import Image from "next/image";
import { formatearPrecio } from "@/lib/formato";
import type { Pedido } from "@/types";

export function ResumenPedido({ pedido }: { pedido: Pedido }) {
  return (
    <div className="rounded-lg border border-borde bg-surface p-5 text-left shadow-card">
      <ul className="divide-y divide-borde">
        {pedido.items.map((i) => (
          <li key={`${i.productoId}-${i.talla}`} className="flex gap-3 py-3">
            <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
              {i.imagen && <Image src={i.imagen} alt="" fill sizes="56px" unoptimized className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-semibold text-cafe">{i.nombre}</p>
              <p className="text-sm text-tenue">
                Talla {i.talla} · x{i.cantidad}
              </p>
            </div>
            <p className="text-base font-bold text-cafe">{formatearPrecio(i.subtotal)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1 border-t border-borde pt-3 text-base text-cafe">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatearPrecio(pedido.subtotal)}</dd>
        </div>
        {pedido.descuentoTotal > 0 && (
          <div className="flex justify-between text-exito">
            <dt>Descuento</dt>
            <dd>-{formatearPrecio(pedido.descuentoTotal)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{pedido.costoEnvio === 0 ? "Gratis" : formatearPrecio(pedido.costoEnvio)}</dd>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatearPrecio(pedido.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
