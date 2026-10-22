import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import { Beneficios } from "@/components/tienda/Beneficios";
import { CarruselInicio } from "@/components/tienda/CarruselInicio";
import TarjetaProducto from "@/components/tienda/TarjetaProducto";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Contenedor } from "@/components/ui/Contenedor";
import { Logo } from "@/components/ui/Logo";
import { Separador } from "@/components/ui/Separador";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import {
  obtenerColeccionDestacada,
  obtenerColecciones,
  obtenerCarrusel,
  obtenerNovedades,
} from "@/lib/datos/tienda";

export default async function InicioPage() {
  const [slides, destacada, colecciones, novedades] = await Promise.all([
    obtenerCarrusel(),
    obtenerColeccionDestacada(),
    obtenerColecciones(),
    obtenerNovedades(6),
  ]);

  return (
    <>
      {slides.length > 0 ? (
        <CarruselInicio slides={slides} />
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

      <section className="relative overflow-hidden py-12 lg:py-20">
        <Decor variant="rama" className="absolute -left-6 bottom-0 hidden h-40 w-24 sm:block lg:left-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 left-10 hidden size-16 lg:block" />
        <Decor variant="rama" className="absolute -right-6 bottom-0 hidden h-40 w-24 -scale-x-100 sm:block lg:right-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 right-10 hidden size-16 lg:block" />
        <Contenedor className="relative flex flex-col items-center text-center">
          <p className="text-xl text-cafe lg:text-2xl">Bienvenidas a</p>
          <p className="font-script text-[56px] font-semibold leading-tight text-rosa-accion lg:text-[72px]">
            Tonorosa
          </p>
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

      {destacada && (
        <section className="pb-12 lg:pb-20">
          <Contenedor>
            <div className="relative overflow-hidden rounded-lg bg-rosa-suave">
              <div className="relative aspect-[4/3] lg:aspect-[16/6]">
                {destacada.imagen && (
                  <Image
                    src={destacada.imagen}
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 1136px, 100vw"
                    unoptimized
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-cafe/70 via-cafe/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 text-white lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.08em]">Colección destacada</p>
                  <h2 className="font-display text-[26px] leading-tight lg:text-4xl">{destacada.nombre}</h2>
                  {destacada.descripcion && (
                    <p className="line-clamp-2 max-w-md text-base">{destacada.descripcion}</p>
                  )}
                  <BotonEnlace href={`/colecciones/${destacada.slug}`}>
                    Ver colección
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </BotonEnlace>
                </div>
              </div>
            </div>
          </Contenedor>
        </section>
      )}

      {colecciones.length > 0 && (
        <section className="bg-rosa-suave py-12 lg:py-20">
          <Contenedor>
            <TituloSeccion titulo="Nuestras colecciones" />
          </Contenedor>
          <ul className="mx-auto mt-8 flex max-w-[1200px] snap-x gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:justify-center lg:px-8">
            {colecciones.map((c) => (
              <li key={c.id} className="w-40 shrink-0 snap-start sm:w-52">
                <Link href={`/colecciones/${c.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-rosa-medio shadow-card">
                    {c.imagen && (
                      <Image
                        src={c.imagen}
                        alt=""
                        fill
                        sizes="208px"
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-center font-display text-lg text-cafe group-hover:text-rosa-accion">
                    {c.nombre}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {novedades.length > 0 && (
        <section className="py-12 lg:py-20">
          <Contenedor>
            <TituloSeccion titulo="Novedades" />
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
              {novedades.map((p, i) => (
                <TarjetaProducto key={p.id} producto={p} prioridad={i < 2} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <BotonEnlace href="/catalogo" variante="secundario">
                Ver toda la colección
              </BotonEnlace>
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
