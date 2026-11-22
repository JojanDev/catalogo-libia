import { BotonCarrito } from "@/components/carrito/BotonCarrito";
import { CajonCarrito } from "@/components/carrito/CajonCarrito";
import { BarraAnuncio } from "@/components/tienda/BarraAnuncio";
import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Encabezado } from "@/components/tienda/Encabezado";
import { PiePagina } from "@/components/tienda/PiePagina";
import { CartProvider } from "@/context/CartContext";
import { obtenerColecciones, obtenerConfiguracion } from "@/lib/datos/tienda";

export default async function TiendaLayout({ children }: { children: React.ReactNode }) {
  const [configuracion, colecciones] = await Promise.all([
    obtenerConfiguracion(),
    obtenerColecciones(),
  ]);

  return (
    <CartProvider>
      <BarraAnuncio texto={configuracion.textoAnuncio} />
      <Encabezado carrito={<BotonCarrito />} colecciones={colecciones} whatsapp={configuracion.whatsapp} />
      <main>{children}</main>
      <PiePagina whatsapp={configuracion.whatsapp} colecciones={colecciones} />
      <BotonWhatsApp numero={configuracion.whatsapp} />
      <CajonCarrito />
    </CartProvider>
  );
}
