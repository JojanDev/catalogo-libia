import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { GestorCodigos } from "@/components/admin/GestorCodigos";
import { listarCodigos } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Códigos promocionales" };

export default async function PaginaCodigos() {
  const codigos = await listarCodigos();
  return (
    <>
      <EncabezadoPagina titulo="Códigos promocionales" descripcion="Códigos que las clientas escriben al pagar." />
      <GestorCodigos codigos={codigos} />
    </>
  );
}
