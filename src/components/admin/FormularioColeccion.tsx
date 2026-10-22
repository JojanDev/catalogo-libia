"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarColeccionAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { SubidorMedios } from "@/components/admin/SubidorMedios";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Entrada } from "@/components/ui/Campo";
import type { Coleccion, Medio } from "@/types";

export function FormularioColeccion({ coleccion }: { coleccion?: Coleccion }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [nombre, setNombre] = useState(coleccion?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(coleccion?.descripcion ?? "");
  const [temporada, setTemporada] = useState(coleccion?.temporada ?? "");
  const [medios, setMedios] = useState<Medio[]>(
    coleccion?.imagen ? [{ id: -1, tipo: "imagen", url: coleccion.imagen, alt: "", orden: 0 }] : [],
  );
  const [orden, setOrden] = useState(String(coleccion?.orden ?? 0));
  const [activa, setActiva] = useState(coleccion?.activa ?? true);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    if (!nombre.trim()) nuevos.nombre = "Escribe el nombre de la colección";
    if (!Number.isInteger(Number(orden))) nuevos.orden = "El orden debe ser un número entero";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    iniciar(async () => {
      const r = await guardarColeccionAccion({
        id: coleccion?.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        temporada: temporada.trim(),
        imagen: medios[0]?.url ?? "",
        activa,
        destacada: coleccion?.destacada ?? false,
        orden: Number(orden),
      });
      if (!r.ok) {
        setAviso({ tipo: "error", texto: r.error });
        return;
      }
      router.push("/admin/colecciones");
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-5 pb-24">
      <TarjetaPanel titulo="Información">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
              {(p) => <Entrada {...p} value={nombre} onChange={(e) => setNombre(e.target.value)} />}
            </Campo>
          </div>
          <div className="sm:col-span-2">
            <Campo id="descripcion" etiqueta="Descripción">
              {(p) => <AreaTexto {...p} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />}
            </Campo>
          </div>
          <Campo id="temporada" etiqueta="Temporada" ayuda="Por ejemplo: Primavera 2026">
            {(p) => <Entrada {...p} value={temporada} onChange={(e) => setTemporada(e.target.value)} />}
          </Campo>
          <Campo id="orden" etiqueta="Orden" ayuda="Los números menores aparecen primero" error={errores.orden}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" value={orden} onChange={(e) => setOrden(e.target.value)} />
            )}
          </Campo>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Imagen">
        <SubidorMedios medios={medios} onCambio={setMedios} unico soloImagenes />
      </TarjetaPanel>

      <TarjetaPanel titulo="Estado">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-5 accent-rosa-accion"
            checked={activa}
            onChange={(e) => setActiva(e.target.checked)}
          />
          Activa (visible en la tienda)
        </label>
      </TarjetaPanel>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-2 border-t border-borde bg-surface px-4 py-3 md:left-60">
        <Boton variante="secundario" tamano="compacto" onClick={() => router.push("/admin/colecciones")}>
          Cancelar
        </Boton>
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar cambios
        </Boton>
      </div>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </form>
  );
}
