import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import { Ola } from "@/components/decor/Ola";
import { Beneficios } from "@/components/tienda/Beneficios";
import { CarruselInicio } from "@/components/tienda/CarruselInicio";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Contenedor } from "@/components/ui/Contenedor";
import { Insignia } from "@/components/ui/Insignia";
import { Logo } from "@/components/ui/Logo";
import { Separador } from "@/components/ui/Separador";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import {
  obtenerColeccionDestacada,
  obtenerColecciones,
  obtenerCarrusel,
  obtenerNovedades,
} from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: { absolute: "Tonorosa by Leyar | Ropa infantil con ternura y estilo" },
  description:
    "Ropa para las más pequeñas con diseños únicos, calidad y confort. Envíos a toda Colombia. Te atendemos por WhatsApp.",
};

export default async function InicioPage() {
  const [slides, destacada, colecciones, novedades] = await Promise.all([
    obtenerCarrusel(),
    obtenerColeccionDestacada(),
    obtenerColecciones(),
    obtenerNovedades(8),
  ]);

  const lista = destacada
    ? [destacada, ...colecciones.filter((c) => c.id !== destacada.id)]
    : colecciones;

  return (
    <>
      {slides.length > 0 ? (
        <div className="relative">
          <h1 className="sr-only">Tonorosa by Leyar, ropa infantil en Colombia</h1>
          <CarruselInicio slides={slides} />
          <Decor variant="rama-esquina-izq" className="absolute left-0 top-0 z-20 hidden w-20 md:block lg:w-28" />
          <Decor variant="rama-esquina-der" className="absolute bottom-0 right-0 z-20 hidden w-24 md:block lg:w-36" />
          <Decor variant="mariposa" className="absolute bottom-0 left-24 z-20 hidden w-14 md:block lg:left-40 lg:w-16" />
          <Decor variant="corazon-2" className="absolute bottom-1 left-40 z-20 hidden w-5 md:block lg:left-60" />
        </div>
      ) : (
        <section className="relative overflow-hidden bg-rosa-suave py-12 lg:py-20">
          <Decor variant="rama-esquina-izq" className="absolute left-0 top-0 z-0 w-24 sm:w-36 lg:w-52" />
          <Decor variant="rama-esquina-der" className="absolute bottom-0 right-0 z-0 w-32 sm:w-44 lg:w-64" />
          <Decor variant="petalo-1" className="absolute left-1/3 top-4 z-0 w-6 rotate-12 sm:w-8" />
          <Decor variant="petalo-3" className="absolute bottom-6 right-1/4 z-0 w-6 -rotate-12 sm:w-8" />
          <Contenedor className="relative z-10 flex flex-col items-center text-center">
            <Logo alto={120} prioridad />
            <h1 className="mt-6 font-script text-[40px] font-semibold leading-tight text-taupe lg:text-[64px]">
              Un jardín de emociones
            </h1>
          </Contenedor>
        </section>
      )}

      <Beneficios />

      <section className="relative overflow-hidden pb-24 pt-8 lg:pb-40 lg:pt-16">
        <Decor variant="rama-esquina-izq" className="absolute left-0 top-0 z-0 hidden w-28 md:block lg:w-44" />
        <Decor variant="rama-esquina-izq" className="absolute right-0 top-0 z-0 hidden w-28 -scale-x-100 md:block lg:w-44" />
        <Ola className="absolute inset-x-0 bottom-0 z-0 h-8 lg:h-14" />
        <Contenedor className="relative z-10 flex flex-col items-center text-center">
          <h2 className="flex flex-col items-center">
            <span className="text-xl text-cafe lg:text-2xl">Bienvenidas a</span>
            <span className="flex items-center gap-3 font-script text-[56px] font-semibold leading-tight tracking-wider text-rosa-accion lg:gap-5 lg:text-[72px]">
              <Heart className="hidden size-7 -rotate-12 stroke-1 sm:block lg:size-9" aria-hidden="true" />
              Tonorosa
              <Heart className="hidden size-7 rotate-12 stroke-1 sm:block lg:size-9" aria-hidden="true" />
            </span>
          </h2>
          <Separador className="mt-2" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-cafe lg:text-[17px]">
            Aquí encontrarás mucho más que ropa, encontrarás un mundo de ternura, estilo y felicidad
            para las más pequeñas.
          </p>
          <BotonEnlace href="/catalogo" className="mt-8 px-10 sm:px-14 lg:px-20">
            Descubrir colección
            <ArrowRight className="size-5" aria-hidden="true" />
          </BotonEnlace>
        </Contenedor>
      </section>

      {colecciones.length > 0 && (
        <section className="relative overflow-hidden bg-rosa-suave py-12 lg:py-20">
          <Decor variant="guirnalda" className="absolute -left-10 top-4 z-0 hidden w-64 lg:block xl:w-80" />
          <Decor variant="guirnalda" className="absolute -right-10 top-4 z-0 hidden w-64 -scale-x-100 lg:block xl:w-80" />
          <Decor variant="petalo-2" className="absolute left-[8%] top-6 z-0 hidden w-8 -rotate-12 md:block" />
          <Decor variant="petalo-6" className="absolute right-[10%] top-24 z-0 hidden w-7 rotate-45 md:block" />
          <Decor variant="petalo-4" className="absolute left-[3%] top-40 z-0 hidden w-6 rotate-12 xl:block" />
          <Contenedor className="relative z-10">
            <TituloSeccion titulo="Nuestras colecciones" />
          </Contenedor>
          <Contenedor className="relative z-10">
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-12 lg:gap-6">
              {lista.map((c) => {
                const grande = c.id === destacada?.id;
                return (
                  <li key={c.id} className={`flex ${grande ? "col-span-2 lg:col-span-6" : "lg:col-span-3"}`}>
                    <Link href={`/colecciones/${c.slug}`} className="group flex w-full flex-col">
                      <div
                        className={`relative overflow-hidden rounded-lg bg-rosa-medio shadow-card ${grande ? "aspect-[8/5] lg:aspect-auto lg:min-h-80 lg:flex-1" : "aspect-[4/5]"}`}
                      >
                        {c.imagen && (
                          <Image
                            src={c.imagen}
                            alt=""
                            fill
                            sizes={grande ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        {grande && <Insignia className="absolute left-3 top-3 shadow-card">Destacada</Insignia>}
                      </div>
                      <p
                        className={`mt-3 text-center font-display text-cafe group-hover:text-rosa-accion ${grande ? "text-xl lg:text-2xl" : "text-lg"}`}
                      >
                        {c.nombre}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Contenedor>
        </section>
      )}

      {novedades.length > 0 && (
        <section className="py-12 lg:py-20">
          <Contenedor>
            <div className="flex flex-col items-center gap-1 lg:flex-row lg:justify-between">
              <TituloSeccion titulo="Recién llegado" />
              <Link
                href="/catalogo"
                className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-rosa-accion hover:text-rosa-hover"
              >
                Ver todo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8">
              <GrillaProductos productos={novedades} conPrioridad={false} />
            </div>
          </Contenedor>
        </section>
      )}
    </>
  );
}
