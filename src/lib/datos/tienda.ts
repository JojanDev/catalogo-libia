import "server-only";
import { connection } from "next/server";
import { almacen, copia } from "@/lib/mock/almacen";
import { aVista } from "@/lib/pricing";
import type {
  Coleccion,
  Configuracion,
  GuiaTallas,
  Pedido,
  ProductoVista,
  SlideCarrusel,
} from "@/types";

export type FiltroProductos = {
  q?: string;
  coleccion?: string;
  categoria?: string;
  min?: number;
  max?: number;
};

function normalizar(t: string): string {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function vistasPublicas(): ProductoVista[] {
  const a = almacen();
  const activas = new Set(a.colecciones.filter((c) => c.activa).map((c) => c.id));
  return a.productos
    .filter((p) => p.activo && (p.coleccionId === null || activas.has(p.coleccionId)))
    .map((p) => aVista(p, a.descuentos, a.colecciones))
    .sort((x, y) => x.orden - y.orden);
}

export async function obtenerConfiguracion(): Promise<Configuracion> {
  await connection();
  return copia(almacen().configuracion);
}

export async function obtenerCarrusel(): Promise<SlideCarrusel[]> {
  await connection();
  return copia(almacen().slides.filter((s) => s.activo).sort((a, b) => a.orden - b.orden));
}

export async function obtenerColecciones(): Promise<Coleccion[]> {
  await connection();
  return copia(almacen().colecciones.filter((c) => c.activa).sort((a, b) => a.orden - b.orden));
}

export async function obtenerColeccionDestacada(): Promise<Coleccion | null> {
  await connection();
  const c = almacen().colecciones.find((x) => x.activa && x.destacada);
  return c ? copia(c) : null;
}

export async function obtenerColeccionPorSlug(slug: string): Promise<Coleccion | null> {
  await connection();
  const c = almacen().colecciones.find((x) => x.slug === slug && x.activa);
  return c ? copia(c) : null;
}

export async function obtenerProductos(filtro: FiltroProductos = {}): Promise<ProductoVista[]> {
  await connection();
  const q = filtro.q ? normalizar(filtro.q.trim()) : "";
  const resultado = vistasPublicas().filter((p) => {
    if (filtro.coleccion && p.coleccion?.slug !== filtro.coleccion) return false;
    if (filtro.categoria && p.categoria !== filtro.categoria) return false;
    if (filtro.min !== undefined && p.precioFinal < filtro.min) return false;
    if (filtro.max !== undefined && p.precioFinal > filtro.max) return false;
    if (q && !normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(q)) return false;
    return true;
  });
  return copia(resultado);
}

export async function obtenerProductoPorSlug(slug: string): Promise<ProductoVista | null> {
  await connection();
  const p = vistasPublicas().find((x) => x.slug === slug);
  return p ? copia(p) : null;
}

export async function obtenerRelacionados(
  producto: ProductoVista,
  n: number = 4,
): Promise<ProductoVista[]> {
  await connection();
  const otros = vistasPublicas().filter((p) => p.id !== producto.id);
  const afines = otros.filter(
    (p) =>
      p.categoria === producto.categoria ||
      (producto.coleccionId !== null && p.coleccionId === producto.coleccionId),
  );
  const resto = otros.filter((p) => !afines.includes(p));
  return copia([...afines, ...resto].slice(0, n));
}

export async function obtenerNovedades(n: number = 6): Promise<ProductoVista[]> {
  await connection();
  const orden = vistasPublicas().sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  return copia(orden.slice(0, n));
}

export async function obtenerCategorias(): Promise<string[]> {
  await connection();
  return [...new Set(vistasPublicas().map((p) => p.categoria))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export async function obtenerGuiaTallas(): Promise<GuiaTallas> {
  await connection();
  return copia(almacen().guiaTallas);
}

export async function obtenerRangoPrecios(): Promise<{ min: number; max: number }> {
  await connection();
  const precios = vistasPublicas().map((p) => p.precioFinal);
  if (precios.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...precios), max: Math.max(...precios) };
}

export async function obtenerPedidoPublico(referencia: string): Promise<Pedido | null> {
  await connection();
  const p = almacen().pedidos.find((x) => x.referencia === referencia);
  return p ? copia(p) : null;
}
