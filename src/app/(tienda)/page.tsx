import { ArrowRight } from "lucide-react";
import { Beneficios } from "@/components/tienda/Beneficios";
import { Decor } from "@/components/decor/Decor";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Contenedor } from "@/components/ui/Contenedor";
import { Logo } from "@/components/ui/Logo";
import { Separador } from "@/components/ui/Separador";

export default function InicioPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-rosa-suave py-12 lg:py-20">
        <Decor variant="flor" className="absolute -left-6 bottom-4 size-24 sm:left-4 sm:size-32 lg:size-44" />
        <Decor variant="rama" className="absolute bottom-0 left-12 hidden h-32 w-20 sm:block lg:left-40 lg:h-44" />
        <Decor variant="flor" className="absolute -right-6 bottom-8 size-24 sm:right-4 sm:size-32 lg:size-44" />
        <Decor variant="mariposa" className="absolute right-6 top-6 size-12 sm:right-24 lg:size-16" />
        <Decor variant="corazon" className="absolute left-6 top-8 size-6 lg:size-8" />
        <Contenedor className="relative flex flex-col items-center text-center">
          <Logo alto={120} prioridad />
          <h1 className="mt-6 font-script text-[40px] font-semibold leading-tight text-taupe lg:text-[64px]">
            Un jardín de emociones
          </h1>
        </Contenedor>
      </section>

      <Beneficios />

      <section className="relative overflow-hidden py-12 lg:py-20">
        <Decor variant="rama" className="absolute -left-6 bottom-0 hidden h-40 w-24 sm:block lg:left-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 left-10 hidden size-16 lg:block" />
        <Decor variant="rama" className="absolute -right-6 bottom-0 hidden h-40 w-24 -scale-x-100 sm:block lg:right-4 lg:h-56 lg:w-36" />
        <Decor variant="flor" className="absolute bottom-4 right-10 hidden size-16 lg:block" />
        <Contenedor className="relative flex flex-col items-center text-center">
          <p className="text-xl text-cafe lg:text-2xl">Bienvenidas a</p>
          <p className="font-script text-[56px] font-semibold leading-tight text-rosa-accion lg:text-[72px]">
            Tonorosa
          </p>
          <Separador className="mt-2" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-cafe lg:text-[17px]">
            Aquí encontrarás mucho más que ropa, encontrarás un mundo de ternura, estilo y felicidad
            para las más pequeñas.
          </p>
          <BotonEnlace href="/catalogo" className="mt-8">
            Descubrir colección
            <ArrowRight className="size-5" aria-hidden="true" />
          </BotonEnlace>
        </Contenedor>
      </section>
    </>
  );
}
