import "server-only";
import { connection } from "next/server";
import {
  SELECT_DESCUENTO,
  SELECT_PEDIDO,
  SELECT_PRODUCTO,
  aColeccion,
  aConfiguracion,
  aDescuento,
  aPedido,
  aProducto,
  aSlide,
  exito,
} from "@/lib/datos/mapeo";
import { aVista } from "@/lib/pricing";
import { clienteAdmin } from "@/lib/supabase/admin";
import { clienteServidor } from "@/lib/supabase/servidor";
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

async function coleccionesActivas(): Promise<Coleccion[]> {
  const r = await clienteServidor()
    .from("colecciones")
    .select("*")
    .eq("activa", true)
    .order("orden", { ascending: true });
  return exito(r, "No se pudieron cargar las colecciones").map(aColeccion);
}

async function vistasPublicas(): Promise<ProductoVista[]> {
  const db = clienteServidor();
  const [rp, colecciones, rd] = await Promise.all([
    db
      .from("productos")
      .select(SELECT_PRODUCTO)
      .eq("activo", true)
      .order("orden", { ascending: true }),
    coleccionesActivas(),
    db.from("descuentos").select(SELECT_DESCUENTO).eq("activo", true),
  ]);
  const descuentos = exito(rd, "No se pudieron cargar los descuentos").map(aDescuento);
  const activas = new Set(colecciones.map((c) => c.id));
  return exito(rp, "No se pudieron cargar los productos")
    .map(aProducto)
    .filter((p) => p.coleccionId === null || activas.has(p.coleccionId))
    .map((p) => aVista(p, descuentos, colecciones));
}

export async function obtenerConfiguracion(): Promise<Configuracion> {
  await connection();
  const r = await clienteAdmin().from("configuracion").select("*").limit(1).single();
  return aConfiguracion(exito(r, "No se pudo cargar la configuración"));
}

export async function obtenerCarrusel(): Promise<SlideCarrusel[]> {
  await connection();
  const r = await clienteServidor()
    .from("carrusel_slides")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });
  return exito(r, "No se pudo cargar el carrusel").map(aSlide);
}

export async function obtenerColecciones(): Promise<Coleccion[]> {
  await connection();
  return coleccionesActivas();
}

export async function obtenerColeccionDestacada(): Promise<Coleccion | null> {
  await connection();
  return (await coleccionesActivas()).find((c) => c.destacada) ?? null;
}

export async function obtenerColeccionPorSlug(slug: string): Promise<Coleccion | null> {
  await connection();
  return (await coleccionesActivas()).find((c) => c.slug === slug) ?? null;
}

export async function obtenerProductos(filtro: FiltroProductos = {}): Promise<ProductoVista[]> {
  await connection();
  const q = filtro.q ? normalizar(filtro.q.trim()) : "";
  return (await vistasPublicas()).filter((p) => {
    if (filtro.coleccion && p.coleccion?.slug !== filtro.coleccion) return false;
    if (filtro.categoria && p.categoria !== filtro.categoria) return false;
    if (filtro.min !== undefined && p.precioFinal < filtro.min) return false;
    if (filtro.max !== undefined && p.precioFinal > filtro.max) return false;
    if (q && !normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(q)) return false;
    return true;
  });
}

export async function obtenerProductoPorSlug(slug: string): Promise<ProductoVista | null> {
  await connection();
  return (await vistasPublicas()).find((x) => x.slug === slug) ?? null;
}

export async function obtenerRelacionados(
  producto: ProductoVista,
  n: number = 4,
): Promise<ProductoVista[]> {
  await connection();
  const otros = (await vistasPublicas()).filter((p) => p.id !== producto.id);
  const afines = otros.filter(
    (p) =>
      p.categoria === producto.categoria ||
      (producto.coleccionId !== null && p.coleccionId === producto.coleccionId),
  );
  const resto = otros.filter((p) => !afines.includes(p));
  return [...afines, ...resto].slice(0, n);
}

export async function obtenerNovedades(n: number = 6): Promise<ProductoVista[]> {
  await connection();
  const orden = (await vistasPublicas()).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  return orden.slice(0, n);
}

export async function obtenerCategorias(): Promise<string[]> {
  await connection();
  return [...new Set((await vistasPublicas()).map((p) => p.categoria))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export async function obtenerGuiaTallas(): Promise<GuiaTallas> {
  await connection();
  const r = await clienteServidor().from("guia_tallas").select("*").limit(1).single();
  const g = exito(r, "No se pudo cargar la guía de tallas");
  return { titulo: g.titulo, columnas: g.columnas, filas: g.filas, notas: g.notas };
}

export async function obtenerRangoPrecios(): Promise<{ min: number; max: number }> {
  await connection();
  const precios = (await vistasPublicas()).map((p) => p.precioFinal);
  if (precios.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...precios), max: Math.max(...precios) };
}

export async function obtenerPedidoPublico(referencia: string): Promise<Pedido | null> {
  await connection();
  const r = await clienteAdmin()
    .from("pedidos")
    .select(SELECT_PEDIDO)
    .eq("referencia", referencia)
    .maybeSingle();
  if (r.error) throw new Error(`No se pudo cargar el pedido: ${r.error.message}`);
  return r.data ? aPedido(r.data) : null;
}
