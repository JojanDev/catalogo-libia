"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AlertCircle, ChevronDown, ShoppingBag } from "lucide-react";
import { Boton } from "@/components/ui/Boton";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { AreaTexto, Campo, Entrada, Selector } from "@/components/ui/Campo";
import { useCart } from "@/context/CartContext";
import { cotizarAccion, crearPedidoAccion } from "@/app/(tienda)/acciones";
import { formatearPrecio } from "@/lib/formato";
import type { Cotizacion, MetodoPago } from "@/types";

const DEPARTAMENTOS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bogotá D.C.",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

type Valores = {
  nombre: string;
  telefono: string;
  email: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  barrio: string;
  notas: string;
};

const inicial: Valores = {
  nombre: "",
  telefono: "",
  email: "",
  departamento: "",
  ciudad: "",
  direccion: "",
  barrio: "",
  notas: "",
};

function validar(v: Valores): Partial<Record<keyof Valores, string>> {
  const e: Partial<Record<keyof Valores, string>> = {};
  if (!v.nombre.trim()) e.nombre = "Escribe tu nombre completo";
  if (!/^\d{10}$/.test(v.telefono.replace(/[\s-]/g, ""))) e.telefono = "Ingresa un celular de 10 dígitos";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Ingresa un correo válido";
  if (!v.departamento) e.departamento = "Elige un departamento";
  if (!v.ciudad.trim()) e.ciudad = "Escribe tu ciudad";
  if (!v.direccion.trim()) e.direccion = "Escribe tu dirección";
  return e;
}

const seccion = "rounded-lg border border-borde bg-surface p-5 shadow-card";
const tituloSeccion = "mb-4 font-display text-xl text-cafe";

