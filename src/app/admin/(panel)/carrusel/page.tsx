import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { GestorCarrusel } from "@/components/admin/GestorCarrusel";
import { listarColecciones, listarSlides } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Carrusel" };

export default async function PaginaCarrusel() {
  const [slides, colecciones] = await Promise.all([listarSlides(), listarColecciones()]);
  return (
    <>
      <EncabezadoPagina titulo="Carrusel" descripcion="Las imágenes y videos que se muestran al inicio de la tienda." />
      <GestorCarrusel slides={slides} colecciones={colecciones.filter((c) => c.activa)} />
    </>
  );
}
