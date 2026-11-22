import { Heart, MessageCircle, Truck } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";

function Vestido({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 2.5c.4 1.4 1.5 2 3 2s2.6-.6 3-2" />
      <path d="M9 2.5 8.2 8.5 6 10.5l1.5 1-4 10h17l-4-10 1.5-1-2.2-2L15 2.5" />
      <path d="M8.2 8.5h7.6" />
    </svg>
  );
}

const BENEFICIOS = [
  { Icono: Heart, lineas: ["Diseños únicos", "para cada ocasión"] },
  { Icono: Vestido, lineas: ["Ropa de calidad", "y confort"] },
  { Icono: Truck, lineas: ["Envíos a todo", "el país"] },
  { Icono: MessageCircle, lineas: ["Te atendemos", "por WhatsApp"] },
];

export function Beneficios() {
  return (
    <section aria-label="Beneficios" className="bg-rosa-suave py-8 lg:py-10">
      <Contenedor>
        <ul className="grid grid-cols-4">
          {BENEFICIOS.map(({ Icono, lineas }) => (
            <li
              key={lineas[0]}
              className="relative flex flex-col items-center gap-2 px-1 text-center text-xs text-cafe not-first:before:absolute not-first:before:left-0 not-first:before:top-[20%] not-first:before:h-[60%] not-first:before:w-px not-first:before:bg-rosa-deco/50 sm:text-sm lg:gap-3 lg:text-base"
            >
              <Icono className="size-9 text-rosa-accion lg:size-12" strokeWidth={1.25} aria-hidden="true" />
              <span>
                {lineas[0]}
                <br />
                {lineas[1]}
              </span>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
