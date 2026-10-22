import type { Metadata } from "next";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/admin/EncabezadoPagina";
import { InsigniaEstado } from "@/components/admin/InsigniaEstado";
import { ListaResponsive } from "@/components/admin/ListaResponsive";
import { listarPedidos } from "@/lib/datos/admin";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import type { EstadoPedido } from "@/types";

export const metadata: Metadata = { title: "Pedidos" };

const PESTANAS: { estado: EstadoPedido | null; texto: string }[] = [
  { estado: null, texto: "Todos" },
  { estado: "pendiente_pago", texto: "Pendientes" },
  { estado: "pagado", texto: "Pagados" },
  { estado: "enviado", texto: "Enviados" },
  { estado: "entregado", texto: "Entregados" },
  { estado: "cancelado", texto: "Cancelados" },
];

export default async function PaginaPedidos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const todos = await listarPedidos();
  const activo = PESTANAS.find((p) => p.estado === estado)?.estado ?? null;
  const filas = activo ? todos.filter((p) => p.estado === activo) : todos;
  const contar = (e: EstadoPedido | null) => (e ? todos.filter((p) => p.estado === e).length : todos.length);

  return (
    <>
      <EncabezadoPagina titulo="Pedidos" descripcion={`${todos.length} en total`} />
      <nav aria-label="Filtrar por estado" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {PESTANAS.map((p) => {
          const seleccionada = p.estado === activo;
          return (
            <Link
              key={p.texto}
              href={p.estado ? `/admin/pedidos?estado=${p.estado}` : "/admin/pedidos"}
              aria-current={seleccionada ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                seleccionada
                  ? "border-rosa-accion bg-rosa-accion text-white"
                  : "border-borde bg-surface text-cafe hover:bg-rosa-suave"
              }`}
            >
              {p.texto}
              <span className={seleccionada ? "text-white/90" : "text-tenue"}>{contar(p.estado)}</span>
            </Link>
          );
        })}
      </nav>
      <ListaResponsive
        filas={filas}
        idFila={(p) => p.id}
        vacio="No hay pedidos en este estado."
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
          { clave: "fecha", titulo: "Fecha", celda: (p) => formatearFecha(p.creadoEn) },
          { clave: "cliente", titulo: "Cliente", celda: (p) => p.cliente.nombre },
          { clave: "ciudad", titulo: "Ciudad", celda: (p) => p.envio.ciudad },
          {
            clave: "total",
            titulo: "Total",
            alinear: "derecha",
            celda: (p) => <span className="font-bold">{formatearPrecio(p.total)}</span>,
          },
          { clave: "metodo", titulo: "Método", celda: (p) => (p.metodoPago === "wompi" ? "Pago en línea" : "WhatsApp") },
          { clave: "estado", titulo: "Estado", celda: (p) => <InsigniaEstado estado={p.estado} /> },
        ]}
      />
    </>
  );
}
