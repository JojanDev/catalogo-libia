import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import FiltrosCatalogo, { BarraLateralFiltros } from "@/components/tienda/FiltrosCatalogo";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { Contenedor } from "@/components/ui/Contenedor";
import { alternar, construirUrl, lista, type Filtros } from "@/lib/filtros-url";
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

type Actuales = Filtros;

const pesos = (n: string) => `$\u00a0${new Intl.NumberFormat("es-CO", { useGrouping: "always" }).format(Number(n))}`;

function FiltrosActivos({
  actuales,
  colecciones,
}: {
  actuales: Actuales;
  colecciones: { slug: string; nombre: string }[];
}) {
  const items: { texto: string; href: string; soloMovil?: boolean }[] = [];
  if (actuales.q) items.push({ texto: `“${actuales.q}”`, href: construirUrl({ ...actuales, q: "" }) });
  actuales.coleccion.forEach((slug) => {
    const nombre = colecciones.find((c) => c.slug === slug)?.nombre;
    if (nombre)
      items.push({
        texto: `Colección: ${nombre}`,
        href: construirUrl({ ...actuales, coleccion: alternar(actuales.coleccion, slug) }),
        soloMovil: true,
      });
  });
  actuales.categoria.forEach((cat) =>
    items.push({
      texto: `Tipo: ${cat}`,
      href: construirUrl({ ...actuales, categoria: alternar(actuales.categoria, cat) }),
      soloMovil: true,
    }),
  );
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
  const hayVisibles = items.some((i) => !i.soloMovil);
  return (
    <ul className={`mt-4 flex flex-wrap items-center gap-2 ${hayVisibles ? "" : "md:hidden"}`}>
      {items.map((i) => (
        <li key={i.texto} className={i.soloMovil ? "md:hidden" : undefined}>
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
    coleccion: lista(sp.coleccion),
    categoria: lista(sp.categoria),
    min: min === undefined ? "" : String(min),
    max: max === undefined ? "" : String(max),
  };
  const hayFiltros = Boolean(
    actuales.q || actuales.coleccion.length || actuales.categoria.length || actuales.min || actuales.max,
  );
  const [productos, colecciones, categorias, rango] = await Promise.all([
    obtenerProductos({
      q: actuales.q || undefined,
      coleccion: actuales.coleccion.length ? actuales.coleccion : undefined,
      categoria: actuales.categoria.length ? actuales.categoria : undefined,
      min,
      max,
    }),
    obtenerColecciones(),
    obtenerCategorias(),
    obtenerRangoPrecios(),
  ]);

  return (
    <div className="relative overflow-x-clip">
    <Decor variant="rama-esquina-der" className="absolute -right-6 top-8 z-0 hidden w-40 xl:block 2xl:w-44" />
    <Contenedor className="relative z-10 py-10 lg:py-16">
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
      <div className="lg:mt-6 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8">
        <BarraLateralFiltros
          key={`${actuales.min}-${actuales.max}`}
          actuales={actuales}
          colecciones={colecciones.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
          categorias={categorias}
          rango={rango}
        />
        <div className="min-w-0">
          <FiltrosActivos actuales={actuales} colecciones={colecciones} />
          <div className="mb-4 mt-6 flex items-center justify-between gap-3 lg:mt-0">
            <p className="text-sm text-tenue" aria-live="polite">
              {productos.length} {productos.length === 1 ? "prenda" : "prendas"}
            </p>
            {hayFiltros && (
              <Link
                href="/catalogo"
                className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm font-semibold text-rosa-accion underline underline-offset-2 hover:text-rosa-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion lg:hidden"
              >
                Limpiar filtros
              </Link>
            )}
          </div>
          <GrillaProductos
            conLateral
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
        </div>
      </div>
    </Contenedor>
    </div>
  );
}
