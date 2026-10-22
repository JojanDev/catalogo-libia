import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { confirmarPagoAccion } from "@/app/(tienda)/acciones";
import { ResumenPedido } from "@/components/tienda/ResumenPedido";
import { Boton } from "@/components/ui/Boton";
import { obtenerPedidoPublico } from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Pago de prueba",
  robots: { index: false },
};

export default async function PagoSimuladoPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const pedido = await obtenerPedidoPublico(referencia);
  if (!pedido) notFound();
  if (pedido.estado !== "pendiente_pago") redirect(`/pedido/${referencia}`);

  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-aviso-fondo px-4 py-3 text-center text-sm font-bold text-aviso">
        <FlaskConical className="size-5 shrink-0" aria-hidden="true" />
        Modo de prueba: no se realiza ningún cobro real
      </div>
      <div className="mx-auto max-w-xl px-4 py-12 lg:py-20">
        <h1 className="text-center font-display text-[32px] leading-tight text-cafe lg:text-5xl">
          Confirma tu pago
        </h1>
        <p className="mt-2 text-center text-base text-tenue">Pedido {pedido.referencia}</p>
        <div className="mt-8">
          <ResumenPedido pedido={pedido} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <form action={confirmarPagoAccion.bind(null, referencia, true)} className="flex-1">
            <Boton type="submit" className="w-full">
              Pago exitoso
            </Boton>
          </form>
          <form action={confirmarPagoAccion.bind(null, referencia, false)} className="flex-1">
            <Boton type="submit" variante="secundario" className="w-full">
              Pago fallido
            </Boton>
          </form>
        </div>
      </div>
    </>
  );
}
