import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.ts";
import type { Pedido } from "../../types/index.ts";

function mapPedidoDesdeDB(row: Record<string, unknown>): Pedido {
  return {
    id: row.id as number,
    cliente: row.cliente as string,
    telefono: (row.telefono as string) ?? "",
    direccion: (row.direccion as string) ?? "",
    productos: (row.productos as Pedido["productos"]) ?? [],
    total: row.total as number,
    metodo_pago: (row.metodo_pago as string) ?? "",
    estado: (row.estado as Pedido["estado"]) ?? "pendiente",
  };
}

export function AdminPedidosList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPedidos(data.map(mapPedidoDesdeDB));
    }
    setLoading(false);
  }

  const handleMarcarEnviado = async (id: number) => {
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: "enviado", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: "enviado" } : p)));
    }
  };

  const pendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const enviados = pedidos.filter((p) => p.estado === "enviado").length;
  const totalVendido = pedidos.reduce((sum, p) => sum + p.total, 0);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-text-muted text-sm animate-pulse font-body">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary font-heading mb-6">Pedidos</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Total Pedidos</p>
          <p className="text-2xl font-bold text-text-primary font-heading mt-1">{pedidos.length}</p>
        </div>
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Pendientes</p>
          <p className="text-2xl font-bold text-warm-accent font-heading mt-1">{pendientes}</p>
        </div>
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Enviados</p>
          <p className="text-2xl font-bold text-green-600 font-heading mt-1">{enviados}</p>
        </div>
        <div className="bg-card-bg border border-border-soft rounded-soft p-4">
          <p className="text-xs text-text-muted font-body">Total Vendido</p>
          <p className="text-2xl font-bold text-text-primary font-heading mt-1">
            ${totalVendido.toLocaleString("es-CO")}
          </p>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-center text-text-muted py-10 font-body">No hay pedidos aún.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-card-bg border border-border-soft rounded-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary font-heading">#{pedido.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold font-body ${
                        pedido.estado === "pendiente"
                          ? "bg-warm-accent/10 text-warm-accent"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {pedido.estado === "pendiente" ? "Pendiente" : "Enviado"}
                    </span>
                  </div>
                  <p className="text-sm text-text-primary font-body mt-1">{pedido.cliente}</p>
                  <p className="text-xs text-text-muted font-body">{pedido.direccion}</p>
                  <p className="text-xs text-text-muted font-body">
                    Tel: {pedido.telefono}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {pedido.productos.map((prod, i) => (
                      <li key={i} className="text-xs text-text-muted font-body">
                        {prod.nombre} (Talla {prod.talla}) × {prod.cantidad} — ${prod.precio.toLocaleString("es-CO")}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-muted font-body mt-1">Pago: {pedido.metodo_pago}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-text-primary font-heading">
                    ${pedido.total.toLocaleString("es-CO")}
                  </p>
                  {pedido.estado === "pendiente" && (
                    <button
                      onClick={() => handleMarcarEnviado(pedido.id)}
                      className="mt-2 px-4 py-1.5 bg-text-primary text-white rounded-soft text-xs font-medium hover:opacity-90 transition-opacity font-body"
                    >
                      Marcar como Enviado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
