import type { DescuentoInfo } from "../types/index.ts";

export function getDiscountedPrice(precio: number, descuento: DescuentoInfo | null | undefined): number {
  if (!descuento) return precio;
  const hoy = new Date();
  const vence = new Date(descuento.fecha_vencimiento);
  if (hoy > vence) return precio;
  return precio * (1 - descuento.porcentaje / 100);
}

export function isDiscountActive(descuento: DescuentoInfo | null | undefined): boolean {
  if (!descuento) return false;
  const hoy = new Date();
  const vence = new Date(descuento.fecha_vencimiento);
  return hoy <= vence;
}
