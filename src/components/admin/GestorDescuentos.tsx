"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search } from "lucide-react";
import { cambiarActivoDescuentoAccion, guardarDescuentoAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { Campo, Entrada } from "@/components/ui/Campo";
import { Insignia } from "@/components/ui/Insignia";
import { formatearFecha } from "@/lib/formato";
import type { Coleccion, Descuento, Producto } from "@/types";

type FormularioDescuentoProps = {
  descuento: Descuento | null;
  productos: Producto[];
  colecciones: Coleccion[];
  onCerrar: () => void;
  onAviso: (a: DatosAviso) => void;
};

const casilla = "size-5 accent-rosa-accion";

function alternar(lista: number[], id: number, marcado: boolean) {
  return marcado ? [...lista, id] : lista.filter((x) => x !== id);
}

function FormularioDescuento({ descuento, productos, colecciones, onCerrar, onAviso }: FormularioDescuentoProps) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [nombre, setNombre] = useState(descuento?.nombre ?? "");
  const [porcentaje, setPorcentaje] = useState(descuento ? String(descuento.porcentaje) : "");
  const [fecha, setFecha] = useState(descuento?.fechaVencimiento.slice(0, 10) ?? "");
  const [productoIds, setProductoIds] = useState(descuento?.productoIds ?? []);
  const [coleccionIds, setColeccionIds] = useState(descuento?.coleccionIds ?? []);
  const [busqueda, setBusqueda] = useState("");
  const [activo, setActivo] = useState(descuento?.activo ?? true);

  const q = busqueda.trim().toLowerCase();
  const visibles = productos.filter((p) => !q || p.nombre.toLowerCase().includes(q));

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    const pct = Number(porcentaje);
    if (!nombre.trim()) nuevos.nombre = "Escribe el nombre del descuento";
    if (!Number.isInteger(pct) || pct < 1 || pct > 100) nuevos.porcentaje = "Escribe un porcentaje entre 1 y 100";
    if (!fecha) nuevos.fecha = "Elige la fecha de vencimiento";
    if (productoIds.length === 0 && coleccionIds.length === 0) {
      nuevos.alcance = "Elige al menos una prenda o una colección";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      onAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    iniciar(async () => {
      const r = await guardarDescuentoAccion({
        id: descuento?.id,
        nombre: nombre.trim(),
        porcentaje: pct,
        fechaVencimiento: fecha,
        activo,
        productoIds,
        coleccionIds,
      });
      if (!r.ok) {
        onAviso({ tipo: "error", texto: r.error });
        return;
      }
      onAviso({ tipo: "exito", texto: descuento ? "Cambios guardados" : "Descuento creado" });
      onCerrar();
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-5">
      <TarjetaPanel titulo={descuento ? "Editar descuento" : "Nuevo descuento"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
              {(p) => <Entrada {...p} value={nombre} onChange={(e) => setNombre(e.target.value)} />}
            </Campo>
          </div>
          <Campo id="porcentaje" etiqueta="Porcentaje (1 a 100)" error={errores.porcentaje}>
            {(p) => (
              <Entrada
                {...p}
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
              />
            )}
          </Campo>
          <Campo id="fecha" etiqueta="Vence el" error={errores.fecha}>
            {(p) => <Entrada {...p} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />}
          </Campo>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" className={casilla} checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            Activo
          </label>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Aplica a">
        {errores.alcance && <p className="mb-3 text-sm font-semibold text-error">{errores.alcance}</p>}
        <p className="mb-2 text-sm font-semibold text-cafe">Colecciones</p>
        {colecciones.length === 0 ? (
          <p className="text-sm text-tenue">Aún no hay colecciones.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {colecciones.map((c) => (
              <li key={c.id}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className={casilla}
                    checked={coleccionIds.includes(c.id)}
                    onChange={(e) => setColeccionIds(alternar(coleccionIds, c.id, e.target.checked))}
                  />
                  {c.nombre}
                </label>
              </li>
            ))}
          </ul>
        )}

        <p className="mb-2 mt-5 text-sm font-semibold text-cafe">Prendas ({productoIds.length} seleccionadas)</p>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-tenue" aria-hidden="true" />
          <Entrada
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar prenda"
            aria-label="Buscar prenda"
            className="h-10 pl-10"
          />
        </div>
        {visibles.length === 0 ? (
          <p className="text-sm text-tenue">No se encontraron prendas.</p>
        ) : (
          <ul className="max-h-80 divide-y divide-borde overflow-y-auto rounded-sm border border-borde">
            {visibles.map((p) => (
              <li key={p.id}>
                <label className="flex items-center gap-3 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className={casilla}
                    checked={productoIds.includes(p.id)}
                    onChange={(e) => setProductoIds(alternar(productoIds, p.id, e.target.checked))}
                  />
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
                    {p.imagen && <Image src={p.imagen} alt="" fill unoptimized className="object-cover" />}
                  </span>
                  <span className="min-w-0 truncate">{p.nombre}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </TarjetaPanel>

      <div className="flex justify-end gap-2">
        <Boton variante="secundario" tamano="compacto" onClick={onCerrar}>
          Cancelar
        </Boton>
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar cambios
        </Boton>
      </div>
    </form>
  );
}

type GestorDescuentosProps = { descuentos: Descuento[]; productos: Producto[]; colecciones: Coleccion[] };

export function GestorDescuentos({ descuentos, productos, colecciones }: GestorDescuentosProps) {
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [editando, setEditando] = useState<Descuento | "nuevo" | null>(null);
  const [hoy] = useState(() => new Date().toISOString().slice(0, 10));

  if (editando) {
    return (
      <>
        <FormularioDescuento
          key={editando === "nuevo" ? "nuevo" : editando.id}
          descuento={editando === "nuevo" ? null : editando}
          productos={productos}
          colecciones={colecciones}
          onCerrar={() => setEditando(null)}
          onAviso={setAviso}
        />
        <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Boton tamano="compacto" onClick={() => setEditando("nuevo")}>
          <Plus className="size-4" aria-hidden="true" />
          Nuevo descuento
        </Boton>
      </div>
      <ListaResponsive
        filas={descuentos}
        idFila={(d) => d.id}
        vacio="Aún no hay descuentos. Crea el primero para activar una promoción."
        columnas={[
          {
            clave: "nombre",
            titulo: "Nombre",
            principal: true,
            celda: (d) => <span className="font-bold text-cafe">{d.nombre}</span>,
          },
          { clave: "pct", titulo: "Descuento", celda: (d) => `${d.porcentaje}%` },
          { clave: "vence", titulo: "Vence", celda: (d) => formatearFecha(d.fechaVencimiento) },
          {
            clave: "alcance",
            titulo: "Alcance",
            celda: (d) => `${d.productoIds.length} prendas / ${d.coleccionIds.length} colecciones`,
          },
          {
            clave: "vigencia",
            titulo: "Vigencia",
            celda: (d) =>
              d.fechaVencimiento.slice(0, 10) >= hoy ? (
                <Insignia variante="exito">Vigente</Insignia>
              ) : (
                <Insignia variante="cafe">Vencido</Insignia>
              ),
          },
          {
            clave: "activo",
            titulo: "Activo",
            celda: (d) => (
              <Interruptor
                activo={d.activo}
                etiqueta={`Activar ${d.nombre}`}
                onCambiar={(v) => cambiarActivoDescuentoAccion(d.id, v)}
                onError={(texto) => setAviso({ tipo: "error", texto })}
              />
            ),
          },
          {
            clave: "editar",
            titulo: "",
            alinear: "derecha",
            celda: (d) => (
              <Boton variante="secundario" tamano="compacto" onClick={() => setEditando(d)}>
                <Pencil className="size-4" aria-hidden="true" />
                Editar
              </Boton>
            ),
          },
        ]}
      />
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </div>
  );
}
