import { Separador } from "@/components/ui/Separador";

type TituloSeccionProps = {
  titulo: string;
  subtitulo?: string;
  className?: string;
};

export function TituloSeccion({ titulo, subtitulo, className }: TituloSeccionProps) {
  return (
    <div className={`text-center ${className ?? ""}`}>
      <h2 className="font-display text-[26px] leading-tight text-cafe md:text-4xl">{titulo}</h2>
      <Separador className="mt-3" />
      {subtitulo && <p className="mx-auto mt-3 max-w-xl text-base text-tenue">{subtitulo}</p>}
    </div>
  );
}
