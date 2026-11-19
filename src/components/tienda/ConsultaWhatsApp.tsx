"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { estilosBoton } from "@/components/ui/estilosBoton";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

type ConsultaWhatsAppProps = { producto: ProductoVista; whatsapp: string };

export default function ConsultaWhatsApp({ producto, whatsapp }: ConsultaWhatsAppProps) {
  const [talla, setTalla] = useState<string | null>(null);

  const alConsultar = () => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const url = `${base.replace(/\/$/, "")}/producto/${producto.slug}`;
    const mensaje = producto.agotado
      ? `Hola, quisiera saber si van a tener de nuevo ${producto.nombre}. La vi aquí: ${url}`
      : `Hola, me interesa ${producto.nombre}${talla ? ` en talla ${talla}` : ""} (${formatearPrecio(producto.precio)}). La vi aquí: ${url}`;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="space-y-6">
      {producto.tallas.length > 0 && (
        <div>
          <span className="mb-3 block text-sm font-semibold text-cafe">
            Talla{talla ? `: ${talla}` : " (opcional)"}
          </span>
          <div role="group" aria-label="Talla" className="flex flex-wrap gap-2">
            {producto.tallas.map((t) => {
              const elegida = talla === t.nombre;
              return (
                <button
                  key={t.tallaId}
                  type="button"
                  aria-pressed={elegida}
                  aria-disabled={t.agotado || undefined}
                  aria-label={t.agotado ? `Talla ${t.nombre}, agotada` : undefined}
                  onClick={() => {
                    if (t.agotado) return;
                    setTalla(elegida ? null : t.nombre);
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
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-borde bg-canvas p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-elevada lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <p className="shrink-0 text-lg font-bold leading-tight text-cafe lg:hidden">
          {formatearPrecio(producto.precio)}
        </p>
        <button
          type="button"
          onClick={alConsultar}
          className={estilosBoton("primario", "normal", "flex-1 lg:w-full")}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          {producto.agotado ? "Preguntar por disponibilidad" : "Consultar por WhatsApp"}
        </button>
      </div>
    </div>
  );
}
