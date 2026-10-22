import Link from "next/link";
import { AlertTriangle, ClipboardList, Package, Plus, Wallet } from "lucide-react";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { TarjetaPanel } from "@/components/admin/TarjetaPanel";
import { BotonEnlace } from "@/components/ui/BotonEnlace";
import { Insignia } from "@/components/ui/Insignia";
import { resumenPanel } from "@/lib/datos/admin";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import type { EstadoPedido } from "@/types";

const ESTADOS: Record<EstadoPedido, { variante: "aviso" | "exito" | "info" | "error"; texto: string }> = {
  pendiente_pago: { variante: "aviso", texto: "Pendiente" },
  pagado: { variante: "exito", texto: "Pagado" },
  enviado: { variante: "info", texto: "Enviado" },
  entregado: { variante: "exito", texto: "Entregado" },
  cancelado: { variante: "error", texto: "Cancelado" },
};

export default async function PaginaResumen() {
  const r = await resumenPanel();
  const metricas = [
    { titulo: "Pedidos pendientes", valor: String(r.pedidosPendientes), Icono: ClipboardList },
    { titulo: "Ventas del mes", valor: formatearPrecio(r.ventasMes), Icono: Wallet },
    { titulo: "Productos agotados", valor: String(r.productosAgotados), Icono: AlertTriangle },
    { titulo: "Productos activos", valor: String(r.productosActivos), Icono: Package },
  ];

  return (
    <>
      <EncabezadoPagina titulo="Resumen" descripcion="Así va Tonorosa hoy." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metricas.map(({ titulo, valor, Icono }) => (
          <div key={titulo} className="rounded-md border border-borde bg-surface p-4">
            <div className="flex items-center gap-2 text-sm text-tenue">
              <Icono className="size-4 text-rosa-deco" aria-hidden="true" />
              {titulo}
            </div>
            <p className="mt-2 text-2xl font-bold text-cafe">{valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <BotonEnlace href="/admin/productos/nuevo" tamano="compacto">
          <Plus className="size-4" aria-hidden="true" />
          Nuevo producto
        </BotonEnlace>
        <BotonEnlace href="/admin/pedidos" variante="secundario" tamano="compacto">
          Ver pedidos
        </BotonEnlace>
        <BotonEnlace href="/admin/colecciones/nuevo" variante="secundario" tamano="compacto">
          Nueva colección
        </BotonEnlace>
      </div>

      <TarjetaPanel titulo="Últimos pedidos" className="mt-6">
        <ListaResponsive
          filas={r.ultimosPedidos}
          idFila={(p) => p.id}
          vacio="Aún no hay pedidos."
          columnas={[
            {
              clave: "ref",
              titulo: "Referencia",
              principal: true,
              celda: (p) => (
                <Link href={`/admin/pedidos/${p.id}`} className="font-bold text-rosa-accion hover:underline">
                  {p.referencia}
                </Link>
              ),
            },
            { clave: "cliente", titulo: "Cliente", celda: (p) => p.cliente.nombre },
            { clave: "fecha", titulo: "Fecha", celda: (p) => formatearFecha(p.creadoEn) },
            {
              clave: "total",
              titulo: "Total",
              alinear: "derecha",
              celda: (p) => <span className="font-bold">{formatearPrecio(p.total)}</span>,
            },
            {
              clave: "estado",
              titulo: "Estado",
              celda: (p) => <Insignia variante={ESTADOS[p.estado].variante}>{ESTADOS[p.estado].texto}</Insignia>,
            },
          ]}
        />
      </TarjetaPanel>
    </>
  );
}
