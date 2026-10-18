import type { Coleccion } from "../../types/index.ts";

interface AdminColeccionesListProps {
  colecciones: Coleccion[];
  conteoProductos: Record<string, number>;
  onAgregar: () => void;
  onEditar: (slug: string) => void;
  onEliminar: (slug: string) => void;
}

export function AdminColeccionesList({
  colecciones,
  conteoProductos,
  onAgregar,
  onEditar,
  onEliminar,
}: AdminColeccionesListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted font-body">{colecciones.length} colecciones</p>
        <button
          onClick={onAgregar}
          className="bg-warm-accent hover:bg-warm-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-full shadow-sm hover:shadow-md transition-all font-body"
        >
          + Nueva colección
        </button>
      </div>

      <div className="bg-card-bg rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-canvas">
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted font-body">Temporada</th>
                <th className="text-center px-4 py-3 font-medium text-text-muted font-body">Productos</th>
                <th className="text-right px-4 py-3 font-medium text-text-muted font-body">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {colecciones.map((c) => (
                <tr key={c.slug} className="border-b border-border-soft hover:bg-canvas/50">
                  <td className="px-4 py-3 font-medium text-text-primary font-body">{c.nombre}</td>
                  <td className="px-4 py-3 text-text-muted font-body">{c.temporada}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-canvas border border-border-soft text-text-primary font-semibold px-2.5 py-0.5 rounded-full text-xs font-body">
                      {conteoProductos[c.nombre] ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditar(c.slug)}
                        className="text-xs text-text-muted hover:text-warm-accent underline underline-offset-2 font-body transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onEliminar(c.slug)}
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
