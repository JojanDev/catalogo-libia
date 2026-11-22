import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronRight, Truck } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import ConsultaWhatsApp from "@/components/tienda/ConsultaWhatsApp";
import GaleriaProducto from "@/components/tienda/GaleriaProducto";
import GrillaProductos from "@/components/tienda/GrillaProductos";
import { Contenedor } from "@/components/ui/Contenedor";
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
  const descripcion = descripcionDe(producto);
  return {
    title: producto.nombre,
    description: descripcion,
    openGraph: {
      title: producto.nombre,
      description: descripcion,
      images: [{ url: producto.imagen, alt: producto.nombre }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function descripcionDe(producto: { nombre: string; descripcion: string }) {
  return (
    producto.descripcion ||
    `${producto.nombre} de Tonorosa by Leyar, ropa infantil con envíos a toda Colombia.`
  );
}

function Acordeon({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-borde">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl text-cafe focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion [&::-webkit-details-marker]:hidden">
        {titulo}
        <ChevronDown
          className="size-5 shrink-0 text-rosa-accion transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-5 text-base leading-relaxed text-cafe">{children}</div>
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    image: [producto.imagen],
    description: descripcionDe(producto),
    offers: {
      "@type": "Offer",
      price: producto.precio,
      priceCurrency: "COP",
      availability: producto.agotado
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };
  const enlaceMiga = "inline-flex min-h-11 items-center hover:text-rosa-accion hover:underline";

  return (
    <div className="overflow-x-clip">
    <Contenedor className="relative pb-32 pt-6 lg:pb-16 lg:pt-10">
      <Decor variant="rama-esquina-izq" className="absolute -right-10 top-40 z-0 hidden w-28 -scale-x-100 xl:block min-[1440px]:-right-28 min-[1440px]:w-28" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Migas de pan" className="mb-5 text-sm text-tenue">
        <ol className="flex flex-wrap items-center gap-1">
          <li className="flex items-center gap-1">
            <Link href="/" className={enlaceMiga}>
              Inicio
            </Link>
            <ChevronRight className="size-4" aria-hidden="true" />
          </li>
          <li className="flex items-center gap-1">
            <Link
              href={producto.coleccion ? `/colecciones/${producto.coleccion.slug}` : "/catalogo"}
              className={enlaceMiga}
            >
              {producto.coleccion?.nombre ?? "Catálogo"}
            </Link>
            <ChevronRight className="size-4" aria-hidden="true" />
          </li>
          <li aria-current="page" className="max-w-48 truncate text-cafe sm:max-w-none">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <GaleriaProducto medios={producto.medios}
            imagen={producto.imagen}
            nombre={producto.nombre}
            agotado={producto.agotado} />
          <Decor variant="ramo" className="absolute bottom-0 left-12 z-0 hidden w-36 lg:block xl:w-44" />
          <Decor variant="petalo-1" className="absolute bottom-24 left-56 z-0 hidden w-6 rotate-12 xl:block" />
          <Decor variant="petalo-6" className="absolute bottom-6 left-80 z-0 hidden w-7 -rotate-12 xl:block" />
        </div>

        <div>
          <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">
            {producto.nombre}
          </h1>
          <p className="mt-4 text-2xl font-bold text-cafe">{formatearPrecio(producto.precio)}</p>
          <p className="mt-4 text-base leading-relaxed text-cafe lg:text-[17px]">
            {producto.descripcion}
          </p>

          <div className="mt-8">
            <ConsultaWhatsApp producto={producto} whatsapp={config.whatsapp} />
            <div className="mt-6 flex items-center gap-4 rounded-md border border-rosa-deco bg-rosa-suave px-4 py-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface">
                <Truck className="size-6 text-salvia-oscuro" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-semibold text-cafe">Envíos a toda Colombia</p>
                <p className="text-sm text-tenue">Recibe tu pedido en cualquier ciudad del país</p>
              </div>
            </div>
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
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="relative mt-16 lg:mt-20">
          <Decor variant="capullo" className="absolute right-0 top-0 hidden w-12 rotate-12 md:block lg:w-16" />
          <Decor variant="hoja-2" className="absolute left-0 top-0 hidden w-12 -rotate-12 md:block lg:w-14" />
          <TituloSeccion titulo="También te puede gustar" className="mb-8" />
          <GrillaProductos productos={relacionados} />
        </section>
      )}
    </Contenedor>
    </div>
  );
}
