export const ENLACES_TIENDA = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/catalogo", etiqueta: "Catálogo" },
];

export const ENLACE_ASESORIA = (n: string) => `https://wa.me/${n}`;

export function esActivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
