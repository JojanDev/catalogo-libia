import { Heart, ShieldCheck, Shirt, Truck } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";

const BENEFICIOS = [
  { Icono: Heart, texto: "Diseños únicos para cada ocasión" },
  { Icono: Shirt, texto: "Ropa de calidad y confort" },
  { Icono: Truck, texto: "Envíos a todo el país" },
  { Icono: ShieldCheck, texto: "Tu compra segura" },
];

export function Beneficios() {
  return (
    <section aria-label="Beneficios" className="bg-rosa-suave py-8 lg:py-10">
      <Contenedor>
        <ul className="grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:gap-y-0">
          {BENEFICIOS.map(({ Icono, texto }, i) => (
            <li
              key={texto}
              className={`flex flex-col items-center gap-3 px-3 text-center lg:px-6 ${i > 0 ? "lg:border-l lg:border-borde" : ""}`}
            >
              <Icono className="size-8 text-rosa-deco" strokeWidth={1.5} aria-hidden="true" />
              <span className="max-w-[16ch] text-[15px] leading-snug text-cafe lg:max-w-none">{texto}</span>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
