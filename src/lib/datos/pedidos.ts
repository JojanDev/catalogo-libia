import "server-only";
import { randomInt } from "node:crypto";
import { connection } from "next/server";
import { almacen, siguienteId } from "@/lib/mock/almacen";
import { formatearPrecio } from "@/lib/formato";
import { cotizar, evaluarCodigo } from "@/lib/pedidos/cotizar";
import type { DatosCliente, DatosEnvio, EntradaItem, MetodoPago, Pedido } from "@/types";

const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function nuevaReferencia(): string {
  const existentes = almacen().pedidos;
  for (;;) {
    let sufijo = "";
    for (let i = 0; i < 8; i++) sufijo += CARACTERES[randomInt(CARACTERES.length)];
    const ref = `TNR-${sufijo}`;
    if (!existentes.some((p) => p.referencia === ref)) return ref;
  }
}

export async function validarCodigo(
  codigo: string,
  subtotal: number,
): Promise<{ valido: boolean; porcentaje: number; mensaje: string }> {
  await connection();
  const r = evaluarCodigo(codigo, subtotal);
  if (!r.codigo) return { valido: false, porcentaje: 0, mensaje: r.mensaje };
  return {
    valido: true,
    porcentaje: r.codigo.porcentaje,
    mensaje: `Código ${r.codigo.codigo} aplicado: ${r.codigo.porcentaje}% de descuento`,
  };
}

export async function crearPedido(entrada: {
  items: EntradaItem[];
  codigo: string | null;
  cliente: DatosCliente;
  envio: DatosEnvio;
  metodoPago: MetodoPago;
}): Promise<{ referencia: string; siguiente: string }> {
  const a = almacen();
  const cot = await cotizar(entrada.items, entrada.codigo);
  if (cot.errores.length > 0 || cot.items.length === 0) {
    throw new Error(cot.errores[0] ?? "El carrito está vacío");
  }

  const bruto = cot.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  const referencia = nuevaReferencia();
  const pedido: Pedido = {
    id: siguienteId(a.pedidos),
    referencia,
    estado: "pendiente_pago",
    metodoPago: entrada.metodoPago,
    cliente: { ...entrada.cliente },
    envio: { ...entrada.envio },
    items: cot.items,
    subtotal: bruto,
    descuentoTotal: bruto - cot.subtotal + cot.descuentoCodigo,
    codigoPromo: cot.codigoAplicado,
    costoEnvio: cot.costoEnvio,
    total: cot.total,
    creadoEn: new Date().toISOString(),
    pagadoEn: null,
  };
  a.pedidos.push(pedido);

  console.log(
    `[correo simulado] Nuevo pedido ${referencia} para ${a.configuracion.correoNotificaciones}: ${pedido.cliente.nombre}, total ${formatearPrecio(pedido.total)}`,
  );

  if (entrada.metodoPago === "wompi") {
    return { referencia, siguiente: `/pago-simulado/${referencia}` };
  }

  const prendas = pedido.items
    .map((i) => `- ${i.nombre} (talla ${i.talla}) x${i.cantidad}`)
    .join("\n");
  const texto = `Hola Tonorosa, quiero confirmar mi pedido ${referencia}:\n${prendas}\nTotal: ${formatearPrecio(pedido.total)}`;
  return {
    referencia,
    siguiente: `https://wa.me/${a.configuracion.whatsapp}?text=${encodeURIComponent(texto)}`,
  };
}

export async function confirmarPagoSimulado(referencia: string, aprobado: boolean): Promise<void> {
  const a = almacen();
  const pedido = a.pedidos.find((p) => p.referencia === referencia);
  if (!pedido || pedido.estado !== "pendiente_pago") return;
  if (!aprobado) {
    pedido.estado = "cancelado";
    return;
  }
  pedido.estado = "pagado";
  pedido.pagadoEn = new Date().toISOString();
  const codigo = a.codigos.find((c) => c.codigo === pedido.codigoPromo);
  if (codigo) codigo.usos += 1;
  console.log(
    `[correo simulado] Confirmación de pago del pedido ${referencia} enviada a ${pedido.cliente.email}`,
  );
}
