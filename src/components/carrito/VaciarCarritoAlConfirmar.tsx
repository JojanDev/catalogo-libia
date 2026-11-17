"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export const CLAVE_PEDIDO_POR_PAGAR = "tonorosa-pedido-por-pagar";

export function VaciarCarritoAlConfirmar({ referencia }: { referencia: string }) {
  const { hidratado, vaciar } = useCart();

  useEffect(() => {
    if (!hidratado || sessionStorage.getItem(CLAVE_PEDIDO_POR_PAGAR) !== referencia) return;
    sessionStorage.removeItem(CLAVE_PEDIDO_POR_PAGAR);
    vaciar();
  }, [hidratado, referencia, vaciar]);

  return null;
}
