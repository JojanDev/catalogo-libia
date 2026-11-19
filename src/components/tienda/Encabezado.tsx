"use client";

import Form from "next/form";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Entrada } from "@/components/ui/Campo";
import { Logo } from "@/components/ui/Logo";
import { MenuLateral } from "@/components/tienda/MenuLateral";
import { ENLACES_TIENDA, esActivo } from "@/components/tienda/enlaces";

const botonIcono =
  "flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave";

export function Encabezado() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-canvas">
      <div className="relative mx-auto max-w-[1200px] px-2 sm:px-4 lg:px-8">
        <div className="grid h-18 grid-cols-[1fr_auto_1fr] items-center lg:h-auto lg:pt-4">
          <div className="flex justify-start lg:hidden">
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={menuAbierto}
              className={botonIcono}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
          <Link href="/" aria-label="Tonorosa by Leyar, ir al inicio" className="col-start-2 justify-self-center">
            <Logo alto={56} prioridad className="lg:hidden" />
            <Logo alto={96} prioridad className="hidden lg:block" />
          </Link>
          <div className="col-start-3 flex items-center justify-end gap-1 lg:absolute lg:right-8 lg:top-8">
            <button
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
        {buscando && (
          <div id="buscador-tienda" className="pb-3 pt-1 lg:mx-auto lg:max-w-xl">
            <Form action="/catalogo" role="search" onSubmit={() => setBuscando(false)} className="relative">
              <label htmlFor="buscar-encabezado" className="sr-only">
                Buscar prendas
              </label>
              <Entrada
                id="buscar-encabezado"
                name="q"
                type="search"
                autoFocus
                placeholder="Buscar vestidos, conjuntos…"
                className="pr-12"
                onKeyDown={(e) => e.key === "Escape" && setBuscando(false)}
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-rosa-accion hover:bg-rosa-suave"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
            </Form>
          </div>
        )}
        <nav aria-label="Principal" className="hidden justify-center gap-10 pb-3 pt-2 lg:flex">
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
      <MenuLateral abierto={menuAbierto} onCerrar={cerrarMenu} />
    </header>
  );
}
