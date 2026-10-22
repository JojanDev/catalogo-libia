import { useState } from "react";
import type { Producto } from "../../types/index.ts";
import { useCart } from "../../context/CartContext.tsx";
import { isDiscountActive, getDiscountedPrice } from "../../lib/pricing.ts";
import { WhatsAppButton } from "./WhatsAppButton.tsx";

interface ProductCardProps {
  producto: Producto;
  onVerDetalle: (producto: Producto) => void;
}

export function ProductCard({ producto, onVerDetalle }: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);

  const sizes = producto.sizes;
  const hasDiscount = isDiscountActive(producto.descuento);
  const discountedPrice = hasDiscount ? getDiscountedPrice(producto.precio, producto.descuento) : null;
  const hasStock = sizes.some((s) => s.stock > 0);

  const handleAdd = () => {
    if (!hasStock) return;
    const size = selectedSize || sizes.find((s) => s.stock > 0)?.size;
    if (!size) {
      onVerDetalle(producto);
      return;
    }
    addItem(producto, size);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group bg-card-bg rounded-2xl border border-border-soft overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 relative">
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-warm-accent text-white text-xs font-bold font-body px-2 py-0.5 rounded-full">
          -{producto.descuento!.porcentaje}%
        </span>
      )}

      {!hasStock && (
        <span className="absolute top-3 right-3 z-10 bg-text-primary/80 text-white text-xs font-bold font-body px-2.5 py-1 rounded-full">
          Agotado
        </span>
      )}

      <div
        className="overflow-hidden cursor-pointer"
        onClick={() => onVerDetalle(producto)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onVerDetalle(producto);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalle de ${producto.nombre}`}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={`w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105 ${!hasStock ? "grayscale opacity-60" : ""}`}
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold text-text-primary/50 uppercase tracking-wider font-body">
          {producto.categoria}
        </span>
        <h3 className="mt-1.5 text-base font-semibold text-text-primary font-heading">
          {producto.nombre}
        </h3>

        <p className="mt-1 font-body">
          {hasDiscount ? (
            <>
              <span className="text-sm text-text-muted line-through mr-2">
                ${producto.precio.toLocaleString("es-CO")}
              </span>
              <span className="text-base font-semibold text-warm-accent">
                ${discountedPrice!.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
              </span>
            </>
          ) : (
            <span className="text-base font-medium text-text-primary/70">
              ${producto.precio.toLocaleString("es-CO")}
            </span>
          )}
        </p>

        {hasStock && sizes.length > 0 && (
          <div className="mt-3">
            <label className="text-xs text-text-muted font-body block mb-1">Talla</label>
            <div className="flex gap-1.5 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  disabled={s.stock === 0}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium font-body border transition-colors ${
                    selectedSize === s.size
                      ? "bg-text-primary text-white border-text-primary"
                      : s.stock === 0
                        ? "border-border-soft text-text-muted/50 line-through cursor-not-allowed"
                        : "border-border-soft text-text-primary hover:border-warm-accent"
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!hasStock}
          className={`mt-4 w-full py-2.5 rounded-soft font-semibold text-sm font-body transition-colors duration-200 ${
            !hasStock
              ? "bg-border-soft text-text-muted cursor-not-allowed"
              : added
                ? "bg-green-500 text-white"
                : "bg-warm-accent text-white hover:opacity-90"
          }`}
        >
          {!hasStock ? "Agotado" : added ? "¡Añadido!" : "Añadir al Carrito"}
        </button>

        <WhatsAppButton
          productoNombre={producto.nombre}
          className="mt-2"
        />
      </div>
    </article>
  );
}
