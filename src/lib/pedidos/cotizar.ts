import "server-only";
import { almacen } from "@/lib/mock/almacen";
import { formatearPrecio } from "@/lib/formato";
import { aVista, fechaHoyBogota } from "@/lib/pricing";
import type { CodigoPromo, Cotizacion, EntradaItem, PedidoItem } from "@/types";

export function evaluarCodigo(
  codigo: string | null | undefined,
  subtotal: number,
): { codigo: CodigoPromo | null; mensaje: string } {
  const invalido = { codigo: null, mensaje: "Ese código no es válido o ya venció" };
  if (!codigo) return invalido;
  const c = almacen().codigos.find((x) => x.codigo === codigo.trim().toUpperCase());
  if (!c || !c.activo) return invalido;
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
  const a = almacen();
  const errores: string[] = [];
  const items: PedidoItem[] = [];

  for (const e of entradas) {
    const cantidad = Math.floor(e.cantidad);
    const producto = a.productos.find((p) => p.id === e.productoId);
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
    const vista = aVista(producto, a.descuentos, a.colecciones);
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
    const r = evaluarCodigo(codigo, subtotal);
    if (r.codigo) {
      descuentoCodigo = Math.round((subtotal * r.codigo.porcentaje) / 100);
      codigoAplicado = r.codigo.codigo;
    } else {
      errores.push(r.mensaje);
    }
  }

  const { costoEnvio: tarifa, envioGratisDesde } = a.configuracion;
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
