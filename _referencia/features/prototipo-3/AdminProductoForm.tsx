import { useState } from "react";
import type { Producto, Coleccion, ProductSize } from "../../types/index.ts";

interface AdminProductoFormProps {
  producto: Producto | null;
  colecciones: Coleccion[];
  tallasDisponibles: string[];
  onGuardar: (datos: Omit<Producto, "id" | "descuento">, sizes: ProductSize[]) => Promise<string | null>;
  onCancelar: () => void;
}

export function AdminProductoForm({
  producto,
  colecciones,
  tallasDisponibles,
  onGuardar,
  onCancelar,
}: AdminProductoFormProps) {
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precio, setPrecio] = useState(producto?.precio.toString() ?? "");
  const [categoria, setCategoria] = useState(producto?.categoria ?? "");
  const [coleccion, setColeccion] = useState(producto?.coleccion ?? "");
  const [imagenUrl, setImagenUrl] = useState(producto?.imagen ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [activo, setActivo] = useState(producto?.activo ?? true);

  const [sizes, setSizes] = useState<ProductSize[]>(producto?.sizes ?? []);
  const [nuevaTalla, setNuevaTalla] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esEdicion = producto !== null;

  const tallasNoAgregadas = tallasDisponibles.filter((t) => !sizes.find((s) => s.size === t));

  const agregarTalla = () => {
    if (!nuevaTalla) return;
    setSizes((prev) => [...prev, { size: nuevaTalla, stock: 0 }]);
    setNuevaTalla("");
  };

  const quitarTalla = (talla: string) => {
    setSizes((prev) => prev.filter((s) => s.size !== talla));
  };

  const updateStock = (talla: string, stock: number) => {
    setSizes((prev) => prev.map((s) => (s.size === talla ? { ...s, stock } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const precioNum = Number.parseFloat(precio);
    if (!nombre || Number.isNaN(precioNum)) {
      setError("Nombre y precio son obligatorios");
      return;
    }

    setGuardando(true);
    const err = await onGuardar(
      {
        nombre,
        precio: precioNum,
        categoria,
        coleccion,
        imagen: imagenUrl,
        descripcion,
        activo,
        sizes,
      },
      sizes,
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
          {esEdicion ? "Editar producto" : "Nuevo producto"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg rounded-2xl border border-border-soft p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: datos básicos */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Información del producto
            </h3>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1 font-body">Precio ($ COP)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1 font-body">Categoría</label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">Colección</label>
              <select
                value={coleccion}
                onChange={(e) => setColeccion(e.target.value)}
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              >
                <option value="">Sin colección</option>
                {colecciones.map((c) => (
                  <option key={c.slug} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1 font-body">URL de la imagen</label>
              <input
                type="url"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                placeholder="https://..."
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

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="w-4 h-4 rounded border-border-soft text-warm-accent focus:ring-warm-accent"
              />
              <span className="text-sm text-text-primary font-body">Producto activo</span>
            </label>
          </div>

          {/* Columna derecha: tallas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary font-heading border-b border-border-soft pb-2">
              Tallas y Stock
            </h3>

            {tallasNoAgregadas.length > 0 && (
              <div className="flex gap-2">
                <select
                  value={nuevaTalla}
                  onChange={(e) => setNuevaTalla(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30"
                >
                  <option value="">Seleccionar talla...</option>
                  {tallasNoAgregadas.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={agregarTalla}
                  disabled={!nuevaTalla}
                  className="px-4 py-2.5 bg-text-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 font-body"
                >
                  Agregar
                </button>
              </div>
            )}

            {sizes.length === 0 ? (
              <p className="text-sm text-text-muted font-body py-4">
                Sin tallas asignadas. Un producto sin tallas no tiene stock.
              </p>
            ) : (
              <div className="space-y-2">
                {sizes.map((s) => (
                  <div key={s.size} className="flex items-center gap-3 bg-canvas border border-border-soft rounded-xl px-3 py-2">
                    <span className="text-sm font-semibold text-text-primary font-heading w-12">{s.size}</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => updateStock(s.size, Number.parseInt(e.target.value, 10) || 0)}
                        className="w-20 px-2 py-1 border border-border-soft rounded-lg text-sm text-text-primary font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30"
                      />
                      <span className="text-xs text-text-muted font-body">stock</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitarTalla(s.size)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                      aria-label={`Eliminar talla ${s.size}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
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
