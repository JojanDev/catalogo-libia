import "server-only";
import { connection } from "next/server";
import {
  SELECT_DESCUENTO,
  SELECT_PEDIDO,
  SELECT_PRODUCTO,
  aCodigo,
  aColeccion,
  aDescuento,
  aPedido,
  aProducto,
  aSlide,
  exito,
} from "@/lib/datos/mapeo";
import { crearSlug } from "@/lib/slug";
import { clienteAdmin } from "@/lib/supabase/admin";
import type {
  CodigoPromo,
  Coleccion,
  Configuracion,
  Descuento,
  EstadoPedido,
  GuiaTallas,
  Pedido,
  Producto,
  ResumenPanel,
  SlideCarrusel,
  Talla,
} from "@/types";

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  pendiente_pago: ["pagado", "cancelado"],
  pagado: ["enviado", "cancelado"],
  enviado: ["entregado"],
  entregado: [],
  cancelado: [],
};

type Error_ = { message: string } | null;

function fallo(e: Error_, contexto: string): void {
  if (e) throw new Error(`${contexto}: ${e.message}`);
}

async function slugUnico(tabla: "productos" | "colecciones", base: string, id?: number) {
  const r = await clienteAdmin().from(tabla).select("id, slug");
  const existentes = exito(r, "No se pudo verificar el slug") as { id: number; slug: string }[];
  const raiz = crearSlug(base) || "item";
  let slug = raiz;
  let n = 2;
  while (existentes.some((e) => e.slug === slug && e.id !== id)) slug = `${raiz}-${n++}`;
  return slug;
}

async function existe(tabla: string, id: number, nombre: string): Promise<void> {
  const r = await clienteAdmin().from(tabla).select("id").eq("id", id).maybeSingle();
  fallo(r.error, `No se pudo cargar ${nombre}`);
  if (!r.data) throw new Error(`${nombre} no encontrado`);
}

async function cambiarBandera(
  tabla: string,
  id: number,
  campo: "activo" | "activa",
  valor: boolean,
  nombre: string,
): Promise<void> {
  await existe(tabla, id, nombre);
  const r = await clienteAdmin().from(tabla).update({ [campo]: valor }).eq("id", id);
  fallo(r.error, `No se pudo actualizar ${nombre}`);
}

async function contar(consulta: PromiseLike<{ count: number | null; error: Error_ }>) {
  const r = await consulta;
  fallo(r.error, "No se pudo calcular el resumen");
  return r.count ?? 0;
}

export async function resumenPanel(): Promise<ResumenPanel> {
  await connection();
  const db = clienteAdmin();
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const [pendientes, agotados, activos, rv, ru] = await Promise.all([
    contar(
      db.from("pedidos").select("id", { count: "exact", head: true }).eq("estado", "pendiente_pago"),
    ),
    contar(
      db
        .from("productos")
        .select("id", { count: "exact", head: true })
        .eq("activo", true)
        .eq("agotado", true),
    ),
    contar(db.from("productos").select("id", { count: "exact", head: true }).eq("activo", true)),
    db
      .from("pedidos")
      .select("total, pagado_en, creado_en")
      .in("estado", ["pagado", "enviado", "entregado"]),
    db
      .from("pedidos")
      .select(SELECT_PEDIDO)
      .order("creado_en", { ascending: false })
      .limit(5),
  ]);
  const ventasMes = exito(rv, "No se pudo calcular el resumen")
    .filter((p) => new Date(p.pagado_en ?? p.creado_en) >= inicioMes)
    .reduce((s, p) => s + p.total, 0);
  return {
    pedidosPendientes: pendientes,
    ventasMes,
    productosAgotados: agotados,
    productosActivos: activos,
    ultimosPedidos: exito(ru, "No se pudo calcular el resumen").map(aPedido),
  };
}

export async function listarProductos(): Promise<Producto[]> {
  await connection();
  const r = await clienteAdmin()
    .from("productos")
    .select(SELECT_PRODUCTO)
    .order("orden", { ascending: true });
  return exito(r, "No se pudieron cargar los productos").map(aProducto);
}

export async function obtenerProducto(id: number): Promise<Producto | null> {
  await connection();
  const r = await clienteAdmin().from("productos").select(SELECT_PRODUCTO).eq("id", id).maybeSingle();
  fallo(r.error, "No se pudo cargar el producto");
  return r.data ? aProducto(r.data) : null;
}

