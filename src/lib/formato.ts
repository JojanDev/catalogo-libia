const numeroCO = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
  useGrouping: "always",
});

export function formatearPrecio(n: number): string {
  return "$ " + numeroCO.format(n);
}
