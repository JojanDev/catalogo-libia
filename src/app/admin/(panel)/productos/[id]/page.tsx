import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { FormularioProducto } from "@/components/admin/FormularioProducto";
import { listarColecciones, listarProductos, listarTallas, obtenerProducto } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Editar producto" };

export default async function PaginaEditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();
  const [producto, tallas, colecciones, productos] = await Promise.all([
    obtenerProducto(numero),
    listarTallas(),
    listarColecciones(),
    listarProductos(),
  ]);
  if (!producto) notFound();
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  return (
    <>
      <EncabezadoPagina titulo="Editar producto" descripcion={producto.nombre} />
      <FormularioProducto
        producto={producto}
        tallas={tallas}
        colecciones={colecciones}
        categorias={categorias}
      />
    </>
  );
}
