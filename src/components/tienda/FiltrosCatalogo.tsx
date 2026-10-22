"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { Entrada, Etiqueta, Selector } from "@/components/ui/Campo";

type Filtros = { q: string; coleccion: string; categoria: string; min: string; max: string };

type FiltrosCatalogoProps = {
  actuales: Filtros;
  colecciones: { slug: string; nombre: string }[];
  categorias: string[];
  rango: { min: number; max: number };
};

function construirUrl(f: Filtros) {
  const p = new URLSearchParams();
  (Object.keys(f) as (keyof Filtros)[]).forEach((k) => {
    if (f[k]) p.set(k, f[k]);
  });
  const s = p.toString();
  return s ? `/catalogo?${s}` : "/catalogo";
}

const chip =
  "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors";
const chipOff = "bg-rosa-medio text-cafe hover:bg-rosa-deco/40";
const chipOn = "bg-rosa-accion text-white";

export default function FiltrosCatalogo({
  actuales,
  colecciones,
  categorias,
  rango,
}: FiltrosCatalogoProps) {
  const router = useRouter();
  const [abierta, setAbierta] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const [borrador, setBorrador] = useState<Filtros>(actuales);
  const [texto, setTexto] = useState(actuales.q);

  useEffect(() => {
    if (!abierta) return;
    const previo = document.activeElement as HTMLElement | null;
    const enfocables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("a, button:not(:disabled), input, select") ??
          [],
      );
    enfocables()[0]?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierta(false);
        return;
      }
      if (e.key !== "Tab") return;
      const lista = enfocables();
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, [abierta]);

  const cantidadActivos = [actuales.coleccion, actuales.categoria, actuales.min, actuales.max].filter(
    Boolean,
  ).length;

  const abrir = () => {
    setBorrador(actuales);
    setAbierta(true);
  };

  const aplicar = () => {
    setAbierta(false);
    router.push(construirUrl({ ...borrador, q: actuales.q }));
  };

  const limpiar = () => {
    setAbierta(false);
    router.push(construirUrl({ q: actuales.q, coleccion: "", categoria: "", min: "", max: "" }));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(construirUrl({ ...actuales, q: texto.trim() }));
          }}
        >
          <Etiqueta htmlFor="buscar-catalogo">
            <span className="sr-only">Buscar prendas</span>
          </Etiqueta>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tenue"
            aria-hidden="true"
          />
          <Entrada
            id="buscar-catalogo"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar prendas"
            className="pl-12"
          />
        </form>
        <Boton variante="secundario" onClick={abrir} className="shrink-0">
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Filtros{cantidadActivos > 0 ? ` (${cantidadActivos})` : ""}
        </Boton>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={construirUrl({ ...actuales, coleccion: "" })}
          className={`${chip} ${!actuales.coleccion ? chipOn : chipOff}`}
        >
          Todas
        </Link>
        {colecciones.map((c) => (
          <Link
            key={c.slug}
            href={construirUrl({ ...actuales, coleccion: c.slug })}
            aria-current={actuales.coleccion === c.slug ? "true" : undefined}
            className={`${chip} ${actuales.coleccion === c.slug ? chipOn : chipOff}`}
          >
            {c.nombre}
          </Link>
        ))}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {categorias.map((c) => (
          <Link
            key={c}
            href={construirUrl({ ...actuales, categoria: actuales.categoria === c ? "" : c })}
            aria-current={actuales.categoria === c ? "true" : undefined}
            className={`${chip} border ${actuales.categoria === c ? "border-rosa-accion bg-rosa-accion text-white" : "border-borde bg-surface text-cafe hover:bg-rosa-suave"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {abierta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-cafe/50" onClick={() => setAbierta(false)} />
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-filtros"
            className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-lg bg-surface p-6 shadow-elevada md:max-w-md md:rounded-lg"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="titulo-filtros" className="font-display text-2xl text-cafe">Filtros</h2>
              <button
                type="button"
                onClick={() => setAbierta(false)}
                aria-label="Cerrar"
                className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Etiqueta htmlFor="f-min">Precio mínimo</Etiqueta>
                  <Entrada
                    id="f-min"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder={String(rango.min)}
                    value={borrador.min}
                    onChange={(e) => setBorrador({ ...borrador, min: e.target.value })}
                  />
                </div>
                <div>
                  <Etiqueta htmlFor="f-max">Precio máximo</Etiqueta>
                  <Entrada
                    id="f-max"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder={String(rango.max)}
                    value={borrador.max}
                    onChange={(e) => setBorrador({ ...borrador, max: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Etiqueta htmlFor="f-coleccion">Colección</Etiqueta>
                <Selector
                  id="f-coleccion"
                  value={borrador.coleccion}
                  onChange={(e) => setBorrador({ ...borrador, coleccion: e.target.value })}
                >
                  <option value="">Todas</option>
                  {colecciones.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nombre}
                    </option>
                  ))}
                </Selector>
              </div>
              <div>
                <Etiqueta htmlFor="f-categoria">Categoría</Etiqueta>
                <Selector
                  id="f-categoria"
                  value={borrador.categoria}
                  onChange={(e) => setBorrador({ ...borrador, categoria: e.target.value })}
                >
                  <option value="">Todas</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Selector>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Boton variante="secundario" onClick={limpiar} className="flex-1">
                Limpiar
              </Boton>
              <Boton onClick={aplicar} className="flex-1">
                Aplicar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
