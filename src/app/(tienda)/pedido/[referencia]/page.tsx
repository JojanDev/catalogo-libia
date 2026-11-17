import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, MessageCircle, XCircle } from "lucide-react";
import { VaciarCarritoAlConfirmar } from "@/components/carrito/VaciarCarritoAlConfirmar";
import { ResumenPedido } from "@/components/tienda/ResumenPedido";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { estilosBoton } from "@/components/ui/estilosBoton";
import { formatearPrecio } from "@/lib/formato";
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
  const mensajeWa = encodeURIComponent(
    `Hola, escribo por mi pedido ${pedido.referencia} (${formatearPrecio(pedido.total)})`,
  );
  const enlaceWa = `https://wa.me/${configuracion.whatsapp}?text=${mensajeWa}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center lg:py-20">
      {pedido.metodoPago === "wompi" && !pendiente && !cancelado && (
        <VaciarCarritoAlConfirmar referencia={pedido.referencia} />
      )}
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
        Número de pedido{" "}
        <span className="ml-1 inline-block rounded-full bg-rosa-suave px-3 py-1 font-bold text-cafe">
          {pedido.referencia}
        </span>
      </p>
      <p className="mt-3 text-base text-cafe">
        {cancelado
          ? "No se realizó ningún cobro. Puedes intentarlo de nuevo cuando quieras."
          : pendiente && pedido.metodoPago === "wompi"
            ? "Estamos esperando la confirmación de tu pago. Te avisaremos por correo y por WhatsApp cuando se confirme."
            : pendiente
              ? "Te contactaremos por WhatsApp para confirmar el pago y coordinar el envío de tu pedido."
              : "Ya estamos preparando tu pedido. Te avisaremos por WhatsApp cuando salga hacia ti."}
      </p>

      {!cancelado && (
        <>
          <div className="mt-8">
            <ResumenPedido pedido={pedido} />
          </div>
          <div className="mt-4 rounded-lg border border-borde bg-surface p-5 text-left shadow-card">
            <p className="flex items-start gap-2 text-base text-cafe">
              <MapPin className="mt-0.5 size-5 shrink-0 text-rosa-accion" aria-hidden="true" />
              Enviaremos tu pedido a {pedido.envio.ciudad}, {pedido.envio.departamento}.
            </p>
          </div>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {cancelado ? (
          <>
            <BotonEnlace href="/checkout">Intentar de nuevo</BotonEnlace>
            <a
              href={enlaceWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center text-sm text-tenue underline"
            >
              ¿Necesitas ayuda? Escríbenos por WhatsApp
            </a>
          </>
        ) : (
          <>
            <a
              href={enlaceWa}
              target="_blank"
              rel="noopener noreferrer"
              className={estilosBoton("primario", "normal")}
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
