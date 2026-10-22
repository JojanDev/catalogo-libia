import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { EditorGuiaTallas } from "@/components/admin/EditorGuiaTallas";
import { obtenerGuiaTallas } from "@/lib/datos/tienda";

export const metadata: Metadata = { title: "Guía de tallas" };

export default async function PaginaGuiaTallas() {
  const guia = await obtenerGuiaTallas();
  return (
    <>
      <EncabezadoPagina titulo="Guía de tallas" descripcion="La tabla que ven las clientas en la tienda." />
      <EditorGuiaTallas guia={guia} />
    </>
  );
}
