import type { Metadata } from "next";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerConfiguracion } from "@/lib/datos/tienda";
import { FormularioCheckout } from "./FormularioCheckout";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const configuracion = await obtenerConfiguracion();

  return (
    <Contenedor className="py-12 lg:py-20">
      <h1 className="mb-8 text-center font-display text-[32px] leading-tight text-cafe lg:text-5xl">
        Finalizar compra
      </h1>
      <FormularioCheckout pagosEnLinea={configuracion.pagosEnLinea} />
    </Contenedor>
  );
}
