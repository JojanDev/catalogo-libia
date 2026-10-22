import { BotonCarrito } from "@/components/carrito/BotonCarrito";
import { CajonCarrito } from "@/components/carrito/CajonCarrito";
import { BarraAnuncio } from "@/components/tienda/BarraAnuncio";
import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Encabezado } from "@/components/tienda/Encabezado";
import { PiePagina } from "@/components/tienda/PiePagina";
import { CartProvider } from "@/context/CartContext";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export default async function TiendaLayout({ children }: { children: React.ReactNode }) {
  const configuracion = await obtenerConfiguracion();

  return (
    <CartProvider>
      <BarraAnuncio texto={configuracion.textoAnuncio} />
      <Encabezado carrito={<BotonCarrito />} />
      <main>{children}</main>
      <PiePagina whatsapp={configuracion.whatsapp} />
      <BotonWhatsApp numero={configuracion.whatsapp} />
      <CajonCarrito />
    </CartProvider>
  );
}
