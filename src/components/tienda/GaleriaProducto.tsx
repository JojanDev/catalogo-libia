"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Medio } from "@/types";

export default function GaleriaProducto({
  medios,
  imagen,
  nombre,
  agotado,
}: {
  medios: Medio[];
  imagen: string;
  nombre: string;
  agotado: boolean;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);
  const lista: Medio[] =
    medios.length > 0
      ? [...medios].sort((a, b) => a.orden - b.orden)
      : [{ id: 0, tipo: "imagen", url: imagen, alt: nombre, orden: 0 }];

  const alDesplazar = () => {
    const el = pista.current;
    if (!el) return;
    setActivo(Math.round(el.scrollLeft / el.clientWidth));
  };

  const ir = (i: number) => {
    const el = pista.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-4">
      <div className="relative min-w-0 flex-1">
        <div
          ref={pista}
          onScroll={alDesplazar}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {lista.map((m, i) => (
            <div key={m.id} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-rosa-suave">
              {m.tipo === "video" ? (
                <video
                  src={m.url}
                  muted
                  loop
                  playsInline
                  controls
                  aria-label={m.alt}
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={m.url}
                  alt={m.alt}
                  fill
                  unoptimized
                  priority={i === 0}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className={`object-cover ${agotado ? "opacity-60" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
        {lista.length > 1 && (
          <span
            className="absolute bottom-3 right-3 rounded-full bg-cafe-oscuro/70 px-3 py-1 text-sm font-semibold text-surface lg:hidden"
            aria-live="polite"
          >
            {activo + 1} / {lista.length}
          </span>
        )}
      </div>
      {lista.length > 1 && (
        <ul className="hidden gap-3 lg:flex lg:max-h-[600px] lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-y-auto">
          {lista.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === activo ? "true" : undefined}
                className={`relative block aspect-[4/5] w-20 overflow-hidden rounded-sm border-2 bg-rosa-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion ${i === activo ? "border-rosa-accion" : "border-borde opacity-80 hover:opacity-100"}`}
              >
                {m.tipo === "video" ? (
                  <span className="flex size-full items-center justify-center text-rosa-accion">
                    <Play className="size-6" aria-hidden="true" />
                  </span>
                ) : (
                  <Image src={m.url} alt="" fill unoptimized sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
