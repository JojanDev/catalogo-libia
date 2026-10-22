interface AdminDashboardProps {
  totalProductos: number;
  totalColecciones: number;
  totalPedidos: number;
  totalDescuentos: number;
  onNavigate: (vista: string) => void;
}

export function AdminDashboard({
  totalProductos,
  totalColecciones,
  totalPedidos,
  totalDescuentos,
  onNavigate,
}: AdminDashboardProps) {
  const cards = [
    { label: "Productos", count: totalProductos, sublabel: "en el catálogo", vista: "productos" },
    { label: "Colecciones", count: totalColecciones, sublabel: "registradas", vista: "colecciones" },
    { label: "Descuentos", count: totalDescuentos, sublabel: "creados", vista: "descuentos", accent: true },
    { label: "Pedidos", count: totalPedidos, sublabel: "recibidos", vista: "pedidos" },
  ];

  return (
    <div>
      <p className="text-sm text-text-muted mb-8 font-body">
        Bienvenida al panel de administración. Aquí puedes gestionar tu catálogo.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <button
            key={card.vista}
            onClick={() => onNavigate(card.vista)}
            className="bg-card-bg rounded-2xl border border-border-soft p-6 text-left hover:shadow-sm transition-shadow"
          >
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body">
              {card.label}
            </span>
            <p className={`mt-2 text-3xl font-light font-heading ${card.accent ? "text-warm-accent" : "text-text-primary"}`}>
              {card.count}
            </p>
            <p className="mt-1 text-sm text-text-muted font-body">{card.sublabel}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
