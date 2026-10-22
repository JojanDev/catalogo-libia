import { Heart } from "lucide-react";

export function BarraAnuncio({ texto }: { texto: string }) {
  return (
    <div className="flex h-9 items-center justify-center gap-2 bg-rosa-suave px-4 text-[13px] text-cafe">
      <Heart className="size-3 shrink-0 fill-rosa-deco text-rosa-deco" aria-hidden="true" />
      <p className="truncate">{texto}</p>
      <Heart className="size-3 shrink-0 fill-rosa-deco text-rosa-deco" aria-hidden="true" />
    </div>
  );
}
