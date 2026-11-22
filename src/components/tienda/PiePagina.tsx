import Link from "next/link";
import { AtSign, MessageCircle, Truck } from "lucide-react";
import { Decor } from "@/components/decor/Decor";
import { ENLACES_POLITICAS, ENLACES_TIENDA } from "@/components/tienda/enlaces";
import { Contenedor } from "@/components/ui/Contenedor";
import { Logo } from "@/components/ui/Logo";
import type { Coleccion } from "@/types";

const CLASE_ENLACE =
  "flex min-h-11 items-center md:min-h-6 text-[15px] font-semibold leading-snug text-cafe hover:text-rosa-accion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion";

export function PiePagina({ whatsapp, colecciones }: { whatsapp: string; colecciones: Coleccion[] }) {
  return (
    <footer className="mt-12 bg-canvas lg:mt-8">
      <Decor variant="ola" className="h-8 lg:h-14" />
      <div className="relative overflow-hidden bg-rosa-suave pb-24 pt-6 sm:pb-6 sm:pt-4 md:pb-8">
        <Decor variant="rama-esquina-izq" className="absolute left-0 top-0 z-0 hidden w-24 sm:block lg:w-36" />
        <Decor variant="rama-esquina-izq" className="absolute right-0 top-0 z-0 hidden w-24 -scale-x-100 sm:block lg:w-36" />
        <Contenedor className="relative z-10">
          <div>
            <div className="grid gap-8 text-center sm:gap-6 md:grid-cols-2 md:gap-8 md:text-left lg:grid-cols-12">
              <div className="flex flex-col items-center gap-3 md:col-span-2 md:items-start lg:col-span-3">
                <Logo alto={112} />
                <p className="max-w-xs text-sm leading-relaxed text-cafe md:max-w-sm">
                  Moda infantil creada con ternura, telas suaves y detalles que acompañan cada momento especial.
                </p>
              </div>
              <div className="lg:col-span-3">
                <h2 className="text-left font-display text-lg text-cafe sm:text-center md:text-left">Explorar</h2>
                <nav aria-label="Explorar">
                  <ul className="mt-1 grid grid-cols-2 justify-items-start gap-x-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-5 md:flex-col md:gap-x-0 md:gap-y-0">
                    {ENLACES_TIENDA.slice(0, 2).map((enlace) => (
                      <li key={enlace.href}>
                        <Link href={enlace.href} className={CLASE_ENLACE}>
                          {enlace.etiqueta}
                        </Link>
                      </li>
                    ))}
                    {colecciones.map((coleccion) => (
                      <li key={coleccion.id}>
                        <Link href={`/colecciones/${coleccion.slug}`} className={CLASE_ENLACE}>
                          {coleccion.nombre}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="lg:col-span-3">
                <h2 className="text-left font-display text-lg text-cafe sm:text-center md:text-left">Información</h2>
                <nav aria-label="Información">
                  <ul className="mt-1 grid grid-cols-2 justify-items-start gap-x-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-5 md:flex-col md:gap-x-0">
                    {[...ENLACES_TIENDA.slice(2), ...ENLACES_POLITICAS].map((enlace) => (
                      <li key={enlace.href}>
                        <Link href={enlace.href} className={CLASE_ENLACE}>
                          {enlace.etiqueta}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="border-t border-borde pt-6 sm:border-0 sm:pt-0 lg:col-span-3">
                <h2 className="text-left font-display text-lg text-cafe sm:text-center md:text-left">Atención</h2>
                <div className="mt-1 flex flex-col items-start sm:items-center md:items-start">
                  <p className="flex min-h-11 items-center gap-2 text-sm text-cafe md:min-h-6">
                    <Truck className="size-5 text-rosa-deco" aria-hidden="true" />
                    Envíos a toda Colombia
                  </p>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-2 text-sm font-semibold text-cafe hover:text-rosa-accion md:min-h-6"
                  >
                    <MessageCircle className="size-5 text-rosa-deco" aria-hidden="true" />
                    Escríbenos por WhatsApp
                  </a>
                  <a
                    href="https://www.instagram.com/tonorosa_byleyar"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Tonorosa"
                    className="flex min-h-11 items-center gap-2 text-sm font-semibold text-cafe hover:text-rosa-accion md:min-h-6"
                  >
                    <AtSign className="size-5 text-rosa-deco" aria-hidden="true" />
                    @tonorosa_byleyar
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-8 border-t border-borde pt-4 text-center text-sm text-cafe sm:mt-4 md:mt-6">© Tonorosa by Leyar</p>
          </div>
        </Contenedor>
      </div>
    </footer>
  );
}
