import Image from "next/image";
import Link from "next/link";
import BotonAgregarRapido from "@/components/tienda/BotonAgregarRapido";
import { Insignia } from "@/components/ui/Insignia";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

type TarjetaProductoProps = {
  producto: ProductoVista;
  prioridad?: boolean;
};

export default function TarjetaProducto({ producto, prioridad = false }: TarjetaProductoProps) {
  const conDescuento = producto.descuentoPorcentaje !== null;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-surface shadow-card transition-shadow hover:shadow-elevada">
      <Link href={`/producto/${producto.slug}`} className="block after:absolute after:inset-0">
        <div className="relative aspect-[4/5] bg-rosa-suave">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            unoptimized
            priority={prioridad}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={`object-cover transition-transform duration-300 ${producto.agotado ? "grayscale" : "group-hover:scale-105"}`}
          />
          {conDescuento && (
            <Insignia className="absolute left-2 top-2">
              -{producto.descuentoPorcentaje}%<span className="sr-only"> de descuento</span>
            </Insignia>
          )}
          {producto.agotado && (
            <Insignia variante="cafe" className="absolute right-2 top-2">
              Agotado
            </Insignia>
          )}
        </div>
        <div className="px-3 pt-3 md:px-4 md:pt-4">
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug lg:text-[17px] ${producto.agotado ? "text-tenue" : "text-cafe"}`}
          >
            {producto.nombre}
          </h3>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 px-3 pb-3 pt-1 md:px-4 md:pb-4">
        <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-extrabold">
            <span className={producto.agotado ? "text-tenue" : conDescuento ? "text-rosa-accion" : "text-cafe"}>
              {conDescuento && <span className="sr-only">Precio con descuento: </span>}
              {formatearPrecio(producto.precioFinal)}
            </span>
            {conDescuento && (
              <span className="text-sm font-normal text-tenue line-through">
                <span className="sr-only">Antes: </span>
                {formatearPrecio(producto.precio)}
              </span>
            )}
        </p>
        <div className="relative z-10">
          <BotonAgregarRapido producto={producto} />
        </div>
      </div>
    </article>
  );
}
