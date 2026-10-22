import { Loader2 } from "lucide-react";
import { estilosBoton } from "@/components/ui/estilosBoton";
import type { TamanoBoton, VarianteBoton } from "@/components/ui/estilosBoton";

type BotonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  cargando?: boolean;
};

export function Boton({
  variante = "primario",
  tamano = "normal",
  cargando = false,
  disabled,
  className,
  children,
  type = "button",
  ...resto
}: BotonProps) {
  return (
    <button
      type={type}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      className={estilosBoton(variante, tamano, className)}
      {...resto}
    >
      {cargando && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
