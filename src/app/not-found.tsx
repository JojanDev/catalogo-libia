import Link from "next/link";
import { Decor } from "@/components/decor/Decor";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <>
      <header className="border-b border-borde bg-canvas py-3">
        <Link href="/" aria-label="Tonorosa, ir al inicio" className="flex justify-center">
          <Logo alto={56} />
        </Link>
      </header>
      <main className="flex min-h-[70dvh] flex-col items-center justify-center px-4 py-16 text-center">
        <Decor variant="flor" className="size-28 lg:size-36" />
        <h1 className="mt-6 font-display text-[32px] leading-tight text-cafe md:text-5xl">
          Esta página se perdió en el jardín
        </h1>
        <p className="mt-3 max-w-md text-base text-tenue">
          No encontramos lo que buscas, pero hay muchas prendas bonitas esperándote.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <BotonEnlace href="/">Ir al inicio</BotonEnlace>
          <BotonEnlace href="/catalogo" variante="secundario">
            Ver colección
          </BotonEnlace>
        </div>
      </main>
    </>
  );
}
