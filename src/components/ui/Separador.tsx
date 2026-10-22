import { Heart } from "lucide-react";

export function Separador({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`mx-auto flex w-40 items-center gap-2 ${className ?? ""}`}
    >
      <span className="h-px flex-1 bg-rosa-deco" />
      <Heart className="size-4 fill-rosa-deco text-rosa-deco" />
      <span className="h-px flex-1 bg-rosa-deco" />
    </div>
  );
}
