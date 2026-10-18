import { useState, useEffect, useMemo, useCallback } from "react";
import type { Producto, Coleccion, ProductSize, DescuentoInfo, Descuento } from "../../types/index.ts";
import { supabase } from "../../lib/supabase.ts";
import { useSupabaseSession } from "./hooks/useSupabaseSession.ts";
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
import { AdminLogin } from "./AdminLogin.tsx";
import { AdminLayout } from "./AdminLayout.tsx";
import { AdminDashboard } from "./AdminDashboard.tsx";
import { AdminProductosList } from "./AdminProductosList.tsx";
import { AdminProductoForm } from "./AdminProductoForm.tsx";
import { AdminColeccionesList } from "./AdminColeccionesList.tsx";
import { AdminColeccionForm } from "./AdminColeccionForm.tsx";
import { AdminPedidosList } from "./AdminPedidosList.tsx";
import { AdminDescuentosList } from "./AdminDescuentosList.tsx";
import { AdminDescuentoForm } from "./AdminDescuentoForm.tsx";

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

function mapProductoParaDB(p: Omit<Producto, "id" | "descuento">) {
  return {
    nombre: p.nombre,
    precio: p.precio,
    categoria: p.categoria,
    coleccion: p.coleccion,
    imagen_url: p.imagen,
    descripcion: p.descripcion,
    activo: p.activo,
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

export function Prototipo3Page() {
  const { session, loading: authLoading, login, sendMagicLink, logout } = useSupabaseSession();
  const [error, setError] = useState<string | null>(null);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [adminVista, setAdminVista] = useState("dashboard");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoSlug, setEditandoSlug] = useState<string | null>(null);
  const [editandoDescuentoId, setEditandoDescuentoId] = useState<number | null>(null);

  const [productos, setProductos] = useState<Producto[]>([]);
  const [coleccionesLocal, setColeccionesLocal] = useState<Coleccion[]>([]);
  const [tallasDisponibles, setTallasDisponibles] = useState<string[]>([]);
  const [descuentosLocal, setDescuentosLocal] = useState<Descuento[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [coleccionActiva, setColeccionActiva] = useState("Todas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(150000);

  const cargarDatos = useCallback(async () => {
    try {
      const [productosRes, coleccionesRes, tallasRes, descuentosRes] = await Promise.all([
        supabase
          .from("productos")
          .select("*, producto_tallas(stock, tallas(nombre)), descuento_productos(descuentos(id, nombre, porcentaje, fecha_vencimiento))")
          .order("id", { ascending: true }),
        supabase.from("colecciones").select("*"),
        supabase.from("tallas").select("nombre").order("nombre"),
        supabase.from("descuentos").select("*").order("created_at", { ascending: false }),
      ]);

      if (productosRes.error) throw productosRes.error;
      if (coleccionesRes.error) throw coleccionesRes.error;

      setProductos((productosRes.data ?? []).map(mapProductoDesdeDB));
      setColeccionesLocal((coleccionesRes.data ?? []).map(mapColeccionDesdeDB));
      setTallasDisponibles((tallasRes.data ?? []).map((t) => t.nombre as string));
      setDescuentosLocal(
        (descuentosRes.data ?? []).map((d) => ({
          id: d.id as number,
          nombre: d.nombre as string,
          porcentaje: d.porcentaje as number,
          fecha_vencimiento: d.fecha_vencimiento as string,
          activo: (d.activo as boolean) ?? true,
        })),
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos de Supabase");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
      ...coleccionesLocal.map((c) => ({ label: c.nombre, value: c.nombre })),
    ],
    [coleccionesLocal],
  );

  const coleccionDestacada = coleccionesLocal[0];

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

  const productoEnEdicion = editandoId
    ? productos.find((p) => p.id === editandoId) ?? null
    : null;

  const coleccionEnEdicion = editandoSlug
    ? coleccionesLocal.find((c) => c.slug === editandoSlug) ?? null
    : null;

  const descuentoEnEdicion = editandoDescuentoId
    ? descuentosLocal.find((d) => d.id === editandoDescuentoId) ?? null
    : null;

  const conteoProductos = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of productos) {
      if (p.coleccion) map[p.coleccion] = (map[p.coleccion] ?? 0) + 1;
    }
    return map;
  }, [productos]);

  const handleGuardarProducto = async (datos: Omit<Producto, "id" | "descuento">, sizes: ProductSize[]): Promise<string | null> => {
    try {
      let productoId = editandoId;

      if (editandoId) {
        const { error: err } = await supabase
          .from("productos")
          .update(mapProductoParaDB(datos))
          .eq("id", editandoId);
        if (err) return err.message;
      } else {
        const { data, error: err } = await supabase
          .from("productos")
          .insert(mapProductoParaDB(datos))
          .select("id")
          .single();
        if (err) return err.message;
        productoId = data.id as number;
      }

      if (productoId) {
        await supabase.from("producto_tallas").delete().eq("producto_id", productoId);

        if (sizes.length > 0) {
          const { data: tallasData } = await supabase.from("tallas").select("id, nombre");
          const tallaMap = new Map((tallasData ?? []).map((t) => [t.nombre as string, t.id as number]));

          const rows = sizes
            .filter((s) => tallaMap.has(s.size))
            .map((s) => ({
              producto_id: productoId,
              talla_id: tallaMap.get(s.size),
              stock: s.stock,
            }));

          if (rows.length > 0) {
            const { error: err } = await supabase.from("producto_tallas").insert(rows);
            if (err) return err.message;
          }
        }
      }

      await cargarDatos();
      setEditandoId(null);
      setAdminVista("productos");
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al guardar";
    }
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    const { error: err } = await supabase.from("productos").update({ activo }).eq("id", id);
    if (!err) {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo } : p)));
    }
  };

  const handleEliminarProducto = async (id: number) => {
    const { error: err } = await supabase.from("productos").update({ activo: false }).eq("id", id);
    if (!err) {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: false } : p)));
    }
  };

  const handleGuardarColeccion = async (
    datos: { nombre: string; slug: string; descripcion: string; temporada: string; imagen: string },
    productoIds: number[],
  ): Promise<string | null> => {
    try {
      const payload = {
        nombre: datos.nombre,
        slug: datos.slug,
        descripcion: datos.descripcion,
        temporada: datos.temporada,
        imagen_url: datos.imagen,
      };

      if (editandoSlug) {
        const { error: err } = await supabase.from("colecciones").update(payload).eq("slug", editandoSlug);
        if (err) return err.message;

        const nombreAnterior = coleccionEnEdicion?.nombre;
        if (nombreAnterior && nombreAnterior !== datos.nombre) {
          await supabase.from("productos").update({ coleccion: datos.nombre }).eq("coleccion", nombreAnterior);
        }
      } else {
        const { error: err } = await supabase.from("colecciones").insert(payload);
        if (err) return err.message;
      }

      await supabase.from("productos").update({ coleccion: "" }).eq("coleccion", datos.nombre);
      if (productoIds.length > 0) {
        await supabase.from("productos").update({ coleccion: datos.nombre }).in("id", productoIds);
      }

      await cargarDatos();
      setEditandoSlug(null);
      setAdminVista("colecciones");
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al guardar";
    }
  };

  const handleEliminarColeccion = async (slug: string) => {
    const col = coleccionesLocal.find((c) => c.slug === slug);
    if (!col) return;
    await supabase.from("productos").update({ coleccion: "" }).eq("coleccion", col.nombre);
    await supabase.from("colecciones").delete().eq("slug", slug);
    await cargarDatos();
  };

  const handleGuardarDescuento = async (
    datos: { nombre: string; porcentaje: number; fecha_vencimiento: string; activo: boolean },
    productoIds: number[],
  ): Promise<string | null> => {
    try {
      let descuentoId = editandoDescuentoId;

      if (editandoDescuentoId) {
        const { error: err } = await supabase
          .from("descuentos")
          .update(datos)
          .eq("id", editandoDescuentoId);
        if (err) return err.message;
      } else {
        const { data, error: err } = await supabase
          .from("descuentos")
          .insert(datos)
          .select("id")
          .single();
        if (err) return err.message;
        descuentoId = data.id as number;
      }

      if (descuentoId) {
        await supabase.from("descuento_productos").delete().eq("descuento_id", descuentoId);
        if (productoIds.length > 0) {
          const rows = productoIds.map((pid) => ({
            descuento_id: descuentoId,
            producto_id: pid,
          }));
          const { error: err } = await supabase.from("descuento_productos").insert(rows);
          if (err) return err.message;
        }
      }

      await cargarDatos();
      setEditandoDescuentoId(null);
      setAdminVista("descuentos");
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Error al guardar";
    }
  };

  if (!mostrarAdmin) {
    return (
      <MainLayout>
        <div className="relative">
          {loadingData && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-text-muted text-sm animate-pulse font-body">Cargando catálogo...</div>
            </div>
          )}

          {!loadingData && error && (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <p className="text-warm-accent font-semibold">No se pudieron cargar los productos</p>
                <p className="mt-2 text-sm text-text-muted font-body">{error}</p>
              </div>
            </div>
          )}

          {!loadingData && !error && soloActivos.length === 0 && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <p className="text-text-muted font-body">No hay productos disponibles.</p>
            </div>
          )}

          {!loadingData && !error && soloActivos.length > 0 && (
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

              {coleccionesLocal.length > 0 && (
                <section className="bg-card-bg border-t border-border-soft py-16">
                  <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                    <h2 className="text-2xl font-heading text-text-primary tracking-wide text-center">
                      Colecciones
                    </h2>
                    <p className="mt-2 text-sm text-text-muted text-center max-w-md mx-auto font-body">
                      Explora nuestras colecciones por temporada
                    </p>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {coleccionesLocal.map((c) => (
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

              <div className="fixed bottom-6 right-6 z-40">
                <button
                  onClick={() => setMostrarAdmin(true)}
                  className="bg-text-primary hover:bg-text-primary/80 text-white text-xs font-medium py-2.5 px-5 rounded-lg shadow-lg transition-colors tracking-wider uppercase font-body"
                >
                  Admin
                </button>
              </div>
            </>
          )}
        </div>

        <ProductModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      </MainLayout>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-text-muted text-sm animate-pulse font-body">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <AdminLogin
        loginFn={login}
        sendMagicLinkFn={sendMagicLink}
        error={error}
        setError={setError}
      />
    );
  }

  const adminContent = () => {
    switch (adminVista) {
      case "productos":
        return (
          <AdminProductosList
            productos={productos}
            onAgregar={() => {
              setEditandoId(null);
              setAdminVista("producto-form");
            }}
            onEditar={(id) => {
              setEditandoId(id);
              setAdminVista("producto-form");
            }}
            onToggleActivo={handleToggleActivo}
            onEliminar={handleEliminarProducto}
          />
        );
      case "producto-form":
        return (
          <AdminProductoForm
            producto={productoEnEdicion}
            colecciones={coleccionesLocal}
            tallasDisponibles={tallasDisponibles}
            onGuardar={handleGuardarProducto}
            onCancelar={() => {
              setEditandoId(null);
              setAdminVista("productos");
            }}
          />
        );
      case "colecciones":
        return (
          <AdminColeccionesList
            colecciones={coleccionesLocal}
            conteoProductos={conteoProductos}
            onAgregar={() => {
              setEditandoSlug(null);
              setAdminVista("coleccion-form");
            }}
            onEditar={(slug) => {
              setEditandoSlug(slug);
              setAdminVista("coleccion-form");
            }}
            onEliminar={handleEliminarColeccion}
          />
        );
      case "coleccion-form":
        return (
          <AdminColeccionForm
            coleccion={coleccionEnEdicion}
            productosExistentes={productos}
            onGuardar={handleGuardarColeccion}
            onCancelar={() => {
              setEditandoSlug(null);
              setAdminVista("colecciones");
            }}
          />
        );
      case "descuentos":
        return (
          <AdminDescuentosList
            onAgregar={() => {
              setEditandoDescuentoId(null);
              setAdminVista("descuento-form");
            }}
            onEditar={(id) => {
              setEditandoDescuentoId(id);
              setAdminVista("descuento-form");
            }}
          />
        );
      case "descuento-form":
        return (
          <AdminDescuentoForm
            descuento={descuentoEnEdicion}
            onGuardar={handleGuardarDescuento}
            onCancelar={() => {
              setEditandoDescuentoId(null);
              setAdminVista("descuentos");
            }}
          />
        );
      case "pedidos":
        return <AdminPedidosList />;
      default:
        return (
          <AdminDashboard
            totalProductos={productos.length}
            totalColecciones={coleccionesLocal.length}
            totalPedidos={0}
            totalDescuentos={descuentosLocal.length}
            onNavigate={setAdminVista}
          />
        );
    }
  };

  const titulos: Record<string, string> = {
    "dashboard": "Dashboard",
    "productos": "Productos",
    "producto-form": editandoId ? "Editar producto" : "Nuevo producto",
    "colecciones": "Colecciones",
    "coleccion-form": coleccionEnEdicion ? "Editar colección" : "Nueva colección",
    "descuentos": "Descuentos",
    "descuento-form": descuentoEnEdicion ? "Editar descuento" : "Nuevo descuento",
    "pedidos": "Pedidos",
  };

  return (
    <AdminLayout
      titulo={titulos[adminVista] ?? "Admin"}
      vistaActual={adminVista}
      onLogout={async () => {
        await logout();
        setMostrarAdmin(false);
      }}
      onNavigate={(vista) => setAdminVista(vista)}
    >
      {adminContent()}
    </AdminLayout>
  );
}
