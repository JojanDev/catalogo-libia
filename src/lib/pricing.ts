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

export function descuentoGanador(
  producto: Pick<Producto, "id" | "coleccionId">,
  descuentos: Descuento[],
): Descuento | null {
  let mejor: Descuento | null = null;
  for (const d of descuentos) {
    if (!descuentoVigente(d)) continue;
    const aplica =
      d.productoIds.includes(producto.id) ||
      (producto.coleccionId !== null && d.coleccionIds.includes(producto.coleccionId));
    if (!aplica) continue;
    if (
      mejor === null ||
      d.porcentaje > mejor.porcentaje ||
      (d.porcentaje === mejor.porcentaje && d.fechaVencimiento > mejor.fechaVencimiento)
    ) {
      mejor = d;
    }
  }
  return mejor;
}

export function porcentajeDescuento(
  producto: Pick<Producto, "id" | "coleccionId">,
  descuentos: Descuento[],
): number | null {
  return descuentoGanador(producto, descuentos)?.porcentaje ?? null;
}

export function precioConDescuento(precio: number, pct: number): number {
  return Math.round((precio * (100 - pct)) / 100);
}

export function aVista(
  producto: Producto,
  descuentos: Descuento[],
  colecciones: Coleccion[],
): ProductoVista {
  const ganador = descuentoGanador(producto, descuentos);
  const pct = ganador?.porcentaje ?? null;
  return {
    ...producto,
    precioFinal: pct === null ? producto.precio : precioConDescuento(producto.precio, pct),
    descuentoPorcentaje: pct,
    descuentoHasta: ganador?.fechaVencimiento ?? null,
    coleccion: colecciones.find((c) => c.id === producto.coleccionId) ?? null,
  };
}