export async function guardarProducto(
  datos: Omit<Producto, "id" | "slug" | "creadoEn"> & { id?: number },
): Promise<Producto> {
  const db = clienteAdmin();
  const slug = await slugUnico("productos", datos.nombre, datos.id);
  const fila = {
    slug,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    categoria: datos.categoria,
    coleccion_id: datos.coleccionId,
    imagen_url: datos.imagen,
    agotado: datos.agotado,
    activo: datos.activo,
    orden: datos.orden,
  };
  let id: number;
  if (datos.id === undefined) {
    const r = await db.from("productos").insert(fila).select("id").single();
    id = exito(r, "No se pudo guardar el producto").id;
  } else {
    await existe("productos", datos.id, "Producto");
    id = datos.id;
    const r = await db.from("productos").update(fila).eq("id", id);
    fallo(r.error, "No se pudo guardar el producto");
  }

  fallo((await db.from("producto_tallas").delete().eq("producto_id", id)).error, "No se pudieron guardar las tallas");
  if (datos.tallas.length > 0) {
    const r = await db.from("producto_tallas").insert(
      datos.tallas.map((t) => ({
        producto_id: id,
        talla_id: t.tallaId,
        agotado: t.agotado,
        stock: t.stock,
      })),
    );
    fallo(r.error, "No se pudieron guardar las tallas");
  }

  fallo((await db.from("producto_medios").delete().eq("producto_id", id)).error, "No se pudieron guardar los medios");
  if (datos.medios.length > 0) {
    const r = await db.from("producto_medios").insert(
      datos.medios.map((m) => ({
        producto_id: id,
        tipo: m.tipo,
        url: m.url,
        alt: m.alt,
        orden: m.orden,
      })),
    );
    fallo(r.error, "No se pudieron guardar los medios");
  }

  const guardado = await obtenerProducto(id);
  if (!guardado) throw new Error("Producto no encontrado");
  return guardado;
}

export async function cambiarActivoProducto(id: number, activo: boolean): Promise<void> {
  await cambiarBandera("productos", id, "activo", activo, "Producto");
}

export async function listarColecciones(): Promise<Coleccion[]> {
  await connection();
  const r = await clienteAdmin().from("colecciones").select("*").order("orden", { ascending: true });
  return exito(r, "No se pudieron cargar las colecciones").map(aColeccion);
}

export async function obtenerColeccion(id: number): Promise<Coleccion | null> {
  await connection();
  const r = await clienteAdmin().from("colecciones").select("*").eq("id", id).maybeSingle();
  fallo(r.error, "No se pudo cargar la colección");
  return r.data ? aColeccion(r.data) : null;
}

export async function guardarColeccion(
  datos: Omit<Coleccion, "id" | "slug"> & { id?: number },
): Promise<Coleccion> {
  const db = clienteAdmin();
  if (datos.id !== undefined) await existe("colecciones", datos.id, "Colección");
  const slug = await slugUnico("colecciones", datos.nombre, datos.id);
  if (datos.destacada) {
    fallo(
      (await db.from("colecciones").update({ destacada: false }).eq("destacada", true)).error,
      "No se pudo destacar la colección",
    );
  }
  const fila = {
    slug,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    temporada: datos.temporada,
    imagen_url: datos.imagen,
    activa: datos.activa,
    destacada: datos.destacada,
    orden: datos.orden,
  };
  const r =
    datos.id === undefined
      ? await db.from("colecciones").insert(fila).select("*").single()
      : await db.from("colecciones").update(fila).eq("id", datos.id).select("*").single();
  return aColeccion(exito(r, "No se pudo guardar la colección"));
}

export async function cambiarActivaColeccion(id: number, activa: boolean): Promise<void> {
  await cambiarBandera("colecciones", id, "activa", activa, "Colección");
}

export async function destacarColeccion(id: number): Promise<void> {
  const db = clienteAdmin();
  await existe("colecciones", id, "Colección");
  fallo(
    (await db.from("colecciones").update({ destacada: false }).eq("destacada", true)).error,
    "No se pudo destacar la colección",
  );
  fallo(
    (await db.from("colecciones").update({ destacada: true }).eq("id", id)).error,
    "No se pudo destacar la colección",
  );
}

export async function listarTallas(): Promise<Talla[]> {
  await connection();
  const r = await clienteAdmin().from("tallas").select("*").order("orden", { ascending: true });
  return exito(r, "No se pudieron cargar las tallas") as Talla[];
}

