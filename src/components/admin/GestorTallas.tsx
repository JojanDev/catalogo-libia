"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { cambiarActivaTallaAccion, guardarTallaAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { Entrada } from "@/components/ui/Campo";
import type { Talla } from "@/types";

function FilaTalla({ talla, alAviso }: { talla: Talla; alAviso: (a: DatosAviso) => void }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(talla.nombre);
  const [orden, setOrden] = useState(String(talla.orden));
  const [pendiente, iniciar] = useTransition();
  const cambio = nombre !== talla.nombre || orden !== String(talla.orden);

  function guardar() {
    if (!nombre.trim() || !Number.isInteger(Number(orden))) {
      alAviso({ tipo: "error", texto: "Nombre y orden válidos son obligatorios" });
      return;
    }
    iniciar(async () => {
      const r = await guardarTallaAccion({
        id: talla.id,
        nombre: nombre.trim(),
        orden: Number(orden),
        activa: talla.activa,
      });
      if (!r.ok) alAviso({ tipo: "error", texto: r.error });
      else {
        alAviso({ tipo: "exito", texto: "Cambios guardados" });
        router.refresh();
      }
    });
  }

  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <Entrada
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        aria-label="Nombre de la talla"
        className="h-10 w-32 flex-1 sm:flex-none"
      />
      <Entrada
        type="number"
        inputMode="numeric"
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        aria-label="Orden"
        className="h-10 w-20"
      />
      <div className="ml-auto flex items-center gap-3">
        <Interruptor
          activo={talla.activa}
          etiqueta={`Activar talla ${talla.nombre}`}
          onCambiar={(v) => cambiarActivaTallaAccion(talla.id, v)}
          onError={(texto) => alAviso({ tipo: "error", texto })}
        />
        <Boton variante="secundario" tamano="compacto" disabled={!cambio} cargando={pendiente} onClick={guardar}>
          <Save className="size-4" aria-hidden="true" />
          Guardar
        </Boton>
      </div>
    </li>
  );
}

export function GestorTallas({ tallas }: { tallas: Talla[] }) {
  const router = useRouter();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState(String(tallas.reduce((m, t) => Math.max(m, t.orden), 0) + 1));
  const [pendiente, iniciar] = useTransition();

  function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !Number.isInteger(Number(orden))) {
      setAviso({ tipo: "error", texto: "Nombre y orden válidos son obligatorios" });
      return;
    }
    iniciar(async () => {
      const r = await guardarTallaAccion({ nombre: nombre.trim(), orden: Number(orden), activa: true });
      if (!r.ok) setAviso({ tipo: "error", texto: r.error });
      else {
        setAviso({ tipo: "exito", texto: "Talla agregada" });
        setNombre("");
        setOrden(String(Number(orden) + 1));
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <TarjetaPanel titulo="Agregar talla">
        <form onSubmit={agregar} className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label htmlFor="talla-nombre" className="mb-1.5 block text-sm font-semibold text-cafe">
              Nombre
            </label>
            <Entrada
              id="talla-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: 4"
              className="h-10"
            />
          </div>
          <div className="w-24">
            <label htmlFor="talla-orden" className="mb-1.5 block text-sm font-semibold text-cafe">
              Orden
            </label>
            <Entrada
              id="talla-orden"
              type="number"
              inputMode="numeric"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="h-10"
            />
          </div>
          <Boton type="submit" tamano="compacto" cargando={pendiente}>
            <Plus className="size-4" aria-hidden="true" />
            Agregar
          </Boton>
        </form>
      </TarjetaPanel>

      <TarjetaPanel titulo="Tallas">
        {tallas.length === 0 ? (
          <p className="text-sm text-tenue">Aún no hay tallas.</p>
        ) : (
          <ul className="divide-y divide-borde">
            {tallas.map((t) => (
              <FilaTalla key={`${t.id}-${t.nombre}-${t.orden}`} talla={t} alAviso={setAviso} />
            ))}
          </ul>
        )}
      </TarjetaPanel>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </div>
  );
}