export function FormularioCheckout({ pagosEnLinea }: { pagosEnLinea: boolean }) {
  const router = useRouter();
  const { items, codigo, vaciar } = useCart();
  const listo = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [cot, setCot] = useState<Cotizacion | null>(null);
  const [resumenAbierto, setResumenAbierto] = useState(false);
  const [valores, setValores] = useState<Valores>(inicial);
  const [errores, setErrores] = useState<Partial<Record<keyof Valores, string>>>({});
  const [metodo, setMetodo] = useState<MetodoPago>(pagosEnLinea ? "wompi" : "whatsapp");
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    if (!listo || items.length === 0) return;
    let vigente = true;
    cotizarAccion(
      items.map((i) => ({ productoId: i.productoId, talla: i.talla, cantidad: i.cantidad })),
      codigo,
    )
      .then((r) => vigente && setCot(r))
      .catch(() => vigente && setCot(null));
    return () => {
      vigente = false;
    };
  }, [listo, items, codigo]);

  function cambiar(campo: keyof Valores) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValores((v) => ({ ...v, [campo]: e.target.value }));
      setErrores((er) => ({ ...er, [campo]: undefined }));
    };
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const er = validar(valores);
    setErrores(er);
    if (Object.keys(er).length > 0) {
      document.getElementById(`co-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setErrorGeneral("");
    setEnviando(true);
    try {
      const r = await crearPedidoAccion({
        items: items.map((i) => ({ productoId: i.productoId, talla: i.talla, cantidad: i.cantidad })),
        codigo,
        cliente: { nombre: valores.nombre, telefono: valores.telefono, email: valores.email },
        envio: {
          departamento: valores.departamento,
          ciudad: valores.ciudad,
          direccion: valores.direccion,
          barrio: valores.barrio,
          notas: valores.notas,
        },
        metodoPago: metodo,
      });
      if (!r.ok) {
        setErrorGeneral(r.error);
        setEnviando(false);
        return;
      }
      vaciar();
      if (r.siguiente.startsWith("https")) window.location.href = r.siguiente;
      else router.push(r.siguiente);
    } catch {
      setErrorGeneral("Algo salió mal. Inténtalo de nuevo en un momento");
      setEnviando(false);
    }
  }

  if (!listo) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (items.length === 0 && !enviando) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-rosa-medio">
          <ShoppingBag className="size-8 text-rosa-accion" aria-hidden="true" />
        </span>
        <p className="text-base text-cafe">
          Tu carrito está vacío. Mira nuestra colección y encuentra algo bonito para tu peque.
        </p>
        <BotonEnlace href="/catalogo">Ver colección</BotonEnlace>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-lg border border-borde bg-surface shadow-card">
        <button
          type="button"
          onClick={() => setResumenAbierto((a) => !a)}
          aria-expanded={resumenAbierto}
          className="flex min-h-14 w-full items-center justify-between gap-3 px-5 text-left"
        >
          <span className="font-display text-xl text-cafe">Resumen del pedido</span>
          <span className="flex items-center gap-2 text-base font-bold text-cafe">
            {cot ? formatearPrecio(cot.total) : ""}
            <ChevronDown
              className={`size-5 text-rosa-accion transition-transform ${resumenAbierto ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>
        {resumenAbierto && (
          <div className="border-t border-borde px-5 py-4">
            {!cot ? (
              <p className="text-sm text-tenue">Calculando tu pedido…</p>
            ) : (
              <>
                <ul className="divide-y divide-borde">
                  {cot.items.map((i) => (
                    <li key={`${i.productoId}-${i.talla}`} className="flex gap-3 py-3">
                      <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-sm bg-rosa-suave">
                        {i.imagen && (
                          <Image src={i.imagen} alt="" fill sizes="56px" unoptimized className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-base font-semibold text-cafe">{i.nombre}</p>
                        <p className="text-sm text-tenue">
                          Talla {i.talla} · x{i.cantidad}
                        </p>
                      </div>
                      <p className="text-base font-bold text-cafe">{formatearPrecio(i.subtotal)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="mt-3 space-y-1 border-t border-borde pt-3 text-base text-cafe">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{formatearPrecio(cot.subtotal)}</dd>
                  </div>
                  {cot.descuentoCodigo > 0 && (
                    <div className="flex justify-between text-exito">
                      <dt>Descuento{cot.codigoAplicado ? ` (${cot.codigoAplicado})` : ""}</dt>
                      <dd>-{formatearPrecio(cot.descuentoCodigo)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Envío</dt>
                    <dd>{cot.costoEnvio === 0 ? "Gratis" : formatearPrecio(cot.costoEnvio)}</dd>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <dt>Total</dt>
                    <dd>{formatearPrecio(cot.total)}</dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        )}
        {cot && cot.errores.length > 0 && (
          <ul className="space-y-1 rounded-b-lg bg-aviso-fondo px-5 py-3 text-sm font-semibold text-aviso">
            {cot.errores.map((m) => (
              <li key={m} className="flex items-start gap-1.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={seccion}>
        <h2 className={tituloSeccion}>Datos de contacto</h2>
        <div className="space-y-4">
          <Campo id="co-nombre" etiqueta="Nombre completo" error={errores.nombre}>
            {(p) => <Entrada {...p} value={valores.nombre} onChange={cambiar("nombre")} autoComplete="name" />}
          </Campo>
          <Campo id="co-telefono" etiqueta="Celular" ayuda="10 dígitos, por ejemplo 3001234567" error={errores.telefono}>
            {(p) => (
              <Entrada
                {...p}
                type="tel"
                inputMode="numeric"
                value={valores.telefono}
                onChange={cambiar("telefono")}
                autoComplete="tel"
              />
            )}
          </Campo>
          <Campo id="co-email" etiqueta="Correo electrónico" error={errores.email}>
            {(p) => (
              <Entrada {...p} type="email" value={valores.email} onChange={cambiar("email")} autoComplete="email" />
            )}
          </Campo>
        </div>
      </section>

      <section className={seccion}>
        <h2 className={tituloSeccion}>Dirección de envío</h2>
        <div className="space-y-4">
          <Campo id="co-departamento" etiqueta="Departamento" error={errores.departamento}>
            {(p) => (
              <Selector {...p} value={valores.departamento} onChange={cambiar("departamento")}>
                <option value="">Selecciona un departamento</option>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Selector>
            )}
          </Campo>
          <Campo id="co-ciudad" etiqueta="Ciudad o municipio" error={errores.ciudad}>
            {(p) => (
              <Entrada {...p} value={valores.ciudad} onChange={cambiar("ciudad")} autoComplete="address-level2" />
            )}
          </Campo>
          <Campo id="co-direccion" etiqueta="Dirección" error={errores.direccion}>
            {(p) => (
              <Entrada {...p} value={valores.direccion} onChange={cambiar("direccion")} autoComplete="street-address" />
            )}
          </Campo>
          <Campo id="co-barrio" etiqueta="Barrio (opcional)">
            {(p) => <Entrada {...p} value={valores.barrio} onChange={cambiar("barrio")} />}
          </Campo>
          <Campo id="co-notas" etiqueta="Indicaciones de entrega (opcional)">
            {(p) => <AreaTexto {...p} value={valores.notas} onChange={cambiar("notas")} />}
          </Campo>
        </div>
      </section>

      <section className={seccion}>
        <h2 className={tituloSeccion}>Método de pago</h2>
        <div className="space-y-3">
          {pagosEnLinea && (
            <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-sm border border-borde px-4 has-checked:border-rosa-accion has-checked:bg-rosa-suave">
              <input
                type="radio"
                name="metodo"
                checked={metodo === "wompi"}
                onChange={() => setMetodo("wompi")}
                className="size-5 accent-rosa-accion"
              />
              <span className="text-base font-semibold text-cafe">Pagar en línea (tarjeta, PSE, Nequi)</span>
            </label>
          )}
          <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-sm border border-borde px-4 has-checked:border-rosa-accion has-checked:bg-rosa-suave">
            <input
              type="radio"
              name="metodo"
              checked={metodo === "whatsapp"}
              onChange={() => setMetodo("whatsapp")}
              className="size-5 accent-rosa-accion"
            />
            <span className="text-base font-semibold text-cafe">Enviar pedido por WhatsApp</span>
          </label>
        </div>
      </section>

      {errorGeneral && (
        <p role="alert" className="flex items-start gap-2 rounded-sm bg-error-fondo px-4 py-3 text-sm font-semibold text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {errorGeneral}
        </p>
      )}

      <Boton type="submit" cargando={enviando} className="w-full">
        Confirmar pedido
      </Boton>
    </form>
  );
}
