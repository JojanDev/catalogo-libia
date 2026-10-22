import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { ListaColecciones } from "@/components/admin/ListaColecciones";
import { listarColecciones, listarProductos } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Colecciones" };

export default async function PaginaColecciones() {
  const [colecciones, productos] = await Promise.all([listarColecciones(), listarProductos()]);
  const conteos: Record<number, number> = {};
  for (const p of productos) {
    if (p.coleccionId !== null) conteos[p.coleccionId] = (conteos[p.coleccionId] ?? 0) + 1;
  }
  return (
    <>
      <EncabezadoPagina
        titulo="Colecciones"
        descripcion={`${colecciones.length} en total`}
        accion={{ texto: "Nueva colección", href: "/admin/colecciones/nuevo" }}
      />
      <ListaColecciones colecciones={colecciones} conteos={conteos} />
    </>
  );
}
