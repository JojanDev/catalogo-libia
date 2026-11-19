"use client";

import { useState, useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { estilosBoton } from "@/components/ui/estilosBoton";
import { formatearPrecio } from "@/lib/formato";
import type { ProductoVista } from "@/types";

type ConsultaWhatsAppProps = { producto: ProductoVista; whatsapp: string };

const sinSuscripcion = () => () => {};
const origenCliente = () => window.location.origin;
const origenServidor = () => "";

function armarConsulta(producto: ProductoVista, talla: string | null, base: string) {
  const url = `${base.replace(/\/$/, "")}/producto/${producto.slug}`;
  const mensaje = producto.agotado
    ? `Hola, quisiera saber si van a tener de nuevo ${producto.nombre}. La vi aquí: ${url}`
    : `Hola, me interesa ${producto.nombre}${talla ? ` en talla ${talla}` : ""} (${formatearPrecio(producto.precio)}). La vi aquí: ${url}`;
  return { mensaje, url };
}

export default function ConsultaWhatsApp({ producto, whatsapp }: ConsultaWhatsAppProps) {
  const [talla, setTalla] = useState<string | null>(null);
  const origen = useSyncExternalStore(sinSuscripcion, origenCliente, origenServidor);
  const base = process.env.NEXT_PUBLIC_SITE_URL || origen;
  const { mensaje } = armarConsulta(producto, talla, base);
  const todasAgotadas = producto.tallas.length > 0 && producto.tallas.every((t) => t.agotado);

  const alConsultar = () => {
    const { mensaje: texto } = armarConsulta(
      producto,
      talla,
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
    );
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="space-y-6">
      {producto.tallas.length > 0 && (
        <div>
          <div className="mb-3 flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm font-semibold text-cafe">
              {todasAgotadas
                ? "Tallas (sin disponibilidad)"
                : talla
                  ? `Talla seleccionada: ${talla}`
                  : "Elige una talla (opcional)"}
            </span>
            {talla && (
              <button
                type="button"
                onClick={() => setTalla(null)}
                className="min-h-11 px-2 text-sm font-semibold text-rosa-accion underline underline-offset-4 hover:text-rosa-hover focus-visible:outline-2 focus-visible:outline-rosa-accion"
              >
                Quitar selección
              </button>
            )}
          </div>
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
                  className={`min-h-11 min-w-14 rounded-sm border-2 px-4 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosa-accion ${
                    t.agotado
                      ? "cursor-not-allowed border-dashed border-borde bg-canvas text-tenue line-through"
                      : elegida
                        ? "border-rosa-boton bg-rosa-boton text-cafe-oscuro ring-2 ring-rosa-accion ring-offset-2"
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

      <div className="rounded-md border border-borde bg-rosa-suave p-3">
        <p className="text-xs font-semibold text-cafe">Mensaje listo para WhatsApp:</p>
        <p className="mt-1 wrap-break-word text-sm leading-relaxed text-cafe" aria-live="polite">
          {mensaje}
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex min-h-16 items-center justify-between gap-3 border-t border-borde bg-canvas px-4 pb-[env(safe-area-inset-bottom)] shadow-elevada lg:static lg:block lg:min-h-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="min-w-0 shrink lg:hidden">
          {talla && <p className="truncate text-xs text-tenue">Talla {talla}</p>}
          <p className="text-lg font-bold leading-tight text-cafe">
            {formatearPrecio(producto.precio)}
          </p>
        </div>
        <button
          type="button"
          onClick={alConsultar}
          className={estilosBoton(
            "primario",
            "normal",
            "shrink-0 whitespace-nowrap px-4 text-sm min-[400px]:text-base lg:w-full",
          )}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          {producto.agotado ? (
            <>
              <span className="min-[400px]:hidden">Disponibilidad</span>
              <span className="hidden min-[400px]:inline">Preguntar por disponibilidad</span>
            </>
          ) : (
            "Consultar por WhatsApp"
          )}
        </button>
      </div>
    </div>
  );
}
