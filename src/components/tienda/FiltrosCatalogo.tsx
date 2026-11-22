"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { Entrada, Etiqueta } from "@/components/ui/Campo";

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
  "w-28 shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-tenue";
const filaChips = "flex min-w-0 flex-1 flex-wrap gap-2 pb-1";
const opcion =
  "inline-flex min-h-11 items-center rounded-full border border-borde bg-surface px-4 text-sm font-semibold text-cafe transition-colors hover:bg-rosa-suave peer-checked:border-rosa-boton peer-checked:bg-rosa-boton peer-checked:text-cafe-oscuro peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rosa-accion";

function GrupoRadio({
  id,
  titulo,
  nombre,
  valor,
  opciones,
  alCambiar,
}: {
  id: string;
  titulo: string;
  nombre: string;
  valor: string;
  opciones: { valor: string; texto: string }[];
  alCambiar: (v: string) => void;
}) {
  return (
    <div>
      <p id={id} className="mb-2 text-sm font-semibold text-cafe">{titulo}</p>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label key={o.valor}>
            <input
              type="radio"
              name={nombre}
              value={o.valor}
              checked={valor === o.valor}
              onChange={() => alCambiar(o.valor)}
              className="peer sr-only"
            />
            <span className={opcion}>{o.texto}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CamposPrecio({
  prefijo,
  rango,
  valores,
  alCambiar,
}: {
  prefijo: string;
  rango: { min: number; max: number };
  valores: Filtros;
  alCambiar: (k: "min" | "max", v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["min", "max"] as const).map((k) => (
        <div key={k}>
          <Etiqueta htmlFor={`${prefijo}-${k}`}>{k === "min" ? "Precio mínimo" : "Precio máximo"}</Etiqueta>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tenue"
            >
              $
            </span>
            <Entrada
              id={`${prefijo}-${k}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className="pl-7"
              placeholder={conMiles(String(rango[k]))}
              value={conMiles(valores[k])}
              onChange={(e) => alCambiar(k, e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const itemLateral =
  "flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion";

export function BarraLateralFiltros({
  actuales,
  colecciones,
  categorias,
  rango,
}: FiltrosCatalogoProps) {
  const router = useRouter();
  const [precio, setPrecio] = useState({ min: actuales.min, max: actuales.max });
  const hayFiltros = Object.values(actuales).some(Boolean);

  const aplicarPrecio = (e: React.FormEvent) => {
    e.preventDefault();
    let { min, max } = precio;
    if (min && max && Number(min) > Number(max)) [min, max] = [max, min];
    router.push(construirUrl({ ...actuales, min, max }));
  };

  return (
    <aside aria-label="Filtros" className="hidden space-y-6 lg:sticky lg:top-6 lg:block lg:self-start">
      <div>
        <p id="lbl-lat-col" className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.08em] text-tenue">
          Colección
        </p>
        <nav aria-labelledby="lbl-lat-col" className="flex flex-col gap-1">
          <Link
            href={construirUrl({ ...actuales, coleccion: "" })}
            aria-current={!actuales.coleccion ? "true" : undefined}
            className={`${itemLateral} ${!actuales.coleccion ? chipOn : "text-cafe hover:bg-rosa-suave hover:text-rosa-accion"}`}
          >
            Todas
          </Link>
          {colecciones.map((c) => (
            <Link
              key={c.slug}
              href={construirUrl({ ...actuales, coleccion: actuales.coleccion === c.slug ? "" : c.slug })}
              aria-current={actuales.coleccion === c.slug ? "true" : undefined}
              className={`${itemLateral} ${actuales.coleccion === c.slug ? chipOn : "text-cafe hover:bg-rosa-suave hover:text-rosa-accion"}`}
            >
              {c.nombre}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-borde pt-6">
        <p id="lbl-lat-tipo" className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.08em] text-tenue">
          Tipo de prenda
        </p>
        <nav aria-labelledby="lbl-lat-tipo" className="flex flex-col gap-1">
          {categorias.map((c) => (
            <Link
              key={c}
              href={construirUrl({ ...actuales, categoria: actuales.categoria === c ? "" : c })}
              aria-current={actuales.categoria === c ? "true" : undefined}
              className={`${itemLateral} ${actuales.categoria === c ? chipOn : "text-cafe hover:bg-rosa-suave hover:text-rosa-accion"}`}
            >
              {c}
            </Link>
          ))}
        </nav>
      </div>
      <form onSubmit={aplicarPrecio} className="space-y-3 border-t border-borde pt-6">
        <p className="px-1 text-xs font-bold uppercase tracking-[0.08em] text-tenue">Precio</p>
        <CamposPrecio
          prefijo="l"
          rango={rango}
          valores={{ ...actuales, ...precio }}
          alCambiar={(k, v) => setPrecio({ ...precio, [k]: v })}
        />
        <Boton type="submit" variante="secundario" className="w-full">
          Aplicar precio
        </Boton>
      </form>
      {hayFiltros && (
        <Link
          href="/catalogo"
          className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-rosa-accion underline underline-offset-2 hover:text-rosa-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion"
        >
          Limpiar filtros
        </Link>
      )}
    </aside>
  );
}

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
        panel.current?.querySelectorAll<HTMLElement>("a, button:not(:disabled), input") ??
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

  const cantidadActivos = [actuales.coleccion, actuales.categoria, actuales.min || actuales.max].filter(
    Boolean,
  ).length;

  const abrir = () => {
    setBorrador(actuales);
    setAbierta(true);
  };

  const aplicar = () => {
    setAbierta(false);
    let { min, max } = borrador;
    if (min && max && Number(min) > Number(max)) [min, max] = [max, min];
    router.push(construirUrl({ ...borrador, min, max, q: actuales.q }));
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
        <Boton variante="secundario" onClick={abrir} className="shrink-0 lg:hidden">
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Filtros{cantidadActivos > 0 ? ` (${cantidadActivos})` : ""}
        </Boton>
      </div>

      <div className="hidden md:flex md:items-center md:gap-3 lg:hidden">
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
              href={construirUrl({ ...actuales, coleccion: actuales.coleccion === c.slug ? "" : c.slug })}
              aria-current={actuales.coleccion === c.slug ? "true" : undefined}
              className={`${chip} ${actuales.coleccion === c.slug ? chipOn : chipOff}`}
            >
              {c.nombre}
            </Link>
          ))}
        </nav>
      </div>

      <div className="hidden md:flex md:items-center md:gap-3 lg:hidden">
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
              <CamposPrecio
                prefijo="f"
                rango={rango}
                valores={borrador}
                alCambiar={(k, v) => setBorrador({ ...borrador, [k]: v })}
              />
              <GrupoRadio
                id="lbl-f-col"
                titulo="Colección"
                nombre="f-coleccion"
                valor={borrador.coleccion}
                opciones={[{ valor: "", texto: "Todas" }, ...colecciones.map((c) => ({ valor: c.slug, texto: c.nombre }))]}
                alCambiar={(v) => setBorrador({ ...borrador, coleccion: v })}
              />
              <GrupoRadio
                id="lbl-f-tipo"
                titulo="Tipo de prenda"
                nombre="f-categoria"
                valor={borrador.categoria}
                opciones={[{ valor: "", texto: "Todas" }, ...categorias.map((c) => ({ valor: c, texto: c }))]}
                alCambiar={(v) => setBorrador({ ...borrador, categoria: v })}
              />
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
