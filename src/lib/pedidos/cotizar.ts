import "server-only";
import {
  SELECT_DESCUENTO,
  SELECT_PRODUCTO,
  aCodigo,
  aColeccion,
  aConfiguracion,
  aDescuento,
  aProducto,
  exito,
} from "@/lib/datos/mapeo";
import { formatearPrecio } from "@/lib/formato";
import { aVista, fechaHoyBogota } from "@/lib/pricing";
import { clienteAdmin } from "@/lib/supabase/admin";
import type { CodigoPromo, Cotizacion, EntradaItem, PedidoItem } from "@/types";

export async function evaluarCodigo(
  codigo: string | null | undefined,
  subtotal: number,
): Promise<{ codigo: CodigoPromo | null; mensaje: string }> {
  const invalido = { codigo: null, mensaje: "Ese código no es válido o ya venció" };
  if (!codigo) return invalido;
  const r = await clienteAdmin()
    .from("codigos_promo")
    .select("*")
    .eq("codigo", codigo.trim().toUpperCase())
    .maybeSingle();
  if (r.error) throw new Error(`No se pudo validar el código: ${r.error.message}`);
  if (!r.data) return invalido;
  const c = aCodigo(r.data);
  if (!c.activo) return invalido;
  if (c.fechaVencimiento && c.fechaVencimiento < fechaHoyBogota()) return invalido;
  if (c.usosMaximos !== null && c.usos >= c.usosMaximos) return invalido;
  if (c.montoMinimo !== null && subtotal < c.montoMinimo) {
    return {
      codigo: null,
      mensaje: `Este código aplica para compras desde ${formatearPrecio(c.montoMinimo)}`,
    };
  }
  return { codigo: c, mensaje: "" };
}

export async function cotizar(
  entradas: EntradaItem[],
  codigo?: string | null,
): Promise<Cotizacion> {
  const db = clienteAdmin();
  const ids = [...new Set(entradas.map((e) => e.productoId))].filter(Number.isInteger);
  const [rp, rc, rd, rcfg] = await Promise.all([
    db.from("productos").select(SELECT_PRODUCTO).in("id", ids),
    db.from("colecciones").select("*"),
    db.from("descuentos").select(SELECT_DESCUENTO),
    db.from("configuracion").select("*").limit(1).single(),
  ]);
  const productos = exito(rp, "No se pudieron cargar los productos").map(aProducto);
  const colecciones = exito(rc, "No se pudieron cargar las colecciones").map(aColeccion);
  const descuentos = exito(rd, "No se pudieron cargar los descuentos").map(aDescuento);
  const config = aConfiguracion(exito(rcfg, "No se pudo cargar la configuración"));

  const errores: string[] = [];
  const items: PedidoItem[] = [];

  for (const e of entradas) {
    const cantidad = Math.floor(e.cantidad);
    const producto = productos.find((p) => p.id === e.productoId);
    if (!producto || !producto.activo) {
      errores.push("Uno de los productos ya no está disponible");
      continue;
    }
    const talla = producto.tallas.find((t) => t.nombre === e.talla);
    if (!talla) {
      errores.push(`La talla ${e.talla} no existe para ${producto.nombre}`);
      continue;
    }
    if (producto.agotado || talla.agotado) {
      errores.push(`${producto.nombre} en talla ${e.talla} está agotado`);
      continue;
    }
    if (!Number.isFinite(cantidad) || cantidad < 1 || cantidad > 10) {
      errores.push(`Cantidad no válida para ${producto.nombre}`);
      continue;
    }
    const vista = aVista(producto, descuentos, colecciones);
    items.push({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagen,
      talla: talla.nombre,
      cantidad,
      precioUnitario: producto.precio,
      descuentoPorcentaje: vista.descuentoPorcentaje ?? 0,
      subtotal: vista.precioFinal * cantidad,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  let descuentoCodigo = 0;
  let codigoAplicado: string | null = null;
  if (codigo) {
    const r = await evaluarCodigo(codigo, subtotal);
    if (r.codigo) {
      descuentoCodigo = Math.round((subtotal * r.codigo.porcentaje) / 100);
      codigoAplicado = r.codigo.codigo;
    } else {
      errores.push(r.mensaje);
    }
  }

  const { costoEnvio: tarifa, envioGratisDesde } = config;
  const base = subtotal - descuentoCodigo;
  const costoEnvio =
    items.length === 0 || (envioGratisDesde !== null && base >= envioGratisDesde) ? 0 : tarifa;

  return {
    items,
    subtotal,
    descuentoCodigo,
    codigoAplicado,
    costoEnvio,
    total: base + costoEnvio,
    errores,
  };
}
