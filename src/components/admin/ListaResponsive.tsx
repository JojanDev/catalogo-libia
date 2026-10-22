export type ColumnaLista<T> = {
  clave: string;
  titulo: string;
  celda: (fila: T) => React.ReactNode;
  principal?: boolean;
  alinear?: "izquierda" | "derecha";
};

type ListaResponsiveProps<T> = {
  filas: T[];
  idFila: (fila: T) => string | number;
  columnas: ColumnaLista<T>[];
  vacio?: React.ReactNode;
};

export function ListaResponsive<T>({ filas, idFila, columnas, vacio }: ListaResponsiveProps<T>) {
  if (filas.length === 0) {
    return (
      <div className="rounded-md border border-borde bg-surface p-8 text-center text-sm text-tenue">
        {vacio ?? "No hay elementos para mostrar."}
      </div>
    );
  }
  const principal = columnas.find((c) => c.principal) ?? columnas[0];
  const resto = columnas.filter((c) => c !== principal);

  return (
    <>
      <div className="hidden overflow-x-auto rounded-md border border-borde bg-surface md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-borde bg-canvas text-left text-xs font-bold uppercase text-tenue">
              {columnas.map((c) => (
                <th
                  key={c.clave}
                  scope="col"
                  className={`px-4 py-3 ${c.alinear === "derecha" ? "text-right" : ""}`}
                >
                  {c.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {filas.map((f) => (
              <tr key={idFila(f)} className="hover:bg-canvas/60">
                {columnas.map((c) => (
                  <td
                    key={c.clave}
                    className={`px-4 py-3 align-middle ${c.alinear === "derecha" ? "text-right" : ""}`}
                  >
                    {c.celda(f)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {filas.map((f) => (
          <li key={idFila(f)} className="rounded-md border border-borde bg-surface p-4">
            <div className="mb-3">{principal.celda(f)}</div>
            <dl className="space-y-2 text-sm">
              {resto.map((c) => (
                <div key={c.clave} className="flex items-center justify-between gap-3">
                  {c.titulo && <dt className="text-tenue">{c.titulo}</dt>}
                  <dd className={c.titulo ? "text-right" : "ml-auto"}>{c.celda(f)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
