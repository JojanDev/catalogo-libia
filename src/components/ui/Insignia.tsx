type InsigniaProps = {
  variante?: "exito" | "error" | "aviso" | "info" | "rosa" | "cafe";
  className?: string;
  children: React.ReactNode;
};

const estilos = {
  exito: "bg-exito-fondo text-exito",
  error: "bg-error-fondo text-error",
  aviso: "bg-aviso-fondo text-aviso",
  info: "bg-info-fondo text-info",
  rosa: "bg-rosa-accion text-white",
  cafe: "bg-cafe text-white",
};

export function Insignia({ variante = "rosa", className, children }: InsigniaProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${estilos[variante]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
