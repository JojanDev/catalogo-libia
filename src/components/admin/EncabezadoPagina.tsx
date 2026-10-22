import { Plus } from "lucide-react";
import { BotonEnlace } from "@/components/ui/BotonEnlace";

type EncabezadoPaginaProps = {
  titulo: string;
  descripcion?: string;
  accion?: { texto: string; href: string };
  children?: React.ReactNode;
};

export function EncabezadoPagina({ titulo, descripcion, accion, children }: EncabezadoPaginaProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl text-cafe sm:text-3xl">{titulo}</h1>
        {descripcion && <p className="mt-1 text-sm text-tenue">{descripcion}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {accion && (
          <BotonEnlace href={accion.href} tamano="compacto">
            <Plus className="size-4" aria-hidden="true" />
            {accion.texto}
          </BotonEnlace>
        )}
      </div>
    </div>
  );
}
