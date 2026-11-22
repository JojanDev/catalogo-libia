import Image from "next/image";
import { Ola } from "@/components/decor/Ola";

const IMAGENES = {
  capullo: [178, 201],
  "corazon-1": [85, 95],
  "corazon-2": [67, 73],
  "corazon-3": [58, 63],
  "corazon-relleno": [56, 54],
  "flor-frente": [274, 261],
  "flor-lado": [242, 195],
  "flor-tulipan": [222, 251],
  guirnalda: [711, 163],
  "hoja-1": [82, 139],
  "hoja-2": [117, 128],
  "hoja-3": [116, 62],
  "hoja-4": [126, 132],
  "hoja-5": [105, 83],
  mariposa: [311, 218],
  "petalo-1": [76, 74],
  "petalo-2": [110, 119],
  "petalo-3": [105, 102],
  "petalo-4": [99, 130],
  "petalo-5": [125, 87],
  "petalo-6": [90, 76],
  "petalo-7": [141, 127],
  "rama-esquina-der": [394, 302],
  "rama-esquina-izq": [466, 556],
  ramito: [268, 265],
  ramo: [399, 327],
  "separador-flores": [824, 107],
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
