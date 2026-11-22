import Image from "next/image";
import Link from "next/link";
import BotonAgregarRapido from "@/components/tienda/BotonAgregarRapido";
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
  const conDescuento = producto.descuentoPorcentaje !== null;
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
          {conDescuento && !apagado && (
            <Insignia className="absolute left-2 top-2">
              -{producto.descuentoPorcentaje}%<span className="sr-only"> de descuento</span>
            </Insignia>
          )}
          {mostrarColeccion && !apagado && !conDescuento && producto.coleccion && (
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
        <div className="flex flex-1 flex-col gap-1 px-3 pt-3 md:px-4 md:pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tenue">
            {producto.categoria}
          </p>
          <h3
            className={`line-clamp-2 text-base font-semibold leading-snug lg:text-[17px] ${apagado ? "text-tenue" : "text-cafe-oscuro"}`}
          >
            {producto.nombre}
          </h3>
        </div>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-2 px-3 pb-3 pt-1 md:px-4 md:pb-4">
        <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-bold tabular-nums">
          <span className={apagado ? "text-tenue" : conDescuento ? "text-rosa-accion" : "text-cafe"}>
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
