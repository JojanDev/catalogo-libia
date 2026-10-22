"use server";

import { revalidatePath } from "next/cache";
import { requerirAdmin } from "@/lib/auth/requerirAdmin";
import * as admin from "@/lib/datos/admin";
import type {
  CodigoPromo,
  Coleccion,
  Configuracion,
  Descuento,
  EstadoPedido,
  GuiaTallas,
  Producto,
  SlideCarrusel,
} from "@/types";

export type Resultado<T = null> = { ok: true; datos: T } | { ok: false; error: string };

class ErrorValidacion extends Error {}

const falla = (mensaje: string): never => {
  throw new ErrorValidacion(mensaje);
};

const entero = (v: unknown, minimo = 0): v is number => Number.isInteger(v) && (v as number) >= minimo;
const texto = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const fecha = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const porcentaje = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 100;
const idValido = (v: unknown): v is number => Number.isInteger(v) && (v as number) > 0;
const idOpcional = (v: unknown) => v === undefined || idValido(v);

const ESTADOS: EstadoPedido[] = ["pendiente_pago", "pagado", "enviado", "entregado", "cancelado"];

async function ejecutar<T>(fn: () => Promise<T>): Promise<Resultado<T>> {
  await requerirAdmin();
  try {
    const datos = await fn();
    revalidatePath("/", "layout");
    return { ok: true, datos };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error && err.message ? err.message : "No se pudo completar la operación",
    };
  }
}

export async function guardarProductoAccion(
  d: Omit<Producto, "id" | "slug" | "creadoEn"> & { id?: number },
): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (!texto(d.nombre)) falla("El nombre es obligatorio");
    if (!entero(d.precio, 1)) falla("El precio debe ser un entero mayor a cero");
    if (!Array.isArray(d.tallas) || d.tallas.length === 0) falla("Agrega al menos una talla");
    if (!entero(d.orden)) falla("El orden no es válido");
    if (d.coleccionId !== null && !idValido(d.coleccionId)) falla("La colección no es válida");
    const medios = Array.isArray(d.medios) ? d.medios : [];
    const imagen = texto(d.imagen) ? d.imagen : (medios.find((m) => m.tipo === "imagen")?.url ?? "");
    if (!texto(imagen)) falla("La imagen es obligatoria");
    for (const t of d.tallas) {
      if (!idValido(t.tallaId) || !entero(t.stock)) falla("Las tallas no son válidas");
    }
    const p = await admin.guardarProducto({ ...d, medios, imagen });
    return { id: p.id };
  });
}

export async function cambiarActivoProductoAccion(id: number, activo: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activo !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivoProducto(id, activo);
    return null;
  });
}

export async function guardarColeccionAccion(
  d: Omit<Coleccion, "id" | "slug"> & { id?: number },
): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (!texto(d.nombre)) falla("El nombre es obligatorio");
    if (!entero(d.orden)) falla("El orden no es válido");
    const c = await admin.guardarColeccion(d);
    return { id: c.id };
  });
}

export async function cambiarActivaColeccionAccion(id: number, activa: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activa !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivaColeccion(id, activa);
    return null;
  });
}

export async function destacarColeccionAccion(id: number): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id)) falla("Datos no válidos");
    await admin.destacarColeccion(id);
    return null;
  });
}

export async function guardarTallaAccion(d: {
  id?: number;
  nombre: string;
  orden: number;
  activa: boolean;
}): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (!texto(d.nombre)) falla("El nombre es obligatorio");
    if (!entero(d.orden)) falla("El orden no es válido");
    const t = await admin.guardarTalla({ ...d, nombre: d.nombre.trim() });
    return { id: t.id };
  });
}

export async function cambiarActivaTallaAccion(id: number, activa: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activa !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivaTalla(id, activa);
    return null;
  });
}

export async function guardarSlideAccion(
  d: Omit<SlideCarrusel, "id"> & { id?: number },
): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (d.tipo !== "imagen" && d.tipo !== "video") falla("El tipo no es válido");
    if (!texto(d.url)) falla("El archivo es obligatorio");
    if (!entero(d.orden)) falla("El orden no es válido");
    const s = await admin.guardarSlide(d);
    return { id: s.id };
  });
}

export async function cambiarActivoSlideAccion(id: number, activo: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activo !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivoSlide(id, activo);
    return null;
  });
}

