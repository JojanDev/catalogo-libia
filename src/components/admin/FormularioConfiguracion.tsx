"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarConfiguracionAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { Campo, Entrada } from "@/components/ui/Campo";
import type { Configuracion, ModoInventario } from "@/types";

const MODOS: { valor: ModoInventario; titulo: string; detalle: string }[] = [
  {
    valor: "sobre_pedido",
    titulo: "Sobre pedido",
    detalle: "Las prendas se confeccionan o piden al recibir el pedido; solo marcas tallas como agotadas.",
  },
  {
    valor: "stock_fijo",
    titulo: "Stock fijo",
    detalle: "Cada talla tiene unidades limitadas y se descuentan con cada venta.",
  },
];

function aEntero(valor: string): number | null {
  const n = Number(valor);
  return valor.trim() !== "" && Number.isInteger(n) && n >= 0 ? n : null;
}

export function FormularioConfiguracion({ configuracion }: { configuracion: Configuracion }) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [anuncio, setAnuncio] = useState(configuracion.textoAnuncio);
  const [whatsapp, setWhatsapp] = useState(configuracion.whatsapp);
  const [correo, setCorreo] = useState(configuracion.correoNotificaciones);
  const [envio, setEnvio] = useState(String(configuracion.costoEnvio));
  const [gratis, setGratis] = useState(configuracion.envioGratisDesde === null ? "" : String(configuracion.envioGratisDesde));
  const [modo, setModo] = useState(configuracion.modoInventario);
  const [pagos, setPagos] = useState(configuracion.pagosEnLinea);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    const costo = aEntero(envio);
    const desde = gratis.trim() ? aEntero(gratis) : null;
    if (!whatsapp.replace(/\D/g, "")) nuevos.whatsapp = "Escribe el número de WhatsApp";
    if (correo.trim() && !/^\S+@\S+\.\S+$/.test(correo.trim())) nuevos.correo = "Escribe un correo válido";
    if (costo === null) nuevos.envio = "Escribe un costo entero (0 si es gratis)";
    if (gratis.trim() && desde === null) nuevos.gratis = "Escribe un monto entero";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0 || costo === null) {
      setAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    iniciar(async () => {
      const r = await guardarConfiguracionAccion({
        textoAnuncio: anuncio.trim(),
        whatsapp: whatsapp.replace(/\D/g, ""),
        correoNotificaciones: correo.trim(),
        costoEnvio: costo,
        envioGratisDesde: desde,
        modoInventario: modo,
        pagosEnLinea: pagos,
      });
      if (!r.ok) setAviso({ tipo: "error", texto: r.error });
      else {
        setAviso({ tipo: "exito", texto: "Configuración guardada" });
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-5 pb-24">
      <TarjetaPanel titulo="Tienda">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="anuncio" etiqueta="Texto del anuncio" ayuda="Se muestra en la barra superior de la tienda">
              {(p) => <Entrada {...p} value={anuncio} onChange={(e) => setAnuncio(e.target.value)} />}
            </Campo>
          </div>
          <Campo id="whatsapp" etiqueta="WhatsApp" ayuda="Solo números, con indicativo. Ej: 573001234567" error={errores.whatsapp}>
            {(p) => (
              <Entrada {...p} type="tel" inputMode="numeric" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            )}
          </Campo>
          <Campo id="correo" etiqueta="Correo de avisos" ayuda="Aquí llegan los avisos de pedidos nuevos" error={errores.correo}>
            {(p) => <Entrada {...p} type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />}
          </Campo>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Envío">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="envio" etiqueta="Costo de envío (COP)" error={errores.envio}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" min={0} value={envio} onChange={(e) => setEnvio(e.target.value)} />
            )}
          </Campo>
          <Campo id="gratis" etiqueta="Envío gratis desde (COP, opcional)" ayuda="Vacío significa que siempre se cobra envío" error={errores.gratis}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" min={0} value={gratis} onChange={(e) => setGratis(e.target.value)} />
            )}
          </Campo>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Inventario">
        <fieldset className="space-y-3">
          <legend className="sr-only">Modo de inventario</legend>
          {MODOS.map((m) => (
            <label
              key={m.valor}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${
                modo === m.valor ? "border-rosa-accion bg-rosa-suave" : "border-borde"
              }`}
            >
              <input
                type="radio"
                name="modo"
                className="mt-1 size-5 accent-rosa-accion"
                checked={modo === m.valor}
                onChange={() => setModo(m.valor)}
              />
              <span>
                <span className="block font-bold text-cafe">{m.titulo}</span>
                <span className="block text-sm text-tenue">{m.detalle}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </TarjetaPanel>

      <TarjetaPanel titulo="Pagos">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            role="switch"
            className="mt-1 size-5 accent-rosa-accion"
            checked={pagos}
            onChange={(e) => setPagos(e.target.checked)}
          />
          <span>
            <span className="block font-bold text-cafe">Pagos en línea</span>
            <span className="block text-sm text-tenue">Si está apagado, los pedidos se envían por WhatsApp</span>
          </span>
        </label>
      </TarjetaPanel>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-2 border-t border-borde bg-surface px-4 py-3 md:left-60">
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar cambios
        </Boton>
      </div>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </form>
  );
}
