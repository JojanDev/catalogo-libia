import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { Contenedor } from "@/components/ui/Contenedor";
import { Separador } from "@/components/ui/Separador";
import { obtenerColeccionPorSlug, obtenerProductos } from "@/lib/datos/tienda";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coleccion = await obtenerColeccionPorSlug(slug);
  if (!coleccion) return { title: "Colección" };
  return { title: coleccion.nombre, description: coleccion.descripcion };
}

export default async function ColeccionPage({ params }: Props) {
  const { slug } = await params;
  const coleccion = await obtenerColeccionPorSlug(slug);
  if (!coleccion) notFound();
  const productos = await obtenerProductos({ coleccion: slug });

  return (
    <>
      <section className="bg-rosa-suave py-12 text-center lg:py-16">
        <Contenedor>
          {coleccion.temporada && (
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-tenue">
              {coleccion.temporada}
            </p>
          )}
          <h1 className="mt-2 font-display text-[32px] leading-tight text-cafe md:text-5xl">
            {coleccion.nombre}
          </h1>
          <Separador className="mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-base text-cafe lg:text-[17px]">
            {coleccion.descripcion}
          </p>
        </Contenedor>
      </section>
      <Contenedor className="py-10 lg:py-16">
        <p className="mb-4 text-sm text-tenue">
          {productos.length} {productos.length === 1 ? "prenda" : "prendas"}
        </p>
        <GrillaProductos productos={productos} />
      </Contenedor>
    </>
  );
}
