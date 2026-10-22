"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import type { SlideCarrusel } from "@/types";

const flecha =
  "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-cafe shadow-card hover:bg-surface lg:flex";

export function CarruselInicio({ slides }: { slides: SlideCarrusel[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const inicioX = useRef<number | null>(null);
  const total = slides.length;

  const ir = (n: number) => setIndice((n + total) % total);

  useEffect(() => {
    if (total < 2 || pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndice((i) => (i + 1) % total), 6000);
    return () => window.clearTimeout(id);
  }, [indice, pausado, total]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      className="relative bg-rosa-suave lg:px-8 lg:pt-6"
    >
      <div
        className="relative mx-auto aspect-[4/5] max-w-[1200px] touch-pan-y overflow-hidden bg-rosa-medio sm:aspect-[16/10] lg:aspect-[16/7] lg:rounded-lg"
        onTouchStart={(e) => {
          setPausado(true);
          inicioX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (inicioX.current !== null) {
            const dx = e.changedTouches[0].clientX - inicioX.current;
            if (Math.abs(dx) > 50) ir(indice + (dx < 0 ? 1 : -1));
          }
          inicioX.current = null;
        }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        {slides.map((slide, i) => {
          const activo = i === indice;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={!activo}
              inert={!activo}
              className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${activo ? "opacity-100" : "opacity-0"}`}
            >
              {slide.tipo === "video" ? (
                <video
                  src={slide.url}
                  poster={slide.urlMovil ?? undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <>
                  <Image
                    src={slide.urlMovil ?? slide.url}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    unoptimized
                    className="object-cover sm:hidden"
                  />
                  <Image
                    src={slide.url}
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 1200px, 100vw"
                    priority={i === 0}
                    unoptimized
                    className="hidden object-cover sm:block"
                  />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cafe/70 via-cafe/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-6 pb-12 text-white lg:px-14 lg:pb-14">
                {slide.titulo && (
                  <h2 className="max-w-xl font-display text-[32px] leading-tight lg:text-5xl">
                    {slide.titulo}
                  </h2>
                )}
                {slide.subtitulo && <p className="max-w-md text-base lg:text-lg">{slide.subtitulo}</p>}
                {slide.textoBoton && slide.enlace && (
                  <BotonEnlace href={slide.enlace} className="mt-1">
                    {slide.textoBoton}
                  </BotonEnlace>
                )}
              </div>
            </div>
          );
        })}

        {total > 1 && (
          <>
            <button type="button" onClick={() => ir(indice - 1)} aria-label="Anterior" className={`${flecha} left-4`}>
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => ir(indice + 1)} aria-label="Siguiente" className={`${flecha} right-4`}>
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
            <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndice(i)}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  aria-current={i === indice ? "true" : undefined}
                  className="flex size-11 items-center justify-center"
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all ${i === indice ? "w-6 bg-white" : "w-2.5 bg-white/60"}`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
