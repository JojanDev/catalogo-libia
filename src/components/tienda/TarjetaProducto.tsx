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
  const conDescuento = producto.descuentoPorcentaje !== null;
  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group block overflow-hidden rounded-md bg-surface shadow-card transition-shadow hover:shadow-elevada"
    >
      <div className="relative aspect-[4/5] bg-rosa-suave">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          unoptimized
          priority={prioridad}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${producto.agotado ? "opacity-60" : ""}`}
        />
        {conDescuento && (
          <Insignia className="absolute left-2 top-2">-{producto.descuentoPorcentaje}%</Insignia>
        )}
        {producto.agotado && (
          <Insignia variante="cafe" className="absolute right-2 top-2">
            Agotado
          </Insignia>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] leading-snug text-cafe">
          {producto.nombre}
        </h3>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-base font-bold">
          <span className={conDescuento ? "text-rosa-accion" : "text-cafe"}>
            {formatearPrecio(producto.precioFinal)}
          </span>
          {conDescuento && (
            <span className="text-sm font-normal text-tenue line-through">
              {formatearPrecio(producto.precio)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
