"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import type { SlideCarrusel } from "@/types";

const flecha =
  "absolute top-1/3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-cafe-oscuro shadow-card hover:bg-surface sm:top-1/2 lg:size-12";

export function CarruselInicio({ slides }: { slides: SlideCarrusel[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [pausadoManual, setPausadoManual] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const inicioX = useRef<number | null>(null);
  const total = slides.length;

  const ir = (n: number) => setIndice((n + total) % total);

  useEffect(() => {
    if (total < 2 || pausado || pausadoManual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndice((i) => (i + 1) % total), 6000);
    return () => window.clearTimeout(id);
  }, [indice, pausado, pausadoManual, total]);

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === indice && !pausadoManual && !reducido) v.play().catch(() => {});
      else v.pause();
    });
  }, [indice, pausadoManual]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      className="relative"
    >
      <div
        className="relative aspect-[4/5] touch-pan-y overflow-hidden bg-rosa-suave sm:aspect-[16/10] lg:aspect-[21/8]"
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
          setPausado(false);
        }}
        onTouchCancel={() => {
          setPausado(false);
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
              <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_9%,black_91%,transparent)]">
              {slide.tipo === "video" ? (
                <video
                  src={slide.url}
                  poster={slide.urlMovil ?? undefined}
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  preload="metadata"
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
                    sizes="100vw"
                    priority={i === 0}
                    unoptimized
                    className="hidden object-cover sm:block"
                  />
                </>
              )}
              </div>
              {(slide.titulo || slide.subtitulo || (slide.textoBoton && slide.enlace)) && (
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[1200px] -translate-x-1/2">
                <div className="pointer-events-auto absolute inset-x-4 bottom-14 flex flex-col items-start gap-2 rounded-xl bg-canvas/90 p-4 shadow-card backdrop-blur-md sm:inset-x-auto sm:left-6 sm:max-w-md sm:bg-canvas/85 sm:p-5 sm:backdrop-blur-sm lg:bottom-16 lg:left-8 lg:max-w-lg lg:p-8">
                  {slide.titulo && (
                    <h2 className="font-display text-2xl leading-tight text-cafe-oscuro lg:text-4xl">{slide.titulo}</h2>
                  )}
                  {slide.subtitulo && <p className="text-sm text-cafe lg:text-base">{slide.subtitulo}</p>}
                  {slide.textoBoton && slide.enlace && (
                    <BotonEnlace href={slide.enlace} tamano="compacto" className="mt-1 sm:h-12 sm:px-6 sm:text-base">
                      {slide.textoBoton}
                    </BotonEnlace>
                  )}
                </div>
                </div>
              )}
            </div>
          );
        })}

        {(total > 1 || slides.some((s) => s.tipo === "video")) && (
          <button
            type="button"
            onClick={() => setPausadoManual((p) => !p)}
            aria-label={pausadoManual ? "Reanudar carrusel" : "Pausar carrusel"}
            className="absolute right-3 top-3 z-10 lg:right-4 lg:top-4 flex size-11 items-center justify-center rounded-full bg-surface/90 text-cafe-oscuro shadow-card hover:bg-surface"
          >
            {pausadoManual ? <Play className="size-5" aria-hidden="true" /> : <Pause className="size-5" aria-hidden="true" />}
          </button>
        )}

        {total > 1 && (
          <>
            <button type="button" onClick={() => ir(indice - 1)} aria-label="Anterior" className={`${flecha} left-2 sm:left-3 lg:left-4`}>
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => ir(indice + 1)} aria-label="Siguiente" className={`${flecha} right-2 sm:right-3 lg:right-4`}>
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 rounded-full bg-surface/95 px-1">
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
                    className={`block h-2.5 rounded-full transition-all ${i === indice ? "w-6 bg-rosa-accion" : "w-2.5 bg-cafe/40"}`}
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
