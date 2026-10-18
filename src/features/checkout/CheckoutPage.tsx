import { useState } from "react";
import { useCart } from "../../context/CartContext.tsx";
import { supabase } from "../../lib/supabase.ts";

export function CheckoutPage() {
  const { items, subtotal, discountAmount, promoCode, promoDiscount, total, clearCart } = useCart();
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", telefono: "", direccion: "", metodo: "wompi" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const precioUnitario = (precio: number, descuento: number | null) =>
    descuento ? precio * (1 - descuento / 100) : precio;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setError(null);

    const productosPayload = items.map((item) => ({
      nombre: item.nombre,
      talla: item.size,
      cantidad: item.cantidad,
      precio: Math.round(precioUnitario(item.precio, item.descuento)),
    }));

    const { error: err } = await supabase.from("pedidos").insert({
      cliente: form.nombre,
      telefono: form.telefono,
      direccion: form.direccion,
      productos: productosPayload,
      total: Math.round(total),
      metodo_pago: form.metodo,
      estado: "pendiente",
    });

    setPaying(false);

    if (err) {
      setError("No se pudo registrar el pedido. Intenta de nuevo.");
      return;
    }

    setPaid(true);
    clearCart();
  };

  if (paid) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-text-primary font-heading">¡Pedido Realizado!</h1>
        <p className="mt-3 text-text-muted font-body">
          Gracias por tu compra. Te contactaremos pronto para confirmar el envío.
        </p>
        <a
          href="#/catalogo"
          className="inline-block mt-6 px-6 py-3 bg-warm-accent text-white rounded-soft font-semibold hover:opacity-90 transition-opacity font-body"
        >
          Volver al Catálogo
        </a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-text-muted font-body">Tu carrito está vacío.</p>
        <a
          href="#/catalogo"
          className="inline-block mt-4 px-6 py-3 bg-text-primary text-white rounded-soft font-semibold hover:opacity-90 transition-opacity font-body"
        >
          Ver Catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-text-primary font-heading mb-8">Finalizar Compra</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">Tu Pedido</h2>
          <div className="space-y-3">
            {items.map((item) => {
              const unit = precioUnitario(item.precio, item.descuento);
              return (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3 border border-border-soft rounded-soft p-3">
                  <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-softer" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary font-heading">{item.nombre}</p>
                    <p className="text-xs text-text-muted font-body">Talla: {item.size} × {item.cantidad}</p>
                    <p className="text-sm font-medium text-text-primary/70 font-body">
                      {item.descuento ? (
                        <>
                          <span className="line-through text-text-muted mr-1">${item.precio.toLocaleString("es-CO")}</span>
                          <span>${unit.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</span>
                        </>
                      ) : (
                        `$${item.precio.toLocaleString("es-CO")}`
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-border-soft pt-4 space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-text-muted">Subtotal</span>
              <span>${subtotal.toLocaleString("es-CO")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm font-body">
                <span className="text-text-muted">Cupón {promoCode} (-{promoDiscount}%)</span>
                <span className="text-warm-accent">-${discountAmount.toLocaleString("es-CO")}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold font-body border-t border-border-soft pt-2">
              <span>Total</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">Datos de Envío y Pago</h2>

          <div>
            <label className="block text-xs text-text-muted font-body mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-border-soft rounded-soft px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted font-body mb-1">Teléfono (WhatsApp)</label>
            <input
              type="tel"
              name="telefono"
              required
              value={form.telefono}
              onChange={handleChange}
              className="w-full border border-border-soft rounded-soft px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted font-body mb-1">Dirección de envío</label>
            <input
              type="text"
              name="direccion"
              required
              value={form.direccion}
              onChange={handleChange}
              className="w-full border border-border-soft rounded-soft px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted font-body mb-1">Método de pago</label>
            <select
              name="metodo"
              value={form.metodo}
              onChange={handleChange}
              className="w-full border border-border-soft rounded-soft px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-accent"
            >
              <option value="wompi">Wompi (Tarjeta / PSE)</option>
              <option value="nequi">Nequi</option>
              <option value="daviplata">Daviplata</option>
              <option value="contraentrega">Contraentrega</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-soft px-3 py-2 font-body">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={paying}
            className="w-full mt-4 py-3 bg-warm-accent text-white rounded-soft font-semibold hover:opacity-90 transition-opacity font-body disabled:opacity-60"
          >
            {paying ? "Procesando pago..." : `Pagar $${total.toLocaleString("es-CO")}`}
          </button>

          <p className="text-xs text-text-muted font-body text-center">
            Pago simulado — no se realiza ningún cobro real.
          </p>
        </form>
      </div>
    </div>
  );
}
