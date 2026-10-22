import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { FormularioColeccion } from "@/components/admin/FormularioColeccion";

export const metadata: Metadata = { title: "Nueva colección" };

export default function PaginaNuevaColeccion() {
  return (
    <>
      <EncabezadoPagina titulo="Nueva colección" />
      <FormularioColeccion />
    </>
  );
}