export async function guardarTalla(datos: {
  id?: number;
  nombre: string;
  orden: number;
  activa: boolean;
}): Promise<Talla> {
  const db = clienteAdmin();
  const fila = { nombre: datos.nombre, orden: datos.orden, activa: datos.activa };
  if (datos.id !== undefined) await existe("tallas", datos.id, "Talla");
  const r =
    datos.id === undefined
      ? await db.from("tallas").insert(fila).select("*").single()
      : await db.from("tallas").update(fila).eq("id", datos.id).select("*").single();
  return exito(r, "No se pudo guardar la talla") as Talla;
}

export async function cambiarActivaTalla(id: number, activa: boolean): Promise<void> {
  await cambiarBandera("tallas", id, "activa", activa, "Talla");
}

export async function listarSlides(): Promise<SlideCarrusel[]> {
  await connection();
  const r = await clienteAdmin()
    .from("carrusel_slides")
    .select("*")
    .order("orden", { ascending: true });
  return exito(r, "No se pudieron cargar los slides").map(aSlide);
}

export async function guardarSlide(
  datos: Omit<SlideCarrusel, "id"> & { id?: number },
): Promise<SlideCarrusel> {
  const db = clienteAdmin();
  const fila = {
    tipo: datos.tipo,
    url: datos.url,
    url_movil: datos.urlMovil,
    titulo: datos.titulo,
    subtitulo: datos.subtitulo,
    texto_boton: datos.textoBoton,
    enlace: datos.enlace,
    orden: datos.orden,
    activo: datos.activo,
  };
  if (datos.id !== undefined) await existe("carrusel_slides", datos.id, "Slide");
  const r =
    datos.id === undefined
      ? await db.from("carrusel_slides").insert(fila).select("*").single()
      : await db.from("carrusel_slides").update(fila).eq("id", datos.id).select("*").single();
  return aSlide(exito(r, "No se pudo guardar el slide"));
}

export async function cambiarActivoSlide(id: number, activo: boolean): Promise<void> {
  await cambiarBandera("carrusel_slides", id, "activo", activo, "Slide");
}

export async function moverSlide(id: number, direccion: "arriba" | "abajo"): Promise<void> {
  const db = clienteAdmin();
  const r = await db.from("carrusel_slides").select("id, orden").order("orden", { ascending: true });
  const ordenados = exito(r, "No se pudieron cargar los slides") as { id: number; orden: number }[];
  const i = ordenados.findIndex((s) => s.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ordenados.length) return;
  const [a, b] = [ordenados[i], ordenados[j]];
  fallo((await db.from("carrusel_slides").update({ orden: b.orden }).eq("id", a.id)).error, "No se pudo mover el slide");
  fallo((await db.from("carrusel_slides").update({ orden: a.orden }).eq("id", b.id)).error, "No se pudo mover el slide");
}

export async function guardarGuiaTallas(g: GuiaTallas): Promise<void> {
  const r = await clienteAdmin()
    .from("guia_tallas")
    .upsert({ id: 1, titulo: g.titulo, columnas: g.columnas, filas: g.filas, notas: g.notas });
  fallo(r.error, "No se pudo guardar la guía de tallas");
}

export async function guardarConfiguracion(c: Configuracion): Promise<void> {
  const r = await clienteAdmin().from("configuracion").upsert({
    id: 1,
    costo_envio: c.costoEnvio,
    envio_gratis_desde: c.envioGratisDesde,
    whatsapp: c.whatsapp,
    correo_notificaciones: c.correoNotificaciones,
    modo_inventario: c.modoInventario,
    texto_anuncio: c.textoAnuncio,
    pagos_en_linea: c.pagosEnLinea,
  });
  fallo(r.error, "No se pudo guardar la configuración");
}

export async function listarDescuentos(): Promise<Descuento[]> {
  await connection();
  const r = await clienteAdmin().from("descuentos").select(SELECT_DESCUENTO).order("id");
  return exito(r, "No se pudieron cargar los descuentos").map(aDescuento);
}

