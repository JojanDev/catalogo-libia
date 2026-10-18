import { useState } from "react";
import { useCart } from "../../context/CartContext.tsx";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateSize,
    subtotal,
    discountAmount,
    promoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    total,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    const result = await applyPromoCode(promoInput);
    setPromoMsg(result);
    if (result.success) setPromoInput("");
  };

  const handleGoToCheckout = () => {
    closeCart();
    window.location.hash = "#/checkout";
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-soft">
          <h2 className="text-lg font-semibold text-text-primary font-heading">Tu Carrito</h2>
          <button
            onClick={closeCart}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-text-muted py-10 font-body">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3 border border-border-soft rounded-soft p-3">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded-softer"
                />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary font-heading truncate">{item.nombre}</p>
          <select
            value={item.size}
            onChange={(e) => updateSize(item.productId, item.size, e.target.value)}
            className="mt-0.5 text-xs text-text-muted bg-transparent border border-border-soft rounded-lg px-1.5 py-0.5 font-body focus:outline-none focus:ring-1 focus:ring-warm-accent cursor-pointer"
          >
            {item.availableSizes.map((s) => (
              <option key={s.size} value={s.size} disabled={s.stock === 0}>
                Talla {s.size} {s.stock === 0 ? "(Agotado)" : `(${s.stock} disp.)`}
              </option>
            ))}
          </select>
                  <p className="text-sm font-medium text-text-primary/70 font-body">
                    {item.descuento ? (
                      <>
                        <span className="line-through text-text-muted mr-1">
                          ${item.precio.toLocaleString("es-CO")}
                        </span>
                        <span className="text-warm-accent font-semibold">
                          ${getDiscounted(item.precio, item.descuento).toLocaleString("es-CO")}
                        </span>
                      </>
                    ) : (
                      `$${item.precio.toLocaleString("es-CO")}`
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.cantidad - 1)}
                      className="h-6 w-6 rounded-full border border-border-soft text-text-primary hover:bg-canvas flex items-center justify-center text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-text-primary w-5 text-center font-body">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.cantidad + 1)}
                      className="h-6 w-6 rounded-full border border-border-soft text-text-primary hover:bg-canvas flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="ml-auto text-xs text-red-500 hover:text-red-700 font-body"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="border-t border-border-soft pt-4 space-y-3">
              {promoCode ? (
                <div className="flex items-center justify-between bg-warm-accent/10 border border-warm-accent/30 rounded-soft px-3 py-2">
                  <span className="text-sm font-medium text-text-primary font-body">
                    {promoCode} (-{promoDiscount}%)
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-red-500 hover:text-red-700 font-body"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Código promocional"
                    className="flex-1 border border-border-soft rounded-soft px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-accent"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-text-primary text-white rounded-soft text-sm font-medium hover:opacity-90 transition-opacity font-body"
                  >
                    Aplicar
                  </button>
                </div>
              )}

              {promoMsg && (
                <p className={`text-xs font-body ${promoMsg.success ? "text-green-600" : "text-red-500"}`}>
                  {promoMsg.message}
                </p>
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border-soft p-4 space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-primary">${subtotal.toLocaleString("es-CO")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-muted">Descuento ({promoDiscount}%)</span>
                <span className="text-warm-accent">-${discountAmount.toLocaleString("es-CO")}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold font-body border-t border-border-soft pt-2">
              <span className="text-text-primary">Total</span>
              <span className="text-text-primary">${total.toLocaleString("es-CO")}</span>
            </div>
            <button
              onClick={handleGoToCheckout}
              className="w-full mt-2 py-3 bg-warm-accent text-white rounded-soft font-semibold hover:opacity-90 transition-opacity font-body"
            >
              Ir a Pagar
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function getDiscounted(precio: number, descuento: number): number {
  return precio * (1 - descuento / 100);
}
