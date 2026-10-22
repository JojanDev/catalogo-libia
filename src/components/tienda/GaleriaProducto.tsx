"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Medio } from "@/types";

export default function GaleriaProducto({
  medios,
  agotado,
}: {
  medios: Medio[];
  agotado: boolean;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

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
    <div>
      <div
        ref={pista}
        onScroll={alDesplazar}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {medios.map((m, i) => (
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
      {medios.length > 1 && (
        <>
          <div className="mt-3 flex justify-center gap-2 lg:hidden" aria-hidden="true">
            {medios.map((m, i) => (
              <span
                key={m.id}
                className={`size-2 rounded-full ${i === activo ? "bg-rosa-accion" : "bg-rosa-medio"}`}
              />
            ))}
          </div>
          <ul className="mt-3 hidden gap-3 lg:flex">
            {medios.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  aria-current={i === activo ? "true" : undefined}
                  className={`relative block aspect-[4/5] w-20 overflow-hidden rounded-sm border-2 bg-rosa-suave ${i === activo ? "border-rosa-accion" : "border-transparent"}`}
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
        </>
      )}
    </div>
  );
}
