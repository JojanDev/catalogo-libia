import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { FormularioColeccion } from "@/components/admin/FormularioColeccion";
import { obtenerColeccion } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Editar colección" };

export default async function PaginaEditarColeccion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();
  const coleccion = await obtenerColeccion(numero);
  if (!coleccion) notFound();
  return (
    <>
      <EncabezadoPagina titulo="Editar colección" descripcion={coleccion.nombre} />
      <FormularioColeccion coleccion={coleccion} />
    </>
  );
}
