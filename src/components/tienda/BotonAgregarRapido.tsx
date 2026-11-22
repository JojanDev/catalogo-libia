"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ProductoVista } from "@/types";

export default function BotonAgregarRapido({ producto }: { producto: ProductoVista }) {
  const { agregar, abrir } = useCart();
  const [abierta, setAbierta] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const disponibles = producto.tallas.filter((t) => !t.agotado);

  useEffect(() => {
    if (!abierta) return;
    const previo = document.activeElement as HTMLElement | null;
    const enfocables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []);
    enfocables()[0]?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierta(false);
        return;
      }
      if (e.key !== "Tab") return;
      const lista = enfocables();
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, [abierta]);

  if (producto.agotado || disponibles.length === 0) {
    return null;
  }

  const agregarTalla = (talla: string) => {
    agregar({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagen,
      talla,
      cantidad: 1,
      precioUnitario: producto.precio,
      precioFinal: producto.precioFinal,
      descuentoPorcentaje: producto.descuentoPorcentaje,
    });
    setAbierta(false);
    abrir();
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Agregar ${producto.nombre} al carrito`}
        onClick={() => (disponibles.length === 1 ? agregarTalla(disponibles[0].nombre) : setAbierta(true))}
        className="group/boton flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion"
      >
        <span className="relative flex size-10 items-center justify-center rounded-full bg-rosa-boton text-white group-hover/boton:bg-rosa-boton-hover">
          <ShoppingBag className="size-5" aria-hidden="true" />
          <Plus className="absolute left-1/2 top-[55%] size-3 -translate-x-1/2 -translate-y-1/2" strokeWidth={3} aria-hidden="true" />
        </span>
      </button>
      {abierta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-cafe/50" onClick={() => setAbierta(false)} />
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`talla-titulo-${producto.id}`}
            className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-lg bg-surface p-6 shadow-elevada md:max-w-sm md:rounded-lg"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 id={`talla-titulo-${producto.id}`} className="font-display text-xl text-cafe">
                  Elige una talla
                </h2>
                <p className="mt-1 text-sm text-tenue">{producto.nombre}</p>
              </div>
              <button
                type="button"
                onClick={() => setAbierta(false)}
                aria-label="Cerrar"
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {producto.tallas.map((t) => (
                <button
                  key={t.tallaId}
                  type="button"
                  disabled={t.agotado}
                  aria-label={t.agotado ? `Talla ${t.nombre}, agotada` : undefined}
                  onClick={() => agregarTalla(t.nombre)}
                  className={`h-11 min-w-11 rounded-full border border-borde px-4 text-sm font-semibold ${
                    t.agotado ? "bg-canvas text-tenue line-through" : "bg-surface text-cafe hover:bg-rosa-suave"
                  }`}
                >
                  {t.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
