interface FilterOption {
  label: string;
  value: string;
}

interface FilterTabsProps {
  opciones: FilterOption[];
  activo: string;
  onChange: (valor: string) => void;
  label?: string;
}

export function FilterTabs({
  opciones,
  activo,
  onChange,
  label,
}: FilterTabsProps) {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 font-body">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.value}
            onClick={() => onChange(opcion.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-body ${
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
