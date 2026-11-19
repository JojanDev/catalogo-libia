import Image from "next/image";
import Link from "next/link";
import { Insignia } from "@/components/ui/Insignia";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

type TarjetaProductoProps = {
  producto: ProductoVista;
  prioridad?: boolean;
};

export default function TarjetaProducto({ producto, prioridad = false }: TarjetaProductoProps) {
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
      <p
        className={`mt-auto px-3 pb-3 pt-1 text-lg font-extrabold md:px-4 md:pb-4 ${producto.agotado ? "text-tenue" : "text-cafe"}`}
      >
        {formatearPrecio(producto.precio)}
      </p>
    </article>
  );
}
