import type { Metadata } from "next";
import { Heart, Sprout, Sparkles } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Contenedor } from "@/components/ui/Contenedor";
import { Separador } from "@/components/ui/Separador";

export const metadata: Metadata = { title: "Nosotros" };

const VALORES = [
  {
    Icono: Heart,
    titulo: "Hecho con amor",
    texto: "Cada prenda se elige y se cuida pensando en los peques y en quienes los quieren.",
  },
  {
    Icono: Sparkles,
    titulo: "Diseños de temporada",
    texto: "Colecciones pequeñas y únicas que cambian con las estaciones y las ocasiones.",
  },
  {
    Icono: Sprout,
    titulo: "Calidad y confort",
    texto: "Telas suaves y acabados duraderos para jugar, crecer y florecer sin límites.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-rosa-suave py-14 text-center lg:py-20">
        <Decor variant="flor" className="absolute -left-6 top-6 hidden size-28 sm:block lg:left-12 lg:size-36" />
        <Decor variant="rama" className="absolute -right-4 bottom-0 hidden size-28 sm:block lg:right-12 lg:size-36" />
        <Contenedor className="relative">
          <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">Nosotros</h1>
          <Separador className="mt-4" />
          <p className="mt-4 font-script text-[40px] leading-none text-rosa-accion lg:text-6xl">
            Tonorosa
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-12 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-4 text-base leading-relaxed text-cafe lg:text-[17px]">
          <h2 className="font-display text-[26px] text-cafe md:text-4xl">Nuestra historia</h2>
          <p>
            Tonorosa nació del cariño por vestir a los más pequeños con prendas bonitas, cómodas y
            llenas de detalles. Empezamos con unas pocas piezas y la ilusión de ver sonrisas
            estrenando ropa nueva.
          </p>
          <p>
            Hoy creamos colecciones de temporada hechas con amor, pensadas para cada ocasión: desde
            el juego de todos los días hasta las fechas más especiales en familia.
          </p>
        </div>
      </Contenedor>

      <section className="bg-rosa-suave py-12 lg:py-16">
        <Contenedor>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {VALORES.map(({ Icono, titulo, texto }) => (
              <li key={titulo} className="rounded-md bg-surface p-6 text-center shadow-card">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-rosa-medio">
                  <Icono className="size-7 text-rosa-deco" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-xl text-cafe">{titulo}</h3>
                <p className="mt-2 text-base text-tenue">{texto}</p>
              </li>
            ))}
          </ul>
        </Contenedor>
      </section>

      <section className="py-12 text-center lg:py-20">
        <Contenedor>
          <BotonEnlace href="/catalogo">Ver colección</BotonEnlace>
        </Contenedor>
      </section>
    </>
  );
}
