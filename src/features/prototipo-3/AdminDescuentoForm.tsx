import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.ts";
import type { Descuento, Producto } from "../../types/index.ts";

interface AdminDescuentoFormProps {
  descuento: Descuento | null;
  onGuardar: (
    datos: { nombre: string; porcentaje: number; fecha_vencimiento: string; activo: boolean },
    productoIds: number[],
  ) => Promise<string | null>;
  onCancelar: () => void;
}

export function AdminDescuentoForm({ descuento, onGuardar, onCancelar }: AdminDescuentoFormProps) {
  const [nombre, setNombre] = useState(descuento?.nombre ?? "");
  const [porcentaje, setPorcentaje] = useState(descuento?.porcentaje?.toString() ?? "");
  const [fechaVencimiento, setFechaVencimiento] = useState(descuento?.fecha_vencimiento ?? "");
  const [activo, setActivo] = useState(descuento?.activo ?? true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [todosProductos, setTodosProductos] = useState<Producto[]>([]);
  const [productosAsignados, setProductosAsignados] = useState<number[]>(descuento?.productos?.map((p) => p.producto_id) ?? []);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    supabase.from("productos").select("id, nombre, imagen_url, activo").order("nombre").then(({ data }) => {
      if (data) setTodosProductos(data.map((r) => ({ id: r.id, nombre: r.nombre, imagen_url: r.imagen_url, activo: r.activo })) as unknown as Producto[]);
    });
  }, []);

  const esEdicion = descuento !== null;

  const productosFiltrados = todosProductos.filter(
    (p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !productosAsignados.includes(p.id),
  );

  const agregarProducto = (id: number) => {
    setProductosAsignados((prev) => [...prev, id]);
    setBusqueda("");
  };

  const quitarProducto = (id: number) => {
    setProductosAsignados((prev) => prev.filter((pid) => pid !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pct = Number.parseInt(porcentaje, 10);
    if (!nombre || Number.isNaN(pct) || pct <= 0 || pct > 100) {
      setError("Nombre y porcentaje (1-100) son obligatorios");
      return;
    }
    if (!fechaVencimiento) {
      setError("La fecha de vencimiento es obligatoria");
      return;
    }

    setGuardando(true);
    const err = await onGuardar(
      { nombre, porcentaje: pct, fecha_vencimiento: fechaVencimiento, activo },
      productosAsignados,
    );
    setGuardando(false);
    if (err) setError(err);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancelar} className="text-sm text-text-muted hover:text-text-primary font-body transition-colors">
          ← Volver
        </button>
        <h2 className="text-lg font-medium text-text-primary font-heading">
          {esEdicion ? "Editar descuento" : "Nuevo descuento"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg rounded-2xl border border-border-soft p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: datos del descuento */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Datos del descuento
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Ej: Rebaja de Verano"
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1 font-body">Porcentaje (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={porcentaje}
                  onChange={(e) => setPorcentaje(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1 font-body">Vence</label>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-4 h-4 rounded border-border-soft text-warm-accent focus:ring-warm-accent"
              />
              <span className="text-sm text-text-primary font-body">Descuento activo</span>
            </label>
          </div>

          {/* Columna derecha: asignar productos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Productos con este descuento
            </h3>

            <div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto por nombre..."
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              />
              {busqueda && productosFiltrados.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-border-soft rounded-xl divide-y">
                  {productosFiltrados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => agregarProducto(p.id)}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-canvas transition-colors font-body"
                    >
                      {p.nombre}
                    </button>
                  ))}
                </div>
              )}
              {busqueda && productosFiltrados.length === 0 && (
                <p className="mt-2 text-xs text-text-muted font-body">No se encontraron productos.</p>
              )}
            </div>

            {productosAsignados.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-text-muted font-body">{productosAsignados.length} producto(s) asignado(s):</p>
                {productosAsignados.map((pid) => {
                  const prod = todosProductos.find((p) => p.id === pid);
                  if (!prod) return null;
                  return (
                    <div key={pid} className="flex items-center justify-between gap-2 bg-canvas border border-border-soft rounded-xl px-3 py-2">
                      <span className="text-sm text-text-primary font-body truncate">{prod.nombre}</span>
                      <button
                        type="button"
                        onClick={() => quitarProducto(pid)}
                        className="text-red-500 hover:text-red-700 text-sm shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2 mt-4 font-body">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-soft">
          <button
            type="submit"
            disabled={guardando}
            className="bg-warm-accent hover:bg-warm-accent-hover disabled:opacity-50 text-white font-semibold text-sm py-2.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all font-body"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="text-sm text-text-muted hover:text-text-primary font-body transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
