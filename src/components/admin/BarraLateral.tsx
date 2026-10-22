"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  ExternalLink,
  Images,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Percent,
  Ruler,
  Settings,
  Ticket,
  X,
} from "lucide-react";
import { cerrarSesionAccion } from "@/app/admin/login/acciones";
import { Logo } from "@/components/ui/Logo";

const ENLACES = [
  { href: "/admin", texto: "Resumen", Icono: LayoutDashboard },
  { href: "/admin/productos", texto: "Productos", Icono: Package },
  { href: "/admin/colecciones", texto: "Colecciones", Icono: Layers },
  { href: "/admin/tallas", texto: "Tallas", Icono: Ruler },
  { href: "/admin/carrusel", texto: "Carrusel", Icono: Images },
  { href: "/admin/guia-tallas", texto: "Guía de tallas", Icono: BookOpen },
  { href: "/admin/descuentos", texto: "Descuentos", Icono: Percent },
  { href: "/admin/codigos", texto: "Códigos", Icono: Ticket },
  { href: "/admin/pedidos", texto: "Pedidos", Icono: ClipboardList },
  { href: "/admin/configuracion", texto: "Configuración", Icono: Settings },
];

function ContenidoMenu({ alNavegar }: { alNavegar?: () => void }) {
  const ruta = usePathname();
  return (
    <>
      <nav aria-label="Panel" className="flex-1 space-y-1 overflow-y-auto p-3">
        {ENLACES.map(({ href, texto, Icono }) => {
          const activo = href === "/admin" ? ruta === href : ruta.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={alNavegar}
              aria-current={activo ? "page" : undefined}
              className={`flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-semibold transition-colors ${
                activo ? "bg-rosa-suave text-rosa-accion" : "text-cafe hover:bg-rosa-suave/60"
              }`}
            >
              <Icono className="size-5 shrink-0" aria-hidden="true" />
              {texto}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-borde p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-semibold text-cafe hover:bg-rosa-suave/60"
        >
          <ExternalLink className="size-5 shrink-0" aria-hidden="true" />
          Ver tienda
        </a>
        <form action={cerrarSesionAccion}>
          <button
            type="submit"
            className="flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold text-cafe hover:bg-rosa-suave/60"
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );
}

export function BarraLateral() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const alTecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, [abierto]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-borde bg-surface px-4 md:hidden">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="-ml-2 flex size-10 items-center justify-center rounded-sm text-cafe hover:bg-rosa-suave"
        >
          <Menu className="size-6" />
        </button>
        <Logo alto={36} />
        <span className="w-8" />
      </header>

      {abierto && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-cafe/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-surface">
            <div className="flex h-14 items-center justify-between border-b border-borde px-4">
              <Logo alto={36} />
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="flex size-10 items-center justify-center rounded-sm text-cafe hover:bg-rosa-suave"
              >
                <X className="size-6" />
              </button>
            </div>
            <ContenidoMenu alNavegar={() => setAbierto(false)} />
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-borde bg-surface md:flex">
        <div className="flex h-16 items-center border-b border-borde px-5">
          <Logo alto={40} />
        </div>
        <ContenidoMenu />
      </aside>
    </>
  );
}
