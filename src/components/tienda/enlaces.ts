export const ENLACES_TIENDA = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/catalogo", etiqueta: "Catálogo" },
  { href: "/guia-de-tallas", etiqueta: "Tallas" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/contacto", etiqueta: "Contacto" },
];

export const ENLACES_POLITICAS = [
  { href: "/politicas/envios-y-devoluciones", etiqueta: "Envíos y devoluciones" },
  { href: "/politicas/terminos", etiqueta: "Términos y condiciones" },
  { href: "/politicas/privacidad", etiqueta: "Tratamiento de datos" },
];

export const ENLACE_ASESORIA = (n: string) => `https://wa.me/${n}`;

export function esActivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
