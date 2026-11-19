import { Heart, MessageCircle, Truck } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";

const BENEFICIOS = [
  { Icono: Truck, texto: "Envíos a toda Colombia" },
  { Icono: MessageCircle, texto: "Te atendemos por WhatsApp" },
  { Icono: Heart, texto: "Diseños únicos, hechos con cariño" },
];

export function Beneficios() {
  return (
    <section aria-label="Beneficios" className="border-y border-borde bg-surface py-8 lg:py-10">
      <Contenedor>
        <ul className="grid grid-cols-3">
          {BENEFICIOS.map(({ Icono, texto }, i) => (
            <li
              key={texto}
              className={`flex flex-col items-center gap-2 px-2 text-center lg:gap-3 lg:px-6 ${i > 0 ? "border-l border-borde" : ""}`}
            >
              <Icono className="size-7 text-rosa-accion lg:size-8" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-xs font-semibold leading-snug text-cafe sm:text-sm">{texto}</span>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
