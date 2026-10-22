import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { FormularioConfiguracion } from "@/components/admin/FormularioConfiguracion";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export const metadata: Metadata = { title: "Configuración" };

export default async function PaginaConfiguracion() {
  const configuracion = await obtenerConfiguracion();
  return (
    <>
      <EncabezadoPagina titulo="Configuración" descripcion="Datos generales de la tienda." />
      <FormularioConfiguracion configuracion={configuracion} />
    </>
  );
}
