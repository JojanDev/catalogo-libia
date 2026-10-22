import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { ListaProductos } from "@/components/admin/ListaProductos";
import { listarColecciones, listarProductos } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Productos" };

export default async function PaginaProductos() {
  const [productos, colecciones] = await Promise.all([listarProductos(), listarColecciones()]);
  return (
    <>
      <EncabezadoPagina
        titulo="Productos"
        descripcion={`${productos.length} en total`}
        accion={{ texto: "Nuevo producto", href: "/admin/productos/nuevo" }}
      />
      <ListaProductos productos={productos} colecciones={colecciones} />
    </>
  );
}
