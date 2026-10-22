"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Film, Pencil, Plus } from "lucide-react";
import { cambiarActivoSlideAccion, guardarSlideAccion, moverSlideAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { Interruptor } from "@/components/admin/Interruptor";
import { SubidorMedios } from "@/components/admin/SubidorMedios";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Entrada, Selector } from "@/components/ui/Campo";
import { Insignia } from "@/components/ui/Insignia";
import type { Coleccion, Medio, SlideCarrusel } from "@/types";

const OTRO = "__otro";

function aMedio(tipo: "imagen" | "video", url: string): Medio {
  return { id: 0, tipo, url, alt: "", orden: 0 };
}

function Miniatura({ slide }: { slide: SlideCarrusel }) {
  return (
    <div className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-rosa-suave">
      {slide.tipo === "imagen" ? (
        <Image src={slide.url} alt="" fill unoptimized className="object-cover" />
      ) : (
        <Film className="size-6 text-rosa-deco" aria-hidden="true" />
      )}
    </div>
  );
}

type FormularioSlideProps = {
  slide: SlideCarrusel | null;
  siguienteOrden: number;
  colecciones: Coleccion[];
  onCerrar: () => void;
  onAviso: (a: DatosAviso) => void;
};

function FormularioSlide({ slide, siguienteOrden, colecciones, onCerrar, onAviso }: FormularioSlideProps) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [errores, setErrores] = useState<Record<string, string>>({});
  const conocidos = ["/catalogo", ...colecciones.map((c) => `/colecciones/${c.slug}`)];
  const enlaceInicial = slide?.enlace ?? "";
  const [destino, setDestino] = useState(
    !enlaceInicial ? "" : conocidos.includes(enlaceInicial) ? enlaceInicial : OTRO,
  );
  const [enlaceLibre, setEnlaceLibre] = useState(conocidos.includes(enlaceInicial) ? "" : enlaceInicial);
  const [principal, setPrincipal] = useState<Medio[]>(slide?.url ? [aMedio(slide.tipo, slide.url)] : []);
  const [movil, setMovil] = useState<Medio[]>(slide?.urlMovil ? [aMedio("imagen", slide.urlMovil)] : []);
  const [titulo, setTitulo] = useState(slide?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(slide?.subtitulo ?? "");
  const [textoBoton, setTextoBoton] = useState(slide?.textoBoton ?? "");
  const [activo, setActivo] = useState(slide?.activo ?? true);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    if (principal.length === 0) nuevos.principal = "Sube la imagen o el video del carrusel";
    if (textoBoton.trim() && destino === "") nuevos.destino = "Elige a dónde lleva el botón";
    if (destino === OTRO && !enlaceLibre.trim()) nuevos.destino = "Escribe el enlace";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      onAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }
    const archivo = principal[0];
    iniciar(async () => {
      const r = await guardarSlideAccion({
        id: slide?.id,
        tipo: archivo.tipo,
        url: archivo.url,
        urlMovil: movil[0]?.url ?? null,
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        textoBoton: textoBoton.trim(),
        enlace: destino === OTRO ? enlaceLibre.trim() : destino,
        orden: slide?.orden ?? siguienteOrden,
        activo,
      });
      if (!r.ok) {
        onAviso({ tipo: "error", texto: r.error });
        return;
      }
      onAviso({ tipo: "exito", texto: slide ? "Cambios guardados" : "Slide agregado" });
      onCerrar();
      router.refresh();
    });
  }

  return (
    <form onSubmit={guardar} noValidate className="space-y-5">
      <TarjetaPanel titulo={slide ? "Editar slide" : "Nuevo slide"}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm font-semibold text-cafe">Archivo principal (imagen o video)</p>
            <SubidorMedios medios={principal} onCambio={setPrincipal} unico ratio="aspect-video" />
            {errores.principal && <p className="mt-1.5 text-sm font-semibold text-error">{errores.principal}</p>}
          </div>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm font-semibold text-cafe">Imagen para móvil (opcional)</p>
            <SubidorMedios medios={movil} onCambio={setMovil} unico soloImagenes ratio="aspect-[4/5]" />
          </div>
          <div className="sm:col-span-2">
            <Campo id="titulo" etiqueta="Título">
              {(p) => <Entrada {...p} value={titulo} onChange={(e) => setTitulo(e.target.value)} />}
            </Campo>
          </div>
          <div className="sm:col-span-2">
            <Campo id="subtitulo" etiqueta="Subtítulo">
              {(p) => <AreaTexto {...p} value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} className="min-h-20" />}
            </Campo>
          </div>
          <Campo id="textoBoton" etiqueta="Texto del botón" ayuda="Déjalo vacío si no quieres botón">
            {(p) => <Entrada {...p} value={textoBoton} onChange={(e) => setTextoBoton(e.target.value)} />}
          </Campo>
          <Campo id="destino" etiqueta="Enlace del botón" error={errores.destino}>
            {(p) => (
              <div className="space-y-2">
                <Selector {...p} value={destino} onChange={(e) => setDestino(e.target.value)}>
                  <option value="">Sin enlace</option>
                  <option value="/catalogo">Catálogo completo</option>
                  {colecciones.map((c) => (
                    <option key={c.id} value={`/colecciones/${c.slug}`}>
                      Colección: {c.nombre}
                    </option>
                  ))}
                  <option value={OTRO}>Otro enlace…</option>
                </Selector>
                {destino === OTRO && (
                  <Entrada
                    value={enlaceLibre}
                    onChange={(e) => setEnlaceLibre(e.target.value)}
                    placeholder="/catalogo?categoria=vestidos"
                    aria-label="Enlace personalizado"
                  />
                )}
              </div>
            )}
          </Campo>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              className="size-5 accent-rosa-accion"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            Activo (visible en la tienda)
          </label>
        </div>
      </TarjetaPanel>
      <div className="flex justify-end gap-2">
        <Boton variante="secundario" tamano="compacto" onClick={onCerrar}>
          Cancelar
        </Boton>
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar cambios
        </Boton>
      </div>
    </form>
  );
}

