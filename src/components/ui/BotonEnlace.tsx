import Link from "next/link";
import { estilosBoton } from "@/components/ui/estilosBoton";
import type { TamanoBoton, VarianteBoton } from "@/components/ui/estilosBoton";

type BotonEnlaceProps = React.ComponentProps<typeof Link> & {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
};

export function BotonEnlace({
  variante = "primario",
  tamano = "normal",
  className,
  ...resto
}: BotonEnlaceProps) {
  return <Link className={estilosBoton(variante, tamano, className)} {...resto} />;
}
