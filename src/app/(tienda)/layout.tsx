import { BarraAnuncio } from "@/components/tienda/BarraAnuncio";
import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Encabezado } from "@/components/tienda/Encabezado";
import { PiePagina } from "@/components/tienda/PiePagina";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export default async function TiendaLayout({ children }: { children: React.ReactNode }) {
  const configuracion = await obtenerConfiguracion();

  return (
    <>
      <BarraAnuncio texto={configuracion.textoAnuncio} />
      <Encabezado />
      <main>{children}</main>
      <PiePagina whatsapp={configuracion.whatsapp} />
      <BotonWhatsApp numero={configuracion.whatsapp} />
    </>
  );
}
