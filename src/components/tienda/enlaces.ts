export const ENLACES_TIENDA = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/catalogo", etiqueta: "Colección" },
  { href: "/guia-de-tallas", etiqueta: "Tallas" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/contacto", etiqueta: "Contacto" },
];

export function esActivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
