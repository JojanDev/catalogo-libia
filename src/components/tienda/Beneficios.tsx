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
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
          {BENEFICIOS.map(({ Icono, texto }) => (
            <li
              key={texto}
              className="flex items-center gap-4 rounded-xl border border-borde bg-canvas p-4 md:flex-col md:gap-3 md:p-6 md:text-center"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rosa-suave">
                <Icono className="size-6 text-rosa-accion" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-snug text-cafe md:text-base">{texto}</span>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
