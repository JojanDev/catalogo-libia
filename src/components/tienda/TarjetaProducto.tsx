import Image from "next/image";
import Link from "next/link";
import { Insignia } from "@/components/ui/Insignia";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

type TarjetaProductoProps = {
  producto: ProductoVista;
  prioridad?: boolean;
  mostrarColeccion?: boolean;
};

export default function TarjetaProducto({
  producto,
  prioridad = false,
  mostrarColeccion = true,
}: TarjetaProductoProps) {
  const apagado = producto.agotado;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-surface shadow-card transition-shadow hover:shadow-elevada">
      <Link
        href={`/producto/${producto.slug}`}
        className="flex flex-1 flex-col after:absolute after:inset-0"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-rosa-suave">
          <Image
            src={producto.imagen}
            alt=""
            fill
            unoptimized
            priority={prioridad}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={`object-cover transition-transform duration-500 motion-reduce:transition-none ${apagado ? "opacity-70 saturate-75 sepia-[.3]" : "group-hover:scale-[1.04]"}`}
          />
          {mostrarColeccion && !apagado && producto.coleccion && (
            <span className="absolute left-2 top-2 max-w-[70%] truncate rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-cafe">
              {producto.coleccion.nombre}
            </span>
          )}
          {apagado && (
            <Insignia variante="cafe" className="absolute right-2 top-2">
              Agotado
            </Insignia>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tenue">
            {producto.categoria}
          </p>
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug lg:text-[17px] ${apagado ? "text-tenue" : "text-cafe-oscuro"}`}
          >
            {producto.nombre}
          </h3>
          <p
            className={`mt-auto pt-1 text-lg font-bold tabular-nums ${apagado ? "text-tenue" : "text-cafe"}`}
          >
            {formatearPrecio(producto.precio)}
          </p>
        </div>
      </Link>
    </article>
  );
}
