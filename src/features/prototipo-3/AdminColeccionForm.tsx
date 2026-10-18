import { useState, useEffect } from "react";
import type { Coleccion, Producto } from "../../types/index.ts";

interface AdminColeccionFormProps {
  coleccion: Coleccion | null;
  productosExistentes: Producto[];
  onGuardar: (
    datos: { nombre: string; slug: string; descripcion: string; temporada: string; imagen: string },
    productoIds: number[],
  ) => Promise<string | null>;
  onCancelar: () => void;
}

export function AdminColeccionForm({
  coleccion,
  productosExistentes,
  onGuardar,
  onCancelar,
}: AdminColeccionFormProps) {
  const [nombre, setNombre] = useState(coleccion?.nombre ?? "");
  const [slug, setSlug] = useState(coleccion?.slug ?? "");
  const [descripcion, setDescripcion] = useState(coleccion?.descripcion ?? "");
  const [temporada, setTemporada] = useState(coleccion?.temporada ?? "");
  const [imagenUrl, setImagenUrl] = useState(coleccion?.imagen ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productosAsignados, setProductosAsignados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const esEdicion = coleccion !== null;

  useEffect(() => {
    if (coleccion) {
      const ids = productosExistentes
        .filter((p) => p.coleccion === coleccion.nombre)
        .map((p) => p.id);
      setProductosAsignados(ids);
    }
  }, [coleccion, productosExistentes]);

  const generarSlug = (valor: string) =>
    valor.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNombreChange = (valor: string) => {
    setNombre(valor);
    if (!esEdicion) setSlug(generarSlug(valor));
  };

  const productosFiltrados = productosExistentes.filter(
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

    if (!nombre || !slug) {
      setError("Nombre y slug son obligatorios");
      return;
    }

    setGuardando(true);
    const err = await onGuardar({ nombre, slug, descripcion, temporada, imagen: imagenUrl }, productosAsignados);
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
          {esEdicion ? "Editar colección" : "Nueva colección"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg rounded-2xl border border-border-soft p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: datos */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Información de la colección
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => handleNombreChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm font-mono text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Temporada</label>
              <input
                type="text"
                value={temporada}
                onChange={(e) => setTemporada(e.target.value)}
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                placeholder="Primavera, Verano..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">URL de imagen</label>
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Columna derecha: productos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Productos en esta colección
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
                <p className="text-xs text-text-muted font-body">{productosAsignados.length} producto(s):</p>
                {productosAsignados.map((pid) => {
                  const prod = productosExistentes.find((p) => p.id === pid);
                  if (!prod) return null;
                  return (
                    <div key={pid} className="flex items-center justify-between gap-2 bg-canvas border border-border-soft rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {prod.imagen && (
                          <img src={prod.imagen} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        )}
                        <span className="text-sm text-text-primary font-body truncate">{prod.nombre}</span>
                      </div>
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
