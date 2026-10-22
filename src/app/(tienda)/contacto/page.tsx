import type { Metadata } from "next";
import { AtSign, Clock, Mail, MessageCircle } from "lucide-react";
import { Contenedor } from "@/components/ui/Contenedor";
import { Separador } from "@/components/ui/Separador";
import { estilosBoton } from "@/components/ui/estilosBoton";
import { obtenerConfiguracion } from "@/lib/datos/tienda";

export const metadata: Metadata = { title: "Contacto" };

export default async function ContactoPage() {
  const config = await obtenerConfiguracion();
  const enlace = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hola Tonorosa, quisiera más información.")}`;

  const datos = [
    { Icono: Mail, titulo: "Correo", texto: config.correoNotificaciones },
    { Icono: Clock, titulo: "Horario", texto: "Lunes a sábado, 9:00 a. m. a 6:00 p. m." },
    { Icono: AtSign, titulo: "Redes", texto: "@tonorosa" },
  ];

  return (
    <Contenedor className="py-10 lg:py-16">
      <div className="text-center">
        <h1 className="font-display text-[32px] leading-tight text-cafe md:text-5xl">Contacto</h1>
        <Separador className="mt-4" />
        <p className="mx-auto mt-4 max-w-md text-base text-tenue">
          Estamos para ayudarte con tu pedido, tallas o cualquier duda.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <a
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          className={estilosBoton("primario", "normal", "w-full h-14! text-lg")}
        >
          <MessageCircle className="size-6" aria-hidden="true" />
          Escríbenos por WhatsApp
        </a>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {datos.map(({ Icono, titulo, texto }) => (
            <li key={titulo} className="rounded-md bg-surface p-5 text-center shadow-card">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rosa-medio">
                <Icono className="size-6 text-rosa-deco" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-tenue">
                {titulo}
              </h2>
              <p className="mt-1 select-text wrap-break-word text-base text-cafe">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Contenedor>
  );
}
