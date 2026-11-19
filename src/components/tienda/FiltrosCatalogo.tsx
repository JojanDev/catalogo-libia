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

const miles = new Intl.NumberFormat("es-CO", { useGrouping: "always" });
const conMiles = (d: string) => (d ? miles.format(Number(d)) : "");

const chip =
  "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors";
const chipOff = "bg-rosa-medio text-cafe hover:bg-rosa-deco/40";
const chipOn = "bg-rosa-boton text-cafe-oscuro";
const etiquetaFila =
  "mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-tenue sm:mb-0 sm:w-28 sm:shrink-0";
const filaChips =
  "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:min-w-0 sm:flex-1 sm:flex-wrap sm:px-0";

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
          <Entrada
            id="buscar-catalogo"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar prendas"
            className="pr-12"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-rosa-accion hover:bg-rosa-suave"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
        </form>
        <Boton variante="secundario" onClick={abrir} className="shrink-0">
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Filtros{cantidadActivos > 0 ? ` (${cantidadActivos})` : ""}
        </Boton>
      </div>

      <div className="sm:flex sm:items-center sm:gap-3">
        <p id="lbl-coleccion" className={etiquetaFila}>Colección</p>
        <nav aria-labelledby="lbl-coleccion" className={filaChips}>
          <Link
            href={construirUrl({ ...actuales, coleccion: "" })}
            aria-current={!actuales.coleccion ? "true" : undefined}
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
        </nav>
      </div>

      <div className="sm:flex sm:items-center sm:gap-3">
        <p id="lbl-tipo" className={etiquetaFila}>Tipo de prenda</p>
        <nav aria-labelledby="lbl-tipo" className={filaChips}>
          {categorias.map((c) => (
            <Link
              key={c}
              href={construirUrl({ ...actuales, categoria: actuales.categoria === c ? "" : c })}
              aria-current={actuales.categoria === c ? "true" : undefined}
              className={`${chip} border ${actuales.categoria === c ? "border-rosa-boton bg-rosa-boton text-cafe-oscuro" : "border-borde bg-surface text-cafe hover:bg-rosa-suave"}`}
            >
              {c}
            </Link>
          ))}
        </nav>
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
                {(["min", "max"] as const).map((k) => (
                  <div key={k}>
                    <Etiqueta htmlFor={`f-${k}`}>{k === "min" ? "Precio mínimo" : "Precio máximo"}</Etiqueta>
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tenue"
                      >
                        $
                      </span>
                      <Entrada
                        id={`f-${k}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className="pl-7"
                        placeholder={conMiles(String(rango[k]))}
                        value={conMiles(borrador[k])}
                        onChange={(e) => setBorrador({ ...borrador, [k]: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                  </div>
                ))}
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
                <Etiqueta htmlFor="f-categoria">Tipo de prenda</Etiqueta>
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
