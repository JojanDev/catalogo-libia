"use server";

import { redirect } from "next/navigation";
import { obtenerConfiguracion } from "@/lib/datos/tienda";
import { confirmarPagoSimulado, crearPedido, validarCodigo } from "@/lib/datos/pedidos";
import { cotizar } from "@/lib/pedidos/cotizar";
import type {
  Cotizacion,
  DatosCliente,
  DatosEnvio,
  EntradaItem,
  MetodoPago,
} from "@/types";

type EntradaPedido = {
  items: EntradaItem[];
  codigo: string | null;
  cliente: DatosCliente;
  envio: DatosEnvio;
  metodoPago: MetodoPago;
};

export async function validarCodigoAccion(codigo: string, subtotal: number) {
  return validarCodigo(String(codigo ?? ""), Number(subtotal) || 0);
}

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function itemsValidos(items: unknown): items is EntradaItem[] {
  return (
    Array.isArray(items) &&
    items.length >= 1 &&
    items.length <= 30 &&
    items.every(
      (i) =>
        esObjeto(i) &&
        Number.isInteger(i.productoId) &&
        (i.productoId as number) > 0 &&
        typeof i.talla === "string" &&
        i.talla.trim() !== "" &&
        Number.isInteger(i.cantidad) &&
        (i.cantidad as number) >= 1 &&
        (i.cantidad as number) <= 10,
    )
  );
}

const cadena = (v: unknown, max: number) => typeof v === "string" && v.length <= max;

export async function cotizarAccion(
  items: EntradaItem[],
  codigo: string | null,
): Promise<Cotizacion> {
  const valido = itemsValidos(items);
  return cotizar(valido ? items : [], valido && typeof codigo === "string" ? codigo : null);
}

export async function crearPedidoAccion(
  entrada: EntradaPedido,
): Promise<{ ok: true; siguiente: string } | { ok: false; error: string }> {
  if (!esObjeto(entrada)) return { ok: false, error: "Faltan datos del pedido" };
  if (!itemsValidos(entrada.items)) return { ok: false, error: "El carrito no es válido" };
  if (entrada.codigo !== null && typeof entrada.codigo !== "string") {
    return { ok: false, error: "El código no es válido" };
  }
  const c = entrada.cliente;
  const e = entrada.envio;
  if (!esObjeto(c) || !esObjeto(e)) return { ok: false, error: "Faltan datos del pedido" };
  const obligatorios = [c.nombre, c.telefono, c.email, e.departamento, e.ciudad, e.direccion];
  if (obligatorios.some((v) => typeof v !== "string" || !v.trim())) {
    return { ok: false, error: "Completa todos los campos obligatorios" };
  }
  if (
    !cadena(c.nombre, 100) ||
    !cadena(c.email, 100) ||
    !cadena(c.telefono, 30) ||
    !cadena(e.departamento, 100) ||
    !cadena(e.ciudad, 100) ||
    !cadena(e.direccion, 200) ||
    !(e.barrio === undefined || cadena(e.barrio, 100)) ||
    !(e.notas === undefined || cadena(e.notas, 500))
  ) {
    return { ok: false, error: "Algún campo supera la longitud permitida" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) {
    return { ok: false, error: "El correo electrónico no es válido" };
  }
  if (!/^\d{10}$/.test(c.telefono.replace(/[\s-]/g, ""))) {
    return { ok: false, error: "El teléfono debe tener 10 dígitos" };
  }
  if (entrada.metodoPago !== "wompi" && entrada.metodoPago !== "whatsapp") {
    return { ok: false, error: "Método de pago no válido" };
  }
  if (entrada.metodoPago === "wompi" && !(await obtenerConfiguracion()).pagosEnLinea) {
    return { ok: false, error: "El pago en línea no está disponible" };
  }
  try {
    const r = await crearPedido({
      items: entrada.items,
      codigo: entrada.codigo,
      metodoPago: entrada.metodoPago,
      cliente: {
        nombre: c.nombre.trim(),
        telefono: c.telefono.replace(/[\s-]/g, ""),
        email: c.email.trim(),
      },
      envio: {
        departamento: e.departamento.trim(),
        ciudad: e.ciudad.trim(),
        direccion: e.direccion.trim(),
        barrio: (e.barrio ?? "").trim(),
        notas: (e.notas ?? "").trim(),
      },
    });
    return { ok: true, siguiente: r.siguiente };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "No se pudo crear el pedido" };
  }
}

export async function confirmarPagoAccion(referencia: string, aprobado: boolean): Promise<void> {
  await confirmarPagoSimulado(referencia, aprobado);
  redirect(`/pedido/${referencia}`);
}
