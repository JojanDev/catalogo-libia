import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { GestorDescuentos } from "@/components/admin/GestorDescuentos";
import { listarColecciones, listarDescuentos, listarProductos } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Descuentos" };

export default async function PaginaDescuentos() {
  const [descuentos, productos, colecciones] = await Promise.all([
    listarDescuentos(),
    listarProductos(),
    listarColecciones(),
  ]);
  return (
    <>
      <EncabezadoPagina titulo="Descuentos" descripcion="Promociones automáticas por prenda o colección." />
      <GestorDescuentos descuentos={descuentos} productos={productos} colecciones={colecciones} />
    </>
  );
}
