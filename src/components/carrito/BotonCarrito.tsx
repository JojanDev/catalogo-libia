"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BotonCarrito() {
  const { cantidadTotal, abrir } = useCart();

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={`Abrir carrito, ${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`}
      className="relative flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
    >
      <ShoppingBag className="size-6" aria-hidden="true" />
      {cantidadTotal > 0 && (
        <span className="absolute right-0.5 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-rosa-accion px-1 text-xs font-bold leading-5 text-white">
          {cantidadTotal}
        </span>
      )}
    </button>
  );
}
