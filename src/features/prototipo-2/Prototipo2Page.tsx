import { useState, useEffect, useMemo } from "react";
import type { Producto, Coleccion, ProductSize, DescuentoInfo } from "../../types/index.ts";
import { supabase } from "../../lib/supabase.ts";
import { MainLayout } from "../../components/layouts/MainLayout.tsx";
import { HeroSection } from "../../components/shared/HeroSection.tsx";
import { ProductCard } from "../../components/shared/ProductCard.tsx";
import { ProductModal } from "../../components/shared/ProductModal.tsx";
import { FilterTabs } from "../../components/shared/FilterTabs.tsx";
import { CollectionCard } from "../../components/shared/CollectionCard.tsx";
import { SearchBar } from "../../components/shared/SearchBar.tsx";
import { PriceSlider } from "../../components/shared/PriceSlider.tsx";
import { CategoryCarousel } from "../../components/shared/CategoryCarousel.tsx";
import { CATEGORIA_EMOJIS } from "../../data/categorias.ts";

function mapProductoDesdeDB(row: Record<string, unknown>): Producto {
  const rawSizes = row.producto_tallas as { stock: number; tallas: { nombre: string }[] }[] | undefined;
  const sizes: ProductSize[] = (rawSizes ?? [])
    .filter((st) => st.tallas && st.tallas.length > 0)
    .map((st) => ({ size: st.tallas[0].nombre, stock: st.stock }));

  let descuento: DescuentoInfo | null = null;
  const rawDesc = row.descuento_productos as
    | { descuentos: { id: number; nombre: string; porcentaje: number; fecha_vencimiento: string } }[]
    | undefined;
  if (rawDesc && rawDesc.length > 0 && rawDesc[0].descuentos) {
    const d = rawDesc[0].descuentos;
    descuento = {
      id: d.id,
      nombre: d.nombre,
      porcentaje: d.porcentaje,
      fecha_vencimiento: d.fecha_vencimiento,
    };
  }

  return {
    id: row.id as number,
    nombre: row.nombre as string,
    precio: row.precio as number,
    categoria: row.categoria as string,
    coleccion: row.coleccion as string,
    imagen: (row.imagen_url as string) ?? "",
    descripcion: (row.descripcion as string) ?? "",
    activo: (row.activo as boolean) ?? true,
    sizes,
    descuento,
  };
}

function mapColeccionDesdeDB(row: Record<string, unknown>): Coleccion {
  return {
    slug: row.slug as string,
    nombre: row.nombre as string,
    descripcion: (row.descripcion as string) ?? "",
    temporada: (row.temporada as string) ?? "",
    imagen: (row.imagen_url as string) ?? "",
  };
}

export function Prototipo2Page() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [coleccionActiva, setColeccionActiva] = useState("Todas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(150000);

  useEffect(() => {
    let cancelled = false;

    async function cargar() {
      try {
        const [productosRes, coleccionesRes] = await Promise.all([
          supabase
            .from("productos")
            .select("*, producto_tallas(stock, tallas(nombre)), descuento_productos(descuentos(id, nombre, porcentaje, fecha_vencimiento))")
            .order("id", { ascending: true }),
          supabase.from("colecciones").select("*"),
        ]);

        if (cancelled) return;

        if (productosRes.error) throw productosRes.error;
        if (coleccionesRes.error) throw coleccionesRes.error;

        setProductos((productosRes.data ?? []).map(mapProductoDesdeDB));
        setColecciones((coleccionesRes.data ?? []).map(mapColeccionDesdeDB));
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error al cargar productos");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    cargar();
    return () => { cancelled = true; };
  }, []);

  const soloActivos = useMemo(() => productos.filter((p) => p.activo), [productos]);
  const precioRealMax = useMemo(
    () => Math.max(...soloActivos.map((p) => p.precio), 100),
    [soloActivos],
  );

  const categorias = useMemo(
    () => [
      { label: `${CATEGORIA_EMOJIS["Todas"]} Todas`, value: "Todas" },
      ...soloActivos
        .map((p) => p.categoria)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((cat) => ({
          label: `${CATEGORIA_EMOJIS[cat] ?? ""} ${cat}`,
          value: cat,
        })),
    ],
    [soloActivos],
  );

  const coleccionFns = useMemo(
    () => [
      { label: "Todas", value: "Todas" },
      ...colecciones.map((c) => ({ label: c.nombre, value: c.nombre })),
    ],
    [colecciones],
  );

  const coleccionDestacada = colecciones[0];

  const productosFiltrados = useMemo(
    () =>
      soloActivos.filter((p) => {
        if (coleccionActiva !== "Todas" && p.coleccion !== coleccionActiva) return false;
        if (categoriaActiva !== "Todas" && p.categoria !== categoriaActiva) return false;
        if (p.precio < precioMin || p.precio > precioMax) return false;
        if (busqueda) {
          const q = busqueda.toLowerCase();
          if (!p.nombre.toLowerCase().includes(q) && !p.categoria.toLowerCase().includes(q))
            return false;
        }
        return true;
      }),
    [soloActivos, coleccionActiva, categoriaActiva, precioMin, precioMax, busqueda],
  );

  return (
    <MainLayout>
      {loading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-text-muted text-sm animate-pulse font-body">Cargando catálogo...</div>
        </div>
      )}

      {!loading && error && (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="text-warm-accent font-semibold">No se pudieron cargar los productos</p>
            <p className="mt-2 text-sm text-text-muted font-body">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && soloActivos.length === 0 && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-text-muted font-body">No hay productos disponibles.</p>
        </div>
      )}

      {!loading && !error && soloActivos.length > 0 && (
        <>
          {coleccionDestacada && <HeroSection coleccion={coleccionDestacada} />}

          <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 space-y-8">
            <div className="flex justify-center">
              <SearchBar valor={busqueda} onChange={setBusqueda} />
            </div>

            <FilterTabs
              label="Colecciones"
              opciones={coleccionFns}
              activo={coleccionActiva}
              onChange={setColeccionActiva}
            />

            <CategoryCarousel
              label="Categorías"
              opciones={categorias}
              activo={categoriaActiva}
              onChange={setCategoriaActiva}
            />

            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 max-w-xs">
                <PriceSlider
                  min={0}
                  max={precioRealMax}
                  valorMin={precioMin}
                  valorMax={precioMax}
                  onChangeMin={setPrecioMin}
                  onChangeMax={setPrecioMax}
                />
              </div>
              <p className="text-sm text-text-muted font-body shrink-0">
                {productosFiltrados.length} productos
              </p>
            </div>

            {productosFiltrados.length === 0 && (
              <p className="text-center text-text-muted py-10 text-sm font-body">
                No se encontraron productos con los filtros seleccionados.
              </p>
            )}
          </section>

          <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {productosFiltrados.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onVerDetalle={setProductoSeleccionado}
                />
              ))}
            </div>
          </main>

          {colecciones.length > 0 && (
            <section className="bg-card-bg border-t border-border-soft py-16">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                <h2 className="text-2xl font-light text-text-primary tracking-wide uppercase text-center font-heading">
                  Colecciones
                </h2>
                <p className="mt-2 text-sm text-text-muted text-center max-w-md mx-auto font-body">
                  Explora nuestras colecciones por temporada
                </p>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colecciones.map((c) => (
                    <CollectionCard
                      key={c.slug}
                      coleccion={c}
                      onClick={() => setColeccionActiva(c.nombre)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <ProductModal
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
      />
    </MainLayout>
  );
}
