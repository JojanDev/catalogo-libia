import Link from "next/link";
import { AtSign, MessageCircle } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import { ENLACES_TIENDA } from "@/components/tienda/enlaces";
import { Contenedor } from "@/components/ui/Contenedor";
import { Logo } from "@/components/ui/Logo";

export function PiePagina() {
  return (
    <footer className="mt-12 bg-canvas lg:mt-20">
      <Decor variant="ola" className="h-8 lg:h-14" />
      <div className="relative overflow-hidden bg-rosa-suave pb-8 pt-4">
        <Decor variant="rama" className="absolute -left-4 bottom-0 hidden h-40 w-24 sm:block" />
        <Decor variant="rama" className="absolute -right-4 bottom-0 hidden h-40 w-24 -scale-x-100 sm:block" />
        <Contenedor className="relative flex flex-col items-center gap-6 text-center">
          <Logo alto={80} />
          <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            {ENLACES_TIENDA.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="flex min-h-11 items-center text-[15px] font-semibold text-cafe hover:text-rosa-accion"
              >
                {enlace.etiqueta}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-1 text-sm text-cafe sm:flex-row sm:gap-6">
            <a
              href="https://wa.me/573006569633"
              className="flex min-h-11 items-center gap-2 font-semibold hover:text-rosa-accion"
            >
              <MessageCircle className="size-5 text-rosa-deco" aria-hidden="true" />
              WhatsApp
            </a>
            <span className="flex min-h-11 items-center gap-2">
              <AtSign className="size-5 text-rosa-deco" aria-hidden="true" />
              @tonorosa
            </span>
          </div>
          <p className="text-sm text-tenue">© Tonorosa by Leyar</p>
        </Contenedor>
      </div>
    </footer>
  );
}
