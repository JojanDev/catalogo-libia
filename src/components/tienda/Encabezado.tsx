"use client";

import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Entrada } from "@/components/ui/Campo";
import { Logo } from "@/components/ui/Logo";
import { MenuLateral } from "@/components/tienda/MenuLateral";
import { ENLACES_TIENDA, esActivo } from "@/components/tienda/enlaces";
import type { Coleccion } from "@/types";

const botonIcono =
  "flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave";

type EncabezadoProps = {
  colecciones: Coleccion[];
  whatsapp: string;
};

export function Encabezado({ colecciones, whatsapp }: EncabezadoProps) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const botonLupa = useRef<HTMLButtonElement>(null);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (rutaPrevia !== pathname) {
    setRutaPrevia(pathname);
    setBuscando(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-canvas">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4 lg:px-8">
        <div className="grid h-[66px] grid-cols-[1fr_auto_1fr] items-center lg:h-[84px]">
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={menuAbierto}
              className={`${botonIcono} lg:hidden`}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
            <nav aria-label="Principal" className="hidden gap-8 lg:flex">
              {ENLACES_TIENDA.map((enlace) => {
                const activo = esActivo(pathname, enlace.href);
                return (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    aria-current={activo ? "page" : undefined}
                    className={`border-b-2 pb-1 text-[15px] font-semibold text-cafe transition-colors hover:text-rosa-accion ${activo ? "border-rosa-deco" : "border-transparent"}`}
                  >
                    {enlace.etiqueta}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link href="/" aria-label="Tonorosa by Leyar, ir al inicio" className="col-start-2 justify-self-center">
            <Logo alto={52} prioridad className="lg:hidden" />
            <Logo alto={72} prioridad className="hidden lg:block" />
          </Link>
          <div className="col-start-3 flex items-center justify-end gap-1 lg:gap-3">
            <button
              ref={botonLupa}
              type="button"
              onClick={() => setBuscando((b) => !b)}
              aria-label="Buscar prendas"
              aria-expanded={buscando}
              aria-controls="buscador-tienda"
              className={botonIcono}
            >
              <Search className="size-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {buscando && (
        <div
          id="buscador-tienda"
          className="absolute inset-x-0 top-full z-30 border-b border-borde bg-canvas px-4 pb-3 pt-2 shadow-lg"
        >
          <Form
            action="/catalogo"
            role="search"
            onSubmit={() => setBuscando(false)}
            className="relative mx-auto max-w-xl"
          >
            <label htmlFor="buscar-encabezado" className="sr-only">
              Buscar prendas
            </label>
            <Entrada
              id="buscar-encabezado"
              name="q"
              type="search"
              autoFocus
              placeholder="Buscar vestidos, conjuntos…"
              className="pr-24"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setBuscando(false);
                  botonLupa.current?.focus();
                }
              }}
            />
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
              <button
                type="submit"
                aria-label="Buscar"
                className="flex size-11 items-center justify-center rounded-full text-rosa-accion hover:bg-rosa-suave"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Cerrar buscador"
                onClick={() => {
                  setBuscando(false);
                  botonLupa.current?.focus();
                }}
                className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </Form>
        </div>
      )}
      <MenuLateral abierto={menuAbierto} onCerrar={cerrarMenu} colecciones={colecciones} whatsapp={whatsapp} />
    </header>
  );
}
