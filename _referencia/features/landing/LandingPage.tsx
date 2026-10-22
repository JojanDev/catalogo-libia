import { PrototypeCard } from "./PrototypeCard.tsx";
import { MainLayout } from "../../components/layouts/MainLayout.tsx";

export function LandingPage() {
  return (
    <MainLayout>
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-text-primary tracking-wide uppercase font-heading">
            Catálogo Libia
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed font-body">
            Catálogo digital para tu tienda de ropa infantil. Elige la opción que mejor se adapte a tus necesidades.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PrototypeCard
            numero={1}
            titulo="Catálogo Simple"
            descripcion="Catálogo completo con colecciones, filtros y búsqueda. Sin panel de administración — yo actualizo los productos por ti."
            precio="$300K - $400K COP"
            caracteristicas={[
              "Hero visual con colección destacada",
              "Colecciones por temporada",
              "Filtros por categoría y colección",
              "Búsqueda por nombre y precio",
              "Modal de detalle de producto",
              "Base de datos Supabase",
            ]}
            ruta="#/catalogo"
          />
          <PrototypeCard
            numero={2}
            titulo="Catálogo con Admin"
            descripcion="Todo lo del Catálogo Simple, más un panel de administración con login para gestionar productos y colecciones."
            precio="$500K COP + $80K/mes"
            caracteristicas={[
              "Todo lo del Catálogo Simple",
              "Panel de administración con login",
              "CRUD de productos y colecciones",
              "Login con email y magic link",
              "Productos activos/inactivos",
              "Historial (soft delete)",
            ]}
            ruta="#/catalogo-admin"
          />
        </div>
      </section>
    </MainLayout>
  );
}
