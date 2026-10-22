const monedaCO = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatearPrecio(n: number): string {
  return monedaCO.format(n).replace(/ /g, " ").replace(/^\$\s?/, "$ ");
}

export function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
