import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
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
    "Ropa para las más pequeñas con diseños únicos, calidad y confort. Envíos a toda Colombia. Compra en línea o por WhatsApp.",
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
        <div className="bg-rosa-suave pb-8 lg:pb-12">
          <h1 className="sr-only">Tonorosa by Leyar, ropa infantil en Colombia</h1>
          <CarruselInicio slides={slides} />
        </div>
      ) : (
        <section className="relative overflow-hidden bg-rosa-suave py-12 lg:py-20">
          <Decor variant="flor" className="absolute -left-6 bottom-4 size-24 sm:left-4 sm:size-32 lg:size-44" />
          <Decor variant="flor" className="absolute -right-6 bottom-8 size-24 sm:right-4 sm:size-32 lg:size-44" />
          <Decor variant="mariposa" className="absolute right-6 top-6 size-12 sm:right-24 lg:size-16" />
          <Contenedor className="relative flex flex-col items-center text-center">
            <Logo alto={120} prioridad />
            <h1 className="mt-6 font-script text-[40px] font-semibold leading-tight text-taupe lg:text-[64px]">
              Un jardín de emociones
            </h1>
          </Contenedor>
        </section>
      )}

      <Beneficios />

      <section className="relative overflow-hidden py-8 lg:py-16">
        <Decor variant="rama" className="absolute -left-6 bottom-0 hidden h-40 w-24 sm:block lg:left-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 left-10 hidden size-16 lg:block" />
        <Decor variant="rama" className="absolute -right-6 bottom-0 hidden h-40 w-24 -scale-x-100 sm:block lg:right-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 right-10 hidden size-16 lg:block" />
        <Contenedor className="relative flex flex-col items-center text-center">
          <h2 className="flex flex-col items-center">
            <span className="text-xl text-cafe lg:text-2xl">Bienvenidas a</span>
            <span className="font-script text-[56px] font-semibold leading-tight text-rosa-accion lg:text-[72px]">
              Tonorosa
            </span>
          </h2>
          <Separador className="mt-2" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-cafe lg:text-[17px]">
            Aquí encontrarás mucho más que ropa, encontrarás un mundo de ternura, estilo y felicidad
            para las más pequeñas.
          </p>
          <BotonEnlace href="/catalogo" className="mt-8">
            Descubrir colección
            <ArrowRight className="size-5" aria-hidden="true" />
          </BotonEnlace>
        </Contenedor>
      </section>

      {colecciones.length > 0 && (
        <section className="bg-rosa-suave py-12 lg:py-20">
          <Contenedor>
            <TituloSeccion titulo="Nuestras colecciones" />
          </Contenedor>
          <Contenedor>
            <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {lista.map((c) => {
                const grande = c.id === destacada?.id;
                return (
                  <li key={c.id} className={grande ? "col-span-2" : undefined}>
                    <Link href={`/colecciones/${c.slug}`} className="group block">
                      <div
                        className={`relative overflow-hidden rounded-lg bg-rosa-medio shadow-card ${grande ? "aspect-[16/9] lg:aspect-[8/5]" : "aspect-[4/5]"}`}
                      >
                        {c.imagen && (
                          <Image
                            src={c.imagen}
                            alt=""
                            fill
                            sizes={grande ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        {grande && <Insignia className="absolute left-3 top-3">Destacada</Insignia>}
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

      <section className="pb-4">
        <Contenedor>
          <Link
            href="/guia-de-tallas"
            className="flex items-center gap-4 rounded-lg border border-borde bg-surface p-5 shadow-card transition-colors hover:bg-rosa-suave lg:p-8"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-rosa-medio">
              <Ruler className="size-7 text-rosa-accion" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-xl text-cafe lg:text-2xl">¿Cuál es su talla?</span>
              <span className="block text-base text-tenue">Consulta nuestra guía de tallas y acierta a la primera.</span>
            </span>
            <ArrowRight className="size-6 shrink-0 text-rosa-accion" aria-hidden="true" />
          </Link>
        </Contenedor>
      </section>
    </>
  );
}
