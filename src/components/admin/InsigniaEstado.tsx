import { Insignia } from "@/components/ui/Insignia";
import type { EstadoPedido } from "@/types";

export const ESTADOS_PEDIDO: Record<
  EstadoPedido,
  { variante: "aviso" | "exito" | "info" | "error"; texto: string }
> = {
  pendiente_pago: { variante: "aviso", texto: "Pendiente de pago" },
  pagado: { variante: "exito", texto: "Pagado" },
  enviado: { variante: "info", texto: "Enviado" },
  entregado: { variante: "exito", texto: "Entregado" },
  cancelado: { variante: "error", texto: "Cancelado" },
};

export function InsigniaEstado({ estado }: { estado: EstadoPedido }) {
  const { variante, texto } = ESTADOS_PEDIDO[estado];
  return <Insignia variante={variante}>{texto}</Insignia>;
}
