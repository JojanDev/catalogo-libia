import "server-only";
import { connection } from "next/server";
import { almacen, copia, siguienteId } from "@/lib/mock/almacen";
import { crearSlug } from "@/lib/slug";
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

function slugUnico(base: string, existentes: { id: number; slug: string }[], id?: number): string {
  const raiz = crearSlug(base) || "item";
  let slug = raiz;
  let n = 2;
  while (existentes.some((e) => e.slug === slug && e.id !== id)) slug = `${raiz}-${n++}`;
  return slug;
}

function buscar<T extends { id: number }>(lista: T[], id: number, nombre: string): T {
  const x = lista.find((e) => e.id === id);
  if (!x) throw new Error(`${nombre} no encontrado`);
  return x;
}

export async function resumenPanel(): Promise<ResumenPanel> {
  await connection();
  const a = almacen();
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const ventasMes = a.pedidos
    .filter(
      (p) =>
        ["pagado", "enviado", "entregado"].includes(p.estado) &&
        new Date(p.pagadoEn ?? p.creadoEn) >= inicioMes,
    )
    .reduce((s, p) => s + p.total, 0);
  return {
    pedidosPendientes: a.pedidos.filter((p) => p.estado === "pendiente_pago").length,
    ventasMes,
    productosAgotados: a.productos.filter((p) => p.activo && p.agotado).length,
    productosActivos: a.productos.filter((p) => p.activo).length,
    ultimosPedidos: copia(
      [...a.pedidos].sort((x, y) => y.creadoEn.localeCompare(x.creadoEn)).slice(0, 5),
    ),
  };
}

export async function listarProductos(): Promise<Producto[]> {
  await connection();
  return copia([...almacen().productos].sort((a, b) => a.orden - b.orden));
}

export async function obtenerProducto(id: number): Promise<Producto | null> {
  await connection();
  const p = almacen().productos.find((x) => x.id === id);
  return p ? copia(p) : null;
}

export async function guardarProducto(
  datos: Omit<Producto, "id" | "slug" | "creadoEn"> & { id?: number },
): Promise<Producto> {
  const lista = almacen().productos;
  const slug = slugUnico(datos.nombre, lista, datos.id);
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Producto");
  const guardado: Producto = copia({
    ...datos,
    id: existente?.id ?? siguienteId(lista),
    slug,
    creadoEn: existente?.creadoEn ?? new Date().toISOString(),
  });
  if (existente) lista[lista.indexOf(existente)] = guardado;
  else lista.push(guardado);
  return copia(guardado);
}

export async function cambiarActivoProducto(id: number, activo: boolean): Promise<void> {
  buscar(almacen().productos, id, "Producto").activo = activo;
}

export async function listarColecciones(): Promise<Coleccion[]> {
  await connection();
  return copia([...almacen().colecciones].sort((a, b) => a.orden - b.orden));
}

export async function obtenerColeccion(id: number): Promise<Coleccion | null> {
  await connection();
  const c = almacen().colecciones.find((x) => x.id === id);
  return c ? copia(c) : null;
}

export async function guardarColeccion(
  datos: Omit<Coleccion, "id" | "slug"> & { id?: number },
): Promise<Coleccion> {
  const lista = almacen().colecciones;
  const slug = slugUnico(datos.nombre, lista, datos.id);
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Colección");
  const guardada: Coleccion = copia({ ...datos, id: existente?.id ?? siguienteId(lista), slug });
  if (guardada.destacada) lista.forEach((c) => (c.destacada = false));
  if (existente) lista[lista.indexOf(existente)] = guardada;
  else lista.push(guardada);
  return copia(guardada);
}

export async function cambiarActivaColeccion(id: number, activa: boolean): Promise<void> {
  buscar(almacen().colecciones, id, "Colección").activa = activa;
}

export async function destacarColeccion(id: number): Promise<void> {
  const lista = almacen().colecciones;
  buscar(lista, id, "Colección");
  lista.forEach((c) => (c.destacada = c.id === id));
}

export async function listarTallas(): Promise<Talla[]> {
  await connection();
  return copia([...almacen().tallas].sort((a, b) => a.orden - b.orden));
}

export async function guardarTalla(datos: {
  id?: number;
  nombre: string;
  orden: number;
  activa: boolean;
}): Promise<Talla> {
  const lista = almacen().tallas;
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Talla");
  const guardada: Talla = { ...datos, id: existente?.id ?? siguienteId(lista) };
  if (existente) lista[lista.indexOf(existente)] = guardada;
  else lista.push(guardada);
  return { ...guardada };
}

