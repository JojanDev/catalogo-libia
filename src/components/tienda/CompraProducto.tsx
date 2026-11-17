"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Minus, Plus } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { useCart } from "@/context/CartContext";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

export default function CompraProducto({ producto }: { producto: ProductoVista }) {
  const { agregar, abrir } = useCart();
  const [talla, setTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [errorTalla, setErrorTalla] = useState(false);

  const alAgregar = () => {
    if (!talla) {
      setErrorTalla(true);
      document
        .getElementById("grupo-tallas")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      document
        .querySelector<HTMLButtonElement>("#grupo-tallas button:not([aria-disabled])")
        ?.focus();
      return;
    }
    agregar({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagen,
      talla,
      cantidad,
      precioUnitario: producto.precio,
      precioFinal: producto.precioFinal,
      descuentoPorcentaje: producto.descuentoPorcentaje,
    });
    abrir();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-cafe">
            Talla{talla ? `: ${talla}` : ""}
          </span>
          <Link href="/guia-de-tallas" className="text-sm font-semibold text-rosa-accion underline">
            Guía de tallas
          </Link>
        </div>
        <div
          id="grupo-tallas"
          role="group"
          aria-label="Talla"
          aria-describedby={errorTalla ? "error-talla" : undefined}
          className="flex flex-wrap gap-2"
        >
          {producto.tallas.map((t) => {
            const elegida = talla === t.nombre;
            return (
              <button
                key={t.tallaId}
                type="button"
                aria-pressed={elegida}
                aria-disabled={t.agotado || undefined}
                onClick={() => {
                  if (t.agotado) return;
                  setTalla(t.nombre);
                  setErrorTalla(false);
                }}
                className={`min-h-11 min-w-14 rounded-sm border-2 px-4 text-base font-semibold transition-colors ${
                  t.agotado
                    ? "cursor-not-allowed border-dashed border-borde text-tenue line-through"
                    : elegida
                      ? "border-rosa-accion bg-rosa-accion text-white"
                      : "border-borde bg-surface text-cafe hover:border-rosa-accion"
                }`}
              >
                {t.nombre}
                {t.agotado && <span className="sr-only"> (agotada)</span>}
              </button>
            );
          })}
        </div>
        {errorTalla && (
          <p
            id="error-talla"
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-error"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            Elige una talla para continuar
          </p>
        )}
      </div>

      <div>
        <span className="mb-3 block text-sm font-semibold text-cafe">Cantidad</span>
        <div className="inline-flex items-center rounded-full border border-borde bg-surface">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            disabled={cantidad <= 1}
            onClick={() => setCantidad((c) => c - 1)}
            className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave disabled:text-tenue/50"
          >
            <Minus className="size-5" aria-hidden="true" />
          </button>
          <span className="w-10 text-center text-base font-bold text-cafe" aria-live="polite">
            {cantidad}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            disabled={cantidad >= 10}
            onClick={() => setCantidad((c) => c + 1)}
            className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave disabled:text-tenue/50"
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-borde bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-elevada lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <p className="shrink-0 leading-tight lg:hidden">
          <span
            className={`block text-lg font-bold ${producto.descuentoPorcentaje !== null ? "text-rosa-accion" : "text-cafe"}`}
          >
            {formatearPrecio(producto.precioFinal)}
          </span>
          {producto.descuentoPorcentaje !== null && (
            <span className="block text-sm text-tenue line-through">
              {formatearPrecio(producto.precio)}
            </span>
          )}
        </p>
        <Boton onClick={alAgregar} disabled={producto.agotado} className="flex-1 lg:w-full">
          {producto.agotado ? "Agotado" : "Agregar al carrito"}
        </Boton>
      </div>
    </div>
  );
}