export function GestorCarrusel({ slides, colecciones }: { slides: SlideCarrusel[]; colecciones: Coleccion[] }) {
  const router = useRouter();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [editando, setEditando] = useState<SlideCarrusel | "nuevo" | null>(null);
  const [moviendo, iniciar] = useTransition();
  const siguienteOrden = slides.reduce((m, s) => Math.max(m, s.orden), 0) + 1;

  function mover(id: number, direccion: "arriba" | "abajo") {
    iniciar(async () => {
      const r = await moverSlideAccion(id, direccion);
      if (!r.ok) setAviso({ tipo: "error", texto: r.error });
      else router.refresh();
    });
  }

  if (editando) {
    return (
      <>
        <FormularioSlide
          key={editando === "nuevo" ? "nuevo" : editando.id}
          slide={editando === "nuevo" ? null : editando}
          siguienteOrden={siguienteOrden}
          colecciones={colecciones}
          onCerrar={() => setEditando(null)}
          onAviso={setAviso}
        />
        <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Boton tamano="compacto" onClick={() => setEditando("nuevo")}>
          <Plus className="size-4" aria-hidden="true" />
          Nuevo slide
        </Boton>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-md border border-borde bg-surface p-8 text-center text-sm text-tenue">
          Aún no hay slides. Agrega el primero para dar vida al inicio de la tienda.
        </div>
      ) : (
        <ul className="space-y-3">
          {slides.map((s, i) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-md border border-borde bg-surface p-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label="Subir"
                  disabled={i === 0 || moviendo}
                  onClick={() => mover(s.id, "arriba")}
                  className="rounded-sm p-1 text-cafe hover:bg-rosa-suave disabled:text-tenue/50 disabled:hover:bg-transparent"
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Bajar"
                  disabled={i === slides.length - 1 || moviendo}
                  onClick={() => mover(s.id, "abajo")}
                  className="rounded-sm p-1 text-cafe hover:bg-rosa-suave disabled:text-tenue/50 disabled:hover:bg-transparent"
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </button>
              </div>
              <Miniatura slide={s} />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate font-bold text-cafe">{s.titulo || "Sin título"}</p>
                <Insignia variante="cafe" className="mt-1">
                  {s.tipo === "imagen" ? "Imagen" : "Video"}
                </Insignia>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Interruptor
                  activo={s.activo}
                  etiqueta={`Activar slide ${s.titulo || s.id}`}
                  onCambiar={(v) => cambiarActivoSlideAccion(s.id, v)}
                  onError={(texto) => setAviso({ tipo: "error", texto })}
                />
                <Boton variante="secundario" tamano="compacto" onClick={() => setEditando(s)}>
                  <Pencil className="size-4" aria-hidden="true" />
                  Editar
                </Boton>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </div>
  );
}
