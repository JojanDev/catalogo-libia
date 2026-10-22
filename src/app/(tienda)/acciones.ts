"use server";

import { redirect } from "next/navigation";
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

export async function cotizarAccion(
  items: EntradaItem[],
  codigo: string | null,
): Promise<Cotizacion> {
  return cotizar(Array.isArray(items) ? items : [], codigo);
}

export async function crearPedidoAccion(
  entrada: EntradaPedido,
): Promise<{ ok: true; siguiente: string } | { ok: false; error: string }> {
  const c = entrada?.cliente;
  const e = entrada?.envio;
  if (!c || !e) return { ok: false, error: "Faltan datos del pedido" };
  const obligatorios = [c.nombre, c.telefono, c.email, e.departamento, e.ciudad, e.direccion];
  if (obligatorios.some((v) => !v || !String(v).trim())) {
    return { ok: false, error: "Completa todos los campos obligatorios" };
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
