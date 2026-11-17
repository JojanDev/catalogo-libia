import { PackageSearch } from "lucide-react";
import TarjetaProducto from "@/components/tienda/TarjetaProducto";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import type { ProductoVista } from "@/types";

type Vacio = { mensaje: string; etiqueta: string; href: string };

export default function GrillaProductos({
  productos,
  conPrioridad = true,
  vacio = {
    mensaje: "No encontramos prendas con esos filtros. Prueba con otros o limpia los filtros.",
    etiqueta: "Limpiar filtros",
    href: "/catalogo",
  },
}: {
  productos: ProductoVista[];
  conPrioridad?: boolean;
  vacio?: Vacio;
}) {
  if (productos.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
        <PackageSearch className="size-10 text-rosa-deco" aria-hidden="true" />
        <p className="text-base text-tenue">{vacio.mensaje}</p>
        <BotonEnlace href={vacio.href} variante="secundario">
          {vacio.etiqueta}
        </BotonEnlace>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {productos.map((p, i) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} prioridad={conPrioridad && i < 4} />
        </li>
      ))}
    </ul>
  );
}
