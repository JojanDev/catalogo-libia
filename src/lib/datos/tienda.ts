import "server-only";
import { connection } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";
import type {
  Coleccion,
  Configuracion,
  Medio,
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

type FilaColeccion = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  temporada: string;
  imagen_url: string;
  activa: boolean;
  destacada: boolean;
  orden: number;
};

type FilaProducto = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  coleccion_id: number | null;
  imagen_url: string;
  agotado: boolean;
  activo: boolean;
  orden: number;
  creado_en: string;
  colecciones: FilaColeccion | null;
  producto_tallas: {
    agotado: boolean;
    tallas: { id: number; nombre: string; orden: number };
  }[];
  producto_medios: {
    id: number;
    tipo: "imagen" | "video";
    url: string;
    alt: string;
    orden: number;
  }[];
};

function normalizar(t: string): string {
  return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function aColeccion(f: FilaColeccion): Coleccion {
  return {
    id: f.id,
    slug: f.slug,
    nombre: f.nombre,
    descripcion: f.descripcion,
    temporada: f.temporada,
    imagen: f.imagen_url,
    activa: f.activa,
    destacada: f.destacada,
    orden: f.orden,
  };
}

async function vistasPublicas(): Promise<ProductoVista[]> {
  const { data, error } = await clienteServidor()
    .from("productos")
    .select(
      "*, colecciones(*), producto_tallas(agotado, tallas(id, nombre, orden)), producto_medios(id, tipo, url, alt, orden)",
    )
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) throw new Error(`No se pudieron cargar los productos: ${error.message}`);
  return (data as unknown as FilaProducto[])
    .filter((p) => p.coleccion_id === null || (p.colecciones !== null && p.colecciones.activa))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      coleccionId: p.coleccion_id,
      imagen: p.imagen_url,
      medios: p.producto_medios
        .map((m): Medio => ({ id: m.id, tipo: m.tipo, url: m.url, alt: m.alt, orden: m.orden }))
        .sort((a, b) => a.orden - b.orden),
      tallas: p.producto_tallas
        .map((t) => ({
          tallaId: t.tallas.id,
          nombre: t.tallas.nombre,
          orden: t.tallas.orden,
          agotado: t.agotado,
        }))
        .sort((a, b) => a.orden - b.orden),
      agotado: p.agotado,
      activo: p.activo,
      orden: p.orden,
      creadoEn: p.creado_en,
      coleccion: p.colecciones ? aColeccion(p.colecciones) : null,
    }));
}

async function coleccionesActivas(): Promise<Coleccion[]> {
  const { data, error } = await clienteServidor()
    .from("colecciones")
    .select("*")
    .eq("activa", true)
    .order("orden", { ascending: true });
  if (error) throw new Error(`No se pudieron cargar las colecciones: ${error.message}`);
  return (data as FilaColeccion[]).map(aColeccion);
}

export async function obtenerConfiguracion(): Promise<Configuracion> {
  await connection();
  const { data, error } = await clienteServidor()
    .from("configuracion")
    .select("whatsapp, texto_anuncio")
    .limit(1)
    .single();
  if (error) throw new Error(`No se pudo cargar la configuración: ${error.message}`);
  return { whatsapp: data.whatsapp, textoAnuncio: data.texto_anuncio };
}

export async function obtenerCarrusel(): Promise<SlideCarrusel[]> {
  await connection();
  const { data, error } = await clienteServidor()
    .from("carrusel_slides")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });
  if (error) throw new Error(`No se pudo cargar el carrusel: ${error.message}`);
  return data.map((s) => ({
    id: s.id,
    tipo: s.tipo,
    url: s.url,
    urlMovil: s.url_movil,
    titulo: s.titulo,
    subtitulo: s.subtitulo,
    textoBoton: s.texto_boton,
    enlace: s.enlace,
    orden: s.orden,
    activo: s.activo,
  }));
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
    if (filtro.min !== undefined && p.precio < filtro.min) return false;
    if (filtro.max !== undefined && p.precio > filtro.max) return false;
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

export async function obtenerRangoPrecios(): Promise<{ min: number; max: number }> {
  await connection();
  const precios = (await vistasPublicas()).map((p) => p.precio);
  if (precios.length === 0) return { min: 0, max: 0 };
  return { min: Math.min(...precios), max: Math.max(...precios) };
}
