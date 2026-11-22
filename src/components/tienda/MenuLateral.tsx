"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MessageCircle, Truck, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ENLACE_ASESORIA, ENLACES_TIENDA, esActivo } from "@/components/tienda/enlaces";
import type { Coleccion } from "@/types";

type MenuLateralProps = {
  abierto: boolean;
  onCerrar: () => void;
  colecciones: Coleccion[];
  whatsapp: string;
};

export function MenuLateral({ abierto, onCerrar, colecciones, whatsapp }: MenuLateralProps) {
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
        <div className="flex-1 overflow-y-auto">
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
          {colecciones.length > 0 && (
            <nav aria-labelledby="menu-colecciones" className="mt-2 border-t border-borde pb-4">
              <h2
                id="menu-colecciones"
                className="px-7 pb-1 pt-4 font-display text-sm uppercase tracking-wide text-tenue"
              >
                Nuestras colecciones
              </h2>
              <ul className="flex flex-col px-4">
                {colecciones.map((coleccion) => {
                  const href = `/colecciones/${coleccion.slug}`;
                  const activo = esActivo(pathname, href);
                  return (
                    <li key={coleccion.id}>
                      <Link
                        href={href}
                        onClick={onCerrar}
                        aria-current={activo ? "page" : undefined}
                        className={`flex min-h-12 items-center rounded-sm border-l-4 px-3 text-base text-cafe ${activo ? "border-rosa-deco bg-rosa-suave font-bold" : "border-transparent font-semibold hover:bg-rosa-suave"}`}
                      >
                        {coleccion.nombre}
                        {coleccion.destacada && (
                          <span className="ml-auto rounded-full bg-rosa-medio px-2 py-0.5 text-xs font-bold text-cafe-oscuro">
                            Destacada
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
        <div className="shrink-0 space-y-3 border-t border-borde bg-surface p-4">
          <a
            href={ENLACE_ASESORIA(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rosa-boton px-4 text-[17px] font-extrabold text-white text-shadow-boton hover:bg-rosa-boton-hover"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Atención por WhatsApp
          </a>
          <p className="flex items-center justify-center gap-2 text-sm text-tenue">
            <Truck className="size-4" aria-hidden="true" />
            Envíos a toda Colombia
          </p>
          <a
            href="https://www.instagram.com/tonorosa_byleyar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Tonorosa"
            className="flex min-h-11 items-center justify-center text-sm text-tenue hover:text-rosa-accion"
          >
            @tonorosa_byleyar
          </a>
        </div>
      </div>
    </div>
  );
}
