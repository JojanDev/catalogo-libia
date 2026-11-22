import "server-only";
import type {
  CodigoPromo,
  Coleccion,
  Configuracion,
  Descuento,
  EstadoPedido,
  Medio,
  MetodoPago,
  Pedido,
  Producto,
  SlideCarrusel,
} from "@/types";

export const SELECT_PRODUCTO =
  "*, producto_tallas(agotado, stock, tallas(id, nombre, orden)), producto_medios(id, tipo, url, alt, orden)";
export const SELECT_DESCUENTO =
  "*, descuento_productos(producto_id), descuento_colecciones(coleccion_id)";
export const SELECT_PEDIDO = "*, pedido_items(*)";

export function exito<T>(
  r: { data: T | null; error: { message: string } | null },
  contexto: string,
): T {
  if (r.error || r.data === null) {
    throw new Error(`${contexto}: ${r.error?.message ?? "sin datos"}`);
  }
  return r.data;
}

export function aColeccion(f: Record<string, any>): Coleccion {
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

export function aProducto(f: Record<string, any>): Producto {
  return {
    id: f.id,
    slug: f.slug,
    nombre: f.nombre,
    descripcion: f.descripcion,
    precio: f.precio,
    categoria: f.categoria,
    coleccionId: f.coleccion_id,
    imagen: f.imagen_url,
    medios: (f.producto_medios as Record<string, any>[])
      .map((m): Medio => ({ id: m.id, tipo: m.tipo, url: m.url, alt: m.alt, orden: m.orden }))
      .sort((a, b) => a.orden - b.orden),
    tallas: (f.producto_tallas as Record<string, any>[])
      .filter((t) => t.tallas !== null)
      .map((t) => ({
        tallaId: t.tallas.id,
        nombre: t.tallas.nombre,
        orden: t.tallas.orden,
        agotado: t.agotado,
        stock: t.stock,
      }))
      .sort((a, b) => a.orden - b.orden),
    agotado: f.agotado,
    activo: f.activo,
    orden: f.orden,
    creadoEn: f.creado_en,
  };
}

export function aSlide(f: Record<string, any>): SlideCarrusel {
  return {
    id: f.id,
    tipo: f.tipo,
    url: f.url,
    urlMovil: f.url_movil,
    titulo: f.titulo,
    subtitulo: f.subtitulo,
    textoBoton: f.texto_boton,
    enlace: f.enlace,
    orden: f.orden,
    activo: f.activo,
  };
}

export function aConfiguracion(f: Record<string, any>): Configuracion {
  return {
    costoEnvio: f.costo_envio,
    envioGratisDesde: f.envio_gratis_desde,
    whatsapp: f.whatsapp,
    correoNotificaciones: f.correo_notificaciones,
    modoInventario: f.modo_inventario,
    textoAnuncio: f.texto_anuncio,
    pagosEnLinea: f.pagos_en_linea,
  };
}

export function aDescuento(f: Record<string, any>): Descuento {
  return {
    id: f.id,
    nombre: f.nombre,
    porcentaje: f.porcentaje,
    fechaVencimiento: f.fecha_vencimiento,
    activo: f.activo,
    productoIds: (f.descuento_productos as { producto_id: number }[]).map((x) => x.producto_id),
    coleccionIds: (f.descuento_colecciones as { coleccion_id: number }[]).map(
      (x) => x.coleccion_id,
    ),
  };
}

export function aCodigo(f: Record<string, any>): CodigoPromo {
  return {
    id: f.id,
    codigo: f.codigo,
    porcentaje: f.porcentaje,
    fechaVencimiento: f.fecha_vencimiento,
    usosMaximos: f.usos_maximos,
    usos: f.usos,
    montoMinimo: f.monto_minimo,
    activo: f.activo,
  };
}

export function aPedido(f: Record<string, any>): Pedido {
  return {
    id: f.id,
    referencia: f.referencia,
    estado: f.estado as EstadoPedido,
    metodoPago: f.metodo_pago as MetodoPago,
    cliente: { nombre: f.cliente_nombre, telefono: f.cliente_telefono, email: f.cliente_email },
    envio: {
      departamento: f.envio_departamento,
      ciudad: f.envio_ciudad,
      direccion: f.envio_direccion,
      barrio: f.envio_barrio,
      notas: f.envio_notas,
    },
    items: (f.pedido_items as Record<string, any>[])
      .sort((a, b) => a.id - b.id)
      .map((i) => ({
        productoId: i.producto_id,
        slug: i.slug,
        nombre: i.nombre,
        imagen: i.imagen,
        talla: i.talla,
        cantidad: i.cantidad,
        precioUnitario: i.precio_unitario,
        descuentoPorcentaje: i.descuento_porcentaje,
        subtotal: i.subtotal,
      })),
    subtotal: f.subtotal,
    descuentoTotal: f.descuento_total,
    codigoPromo: f.codigo_promo,
    costoEnvio: f.costo_envio,
    total: f.total,
    creadoEn: f.creado_en,
    pagadoEn: f.pagado_en,
  };
}
