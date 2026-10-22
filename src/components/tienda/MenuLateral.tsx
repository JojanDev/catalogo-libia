"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ENLACES_TIENDA, esActivo } from "@/components/tienda/enlaces";

type MenuLateralProps = {
  abierto: boolean;
  onCerrar: () => void;
};

export function MenuLateral({ abierto, onCerrar }: MenuLateralProps) {
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const enfocables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    enfocables()[0]?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab") return;
      const lista = enfocables();
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, [abierto, onCerrar]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${abierto ? "" : "pointer-events-none"}`}
      aria-hidden={!abierto}
    >
      <div
        onClick={onCerrar}
        className={`absolute inset-0 bg-cafe/40 transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!abierto}
        className={`absolute inset-y-0 left-0 flex w-[85%] max-w-80 flex-col bg-canvas shadow-elevada transition-transform duration-300 ${abierto ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-borde px-4 py-3">
          <Logo alto={48} />
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar menú"
            className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Principal" className="flex flex-col p-4">
          {ENLACES_TIENDA.map((enlace) => {
            const activo = esActivo(pathname, enlace.href);
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={onCerrar}
                aria-current={activo ? "page" : undefined}
                className={`flex min-h-12 items-center rounded-sm border-l-4 px-3 text-base text-cafe ${activo ? "border-rosa-deco bg-rosa-suave font-bold" : "border-transparent font-semibold hover:bg-rosa-suave"}`}
              >
                {enlace.etiqueta}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