export async function cambiarActivaTalla(id: number, activa: boolean): Promise<void> {
  buscar(almacen().tallas, id, "Talla").activa = activa;
}

export async function listarSlides(): Promise<SlideCarrusel[]> {
  await connection();
  return copia([...almacen().slides].sort((a, b) => a.orden - b.orden));
}

export async function guardarSlide(
  datos: Omit<SlideCarrusel, "id"> & { id?: number },
): Promise<SlideCarrusel> {
  const lista = almacen().slides;
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Slide");
  const guardado: SlideCarrusel = copia({ ...datos, id: existente?.id ?? siguienteId(lista) });
  if (existente) lista[lista.indexOf(existente)] = guardado;
  else lista.push(guardado);
  return copia(guardado);
}

export async function cambiarActivoSlide(id: number, activo: boolean): Promise<void> {
  buscar(almacen().slides, id, "Slide").activo = activo;
}

export async function moverSlide(id: number, direccion: "arriba" | "abajo"): Promise<void> {
  const ordenados = [...almacen().slides].sort((a, b) => a.orden - b.orden);
  const i = ordenados.findIndex((s) => s.id === id);
  const j = direccion === "arriba" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ordenados.length) return;
  const orden = ordenados[i].orden;
  ordenados[i].orden = ordenados[j].orden;
  ordenados[j].orden = orden;
}

export async function guardarGuiaTallas(g: GuiaTallas): Promise<void> {
  almacen().guiaTallas = copia(g);
}

export async function guardarConfiguracion(c: Configuracion): Promise<void> {
  almacen().configuracion = copia(c);
}

export async function listarDescuentos(): Promise<Descuento[]> {
  await connection();
  return copia(almacen().descuentos);
}

export async function guardarDescuento(
  datos: Omit<Descuento, "id"> & { id?: number },
): Promise<Descuento> {
  const lista = almacen().descuentos;
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Descuento");
  const guardado: Descuento = copia({ ...datos, id: existente?.id ?? siguienteId(lista) });
  if (existente) lista[lista.indexOf(existente)] = guardado;
  else lista.push(guardado);
  return copia(guardado);
}

export async function cambiarActivoDescuento(id: number, activo: boolean): Promise<void> {
  buscar(almacen().descuentos, id, "Descuento").activo = activo;
}

export async function listarCodigos(): Promise<CodigoPromo[]> {
  await connection();
  return copia(almacen().codigos);
}

export async function guardarCodigo(
  datos: Omit<CodigoPromo, "id" | "usos"> & { id?: number },
): Promise<CodigoPromo> {
  const lista = almacen().codigos;
  const codigo = datos.codigo.trim().toUpperCase();
  if (!codigo) throw new Error("El código es obligatorio");
  if (lista.some((c) => c.codigo === codigo && c.id !== datos.id)) {
    throw new Error("Ya existe un código con ese nombre");
  }
  const existente = datos.id === undefined ? undefined : buscar(lista, datos.id, "Código");
  const guardado: CodigoPromo = {
    ...datos,
    codigo,
    id: existente?.id ?? siguienteId(lista),
    usos: existente?.usos ?? 0,
  };
  if (existente) lista[lista.indexOf(existente)] = guardado;
  else lista.push(guardado);
  return { ...guardado };
}

export async function cambiarActivoCodigo(id: number, activo: boolean): Promise<void> {
  buscar(almacen().codigos, id, "Código").activo = activo;
}

export async function listarPedidos(estado?: EstadoPedido): Promise<Pedido[]> {
  await connection();
  return copia(
    almacen()
      .pedidos.filter((p) => !estado || p.estado === estado)
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)),
  );
}

export async function obtenerPedido(id: number): Promise<Pedido | null> {
  await connection();
  const p = almacen().pedidos.find((x) => x.id === id);
  return p ? copia(p) : null;
}

export async function cambiarEstadoPedido(id: number, estado: EstadoPedido): Promise<void> {
  const pedido = buscar(almacen().pedidos, id, "Pedido");
  if (!TRANSICIONES[pedido.estado].includes(estado)) {
    throw new Error("Ese cambio de estado no es válido para el pedido");
  }
  pedido.estado = estado;
  if (estado === "pagado" && !pedido.pagadoEn) pedido.pagadoEn = new Date().toISOString();
}
