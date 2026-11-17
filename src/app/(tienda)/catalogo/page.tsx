import type { Metadata } from "next";
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
  const n = Number(v);
  return v !== "" && Number.isFinite(n) ? n : undefined;
}

export default async function CatalogoPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const actuales = {
    q: uno(sp.q),
    coleccion: uno(sp.coleccion),
    categoria: uno(sp.categoria),
    min: uno(sp.min),
    max: uno(sp.max),
  };
  const [productos, colecciones, categorias, rango] = await Promise.all([
    obtenerProductos({
      q: actuales.q || undefined,
      coleccion: actuales.coleccion || undefined,
      categoria: actuales.categoria || undefined,
      min: numero(actuales.min),
      max: numero(actuales.max),
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
