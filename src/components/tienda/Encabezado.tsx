"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MenuLateral } from "@/components/tienda/MenuLateral";
import { ENLACES_TIENDA, esActivo } from "@/components/tienda/enlaces";

type EncabezadoProps = {
  carrito?: React.ReactNode;
};

const botonIcono =
  "flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave";

export function Encabezado({ carrito }: EncabezadoProps) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-canvas">
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4 lg:px-8">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-auto lg:pt-3">
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
            <Logo alto={40} prioridad className="lg:hidden" />
            <Logo alto={64} prioridad className="hidden lg:block" />
          </Link>
          <div className="col-start-3 flex items-center justify-end gap-1 lg:absolute lg:right-8 lg:top-6">
            <Link href="/catalogo" aria-label="Buscar en la colección" className={botonIcono}>
              <Search className="size-6" aria-hidden="true" />
            </Link>
            {carrito}
          </div>
        </div>
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
