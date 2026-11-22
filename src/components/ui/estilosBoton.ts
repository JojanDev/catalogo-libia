export type VarianteBoton = "primario" | "secundario" | "texto";
export type TamanoBoton = "normal" | "compacto";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-200";

const variantes: Record<VarianteBoton, string> = {
  primario:
    "bg-rosa-boton text-white font-extrabold text-[17px] text-shadow-boton hover:bg-rosa-boton-hover aria-disabled:bg-rosa-medio aria-disabled:text-tenue aria-disabled:text-shadow-none aria-disabled:pointer-events-none disabled:bg-rosa-medio disabled:text-tenue disabled:text-shadow-none disabled:cursor-not-allowed",
  secundario:
    "border-2 border-rosa-accion text-rosa-accion bg-transparent hover:bg-rosa-suave disabled:border-rosa-medio disabled:text-tenue disabled:cursor-not-allowed",
  texto: "text-rosa-accion hover:underline disabled:text-tenue disabled:cursor-not-allowed",
};

const tamanos: Record<TamanoBoton, string> = {
  normal: "h-12 px-6",
  compacto: "h-10 px-4",
};

const textoTamano: Record<TamanoBoton, string> = {
  normal: "text-base",
  compacto: "text-sm",
};

export function estilosBoton(
  variante: VarianteBoton,
  tamano: TamanoBoton,
  className?: string,
) {
  const texto = variante === "primario" ? "" : textoTamano[tamano];
  return `${base} ${variantes[variante]} ${tamanos[tamano]} ${texto} ${className ?? ""}`.trim();
}
