import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import FiltrosCatalogo from "@/components/tienda/FiltrosCatalogo";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { Contenedor } from "@/components/ui/Contenedor";
import {
  obtenerCategorias,
  obtenerColecciones,
  obtenerProductos,
  obtenerRangoPrecios,
} from "@/lib/datos/tienda";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Ropa infantil Tonorosa: vestidos, conjuntos y más para las más pequeñas. Envíos a toda Colombia.",
};

type Params = Promise<Record<string, string | string[] | undefined>>;

function uno(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function numero(v: string) {
  return /^\d+$/.test(v) ? Number(v) : undefined;
}

type Actuales = { q: string; coleccion: string; categoria: string; min: string; max: string };

function construirUrl(f: Actuales) {
  const p = new URLSearchParams();
  (Object.keys(f) as (keyof Actuales)[]).forEach((k) => {
    if (f[k]) p.set(k, f[k]);
  });
  const s = p.toString();
  return s ? `/catalogo?${s}` : "/catalogo";
}

const pesos = (n: string) => `$\u00a0${new Intl.NumberFormat("es-CO", { useGrouping: "always" }).format(Number(n))}`;

function FiltrosActivos({
  actuales,
  colecciones,
}: {
  actuales: Actuales;
  colecciones: { slug: string; nombre: string }[];
}) {
  const nombreColeccion = colecciones.find((c) => c.slug === actuales.coleccion)?.nombre;
  const items: { texto: string; href: string }[] = [];
  if (actuales.q) items.push({ texto: `“${actuales.q}”`, href: construirUrl({ ...actuales, q: "" }) });
  if (nombreColeccion)
    items.push({
      texto: `Colección: ${nombreColeccion}`,
      href: construirUrl({ ...actuales, coleccion: "" }),
    });
  if (actuales.categoria)
    items.push({
      texto: `Tipo: ${actuales.categoria}`,
      href: construirUrl({ ...actuales, categoria: "" }),
    });
  if (actuales.min || actuales.max) {
    const texto =
      actuales.min && actuales.max
        ? `Precio: ${pesos(actuales.min)} – ${pesos(actuales.max)}`
        : actuales.min
          ? `Desde ${pesos(actuales.min)}`
          : `Hasta ${pesos(actuales.max)}`;
    items.push({ texto, href: construirUrl({ ...actuales, min: "", max: "" }) });
  }
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap items-center gap-2">
      {items.map((i) => (
        <li key={i.texto}>
          <Link
            href={i.href}
            aria-label={`Quitar filtro: ${i.texto}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-rosa-suave px-3 py-1 text-xs font-semibold text-cafe hover:bg-rosa-medio sm:min-h-11 sm:px-3.5 sm:text-sm"
          >
            <span className="max-w-[16rem] truncate">{i.texto}</span>
            <X className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/catalogo"
          className="inline-flex min-h-9 items-center px-2 py-1 text-xs font-semibold text-rosa-accion sm:min-h-11 sm:text-sm underline underline-offset-2 hover:text-rosa-hover"
        >
          Limpiar todo
        </Link>
      </li>
    </ul>
  );
}

export default async function CatalogoPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  let min = numero(uno(sp.min));
  let max = numero(uno(sp.max));
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  const actuales = {
    q: uno(sp.q),
    coleccion: uno(sp.coleccion),
    categoria: uno(sp.categoria),
    min: min === undefined ? "" : String(min),
    max: max === undefined ? "" : String(max),
  };
  const [productos, colecciones, categorias, rango] = await Promise.all([
    obtenerProductos({
      q: actuales.q || undefined,
      coleccion: actuales.coleccion || undefined,
      categoria: actuales.categoria || undefined,
      min,
      max,
    }),
    obtenerColecciones(),
    obtenerCategorias(),
    obtenerRangoPrecios(),
  ]);

  return (
    <Contenedor className="py-10 lg:py-16">
      <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">Catálogo</h1>
      <p className="mt-2 text-base text-tenue">Elige lo que más le guste a tu peque.</p>
      <div className="mt-6">
        <FiltrosCatalogo
          key={actuales.q}
          actuales={actuales}
          colecciones={colecciones.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
          categorias={categorias}
          rango={rango}
        />
      </div>
      <FiltrosActivos actuales={actuales} colecciones={colecciones} />
      <p className="mb-4 mt-6 text-sm text-tenue" aria-live="polite">
        {productos.length} {productos.length === 1 ? "prenda" : "prendas"}
      </p>
      <GrillaProductos
        productos={productos}
        vacio={
          actuales.q
            ? {
                mensaje: `No encontramos “${actuales.q}”. Revisa la ortografía o prueba con otra palabra.`,
                etiqueta: "Ver todo el catálogo",
                href: "/catalogo",
              }
            : undefined
        }
      />
    </Contenedor>
  );
}
