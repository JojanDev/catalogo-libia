import { Heart } from "lucide-react";

export function BarraAnuncio({ texto }: { texto: string }) {
  return (
    <div className="flex h-8 items-center justify-center gap-2 bg-rosa-suave px-3 text-xs text-cafe sm:text-[13px]">
      <Heart className="size-3 shrink-0 fill-rosa-deco text-rosa-deco" aria-hidden="true" />
      <p className="truncate">{texto}</p>
      <Heart className="size-3 shrink-0 fill-rosa-deco text-rosa-deco" aria-hidden="true" />
    </div>
  );
}
