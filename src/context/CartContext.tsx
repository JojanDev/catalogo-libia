"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { validarCodigoAccion } from "@/app/(tienda)/acciones";
import type { ItemCarrito } from "@/types";

type Estado = {
  items: ItemCarrito[];
  codigo: string | null;
  porcentajeCodigo: number;
};

type Accion =
  | { tipo: "hidratar"; estado: Estado }
  | { tipo: "agregar"; item: ItemCarrito }
  | { tipo: "quitar"; productoId: number; talla: string }
  | { tipo: "cambiarCantidad"; productoId: number; talla: string; cantidad: number }
  | { tipo: "vaciar" }
  | { tipo: "aplicarCodigo"; codigo: string; porcentaje: number }
  | { tipo: "quitarCodigo" };

const CLAVE = "tonorosa_carrito";
const MAX_CANTIDAD = 10;

const estadoInicial: Estado = { items: [], codigo: null, porcentajeCodigo: 0 };

function limitar(n: number): number {
  return Math.min(MAX_CANTIDAD, Math.max(1, Math.floor(n)));
}

function reducir(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "hidratar":
      return accion.estado;
    case "agregar": {
      const { item } = accion;
      const existe = estado.items.some(
        (i) => i.productoId === item.productoId && i.talla === item.talla,
      );
      if (existe) {
        return {
          ...estado,
          items: estado.items.map((i) =>
            i.productoId === item.productoId && i.talla === item.talla
              ? { ...i, cantidad: limitar(i.cantidad + item.cantidad) }
              : i,
          ),
        };
      }
      return { ...estado, items: [...estado.items, { ...item, cantidad: limitar(item.cantidad) }] };
    }
    case "quitar":
      return {
        ...estado,
        items: estado.items.filter(
          (i) => !(i.productoId === accion.productoId && i.talla === accion.talla),
        ),
      };
    case "cambiarCantidad":
      return {
        ...estado,
        items: estado.items.map((i) =>
          i.productoId === accion.productoId && i.talla === accion.talla
            ? { ...i, cantidad: limitar(accion.cantidad) }
            : i,
        ),
      };
    case "vaciar":
      return estadoInicial;
    case "aplicarCodigo":
      return { ...estado, codigo: accion.codigo, porcentajeCodigo: accion.porcentaje };
    case "quitarCodigo":
      return { ...estado, codigo: null, porcentajeCodigo: 0 };
    default:
      return estado;
  }
}

type ValorCarrito = {
  items: ItemCarrito[];
  cantidadTotal: number;
  subtotal: number;
  descuentoCodigo: number;
  total: number;
  codigo: string | null;
  porcentajeCodigo: number;
  agregar: (item: ItemCarrito) => void;
  quitar: (productoId: number, talla: string) => void;
  cambiarCantidad: (productoId: number, talla: string, cantidad: number) => void;
  vaciar: () => void;
  aplicarCodigo: (codigo: string) => Promise<string>;
  quitarCodigo: () => void;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
};

const CartContext = createContext<ValorCarrito | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducir, estadoInicial);
  const [abierto, setAbierto] = useState(false);
  const hidratado = useRef(false);

  useEffect(() => {
    try {
      const crudo = window.localStorage.getItem(CLAVE);
      if (crudo) {
        const datos = JSON.parse(crudo) as Partial<Estado>;
        if (Array.isArray(datos.items)) {
          despachar({
            tipo: "hidratar",
            estado: {
              items: datos.items,
              codigo: datos.codigo ?? null,
              porcentajeCodigo: datos.porcentajeCodigo ?? 0,
            },
          });
        }
      }
    } catch {
      window.localStorage.removeItem(CLAVE);
    }
    hidratado.current = true;
  }, []);

  useEffect(() => {
    if (hidratado.current) window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  }, [estado]);

  const cantidadTotal = useMemo(
    () => estado.items.reduce((s, i) => s + i.cantidad, 0),
    [estado.items],
  );
  const subtotal = useMemo(
    () => estado.items.reduce((s, i) => s + i.precioFinal * i.cantidad, 0),
    [estado.items],
  );
  const descuentoCodigo = Math.round((subtotal * estado.porcentajeCodigo) / 100);

  const aplicarCodigo = useCallback(
    async (codigo: string) => {
      const r = await validarCodigoAccion(codigo.trim().toUpperCase(), subtotal);
      if (r.valido) {
        despachar({ tipo: "aplicarCodigo", codigo: codigo.trim().toUpperCase(), porcentaje: r.porcentaje });
      }
      return r.mensaje;
    },
    [subtotal],
  );

  const valor: ValorCarrito = {
    items: estado.items,
    cantidadTotal,
    subtotal,
    descuentoCodigo,
    total: subtotal - descuentoCodigo,
    codigo: estado.codigo,
    porcentajeCodigo: estado.porcentajeCodigo,
    agregar: (item) => despachar({ tipo: "agregar", item }),
    quitar: (productoId, talla) => despachar({ tipo: "quitar", productoId, talla }),
    cambiarCantidad: (productoId, talla, cantidad) =>
      despachar({ tipo: "cambiarCantidad", productoId, talla, cantidad }),
    vaciar: () => despachar({ tipo: "vaciar" }),
    aplicarCodigo,
    quitarCodigo: () => despachar({ tipo: "quitarCodigo" }),
    abierto,
    abrir: () => setAbierto(true),
    cerrar: () => setAbierto(false),
  };

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart(): ValorCarrito {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
