"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type InterruptorProps = {
  activo: boolean;
  etiqueta: string;
  onCambiar: (activo: boolean) => Promise<{ ok: true } | { ok: false; error: string }>;
  onError?: (mensaje: string) => void;
  refrescar?: boolean;
  disabled?: boolean;
};

export function Interruptor({
  activo,
  etiqueta,
  onCambiar,
  onError,
  refrescar = true,
  disabled,
}: InterruptorProps) {
  const router = useRouter();
  const [valor, setValor] = useState(activo);
  const [previo, setPrevio] = useState(activo);
  const [pendiente, iniciar] = useTransition();

  if (previo !== activo) {
    setPrevio(activo);
    setValor(activo);
  }

  function alternar() {
    const nuevo = !valor;
    setValor(nuevo);
    iniciar(async () => {
      const r = await onCambiar(nuevo);
      if (!r.ok) {
        setValor(!nuevo);
        onError?.(r.error);
      } else if (refrescar) router.refresh();
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={valor}
      aria-label={etiqueta}
      disabled={disabled || pendiente}
      onClick={alternar}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${
        valor ? "bg-salvia-oscuro" : "bg-taupe/60"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white transition-transform ${
          valor ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
