import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { FormularioProducto } from "@/components/admin/FormularioProducto";
import { listarColecciones, listarProductos, listarTallas } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function PaginaNuevoProducto() {
  const [tallas, colecciones, productos] = await Promise.all([
    listarTallas(),
    listarColecciones(),
    listarProductos(),
  ]);
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  return (
    <>
      <EncabezadoPagina titulo="Nuevo producto" />
      <FormularioProducto tallas={tallas} colecciones={colecciones} categorias={categorias} />
    </>
  );
}
