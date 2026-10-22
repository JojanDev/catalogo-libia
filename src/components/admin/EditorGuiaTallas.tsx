"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { guardarGuiaTallasAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Entrada } from "@/components/ui/Campo";
import type { GuiaTallas } from "@/types";

export function EditorGuiaTallas({ guia }: { guia: GuiaTallas }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [errorTitulo, setErrorTitulo] = useState("");
  const [titulo, setTitulo] = useState(guia.titulo);
  const [columnas, setColumnas] = useState(guia.columnas);
  const [filas, setFilas] = useState(guia.filas);
  const [notas, setNotas] = useState(guia.notas);

  function cambiarColumna(c: number, valor: string) {
    setColumnas(columnas.map((x, i) => (i === c ? valor : x)));
  }

  function cambiarCelda(f: number, c: number, valor: string) {
    setFilas(filas.map((fila, i) => (i === f ? fila.map((x, j) => (j === c ? valor : x)) : fila)));
  }

  function agregarColumna() {
    setColumnas([...columnas, ""]);
    setFilas(filas.map((fila) => [...fila, ""]));
  }

  function quitarColumna(c: number) {
    setColumnas(columnas.filter((_, i) => i !== c));
    setFilas(filas.map((fila) => fila.filter((_, i) => i !== c)));
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) {
      setErrorTitulo("Escribe el título de la guía");
      setAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    setErrorTitulo("");
    const limpias = columnas.map((c) => c.trim());
    if (limpias.length === 0 || limpias.some((c) => !c)) {
      setAviso({ tipo: "error", texto: "Todas las columnas necesitan un nombre" });
      return;
    }
    iniciar(async () => {
      const r = await guardarGuiaTallasAccion({
        titulo: titulo.trim(),
        columnas: limpias,
        filas: filas.map((fila) => fila.map((c) => c.trim())).filter((fila) => fila.some(Boolean)),
        notas: notas.trim(),
      });
      if (!r.ok) setAviso({ tipo: "error", texto: r.error });
      else {
        setAviso({ tipo: "exito", texto: "Guía de tallas guardada" });
        router.refresh();
      }
    });
  }

  const celda = "h-10 min-w-24 px-2 text-sm";

  return (
    <form onSubmit={guardar} noValidate className="space-y-5 pb-24">
      <TarjetaPanel titulo="Título">
        <Campo id="titulo" etiqueta="Título de la guía" error={errorTitulo}>
          {(p) => <Entrada {...p} value={titulo} onChange={(e) => setTitulo(e.target.value)} />}
        </Campo>
      </TarjetaPanel>

      <TarjetaPanel titulo="Tabla de medidas">
        <p className="mb-3 text-sm text-tenue">Desliza hacia los lados para ver todas las columnas.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1.5">
            <thead>
              <tr>
                {columnas.map((c, i) => (
                  <th key={i} className="min-w-24 font-normal">
                    <div className="flex items-center gap-1">
                      <Entrada
                        value={c}
                        onChange={(e) => cambiarColumna(i, e.target.value)}
                        aria-label={`Nombre de la columna ${i + 1}`}
                        className={`${celda} font-bold`}
                      />
                      <button
                        type="button"
                        onClick={() => quitarColumna(i)}
                        aria-label={`Quitar columna ${c || i + 1}`}
                        className="rounded-sm p-1 text-tenue hover:bg-rosa-suave hover:text-error"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, f) => (
                <tr key={f}>
                  {fila.map((valor, c) => (
                    <td key={c}>
                      <Entrada
                        value={valor}
                        onChange={(e) => cambiarCelda(f, c, e.target.value)}
                        aria-label={`Fila ${f + 1}, ${columnas[c] || `columna ${c + 1}`}`}
                        className={celda}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      onClick={() => setFilas(filas.filter((_, i) => i !== f))}
                      aria-label={`Quitar fila ${f + 1}`}
                      className="rounded-sm p-1 text-tenue hover:bg-rosa-suave hover:text-error"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {columnas.length === 0 && (
          <p className="py-4 text-center text-sm text-tenue">La tabla está vacía. Agrega una columna para empezar.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Boton variante="secundario" tamano="compacto" onClick={agregarColumna}>
            <Plus className="size-4" aria-hidden="true" />
            Agregar columna
          </Boton>
          <Boton
            variante="secundario"
            tamano="compacto"
            disabled={columnas.length === 0}
            onClick={() => setFilas([...filas, columnas.map(() => "")])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Agregar fila
          </Boton>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Notas">
        <Campo id="notas" etiqueta="Notas bajo la tabla" ayuda="Por ejemplo: cómo tomar las medidas">
          {(p) => <AreaTexto {...p} value={notas} onChange={(e) => setNotas(e.target.value)} />}
        </Campo>
      </TarjetaPanel>

      <TarjetaPanel titulo="Vista previa">
        <h3 className="mb-3 font-display text-xl text-cafe">{titulo || "Guía de tallas"}</h3>
        {columnas.length === 0 ? (
          <p className="text-sm text-tenue">Aún no hay columnas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-rosa-suave text-left text-cafe">
                  {columnas.map((c, i) => (
                    <th key={i} className="whitespace-nowrap px-3 py-2 font-bold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {filas.map((fila, f) => (
                  <tr key={f}>
                    {fila.map((v, c) => (
                      <td key={c} className="whitespace-nowrap px-3 py-2">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {notas.trim() && <p className="mt-3 whitespace-pre-line text-sm text-tenue">{notas}</p>}
      </TarjetaPanel>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-2 border-t border-borde bg-surface px-4 py-3 md:left-60">
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar guía
        </Boton>
      </div>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </form>
  );
}
