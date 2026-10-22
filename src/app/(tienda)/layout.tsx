import { BarraAnuncio } from "@/components/tienda/BarraAnuncio";
import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Encabezado } from "@/components/tienda/Encabezado";
import { PiePagina } from "@/components/tienda/PiePagina";

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraAnuncio texto="Moda infantil que hace florecer sonrisas" />
      <Encabezado />
      <main>{children}</main>
      <PiePagina />
      <BotonWhatsApp numero="573006569633" />
    </>
  );
}
