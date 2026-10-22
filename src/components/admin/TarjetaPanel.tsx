type TarjetaPanelProps = {
  titulo?: string;
  acciones?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function TarjetaPanel({ titulo, acciones, className, children }: TarjetaPanelProps) {
  return (
    <section className={`rounded-md border border-borde bg-surface p-4 sm:p-5 ${className ?? ""}`}>
      {(titulo || acciones) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-base font-bold text-cafe">{titulo}</h2>}
          {acciones}
        </div>
      )}
      {children}
    </section>
  );
}
