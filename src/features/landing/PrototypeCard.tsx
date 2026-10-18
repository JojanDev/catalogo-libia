interface PrototypeCardProps {
  numero: number;
  titulo: string;
  descripcion: string;
  precio: string;
  caracteristicas: string[];
  ruta: string;
}

export function PrototypeCard({
  numero,
  titulo,
  descripcion,
  precio,
  caracteristicas,
  ruta,
}: PrototypeCardProps) {
  return (
    <article className="bg-card-bg rounded-2xl border border-border-soft overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-text-primary px-6 py-4">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider font-body">
          Prototipo {numero}
        </span>
        <h3 className="mt-1 text-xl font-semibold text-white font-heading">{titulo}</h3>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-text-muted text-sm leading-relaxed font-body">{descripcion}</p>
        <ul className="mt-4 space-y-2">
          {caracteristicas.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-text-muted font-body">
              <svg className="w-4 h-4 mt-0.5 text-warm-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-border-soft">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-body">
            Desde
          </span>
          <p className="text-lg font-semibold text-text-primary">{precio}</p>
        </div>
        <a
          href={ruta}
          className="mt-4 inline-flex items-center justify-center bg-warm-accent hover:bg-warm-accent-hover text-white font-semibold text-sm py-3 px-4 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 font-body"
        >
          Ver prototipo
        </a>
      </div>
    </article>
  );
}
