import type { Producto } from "../../types/index.ts";

interface AdminProductosListProps {
  productos: Producto[];
  onAgregar: () => void;
  onEditar: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
  onEliminar: (id: number) => void;
}

export function AdminProductosList({
  productos,
  onAgregar,
  onEditar,
  onToggleActivo,
  onEliminar,
}: AdminProductosListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted font-body">{productos.length} productos</p>
        <button
          onClick={onAgregar}
          className="bg-warm-accent hover:bg-warm-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-full shadow-sm hover:shadow-md transition-all font-body"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="bg-card-bg rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-canvas">
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">ID</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Precio</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Categoría</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Colección</th>
                <th className="text-center px-4 py-3 font-medium text-text-muted font-body">Activo</th>
                <th className="text-right px-4 py-3 font-medium text-text-muted font-body">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b border-border-soft hover:bg-canvas/50">
                  <td className="px-4 py-3 text-text-muted font-body">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-text-primary font-body">{p.nombre}</td>
                  <td className="px-4 py-3 text-text-muted font-body">${p.precio.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3 text-text-muted font-body">{p.categoria}</td>
                  <td className="px-4 py-3 text-text-muted font-body">{p.coleccion}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleActivo(p.id, !p.activo)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full font-body ${
                        p.activo
                          ? "bg-pastel-green text-text-primary"
                          : "bg-border-soft text-text-muted"
                      }`}
                    >
                      {p.activo ? "Sí" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditar(p.id)}
                        className="text-xs text-text-muted hover:text-warm-accent underline underline-offset-2 font-body transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onEliminar(p.id)}
                        className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 font-body"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