export async function moverSlideAccion(
  id: number,
  direccion: "arriba" | "abajo",
): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || (direccion !== "arriba" && direccion !== "abajo")) falla("Datos no válidos");
    await admin.moverSlide(id, direccion);
    return null;
  });
}

export async function guardarGuiaTallasAccion(g: GuiaTallas): Promise<Resultado> {
  return ejecutar(async () => {
    if (!g || !texto(g.titulo)) falla("El título es obligatorio");
    if (!Array.isArray(g.columnas) || !Array.isArray(g.filas)) falla("La tabla no es válida");
    await admin.guardarGuiaTallas(g);
    return null;
  });
}

export async function guardarConfiguracionAccion(c: Configuracion): Promise<Resultado> {
  return ejecutar(async () => {
    if (!c) falla("Datos no válidos");
    if (!entero(c.costoEnvio)) falla("El costo de envío no es válido");
    if (c.envioGratisDesde !== null && !entero(c.envioGratisDesde)) {
      falla("El envío gratis desde no es válido");
    }
    if (c.modoInventario !== "sobre_pedido" && c.modoInventario !== "stock_fijo") {
      falla("El modo de inventario no es válido");
    }
    if (typeof c.pagosEnLinea !== "boolean") falla("Datos no válidos");
    await admin.guardarConfiguracion(c);
    return null;
  });
}

export async function guardarDescuentoAccion(
  d: Omit<Descuento, "id"> & { id?: number },
): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (!texto(d.nombre)) falla("El nombre es obligatorio");
    if (!porcentaje(d.porcentaje)) falla("El porcentaje debe estar entre 1 y 100");
    if (!fecha(d.fechaVencimiento)) falla("La fecha de vencimiento no es válida");
    if (!Array.isArray(d.productoIds) || !Array.isArray(d.coleccionIds)) falla("Datos no válidos");
    const r = await admin.guardarDescuento(d);
    return { id: r.id };
  });
}

export async function cambiarActivoDescuentoAccion(id: number, activo: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activo !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivoDescuento(id, activo);
    return null;
  });
}

export async function guardarCodigoAccion(
  d: Omit<CodigoPromo, "id" | "usos"> & { id?: number },
): Promise<Resultado<{ id: number }>> {
  return ejecutar(async () => {
    if (!d || !idOpcional(d.id)) falla("Datos no válidos");
    if (!texto(d.codigo)) falla("El código es obligatorio");
    if (!porcentaje(d.porcentaje)) falla("El porcentaje debe estar entre 1 y 100");
    if (d.fechaVencimiento !== null && !fecha(d.fechaVencimiento)) falla("La fecha no es válida");
    if (d.usosMaximos !== null && !entero(d.usosMaximos, 1)) falla("Los usos máximos no son válidos");
    if (d.montoMinimo !== null && !entero(d.montoMinimo)) falla("El monto mínimo no es válido");
    const r = await admin.guardarCodigo(d);
    return { id: r.id };
  });
}

export async function cambiarActivoCodigoAccion(id: number, activo: boolean): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || typeof activo !== "boolean") falla("Datos no válidos");
    await admin.cambiarActivoCodigo(id, activo);
    return null;
  });
}

export async function cambiarEstadoPedidoAccion(id: number, estado: EstadoPedido): Promise<Resultado> {
  return ejecutar(async () => {
    if (!idValido(id) || !ESTADOS.includes(estado)) falla("Datos no válidos");
    await admin.cambiarEstadoPedido(id, estado);
    return null;
  });
}

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const TIPOS_VIDEO = ["video/mp4", "video/webm"];

export async function subirArchivoAccion(
  formData: FormData,
): Promise<Resultado<{ url: string; tipo: "imagen" | "video" }>> {
  return ejecutar(async () => {
    const archivo = formData?.get("archivo");
    if (!(archivo instanceof File) || archivo.size === 0) falla("Selecciona un archivo");
    const f = archivo as File;
    const esImagen = TIPOS_IMAGEN.includes(f.type);
    if (!esImagen && !TIPOS_VIDEO.includes(f.type)) falla("Formato de archivo no permitido");
    if (f.size > (esImagen ? 8 : 20) * 1024 * 1024) {
      falla(esImagen ? "La imagen supera los 8 MB" : "El video supera los 20 MB");
    }
    const base64 = Buffer.from(await f.arrayBuffer()).toString("base64");
    return { url: `data:${f.type};base64,${base64}`, tipo: esImagen ? "imagen" : "video" } as const;
  });
}
