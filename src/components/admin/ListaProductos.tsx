"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Search } from "lucide-react";
import { cambiarActivoProductoAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Entrada, Selector } from "@/components/ui/Campo";
import { Insignia } from "@/components/ui/Insignia";
import { formatearPrecio } from "@/lib/formato";
import type { Coleccion, Producto } from "@/types";

type ListaProductosProps = { productos: Producto[]; colecciones: Coleccion[] };

export function ListaProductos({ productos, colecciones }: ListaProductosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [coleccion, setColeccion] = useState("");
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const nombres = new Map(colecciones.map((c) => [c.id, c.nombre]));

  const q = busqueda.trim().toLowerCase();
  const filas = productos.filter(
    (p) =>
      (!q || p.nombre.toLowerCase().includes(q)) &&
      (!coleccion || (coleccion === "0" ? p.coleccionId === null : String(p.coleccionId) === coleccion)),
  );

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-tenue" aria-hidden="true" />
          <Entrada
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre"
            aria-label="Buscar producto"
            className="h-10 pl-10"
          />
        </div>
        <Selector
          value={coleccion}
          onChange={(e) => setColeccion(e.target.value)}
          aria-label="Filtrar por colección"
          className="h-10 sm:w-56"
        >
          <option value="">Todas las colecciones</option>
          <option value="0">Sin colección</option>
          {colecciones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Selector>
      </div>

      <ListaResponsive
        filas={filas}
        idFila={(p) => p.id}
        vacio="No se encontraron productos."
        columnas={[
          {
            clave: "producto",
            titulo: "Producto",
            principal: true,
            celda: (p) => (
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
                  {p.imagen && <Image src={p.imagen} alt="" fill unoptimized className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-cafe">{p.nombre}</p>
                  <div className="mt-1 flex gap-1.5 empty:hidden">
                    {p.agotado && <Insignia variante="error">Agotado</Insignia>}
                    {!p.activo && <Insignia variante="cafe">Inactivo</Insignia>}
                  </div>
                </div>
              </div>
            ),
          },
          {
            clave: "coleccion",
            titulo: "Colección",
            celda: (p) => (p.coleccionId !== null ? nombres.get(p.coleccionId) ?? "—" : "—"),
          },
          { clave: "precio", titulo: "Precio", alinear: "derecha", celda: (p) => formatearPrecio(p.precio) },
          {
            clave: "activo",
            titulo: "Activo",
            celda: (p) => (
              <Interruptor
                activo={p.activo}
                etiqueta={`Activar ${p.nombre}`}
                onCambiar={(v) => cambiarActivoProductoAccion(p.id, v)}
                onError={(texto) => setAviso({ tipo: "error", texto })}
              />
            ),
          },
          {
            clave: "editar",
            titulo: "",
            alinear: "derecha",
            celda: (p) => (
              <BotonEnlace href={`/admin/productos/${p.id}`} variante="secundario" tamano="compacto">
                <Pencil className="size-4" aria-hidden="true" />
                Editar
              </BotonEnlace>
            ),
          },
        ]}
      />
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </>
  );
}
