import type { Coleccion } from "../../types/index.ts";

interface HeroSectionProps {
  coleccion: Coleccion;
}

export function HeroSection({ coleccion }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={coleccion.imagen}
          alt={coleccion.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/80 via-[#2C3E50]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8A838]/20 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="inline-block text-xs font-semibold text-white/70 uppercase tracking-[0.2em] bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full font-body">
          Colección {coleccion.temporada}
        </span>
        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-wide uppercase leading-tight font-heading">
          {coleccion.nombre}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-light font-body">
          {coleccion.descripcion}
        </p>
        <a
          href="#/"
          className="mt-8 inline-flex items-center justify-center gap-2 bg-warm-accent hover:bg-warm-accent-hover text-white font-semibold text-sm py-3.5 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-body"
        >
          Ver colección completa
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
