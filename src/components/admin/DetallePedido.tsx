"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { cambiarEstadoPedidoAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { ESTADOS_PEDIDO, InsigniaEstado } from "@/components/admin/InsigniaEstado";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Selector } from "@/components/ui/Campo";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import type { EstadoPedido, Pedido } from "@/types";

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente_pago: ["pagado", "cancelado"],
  pagado: ["enviado", "cancelado"],
  enviado: ["entregado"],
  entregado: [],
  cancelado: [],
};

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-tenue">{etiqueta}</dt>
      <dd className="mt-0.5 wrap-break-word text-cafe">{valor}</dd>
    </div>
  );
}

export function DetallePedido({ pedido }: { pedido: Pedido }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [elegido, setElegido] = useState<EstadoPedido | "">("");
  const [confirmando, setConfirmando] = useState(false);
  const opciones = TRANSICIONES[pedido.estado];

  function cambiar() {
    if (!elegido) return;
    iniciar(async () => {
      const r = await cambiarEstadoPedidoAccion(pedido.id, elegido);
      setConfirmando(false);
      if (!r.ok) {
        setAviso({ tipo: "error", texto: r.error });
        return;
      }
      setElegido("");
      setAviso({ tipo: "exito", texto: `Pedido marcado como ${ESTADOS_PEDIDO[elegido].texto.toLowerCase()}` });
      router.refresh();
    });
  }

  const mensaje = `Hola ${pedido.cliente.nombre}, te escribimos de Tonorosa sobre tu pedido ${pedido.referencia}.`;
  const enlaceWhatsapp = `https://wa.me/57${pedido.cliente.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;

  return (
    <>
      <BotonEnlace href="/admin/pedidos" variante="secundario" tamano="compacto" className="mb-4">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Pedidos
      </BotonEnlace>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-cafe sm:text-3xl">{pedido.referencia}</h1>
          <p className="mt-1 text-sm text-tenue">{formatearFecha(pedido.creadoEn)}</p>
        </div>
        <InsigniaEstado estado={pedido.estado} />
      </div>

      <div className="space-y-5">
        <TarjetaPanel titulo="Estado del pedido">
          {opciones.length === 0 ? (
            <p className="text-sm text-tenue">Este pedido ya está cerrado y no admite más cambios.</p>
          ) : confirmando && elegido ? (
            <div role="alertdialog" aria-label="Confirmar cambio de estado" className="space-y-3">
              <p className="text-sm text-cafe">
                ¿Cambiar el pedido a <strong>{ESTADOS_PEDIDO[elegido].texto}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-2">
                <Boton tamano="compacto" cargando={pendiente} onClick={cambiar}>
                  Sí, cambiar estado
                </Boton>
                <Boton variante="secundario" tamano="compacto" disabled={pendiente} onClick={() => setConfirmando(false)}>
                  Cancelar
                </Boton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Selector
                value={elegido}
                onChange={(e) => setElegido(e.target.value as EstadoPedido | "")}
                aria-label="Nuevo estado"
                className="h-10 sm:w-64"
              >
                <option value="">Cambiar estado a…</option>
                {opciones.map((o) => (
                  <option key={o} value={o}>
                    {ESTADOS_PEDIDO[o].texto}
                  </option>
                ))}
              </Selector>
              <Boton tamano="compacto" disabled={!elegido} onClick={() => setConfirmando(true)}>
                Continuar
              </Boton>
            </div>
          )}
        </TarjetaPanel>

        <div className="grid gap-5 md:grid-cols-2">
          <TarjetaPanel titulo="Cliente">
            <dl className="space-y-3 text-sm">
              <Dato etiqueta="Nombre" valor={pedido.cliente.nombre} />
              <Dato etiqueta="Teléfono" valor={pedido.cliente.telefono} />
              <Dato etiqueta="Correo" valor={pedido.cliente.email} />
            </dl>
            <a
              href={enlaceWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white hover:brightness-95"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Contactar por WhatsApp
            </a>
          </TarjetaPanel>

          <TarjetaPanel titulo="Envío">
            <dl className="space-y-3 text-sm">
              <Dato etiqueta="Departamento" valor={pedido.envio.departamento} />
              <Dato etiqueta="Ciudad" valor={pedido.envio.ciudad} />
              <Dato etiqueta="Dirección" valor={pedido.envio.direccion} />
              <Dato etiqueta="Barrio" valor={pedido.envio.barrio} />
              <Dato etiqueta="Notas" valor={pedido.envio.notas} />
            </dl>
          </TarjetaPanel>
        </div>

        <TarjetaPanel titulo="Prendas">
          <ul className="divide-y divide-borde">
            {pedido.items.map((it) => (
              <li key={`${it.productoId}-${it.talla}`} className="flex items-center gap-3 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
                  {it.imagen && <Image src={it.imagen} alt="" fill unoptimized className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-cafe">{it.nombre}</p>
                  <p className="text-sm text-tenue">
                    Talla {it.talla} · {it.cantidad} × {formatearPrecio(it.precioUnitario)}
                    {it.descuentoPorcentaje > 0 && ` (-${it.descuentoPorcentaje}%)`}
                  </p>
                </div>
                <p className="font-bold text-cafe">{formatearPrecio(it.subtotal)}</p>
              </li>
            ))}
          </ul>
        </TarjetaPanel>

        <TarjetaPanel titulo="Totales">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-tenue">Subtotal</dt>
              <dd>{formatearPrecio(pedido.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-tenue">Descuentos</dt>
              <dd>{pedido.descuentoTotal > 0 ? `-${formatearPrecio(pedido.descuentoTotal)}` : formatearPrecio(0)}</dd>
            </div>
            {pedido.codigoPromo && (
              <div className="flex justify-between">
                <dt className="text-tenue">Código</dt>
                <dd className="font-bold">{pedido.codigoPromo}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-tenue">Envío</dt>
              <dd>{pedido.costoEnvio > 0 ? formatearPrecio(pedido.costoEnvio) : "Gratis"}</dd>
            </div>
            <div className="flex justify-between border-t border-borde pt-3 text-base font-bold text-cafe">
              <dt>Total</dt>
              <dd>{formatearPrecio(pedido.total)}</dd>
            </div>
          </dl>
        </TarjetaPanel>
      </div>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </>
  );
}
