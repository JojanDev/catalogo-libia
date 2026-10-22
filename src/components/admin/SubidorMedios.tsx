"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Loader2, Trash2, UploadCloud } from "lucide-react";
import { subirArchivoAccion } from "@/app/admin/acciones";
import type { Medio } from "@/types";

type SubidorMediosProps = {
  medios: Medio[];
  onCambio: (medios: Medio[]) => void;
  unico?: boolean;
  soloImagenes?: boolean;
  ratio?: string;
};

function reordenar(lista: Medio[]): Medio[] {
  return lista.map((m, i) => ({ ...m, orden: i }));
}

export function SubidorMedios({
  medios,
  onCambio,
  unico = false,
  soloImagenes = false,
  ratio = "aspect-[4/5]",
}: SubidorMediosProps) {
  const entrada = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subir(archivos: FileList | File[]) {
    const lista = Array.from(archivos).slice(0, unico ? 1 : undefined);
    if (lista.length === 0) return;
    setSubiendo(true);
    setError(null);
    let resultado = unico ? [] : [...medios];
    for (const archivo of lista) {
      if (soloImagenes && !archivo.type.startsWith("image/")) {
        setError("Solo se permiten imágenes");
        continue;
      }
      const datos = new FormData();
      datos.append("archivo", archivo);
      const r = await subirArchivoAccion(datos);
      if (!r.ok) {
        setError(r.error);
        continue;
      }
      resultado = [
        ...resultado,
        {
          id: -(Date.now() + resultado.length),
          tipo: r.datos.tipo,
          url: r.datos.url,
          alt: "",
          orden: resultado.length,
        },
      ];
    }
    onCambio(reordenar(resultado));
    setSubiendo(false);
    if (entrada.current) entrada.current.value = "";
  }

  function mover(i: number, d: -1 | 1) {
    const copia = [...medios];
    [copia[i], copia[i + d]] = [copia[i + d], copia[i]];
    onCambio(reordenar(copia));
  }

  function quitar(i: number) {
    onCambio(reordenar(medios.filter((_, j) => j !== i)));
  }

  const lleno = unico && medios.length >= 1;

  return (
    <div className="space-y-3">
      {medios.length > 0 && (
        <ul className={`grid gap-3 ${unico ? "max-w-48 grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
          {medios.map((m, i) => (
            <li key={`${m.id}-${i}`} className="overflow-hidden rounded-sm border border-borde bg-surface">
              <div className={`relative ${ratio} bg-rosa-suave`}>
                {m.tipo === "video" ? (
                  <video src={m.url} muted playsInline preload="metadata" className="size-full object-cover" />
                ) : (
                  <Image src={m.url} alt={m.alt || "Vista previa"} fill unoptimized className="object-cover" />
                )}
                {!unico && i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-cafe px-2 py-0.5 text-xs font-bold text-white">
                    Portada
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-1">
                {!unico ? (
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => mover(i, -1)}
                      disabled={i === 0}
                      aria-label="Mover antes"
                      className="flex size-9 items-center justify-center rounded-sm text-cafe hover:bg-rosa-suave disabled:text-taupe/50"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(i, 1)}
                      disabled={i === medios.length - 1}
                      aria-label="Mover después"
                      className="flex size-9 items-center justify-center rounded-sm text-cafe hover:bg-rosa-suave disabled:text-taupe/50"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                  </div>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => quitar(i)}
                  aria-label="Quitar"
                  className="flex size-9 items-center justify-center rounded-sm text-error hover:bg-error-fondo"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!lleno && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            void subir(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-center text-sm ${
            arrastrando ? "border-rosa-accion bg-rosa-suave" : "border-borde bg-canvas"
          }`}
        >
          {subiendo ? (
            <Loader2 className="size-6 animate-spin text-rosa-accion" aria-label="Subiendo" />
          ) : (
            <UploadCloud className="size-6 text-rosa-deco" aria-hidden="true" />
          )}
          <p className="text-tenue">Arrastra {unico ? "un archivo" : "archivos"} aquí o</p>
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            disabled={subiendo}
            className="h-10 rounded-full border-2 border-rosa-accion px-4 text-sm font-bold text-rosa-accion hover:bg-rosa-suave disabled:opacity-60"
          >
            Elegir {unico ? "archivo" : "archivos"}
          </button>
          <input
            ref={entrada}
            type="file"
            hidden
            multiple={!unico}
            accept={soloImagenes ? "image/*" : "image/*,video/*"}
            onChange={(e) => e.target.files && void subir(e.target.files)}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}
