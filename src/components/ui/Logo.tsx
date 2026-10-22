import Image from "next/image";

type LogoProps = {
  alto?: number;
  className?: string;
  prioridad?: boolean;
};

export function Logo({ alto = 64, className, prioridad = false }: LogoProps) {
  const ancho = Math.round((alto * 186) / 174);
  return (
    <Image
      src="/logo-tonorosa.svg"
      alt="Tonorosa by Leyar"
      width={ancho}
      height={alto}
      priority={prioridad}
      className={className}
      style={{ height: alto, width: "auto" }}
    />
  );
}
