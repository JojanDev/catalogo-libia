interface CategoryCarouselProps {
  opciones: { label: string; value: string }[];
  activo: string;
  onChange: (valor: string) => void;
  label?: string;
}

export function CategoryCarousel({
  opciones,
  activo,
  onChange,
  label,
}: CategoryCarouselProps) {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 font-body">
          {label}
        </p>
      )}
      <div
        className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {opciones.map((opcion) => (
          <button
            key={opcion.value}
            onClick={() => onChange(opcion.value)}
            className={`shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-body whitespace-nowrap ${
              opcion.value === activo
                ? "bg-warm-accent text-white shadow-sm"
                : "bg-card-bg text-text-muted border border-border-soft hover:border-warm-accent/30 hover:text-warm-accent"
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