export async function guardarDescuento(
  datos: Omit<Descuento, "id"> & { id?: number },
): Promise<Descuento> {
  const db = clienteAdmin();
  const fila = {
    nombre: datos.nombre,
    porcentaje: datos.porcentaje,
    fecha_vencimiento: datos.fechaVencimiento,
    activo: datos.activo,
  };
  let id: number;
  if (datos.id === undefined) {
    const r = await db.from("descuentos").insert(fila).select("id").single();
    id = exito(r, "No se pudo guardar el descuento").id;
  } else {
    await existe("descuentos", datos.id, "Descuento");
    id = datos.id;
    fallo((await db.from("descuentos").update(fila).eq("id", id)).error, "No se pudo guardar el descuento");
  }
  fallo((await db.from("descuento_productos").delete().eq("descuento_id", id)).error, "No se pudo guardar el descuento");
  fallo((await db.from("descuento_colecciones").delete().eq("descuento_id", id)).error, "No se pudo guardar el descuento");
  if (datos.productoIds.length > 0) {
    const r = await db
      .from("descuento_productos")
      .insert(datos.productoIds.map((producto_id) => ({ descuento_id: id, producto_id })));
    fallo(r.error, "No se pudo guardar el descuento");
  }
  if (datos.coleccionIds.length > 0) {
    const r = await db
      .from("descuento_colecciones")
      .insert(datos.coleccionIds.map((coleccion_id) => ({ descuento_id: id, coleccion_id })));
    fallo(r.error, "No se pudo guardar el descuento");
  }
  const r = await db.from("descuentos").select(SELECT_DESCUENTO).eq("id", id).single();
  return aDescuento(exito(r, "No se pudo guardar el descuento"));
}

export async function cambiarActivoDescuento(id: number, activo: boolean): Promise<void> {
  await cambiarBandera("descuentos", id, "activo", activo, "Descuento");
}

export async function listarCodigos(): Promise<CodigoPromo[]> {
  await connection();
  const r = await clienteAdmin().from("codigos_promo").select("*").order("id");
  return exito(r, "No se pudieron cargar los códigos").map(aCodigo);
}

export async function guardarCodigo(
  datos: Omit<CodigoPromo, "id" | "usos"> & { id?: number },
): Promise<CodigoPromo> {
  const db = clienteAdmin();
  const codigo = datos.codigo.trim().toUpperCase();
  if (!codigo) throw new Error("El código es obligatorio");
  const rd = await db.from("codigos_promo").select("id").eq("codigo", codigo).maybeSingle();
  fallo(rd.error, "No se pudo verificar el código");
  if (rd.data && rd.data.id !== datos.id) throw new Error("Ya existe un código con ese nombre");
  if (datos.id !== undefined) await existe("codigos_promo", datos.id, "Código");
  const fila = {
    codigo,
    porcentaje: datos.porcentaje,
    fecha_vencimiento: datos.fechaVencimiento,
    usos_maximos: datos.usosMaximos,
    monto_minimo: datos.montoMinimo,
    activo: datos.activo,
  };
  const r =
    datos.id === undefined
      ? await db.from("codigos_promo").insert(fila).select("*").single()
      : await db.from("codigos_promo").update(fila).eq("id", datos.id).select("*").single();
  return aCodigo(exito(r, "No se pudo guardar el código"));
}

export async function cambiarActivoCodigo(id: number, activo: boolean): Promise<void> {
  await cambiarBandera("codigos_promo", id, "activo", activo, "Código");
}

export async function listarPedidos(estado?: EstadoPedido): Promise<Pedido[]> {
  await connection();
  let consulta = clienteAdmin().from("pedidos").select(SELECT_PEDIDO);
  if (estado) consulta = consulta.eq("estado", estado);
  const r = await consulta.order("creado_en", { ascending: false });
  return exito(r, "No se pudieron cargar los pedidos").map(aPedido);
}

export async function obtenerPedido(id: number): Promise<Pedido | null> {
  await connection();
  const r = await clienteAdmin().from("pedidos").select(SELECT_PEDIDO).eq("id", id).maybeSingle();
  fallo(r.error, "No se pudo cargar el pedido");
  return r.data ? aPedido(r.data) : null;
}

export async function cambiarEstadoPedido(id: number, estado: EstadoPedido): Promise<void> {
  const db = clienteAdmin();
  const r = await db.from("pedidos").select("estado, pagado_en").eq("id", id).maybeSingle();
  fallo(r.error, "No se pudo cargar el pedido");
  if (!r.data) throw new Error("Pedido no encontrado");
  if (!TRANSICIONES[r.data.estado as EstadoPedido].includes(estado)) {
    throw new Error("Ese cambio de estado no es válido para el pedido");
  }
  const cambios: Record<string, string> = { estado };
  if (estado === "pagado" && !r.data.pagado_en) cambios.pagado_en = new Date().toISOString();
  fallo(
    (await db.from("pedidos").update(cambios).eq("id", id).eq("estado", r.data.estado)).error,
    "No se pudo actualizar el pedido",
  );
}
