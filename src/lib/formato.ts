const monedaCO = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatearPrecio(n: number): string {
  return monedaCO.format(n).replace(/ /g, " ").replace(/^\$\s?/, "$ ");
}
