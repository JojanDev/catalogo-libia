import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetallePedido } from "@/components/admin/DetallePedido";
import { obtenerPedido } from "@/lib/datos/admin";

export const metadata: Metadata = { title: "Detalle del pedido" };

export default async function PaginaPedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();
  const pedido = await obtenerPedido(numero);
  if (!pedido) notFound();
  return <DetallePedido pedido={pedido} />;
}
