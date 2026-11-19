import Image from "next/image";
import { Ola } from "@/components/decor/Ola";

const IMAGENES = {
  "rama-izquierda": [543, 558],
  "rama-derecha": [448, 317],
  "flor-1": [218, 206],
  "flor-2": [213, 203],
  botones: [148, 169],
  hojas: [185, 235],
  "petalo-1": [104, 86],
  "petalo-2": [97, 94],
  "petalo-3": [79, 108],
  "petalo-4": [98, 78],
} as const;

type DecorProps = {
  variant: keyof typeof IMAGENES | "ola";
  className?: string;
};

export function Decor({ variant, className }: DecorProps) {
  if (variant === "ola") return <Ola className={className} />;
  const [width, height] = IMAGENES[variant];
  return (
    <Image
      src={`/decor/${variant}.png`}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none h-auto select-none ${className ?? ""}`}
    />
  );
}
