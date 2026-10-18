import { createContext, useContext, useMemo, useReducer, useState, type ReactNode } from "react";
import type { CartItem, Producto } from "../types/index.ts";
import { isDiscountActive } from "../lib/pricing.ts";
import { supabase } from "../lib/supabase.ts";

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Producto; size: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: number; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; size: string; cantidad: number } }
  | { type: "UPDATE_SIZE"; payload: { productId: number; oldSize: string; newSize: string } }
  | { type: "APPLY_PROMO"; payload: { code: string; discount: number } }
  | { type: "REMOVE_PROMO" }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  promoCode: null,
  promoDiscount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === product.id && i.size === size,
      );
      const sizeData = product.sizes.find((s) => s.size === size);
      if (sizeData && sizeData.stock <= 0) return state;

      if (existing) {
        if (sizeData && existing.cantidad >= sizeData.stock) return state;
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === product.id && i.size === size
              ? { ...i, cantidad: i.cantidad + 1 }
              : i,
          ),
        };
      }

      const descuento = isDiscountActive(product.descuento)
        ? product.descuento?.porcentaje ?? null
        : null;

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            nombre: product.nombre,
            imagen: product.imagen,
            precio: product.precio,
            size,
            cantidad: 1,
            descuento,
            availableSizes: product.sizes,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.size === action.payload.size),
        ),
      };
    case "UPDATE_QUANTITY": {
      const { productId, size, cantidad } = action.payload;
      if (cantidad <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId && i.size === size ? { ...i, cantidad } : i,
        ),
      };
    }
    case "UPDATE_SIZE": {
      const { productId, oldSize, newSize } = action.payload;
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === newSize,
      );
      if (existing) {
        const oldItem = state.items.find(
          (i) => i.productId === productId && i.size === oldSize,
        );
        const mergedQty = existing.cantidad + (oldItem?.cantidad ?? 1);
        return {
          ...state,
          items: state.items
            .filter((i) => !(i.productId === productId && i.size === oldSize))
            .map((i) =>
              i.productId === productId && i.size === newSize
                ? { ...i, cantidad: mergedQty }
                : i,
            ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId && i.size === oldSize ? { ...i, size: newSize } : i,
        ),
      };
    }
    case "APPLY_PROMO":
      return { ...state, promoCode: action.payload.code, promoDiscount: action.payload.discount };
    case "REMOVE_PROMO":
      return { ...state, promoCode: null, promoDiscount: 0 };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Producto, size: string) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, cantidad: number) => void;
  updateSize: (productId: number, oldSize: string, newSize: string) => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = useMemo(() => state.items.reduce((sum, i) => sum + i.cantidad, 0), [state.items]);

  const subtotal = useMemo(
    () =>
      state.items.reduce((sum, i) => {
        const unit = i.descuento ? i.precio * (1 - i.descuento / 100) : i.precio;
        return sum + unit * i.cantidad;
      }, 0),
    [state.items],
  );

  const discountAmount = useMemo(() => {
    return state.promoDiscount > 0 ? (subtotal * state.promoDiscount) / 100 : 0;
  }, [subtotal, state.promoDiscount]);

  const total = subtotal - discountAmount;

  const value: CartContextValue = {
    ...state,
    totalItems,
    subtotal,
    discountAmount,
    total,
    isCartOpen,
    toggleCart: () => setIsCartOpen((v) => !v),
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addItem: (product, size) => dispatch({ type: "ADD_ITEM", payload: { product, size } }),
    removeItem: (productId, size) => dispatch({ type: "REMOVE_ITEM", payload: { productId, size } }),
    updateQuantity: (productId, size, cantidad) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, cantidad } }),
    updateSize: (productId, oldSize, newSize) =>
      dispatch({ type: "UPDATE_SIZE", payload: { productId, oldSize, newSize } }),
    applyPromoCode: async (code) => {
      const trimmed = code.trim().toUpperCase();
      const { data, error } = await supabase
        .from("codigos_promo")
        .select("code, discount")
        .eq("code", trimmed)
        .eq("activo", true)
        .single();

      if (error || !data) {
        return { success: false, message: "Cupón no válido" };
      }

      dispatch({ type: "APPLY_PROMO", payload: { code: data.code, discount: data.discount } });
      return { success: true, message: `¡Cupón ${data.code} aplicado! -${data.discount}%` };
    },
    removePromoCode: () => dispatch({ type: "REMOVE_PROMO" }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
