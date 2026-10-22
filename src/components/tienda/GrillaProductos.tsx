import TarjetaProducto from "@/components/tienda/TarjetaProducto";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import type { ProductoVista } from "@/types";

export default function GrillaProductos({ productos }: { productos: ProductoVista[] }) {
  if (productos.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
        <p className="text-base text-tenue">
          No encontramos prendas con esos filtros. Prueba con otros o limpia los filtros.
        </p>
        <BotonEnlace href="/catalogo" variante="secundario">
          Limpiar filtros
        </BotonEnlace>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {productos.map((p, i) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} prioridad={i < 4} />
        </li>
      ))}
    </ul>
  );
}
