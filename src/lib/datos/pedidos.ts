import "server-only";
import { randomInt } from "node:crypto";
import { connection } from "next/server";
import { exito } from "@/lib/datos/mapeo";
import { formatearPrecio } from "@/lib/formato";
import { cotizar, evaluarCodigo } from "@/lib/pedidos/cotizar";
import { clienteAdmin } from "@/lib/supabase/admin";
import type { DatosCliente, DatosEnvio, EntradaItem, MetodoPago } from "@/types";

const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function nuevaReferencia(): string {
  let sufijo = "";
  for (let i = 0; i < 8; i++) sufijo += CARACTERES[randomInt(CARACTERES.length)];
  return `TNR-${sufijo}`;
}

export async function validarCodigo(
  codigo: string,
  subtotal: number,
): Promise<{ valido: boolean; porcentaje: number; mensaje: string }> {
  await connection();
  const r = await evaluarCodigo(codigo, subtotal);
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
  const db = clienteAdmin();
  const cot = await cotizar(entrada.items, entrada.codigo);
  if (cot.errores.length > 0 || cot.items.length === 0) {
    throw new Error(cot.errores[0] ?? "El carrito está vacío");
  }

  const bruto = cot.items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  let referencia = "";
  let pedidoId = 0;
  for (let intento = 0; intento < 5 && pedidoId === 0; intento++) {
    referencia = nuevaReferencia();
    const r = await db
      .from("pedidos")
      .insert({
        referencia,
        estado: "pendiente_pago",
        metodo_pago: entrada.metodoPago,
        cliente_nombre: entrada.cliente.nombre,
        cliente_telefono: entrada.cliente.telefono,
        cliente_email: entrada.cliente.email,
        envio_departamento: entrada.envio.departamento,
        envio_ciudad: entrada.envio.ciudad,
        envio_direccion: entrada.envio.direccion,
        envio_barrio: entrada.envio.barrio,
        envio_notas: entrada.envio.notas,
        subtotal: bruto,
        descuento_total: bruto - cot.subtotal + cot.descuentoCodigo,
        codigo_promo: cot.codigoAplicado,
        costo_envio: cot.costoEnvio,
        total: cot.total,
      })
      .select("id")
      .single();
    if (r.error && r.error.code !== "23505") {
      throw new Error(`No se pudo crear el pedido: ${r.error.message}`);
    }
    if (r.data) pedidoId = r.data.id;
  }
  if (pedidoId === 0) throw new Error("No se pudo generar la referencia del pedido");

  const ri = await db.from("pedido_items").insert(
    cot.items.map((i) => ({
      pedido_id: pedidoId,
      producto_id: i.productoId,
      slug: i.slug,
      nombre: i.nombre,
      imagen: i.imagen,
      talla: i.talla,
      cantidad: i.cantidad,
      precio_unitario: i.precioUnitario,
      descuento_porcentaje: i.descuentoPorcentaje,
      subtotal: i.subtotal,
    })),
  );
  if (ri.error) {
    await db.from("pedidos").delete().eq("id", pedidoId);
    throw new Error(`No se pudo crear el pedido: ${ri.error.message}`);
  }

  const rc = await db.from("configuracion").select("whatsapp").limit(1).single();
  const whatsapp = exito(rc, "No se pudo cargar la configuración").whatsapp;

  if (entrada.metodoPago === "wompi") {
    return { referencia, siguiente: `/pago-simulado/${referencia}` };
  }

  const prendas = cot.items
    .map((i) => `- ${i.nombre} (talla ${i.talla}) x${i.cantidad}`)
    .join("\n");
  const texto = `Hola Tonorosa, quiero confirmar mi pedido ${referencia}:\n${prendas}\nTotal: ${formatearPrecio(cot.total)}`;
  return {
    referencia,
    siguiente: `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`,
  };
}

export async function confirmarPagoSimulado(referencia: string, aprobado: boolean): Promise<void> {
  const db = clienteAdmin();
  const r = await db
    .from("pedidos")
    .select("id, estado, codigo_promo")
    .eq("referencia", referencia)
    .maybeSingle();
  if (r.error) throw new Error(`No se pudo cargar el pedido: ${r.error.message}`);
  const pedido = r.data;
  if (!pedido || pedido.estado !== "pendiente_pago") return;

  if (!aprobado) {
    await db
      .from("pedidos")
      .update({ estado: "cancelado" })
      .eq("id", pedido.id)
      .eq("estado", "pendiente_pago");
    return;
  }

  const ru = await db
    .from("pedidos")
    .update({ estado: "pagado", pagado_en: new Date().toISOString() })
    .eq("id", pedido.id)
    .eq("estado", "pendiente_pago")
    .select("id");
  if (ru.error) throw new Error(`No se pudo confirmar el pago: ${ru.error.message}`);
  if (!ru.data || ru.data.length === 0 || !pedido.codigo_promo) return;

  const rc = await db
    .from("codigos_promo")
    .select("id, usos")
    .eq("codigo", pedido.codigo_promo)
    .maybeSingle();
  if (rc.data) await db.from("codigos_promo").update({ usos: rc.data.usos + 1 }).eq("id", rc.data.id);
}
