"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guardarProductoAccion } from "@/app/admin/acciones";
import { Aviso } from "@/components/admin/Aviso";
import type { DatosAviso } from "@/components/admin/Aviso";
import { SubidorMedios } from "@/components/admin/SubidorMedios";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { Boton } from "@/components/ui/Boton";
import { AreaTexto, Campo, Entrada, Selector } from "@/components/ui/Campo";
import type { Coleccion, Medio, Producto, ProductoTalla, Talla } from "@/types";

type FormularioProductoProps = {
  producto?: Producto;
  tallas: Talla[];
  colecciones: Coleccion[];
  categorias: string[];
};

const NUEVA = "__nueva";

export function FormularioProducto({ producto, tallas, colecciones, categorias }: FormularioProductoProps) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<DatosAviso | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(producto ? String(producto.precio) : "");
  const [categoria, setCategoria] = useState(producto?.categoria ?? "");
  const [categoriaNueva, setCategoriaNueva] = useState(false);
  const [coleccionId, setColeccionId] = useState(producto?.coleccionId ? String(producto.coleccionId) : "");
  const [medios, setMedios] = useState<Medio[]>(producto?.medios ?? []);
  const [seleccion, setSeleccion] = useState<Map<number, boolean>>(
    new Map((producto?.tallas ?? []).map((t) => [t.tallaId, t.agotado])),
  );
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [agotado, setAgotado] = useState(producto?.agotado ?? false);
  const [orden, setOrden] = useState(String(producto?.orden ?? 0));

  const tallasVisibles = tallas.filter((t) => t.activa || seleccion.has(t.id));

  function alternarDisponible(id: number, marcado: boolean) {
    const copia = new Map(seleccion);
    if (marcado) copia.set(id, false);
    else copia.delete(id);
    setSeleccion(copia);
  }

  function alternarAgotada(id: number, marcado: boolean) {
    setSeleccion(new Map(seleccion).set(id, marcado));
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Record<string, string> = {};
    const precioNum = Number(precio);
    if (!nombre.trim()) nuevos.nombre = "Escribe el nombre del producto";
    if (!precio || !Number.isInteger(precioNum) || precioNum <= 0) nuevos.precio = "Escribe un precio entero mayor a 0";
    if (!categoria.trim()) nuevos.categoria = "Elige o escribe una categoría";
    if (!Number.isInteger(Number(orden))) nuevos.orden = "El orden debe ser un número entero";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setAviso({ tipo: "error", texto: "Revisa los campos marcados" });
      return;
    }

    const tallasProducto: ProductoTalla[] = tallas
      .filter((t) => seleccion.has(t.id))
      .map((t) => {
        const previa = producto?.tallas.find((x) => x.tallaId === t.id);
        return {
          tallaId: t.id,
          nombre: t.nombre,
          orden: t.orden,
          agotado: seleccion.get(t.id) ?? false,
          stock: previa?.stock ?? 0,
        };
      });
    const portada = medios.find((m) => m.tipo === "imagen");

    iniciar(async () => {
      const r = await guardarProductoAccion({
        id: producto?.id,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNum,
        categoria: categoria.trim(),
        coleccionId: coleccionId ? Number(coleccionId) : null,
        imagen: portada?.url ?? "",
        medios,
        tallas: tallasProducto,
        agotado,
        activo,
        orden: Number(orden),
      });
      if (!r.ok) {
        setAviso({ tipo: "error", texto: r.error });
        return;
      }
      router.push("/admin/productos");
      router.refresh();
    });
  }

  const casilla = "size-5 accent-rosa-accion";

  return (
    <form onSubmit={guardar} noValidate className="space-y-5 pb-24">
      <TarjetaPanel titulo="Información">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
              {(p) => <Entrada {...p} value={nombre} onChange={(e) => setNombre(e.target.value)} />}
            </Campo>
          </div>
          <div className="sm:col-span-2">
            <Campo id="descripcion" etiqueta="Descripción">
              {(p) => <AreaTexto {...p} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />}
            </Campo>
          </div>
          <Campo id="precio" etiqueta="Precio (COP)" error={errores.precio}>
            {(p) => (
              <Entrada
                {...p}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            )}
          </Campo>
          <Campo id="categoria" etiqueta="Categoría" error={errores.categoria}>
            {(p) => (
              <div className="space-y-2">
                <Selector
                  {...p}
                  value={categoriaNueva ? NUEVA : categoria}
                  onChange={(e) => {
                    if (e.target.value === NUEVA) {
                      setCategoriaNueva(true);
                      setCategoria("");
                    } else {
                      setCategoriaNueva(false);
                      setCategoria(e.target.value);
                    }
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value={NUEVA}>Escribir una nueva…</option>
                </Selector>
                {categoriaNueva && (
                  <Entrada
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Nueva categoría"
                    aria-label="Nueva categoría"
                  />
                )}
              </div>
            )}
          </Campo>
          <Campo id="coleccion" etiqueta="Colección">
            {(p) => (
              <Selector {...p} value={coleccionId} onChange={(e) => setColeccionId(e.target.value)}>
                <option value="">Sin colección</option>
                {colecciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Selector>
            )}
          </Campo>
        </div>
      </TarjetaPanel>

      <TarjetaPanel titulo="Fotos y video">
        <p className="mb-3 text-sm text-tenue">La primera imagen es la portada del producto.</p>
        <SubidorMedios medios={medios} onCambio={setMedios} />
      </TarjetaPanel>

      <TarjetaPanel titulo="Tallas">
        {tallasVisibles.length === 0 ? (
          <p className="text-sm text-tenue">No hay tallas activas. Créalas en la sección Tallas.</p>
        ) : (
          <ul className="divide-y divide-borde">
            {tallasVisibles.map((t) => {
              const disponible = seleccion.has(t.id);
              return (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <span className="min-w-16 font-bold text-cafe">{t.nombre}</span>
                  <div className="flex gap-5 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className={casilla}
                        checked={disponible}
                        onChange={(e) => alternarDisponible(t.id, e.target.checked)}
                      />
                      Disponible
                    </label>
                    <label className={`flex items-center gap-2 ${disponible ? "" : "text-tenue"}`}>
                      <input
                        type="checkbox"
                        className={casilla}
                        disabled={!disponible}
                        checked={disponible && (seleccion.get(t.id) ?? false)}
                        onChange={(e) => alternarAgotada(t.id, e.target.checked)}
                      />
                      Agotada
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </TarjetaPanel>

      <TarjetaPanel titulo="Estado">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className={casilla} checked={activo} onChange={(e) => setActivo(e.target.checked)} />
              Activo (visible en la tienda)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className={casilla} checked={agotado} onChange={(e) => setAgotado(e.target.checked)} />
              Agotado (toda la prenda)
            </label>
          </div>
          <Campo id="orden" etiqueta="Orden" ayuda="Los números menores aparecen primero" error={errores.orden}>
            {(p) => (
              <Entrada {...p} type="number" inputMode="numeric" value={orden} onChange={(e) => setOrden(e.target.value)} />
            )}
          </Campo>
        </div>
      </TarjetaPanel>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end gap-2 border-t border-borde bg-surface px-4 py-3 md:left-60">
        <Boton variante="secundario" tamano="compacto" onClick={() => router.push("/admin/productos")}>
          Cancelar
        </Boton>
        <Boton type="submit" tamano="compacto" cargando={pendiente}>
          Guardar cambios
        </Boton>
      </div>
      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </form>
  );
}
