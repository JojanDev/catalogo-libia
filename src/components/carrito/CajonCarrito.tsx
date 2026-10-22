"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Entrada } from "@/components/ui/Campo";
import { useCart } from "@/context/CartContext";
import { formatearPrecio } from "@/lib/formato";

const botonCantidad =
  "flex size-11 items-center justify-center text-cafe hover:bg-rosa-suave disabled:text-tenue disabled:hover:bg-transparent";

export function CajonCarrito() {
  const {
    items,
    cantidadTotal,
    subtotal,
    descuentoCodigo,
    total,
    codigo,
    porcentajeCodigo,
    quitar,
    cambiarCantidad,
    aplicarCodigo,
    quitarCodigo,
    abierto,
    cerrar,
  } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [validando, setValidando] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const enfocables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("a, button:not(:disabled), input") ?? [],
      );
    enfocables()[0]?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cerrar();
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
  }, [abierto, cerrar]);

  async function aplicar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    setValidando(true);
    try {
      setMensaje(await aplicarCodigo(texto));
      setTexto("");
    } catch {
      setMensaje("Algo salió mal. Inténtalo de nuevo en un momento");
    } finally {
      setValidando(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${abierto ? "" : "pointer-events-none"}`}
      aria-hidden={!abierto}
    >
      <div
        onClick={cerrar}
        className={`absolute inset-0 bg-cafe/40 transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        inert={!abierto}
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-canvas shadow-elevada transition-transform duration-300 sm:max-w-[420px] ${abierto ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-borde px-4 py-3">
          <h2 className="font-display text-2xl text-cafe">Tu carrito ({cantidadTotal})</h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar carrito"
            className="flex size-11 items-center justify-center rounded-full text-cafe hover:bg-rosa-suave"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-rosa-medio">
              <ShoppingBag className="size-8 text-rosa-accion" aria-hidden="true" />
            </span>
            <p className="text-base text-cafe">
              Tu carrito está vacío. Mira nuestra colección y encuentra algo bonito para tu peque.
            </p>
            <BotonEnlace href="/catalogo" onClick={cerrar}>
              Ver colección
            </BotonEnlace>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-borde overflow-y-auto px-4">
              {items.map((item) => (
                <li key={`${item.productoId}-${item.talla}`} className="flex gap-3 py-4">
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={cerrar}
                    className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md bg-rosa-suave"
                  >
                    {item.imagen && (
                      <Image src={item.imagen} alt={item.nombre} fill sizes="80px" unoptimized className="object-cover" />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/producto/${item.slug}`}
                        onClick={cerrar}
                        className="line-clamp-2 text-base font-semibold text-cafe hover:text-rosa-accion"
                      >
                        {item.nombre}
                      </Link>
                      <button
                        type="button"
                        onClick={() => quitar(item.productoId, item.talla)}
                        aria-label={`Quitar ${item.nombre} talla ${item.talla}`}
                        className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-tenue hover:bg-rosa-suave hover:text-rosa-accion"
                      >
                        <Trash2 className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-sm text-tenue">Talla {item.talla}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center overflow-hidden rounded-full border border-borde bg-surface">
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.productoId, item.talla, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          aria-label="Disminuir cantidad"
                          className={botonCantidad}
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-base font-semibold" aria-live="polite">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.productoId, item.talla, item.cantidad + 1)}
                          disabled={item.cantidad >= 10}
                          aria-label="Aumentar cantidad"
                          className={botonCantidad}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-bold ${item.descuentoPorcentaje ? "text-rosa-accion" : "text-cafe"}`}>
                          {formatearPrecio(item.precioFinal * item.cantidad)}
                        </p>
                        {item.descuentoPorcentaje ? (
                          <p className="text-sm text-tenue line-through">
                            {formatearPrecio(item.precioUnitario * item.cantidad)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-borde bg-surface p-4">
              {codigo ? (
                <div className="flex items-center justify-between rounded-sm bg-exito-fondo px-3 py-2 text-sm font-semibold text-exito">
                  <span className="flex items-center gap-2">
                    <Tag className="size-4" aria-hidden="true" />
                    {codigo} (-{porcentajeCodigo}%)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      quitarCodigo();
                      setMensaje("");
                    }}
                    className="flex min-h-11 items-center underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={aplicar}>
                  <label htmlFor="codigo-carrito" className="mb-1.5 block text-sm font-semibold text-cafe">
                    Código de descuento
                  </label>
                  <div className="flex gap-2">
                    <Entrada
                      id="codigo-carrito"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      autoComplete="off"
                      aria-invalid={mensaje ? true : undefined}
                      aria-describedby={mensaje ? "codigo-carrito-msg" : undefined}
                      className="uppercase"
                    />
                    <Boton type="submit" variante="secundario" cargando={validando} disabled={!texto.trim()}>
                      Aplicar
                    </Boton>
                  </div>
                  {mensaje && (
                    <p id="codigo-carrito-msg" role="status" className="mt-1.5 text-sm font-semibold text-error">
                      {mensaje}
                    </p>
                  )}
                </form>
              )}

              <dl className="space-y-1 text-base text-cafe">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatearPrecio(subtotal)}</dd>
                </div>
                {descuentoCodigo > 0 && (
                  <div className="flex justify-between text-exito">
                    <dt>Descuento</dt>
                    <dd>-{formatearPrecio(descuentoCodigo)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd>{formatearPrecio(total)}</dd>
                </div>
              </dl>
              <p className="text-sm text-tenue">El envío se calcula al finalizar</p>

              <div className="flex flex-col gap-2">
                <BotonEnlace href="/checkout" onClick={cerrar}>
                  Ir a pagar
                </BotonEnlace>
                <Boton variante="texto" onClick={cerrar} className="h-11">
                  Seguir viendo
                </Boton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
