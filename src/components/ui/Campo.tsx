import { AlertCircle } from "lucide-react";

type CampoProps = {
  id: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
  }) => React.ReactNode;
};

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

export function AreaTexto({
  className,
  ...resto
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const borde = resto["aria-invalid"] ? "border-error" : "border-borde";
  return <textarea className={`min-h-28 py-3 ${baseControl} ${borde} ${className ?? ""}`} {...resto} />;
}

export function Selector({ className, ...resto }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const borde = resto["aria-invalid"] ? "border-error" : "border-borde";
  return <select className={`h-12 ${baseControl} ${borde} ${className ?? ""}`} {...resto} />;
}

export function Campo({ id, etiqueta, ayuda, error, children }: CampoProps) {
  const ids = [ayuda ? `${id}-ayuda` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      {children({
        id,
        "aria-describedby": ids || undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {ayuda && (
        <p id={`${id}-ayuda`} className="mt-1.5 text-sm text-tenue">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-error">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
