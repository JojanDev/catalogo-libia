import { Search, X } from "lucide-react";

interface SearchBarProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

export function SearchBar({
  valor,
  onChange,
  placeholder = "Buscar productos...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-card-bg border border-border-soft rounded-2xl text-sm text-text-primary placeholder-text-muted/60 font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent transition-shadow"
      />
      {valor && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
