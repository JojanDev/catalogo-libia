"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Star } from "lucide-react";
import { cambiarActivaColeccionAccion, destacarColeccionAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { Boton } from "@/components/ui/Boton";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Insignia } from "@/components/ui/Insignia";
import type { Coleccion } from "@/types";

type ListaColeccionesProps = { colecciones: Coleccion[]; conteos: Record<number, number> };

export function ListaColecciones({ colecciones, conteos }: ListaColeccionesProps) {
  const router = useRouter();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [pendiente, iniciar] = useTransition();

  function destacar(id: number) {
    iniciar(async () => {
      const r = await destacarColeccionAccion(id);
      if (!r.ok) setAviso({ tipo: "error", texto: r.error });
      else {
        setAviso({ tipo: "exito", texto: "Colección destacada" });
        router.refresh();
      }
    });
  }

  return (
    <>
      <ListaResponsive
        filas={colecciones}
        idFila={(c) => c.id}
        vacio="Aún no hay colecciones."
        columnas={[
          {
            clave: "coleccion",
            titulo: "Colección",
            principal: true,
            celda: (c) => (
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
                  {c.imagen && <Image src={c.imagen} alt="" fill unoptimized className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-cafe">{c.nombre}</p>
                  {c.destacada && (
                    <Insignia variante="rosa" className="mt-1">
                      Destacada
                    </Insignia>
                  )}
                </div>
              </div>
            ),
          },
          { clave: "temporada", titulo: "Temporada", celda: (c) => c.temporada || "—" },
          { clave: "productos", titulo: "Productos", alinear: "derecha", celda: (c) => conteos[c.id] ?? 0 },
          {
            clave: "activa",
            titulo: "Activa",
            celda: (c) => (
              <Interruptor
                activo={c.activa}
                etiqueta={`Activar ${c.nombre}`}
                onCambiar={(v) => cambiarActivaColeccionAccion(c.id, v)}
                onError={(texto) => setAviso({ tipo: "error", texto })}
              />
            ),
          },
          {
            clave: "acciones",
            titulo: "",
            alinear: "derecha",
            celda: (c) => (
              <div className="flex flex-wrap justify-end gap-2">
                {!c.destacada && (
                  <Boton variante="texto" tamano="compacto" disabled={pendiente} onClick={() => destacar(c.id)}>
                    <Star className="size-4" aria-hidden="true" />
                    Destacar
                  </Boton>
                )}
                <BotonEnlace href={`/admin/colecciones/${c.id}`} variante="secundario" tamano="compacto">
                  <Pencil className="size-4" aria-hidden="true" />
                  Editar
                </BotonEnlace>
              </div>
            ),
          },
        ]}
      />
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </>
  );
}
