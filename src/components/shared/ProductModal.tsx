import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Producto } from "../../types/index.ts";
import { WhatsAppButton } from "./WhatsAppButton.tsx";
import { useCart } from "../../context/CartContext.tsx";
import { isDiscountActive, getDiscountedPrice } from "../../lib/pricing.ts";

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
}

export function ProductModal({ producto, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!producto) return;
    setSelectedSize("");
    setCantidad(1);
    setAdded(false);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [producto, onClose]);

  if (!producto) return null;

  const hasDiscount = isDiscountActive(producto.descuento);
  const discountedPrice = hasDiscount ? getDiscountedPrice(producto.precio, producto.descuento) : null;
  const hasStock = producto.sizes.some((s) => s.stock > 0);
  const selectedSizeData = producto.sizes.find((s) => s.size === selectedSize);
  const maxCantidad = selectedSizeData?.stock ?? 1;

  const handleAdd = () => {
    if (!selectedSize) return;
    for (let i = 0; i < cantidad; i++) {
      addItem(producto, selectedSize);
    }
    setAdded(true);
    setTimeout(() => {
      openCart();
      onClose();
    }, 600);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-card-bg rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="relative">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={`w-full h-80 object-cover rounded-t-2xl ${!hasStock ? "grayscale opacity-60" : ""}`}
          />
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-warm-accent text-white text-sm font-bold font-body px-3 py-1 rounded-full">
              -{producto.descuento!.porcentaje}%
            </span>
          )}
          {!hasStock && (
            <span className="absolute top-4 right-4 bg-text-primary/80 text-white text-sm font-bold font-body px-3 py-1 rounded-full">
              Agotado
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-card-bg/90 hover:bg-card-bg text-text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body">
            {producto.categoria}
          </span>
          <h2 className="mt-1 text-2xl font-semibold text-text-primary font-heading">
            {producto.nombre}
          </h2>
          <p className="mt-2 text-text-muted leading-relaxed font-body">
            {producto.descripcion}
          </p>

          <p className="mt-4 text-2xl font-semibold">
            {hasDiscount ? (
              <>
                <span className="text-lg text-text-muted line-through mr-2">
                  ${producto.precio.toLocaleString("es-CO")}
                </span>
                <span className="text-warm-accent">
                  ${discountedPrice!.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                </span>
              </>
            ) : (
              <span className="text-text-primary">
                ${producto.precio.toLocaleString("es-CO")}
              </span>
            )}
          </p>

          {/* Selector de tallas */}
          {hasStock && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                Selecciona tu talla <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {producto.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => {
                      setSelectedSize(s.size);
                      if (cantidad > s.stock) setCantidad(Math.max(1, s.stock));
                    }}
                    disabled={s.stock === 0}
                    className={`px-4 py-2 rounded-xl text-sm font-medium font-body border transition-colors ${
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
              {selectedSizeData && (
                <p className="mt-1.5 text-xs text-text-muted font-body">
                  {selectedSizeData.stock} disponibles
                </p>
              )}
            </div>
          )}

          {/* Cantidad */}
          {hasStock && selectedSize && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2 font-body">Cantidad</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="h-9 w-9 rounded-full border border-border-soft text-text-primary hover:bg-canvas flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-base font-medium text-text-primary w-8 text-center font-body">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                  className="h-9 w-9 rounded-full border border-border-soft text-text-primary hover:bg-canvas flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Agregar al carrito */}
          <button
            onClick={handleAdd}
            disabled={!selectedSize || added}
            className={`mt-6 w-full py-3 rounded-soft font-semibold text-sm font-body transition-colors ${
              !selectedSize
                ? "bg-border-soft text-text-muted cursor-not-allowed"
                : added
                  ? "bg-green-500 text-white"
                  : "bg-warm-accent text-white hover:opacity-90"
            }`}
          >
            {!hasStock
              ? "Agotado"
              : !selectedSize
                ? "Selecciona una talla"
                : added
                  ? "¡Añadido!"
                  : `Añadir al Carrito — $${(hasDiscount ? discountedPrice! : producto.precio).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`}
          </button>

          <div className="mt-4">
            <WhatsAppButton productoNombre={producto.nombre} label="Consultar ahora" />
          </div>
        </div>
      </div>
    </div>
  );
}
