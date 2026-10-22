import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { GestorTallas } from "@/components/admin/GestorTallas";
import { listarTallas } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Tallas" };

export default async function PaginaTallas() {
  const tallas = await listarTallas();
  return (
    <>
      <EncabezadoPagina titulo="Tallas" descripcion="Las tallas activas aparecen al editar productos." />
      <GestorTallas tallas={tallas} />
    </>
  );
}
