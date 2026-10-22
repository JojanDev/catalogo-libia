"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type DatosAviso = { tipo: "exito" | "error"; texto: string };

type AvisoProps = {
  aviso: DatosAviso | null;
  onCerrar: () => void;
};

export function Aviso({ aviso, onCerrar }: AvisoProps) {
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(onCerrar, aviso.tipo === "exito" ? 3500 : 6000);
    return () => clearTimeout(t);
  }, [aviso, onCerrar]);

  if (!aviso) return null;
  const exito = aviso.tipo === "exito";
  const Icono = exito ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={exito ? "status" : "alert"}
      className={`fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold ${
        exito ? "border-exito/30 bg-exito-fondo text-exito" : "border-error/30 bg-error-fondo text-error"
      }`}
    >
      <Icono className="size-5 shrink-0" aria-hidden="true" />
      <span className="flex-1">{aviso.texto}</span>
      <button type="button" onClick={onCerrar} aria-label="Cerrar aviso" className="shrink-0">
        <X className="size-4" />
      </button>
    </div>
  );
}
