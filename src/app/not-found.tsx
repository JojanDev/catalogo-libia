import type { Metadata } from "next";
import { Suspense } from "react";
import { Decor } from "@/components/decor/Decor";
import { BarraAnuncio } from "@/components/tienda/BarraAnuncio";
import { BotonWhatsApp } from "@/components/tienda/BotonWhatsApp";
import { Encabezado } from "@/components/tienda/Encabezado";
import { PiePagina } from "@/components/tienda/PiePagina";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { obtenerColecciones, obtenerConfiguracion } from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

async function MarcoTienda({ children }: { children: React.ReactNode }) {
  const [configuracion, colecciones] = await Promise.all([
    obtenerConfiguracion(),
    obtenerColecciones(),
  ]);

  return (
    <>
      <BarraAnuncio texto={configuracion.textoAnuncio} />
      <Encabezado colecciones={colecciones} whatsapp={configuracion.whatsapp} />
      <main>{children}</main>
      <PiePagina whatsapp={configuracion.whatsapp} colecciones={colecciones} />
      <BotonWhatsApp numero={configuracion.whatsapp} />
    </>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <MarcoTienda>
        <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-16 text-center">
          <Decor variant="ramo" className="w-40 lg:w-56" />
          <h1 className="mt-6 font-display text-[32px] leading-tight text-cafe md:text-5xl">
            Esta página se perdió en el jardín
          </h1>
          <p className="mt-3 max-w-md text-base text-tenue">
            No encontramos lo que buscas, pero hay muchas prendas bonitas esperándote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotonEnlace href="/">Ir al inicio</BotonEnlace>
            <BotonEnlace href="/catalogo" variante="secundario">
              Explorar catálogo
            </BotonEnlace>
          </div>
        </div>
      </MarcoTienda>
    </Suspense>
  );
}
