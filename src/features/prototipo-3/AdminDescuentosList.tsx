import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.ts";
import type { Descuento } from "../../types/index.ts";

function mapDescuentoDesdeDB(row: Record<string, unknown>): Descuento {
  return {
    id: row.id as number,
    nombre: row.nombre as string,
    porcentaje: row.porcentaje as number,
    fecha_vencimiento: row.fecha_vencimiento as string,
    activo: (row.activo as boolean) ?? true,
  };
}

export function AdminDescuentosList({
  onAgregar,
  onEditar,
}: {
  onAgregar: () => void;
  onEditar: (id: number) => void;
}) {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    const { data } = await supabase
      .from("descuentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDescuentos(data.map(mapDescuentoDesdeDB));
    setLoading(false);
  }

  const handleToggle = async (id: number, activo: boolean) => {
    const { error } = await supabase.from("descuentos").update({ activo }).eq("id", id);
    if (!error) setDescuentos((prev) => prev.map((d) => (d.id === id ? { ...d, activo } : d)));
  };

  const handleEliminar = async (id: number) => {
    const { error } = await supabase.from("descuentos").delete().eq("id", id);
    if (!error) setDescuentos((prev) => prev.filter((d) => d.id !== id));
  };

  const hoy = new Date().toISOString().split("T")[0];
  const activos = descuentos.filter((d) => d.activo && d.fecha_vencimiento >= hoy).length;
  const vencidos = descuentos.filter((d) => d.fecha_vencimiento < hoy).length;

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse font-body">Cargando descuentos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted font-body">{descuentos.length} descuentos</p>
        <button
          onClick={onAgregar}
          className="bg-warm-accent hover:bg-warm-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-full shadow-sm hover:shadow-md transition-all font-body"
        >
          + Nuevo descuento
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Total</p>
          <p className="text-2xl font-bold text-text-primary font-heading mt-1">{descuentos.length}</p>
        </div>
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Activos</p>
          <p className="text-2xl font-bold text-green-600 font-heading mt-1">{activos}</p>
        </div>
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Vencidos</p>
          <p className="text-2xl font-bold text-red-500 font-heading mt-1">{vencidos}</p>
        </div>
      </div>

      {descuentos.length === 0 ? (
        <p className="text-center text-text-muted py-10 font-body">No hay descuentos creados.</p>
      ) : (
        <div className="bg-card-bg rounded-2xl border border-border-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-canvas">
                  <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Nombre</th>
                  <th className="text-center px-4 py-3 font-medium text-text-muted font-body">Descuento</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Vence</th>
                  <th className="text-center px-4 py-3 font-medium text-text-muted font-body">Estado</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted font-body">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {descuentos.map((d) => {
                  const vencido = d.fecha_vencimiento < hoy;
                  return (
                    <tr key={d.id} className="border-b border-border-soft hover:bg-canvas/50">
                      <td className="px-4 py-3 font-medium text-text-primary font-body">{d.nombre}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block bg-warm-accent/10 text-warm-accent font-bold px-2.5 py-0.5 rounded-full text-xs font-body">
                          -{d.porcentaje}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted font-body">{d.fecha_vencimiento}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold font-body ${
                            !d.activo
                              ? "bg-border-soft text-text-muted"
                              : vencido
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {!d.activo ? "Inactivo" : vencido ? "Vencido" : "Activo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditar(d.id)}
                            className="text-xs text-text-muted hover:text-warm-accent underline underline-offset-2 font-body transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggle(d.id, !d.activo)}
                            className="text-xs text-text-muted hover:text-text-primary underline underline-offset-2 font-body"
                          >
                            {d.activo ? "Desactivar" : "Activar"}
                          </button>
                          <button
                            onClick={() => handleEliminar(d.id)}
                            className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 font-body"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
