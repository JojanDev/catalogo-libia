import type { Coleccion, Descuento, Producto, ProductoVista } from "@/types";

export function fechaHoyBogota(hoy: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(hoy);
}

export function descuentoVigente(d: Descuento, hoy?: Date): boolean {
  return d.activo && d.fechaVencimiento >= fechaHoyBogota(hoy);
}

export function porcentajeDescuento(
  producto: Pick<Producto, "id" | "coleccionId">,
  descuentos: Descuento[],
): number | null {
  let mayor: number | null = null;
  for (const d of descuentos) {
    if (!descuentoVigente(d)) continue;
    const aplica =
      d.productoIds.includes(producto.id) ||
      (producto.coleccionId !== null && d.coleccionIds.includes(producto.coleccionId));
    if (aplica && (mayor === null || d.porcentaje > mayor)) mayor = d.porcentaje;
  }
  return mayor;
}

export function precioConDescuento(precio: number, pct: number): number {
  return Math.round((precio * (100 - pct)) / 100);
}

export function aVista(
  producto: Producto,
  descuentos: Descuento[],
  colecciones: Coleccion[],
): ProductoVista {
  const pct = porcentajeDescuento(producto, descuentos);
  return {
    ...producto,
    precioFinal: pct === null ? producto.precio : precioConDescuento(producto.precio, pct),
    descuentoPorcentaje: pct,
    coleccion: colecciones.find((c) => c.id === producto.coleccionId) ?? null,
  };
}
