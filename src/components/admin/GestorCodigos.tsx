"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { cambiarActivoCodigoAccion, guardarCodigoAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { Campo, Entrada } from "@/components/ui/Campo";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import type { CodigoPromo } from "@/types";

type FormularioCodigoProps = {
  codigo: CodigoPromo | null;
  onCerrar: () => void;
  onAviso: (a: DatosAviso) => void;
};

function enteroOpcional(valor: string, minimo: number): number | null | undefined {
  if (!valor.trim()) return null;
  const n = Number(valor);
  return Number.isInteger(n) && n >= minimo ? n : undefined;
}

function FormularioCodigo({ codigo, onCerrar, onAviso }: FormularioCodigoProps) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [texto, setTexto] = useState(codigo?.codigo ?? "");
  const [porcentaje, setPorcentaje] = useState(codigo ? String(codigo.porcentaje) : "");
  const [fecha, setFecha] = useState(codigo?.fechaVencimiento?.slice(0, 10) ?? "");
  const [usos, setUsos] = useState(codigo?.usosMaximos ? String(codigo.usosMaximos) : "");
  const [monto, setMonto] = useState(codigo?.montoMinimo ? String(codigo.montoMinimo) : "");
  const [activo, setActivo] = useState(codigo?.activo ?? true);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    const pct = Number(porcentaje);
    const usosMaximos = enteroOpcional(usos, 1);
    const montoMinimo = enteroOpcional(monto, 0);
    if (!texto.trim()) nuevos.codigo = "Escribe el código";
    if (!Number.isInteger(pct) || pct < 1 || pct > 100) nuevos.porcentaje = "Escribe un porcentaje entre 1 y 100";
    if (usosMaximos === undefined) nuevos.usos = "Escribe un número entero mayor a 0";
    if (montoMinimo === undefined) nuevos.monto = "Escribe un monto entero";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0 || usosMaximos === undefined || montoMinimo === undefined) {
      onAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    iniciar(async () => {
      const r = await guardarCodigoAccion({
        id: codigo?.id,
        codigo: texto.trim().toUpperCase(),
        porcentaje: pct,
        fechaVencimiento: fecha || null,
        usosMaximos,
        montoMinimo,
        activo,
      });
      if (!r.ok) {
        onAviso({ tipo: "error", texto: r.error });
        return;
      }
      onAviso({ tipo: "exito", texto: codigo ? "Cambios guardados" : "Código creado" });
      onCerrar();
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-5">
      <TarjetaPanel titulo={codigo ? "Editar código" : "Nuevo código"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="codigo" etiqueta="Código" error={errores.codigo}>
            {(p) => (
              <Entrada
                {...p}
                value={texto}
                onChange={(e) => setTexto(e.target.value.toUpperCase())}
                autoCapitalize="characters"
                className="uppercase"
              />
            )}
          </Campo>
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
          <Campo id="fecha" etiqueta="Vence el (opcional)" ayuda="Sin fecha, no vence">
            {(p) => <Entrada {...p} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />}
          </Campo>
          <Campo id="usos" etiqueta="Usos máximos (opcional)" ayuda="Vacío significa ilimitado" error={errores.usos}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" min={1} value={usos} onChange={(e) => setUsos(e.target.value)} />
            )}
          </Campo>
          <Campo id="monto" etiqueta="Monto mínimo de compra (opcional)" error={errores.monto}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" min={0} value={monto} onChange={(e) => setMonto(e.target.value)} />
            )}
          </Campo>
          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-rosa-accion"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            Activo
          </label>
        </div>
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

export function GestorCodigos({ codigos }: { codigos: CodigoPromo[] }) {
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [editando, setEditando] = useState<CodigoPromo | "nuevo" | null>(null);

  if (editando) {
    return (
      <>
        <FormularioCodigo
          key={editando === "nuevo" ? "nuevo" : editando.id}
          codigo={editando === "nuevo" ? null : editando}
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
          Nuevo código
        </Boton>
      </div>
      <ListaResponsive
        filas={codigos}
        idFila={(c) => c.id}
        vacio="Aún no hay códigos promocionales. Crea el primero para compartirlo con tus clientas."
        columnas={[
          {
            clave: "codigo",
            titulo: "Código",
            principal: true,
            celda: (c) => <span className="font-bold tracking-wide text-cafe">{c.codigo}</span>,
          },
          { clave: "pct", titulo: "Descuento", celda: (c) => `${c.porcentaje}%` },
          {
            clave: "usos",
            titulo: "Usos",
            celda: (c) => `${c.usos} / ${c.usosMaximos ?? "∞"}`,
          },
          {
            clave: "vence",
            titulo: "Vence",
            celda: (c) => (c.fechaVencimiento ? formatearFecha(c.fechaVencimiento) : "Sin vencimiento"),
          },
          {
            clave: "minimo",
            titulo: "Monto mínimo",
            alinear: "derecha",
            celda: (c) => (c.montoMinimo ? formatearPrecio(c.montoMinimo) : "—"),
          },
          {
            clave: "activo",
            titulo: "Activo",
            celda: (c) => (
              <Interruptor
                activo={c.activo}
                etiqueta={`Activar ${c.codigo}`}
                onCambiar={(v) => cambiarActivoCodigoAccion(c.id, v)}
                onError={(texto) => setAviso({ tipo: "error", texto })}
              />
            ),
          },
          {
            clave: "editar",
            titulo: "",
            alinear: "derecha",
            celda: (c) => (
              <Boton variante="secundario" tamano="compacto" onClick={() => setEditando(c)}>
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
