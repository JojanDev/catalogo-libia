export function Etiqueta({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-cafe">
      {children}
    </label>
  );
}

const baseControl =
  "w-full rounded-sm border bg-surface px-4 text-base text-cafe placeholder:text-tenue focus:border-rosa-accion focus:outline-2 focus:outline-rosa-accion disabled:bg-rosa-suave disabled:text-tenue";

export function Entrada({ className, ...resto }: React.InputHTMLAttributes<HTMLInputElement>) {
  const borde = resto["aria-invalid"] ? "border-error" : "border-borde";
  return <input className={`h-12 ${baseControl} ${borde} ${className ?? ""}`} {...resto} />;
}

export function Selector({ className, ...resto }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const borde = resto["aria-invalid"] ? "border-error" : "border-borde";
  return <select className={`h-12 ${baseControl} ${borde} ${className ?? ""}`} {...resto} />;
}
