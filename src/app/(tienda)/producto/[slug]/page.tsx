import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import CompraProducto from "@/components/tienda/CompraProducto";
import GaleriaProducto from "@/components/tienda/GaleriaProducto";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { Contenedor } from "@/components/ui/Contenedor";
import { Insignia } from "@/components/ui/Insignia";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import {
  obtenerConfiguracion,
  obtenerProductoPorSlug,
  obtenerRelacionados,
} from "@/lib/datos/tienda";
import { formatearPrecio } from "@/lib/formato";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) return { title: "Producto no encontrado" };
  return {
    title: producto.nombre,
    description: producto.descripcion,
    openGraph: { images: [producto.imagen] },
  };
}

function Acordeon({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-borde py-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-xl text-cafe [&::-webkit-details-marker]:hidden">
        {titulo}
        <ChevronDown
          className="size-5 text-rosa-deco transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pt-2 text-base leading-relaxed text-tenue">{children}</div>
    </details>
  );
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);
  if (!producto) notFound();
  const [config, relacionados] = await Promise.all([
    obtenerConfiguracion(),
    obtenerRelacionados(producto),
  ]);
  const conDescuento = producto.descuentoPorcentaje !== null;

  return (
    <Contenedor className="pb-32 pt-6 lg:pb-16 lg:pt-10">
      <nav aria-label="Migas de pan" className="mb-5 text-sm text-tenue">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-rosa-accion hover:underline">
              Inicio
            </Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li>
            <Link
              href={producto.coleccion ? `/colecciones/${producto.coleccion.slug}` : "/catalogo"}
              className="hover:text-rosa-accion hover:underline"
            >
              {producto.coleccion?.nombre ?? "Colección"}
            </Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li aria-current="page" className="text-cafe">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <GaleriaProducto medios={producto.medios} agotado={producto.agotado} />

        <div>
          <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">
            {producto.nombre}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`text-2xl font-bold ${conDescuento ? "text-rosa-accion" : "text-cafe"}`}
            >
              {formatearPrecio(producto.precioFinal)}
            </span>
            {conDescuento && (
              <>
                <span className="text-base text-tenue line-through">
                  {formatearPrecio(producto.precio)}
                </span>
                <Insignia>-{producto.descuentoPorcentaje}%</Insignia>
              </>
            )}
          </p>
          <p className="mt-4 text-base leading-relaxed text-cafe lg:text-[17px]">
            {producto.descripcion}
          </p>

          <div className="mt-8">
            <CompraProducto producto={producto} />
          </div>

          <div className="mt-10 border-t border-borde">
            <Acordeon titulo="Detalles">
              Prendas pensadas para el día a día de tu peque, con telas suaves y acabados cuidados.
              Cada pieza forma parte de una colección de temporada.
            </Acordeon>
            <Acordeon titulo="Cuidados">
              Lava con agua fría y colores similares, sin blanqueador. Seca a la sombra y plancha a
              temperatura baja para que dure mucho más.
            </Acordeon>
            <Acordeon titulo="Envíos">
              Enviamos a todo el país. El costo de envío es de {formatearPrecio(config.costoEnvio)}
              {config.envioGratisDesde !== null
                ? ` y es gratis en compras desde ${formatearPrecio(config.envioGratisDesde)}.`
                : "."}{" "}
              Te avisamos por WhatsApp cuando tu pedido salga.
            </Acordeon>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16 lg:mt-20">
          <TituloSeccion titulo="También te puede gustar" className="mb-8" />
          <GrillaProductos productos={relacionados} />
        </section>
      )}
    </Contenedor>
  );
}
