import { MessageCircle } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";
import { Separador } from "@/components/ui/Separador";
import { estilosBoton } from "@/components/ui/estilosBoton";

type PaginaPoliticaProps = {
  titulo: string;
  introduccion: string;
  whatsapp: string;
  children: React.ReactNode;
};

export function PaginaPolitica({ titulo, introduccion, whatsapp, children }: PaginaPoliticaProps) {
  const enlace = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola Tonorosa, tengo una pregunta sobre sus políticas.")}`;

  return (
    <Contenedor className="py-10 lg:py-16">
      <div className="text-center">
        <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">{titulo}</h1>
        <Separador className="mt-4" />
        <p className="mx-auto mt-4 max-w-xl text-base text-tenue">{introduccion}</p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-cafe [&_a]:font-semibold [&_a]:text-rosa-accion [&_a]:underline [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
        <p className="mt-10 text-sm text-tenue">Última actualización: noviembre de 2026</p>
      </div>

      <section className="mx-auto mt-14 max-w-2xl rounded-lg bg-rosa-suave p-8 text-center">
        <h2 className="font-display text-2xl text-cafe md:text-3xl">¿Tienes dudas?</h2>
        <p className="mx-auto mt-2 max-w-md text-base text-cafe">Escríbenos y con gusto te ayudamos.</p>
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className={estilosBoton("primario", "normal", "mt-5")}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Escribir por WhatsApp
        </a>
      </section>
    </Contenedor>
  );
}

export function SeccionPolitica({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mt-10 font-display text-[26px] leading-tight text-cafe md:text-3xl">{titulo}</h2>
      {children}
    </section>
  );
}
