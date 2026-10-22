import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle, XCircle } from "lucide-react";
import { ResumenPedido } from "@/components/tienda/ResumenPedido";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { obtenerConfiguracion, obtenerPedidoPublico } from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false },
};

export default async function PedidoPage({ params }: { params: Promise<{ referencia: string }> }) {
  const { referencia } = await params;
  const [pedido, configuracion] = await Promise.all([
    obtenerPedidoPublico(referencia),
    obtenerConfiguracion(),
  ]);
  if (!pedido) notFound();

  const cancelado = pedido.estado === "cancelado";
  const pendiente = pedido.estado === "pendiente_pago";
  const mensajeWa = encodeURIComponent(`Hola, escribo por mi pedido ${pedido.referencia}`);

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center lg:py-20">
      {cancelado ? (
        <XCircle className="mx-auto size-16 text-error" aria-hidden="true" />
      ) : pendiente ? (
        <Clock className="mx-auto size-16 text-aviso" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mx-auto size-16 text-salvia" aria-hidden="true" />
      )}
      <h1 className="mt-4 font-display text-[32px] leading-tight text-cafe lg:text-5xl">
        {cancelado ? "Tu pago no fue aprobado" : pendiente ? "Recibimos tu pedido" : "¡Gracias por tu compra!"}
      </h1>
      <p className="mt-3 text-base text-tenue">
        Pedido <span className="font-bold text-cafe">{pedido.referencia}</span>
      </p>
      <p className="mt-3 text-base text-cafe">
        {cancelado
          ? "No se realizó ningún cobro. Puedes intentarlo de nuevo cuando quieras."
          : pendiente
            ? "Te contactaremos por WhatsApp para confirmar el pago y coordinar el envío de tu pedido."
            : "Ya estamos preparando tu pedido. Te avisaremos por WhatsApp cuando salga hacia ti."}
      </p>

      {!cancelado && (
        <div className="mt-8">
          <ResumenPedido pedido={pedido} />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {cancelado ? (
          <BotonEnlace href="/checkout">Intentar de nuevo</BotonEnlace>
        ) : (
          <>
            <a
              href={`https://wa.me/${configuracion.whatsapp}?text=${mensajeWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rosa-accion px-6 text-base font-bold text-white transition-colors hover:bg-rosa-hover"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
            <BotonEnlace href="/catalogo" variante="secundario">
              Seguir comprando
            </BotonEnlace>
          </>
        )}
      </div>
    </div>
  );
}
