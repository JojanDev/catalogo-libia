import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  titulo: string;
  vistaActual: string;
  onLogout: () => void;
  onNavigate: (vista: string) => void;
}

export function AdminLayout({
  children,
  titulo,
  vistaActual,
  onLogout,
  onNavigate,
}: AdminLayoutProps) {
  const links = [
    { vista: "dashboard", label: "Dashboard" },
    { vista: "productos", label: "Productos" },
    { vista: "colecciones", label: "Colecciones" },
    { vista: "descuentos", label: "Descuentos" },
    { vista: "pedidos", label: "Pedidos" },
  ];

  const isActive = (v: string) =>
    vistaActual === v ||
    (v === "productos" && vistaActual === "producto-form") ||
    (v === "colecciones" && vistaActual === "coleccion-form") ||
    (v === "descuentos" && vistaActual === "descuento-form");

  return (
    <div className="min-h-screen bg-canvas flex">
      <aside className="w-60 bg-card-bg border-r border-border-soft shrink-0 hidden lg:flex flex-col">
        <div className="px-6 py-5 border-b border-border-soft">
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-text-primary font-heading">
            Libia Admin
          </h2>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map((link) => (
            <button
              key={link.vista}
              onClick={() => onNavigate(link.vista)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors font-body ${
                isActive(link.vista)
                  ? "bg-warm-accent/10 text-warm-accent font-semibold border-l-2 border-warm-accent"
                  : "text-text-muted hover:bg-canvas hover:text-text-primary"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border-soft">
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-body"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card-bg border-b border-border-soft px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-text-primary font-heading">{titulo}</h1>
          <div className="flex items-center gap-3 lg:hidden overflow-x-auto">
            {links.map((link) => (
              <button
                key={link.vista}
                onClick={() => onNavigate(link.vista)}
                className={`text-xs uppercase tracking-wider font-body whitespace-nowrap ${
                  isActive(link.vista) ? "text-warm-accent font-semibold" : "text-text-muted hover:text-warm-accent"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider font-body"
            >
              Salir
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
