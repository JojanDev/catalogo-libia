import type { Coleccion } from "../../types/index.ts";

interface CollectionCardProps {
  coleccion: Coleccion;
  onClick: () => void;
}

export function CollectionCard({ coleccion, onClick }: CollectionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative h-64 rounded-2xl overflow-hidden text-left shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={coleccion.imagen}
        alt={coleccion.nombre}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/70 via-[#2C3E50]/20 to-transparent" />
      <div className="absolute bottom-0 p-6 text-white">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80 font-body">
          {coleccion.temporada}
        </span>
        <h3 className="mt-1 text-xl font-semibold font-heading">{coleccion.nombre}</h3>
        <p className="mt-1 text-sm text-white/80 line-clamp-2 font-body">
          {coleccion.descripcion}
        </p>
      </div>
    </button>
  );
}
