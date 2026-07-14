"use client";

import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/adminData";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatKes } from "@/lib/format";
import { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setOrders(await fetchOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update order.");
    }
    setUpdatingId(null);
  }

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-12">
      <div>
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          Order intents created when customers tap &ldquo;Order on
          WhatsApp&rdquo;. Update status once payment is confirmed.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              filter === s
                ? "bg-ink text-paper"
                : "border border-line text-muted hover:text-ink"
            }`}
          >
            {s}
            {s !== "all" && (
              <span className="ml-1.5 opacity-60">
                {orders.filter((o) => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-alert">{error}</p>}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Loading orders…</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-white">
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              No orders {filter !== "all" ? `with status "${filter}"` : "yet"}.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink text-paper">
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Product
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Placed
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <span className="max-w-[220px] truncate">
                        {o.product_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {formatKes(o.price_kes)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) =>
                          handleStatusChange(o, e.target.value as OrderStatus)
                        }
                        className="border border-line bg-white px-2 py-1.5 font-mono text-xs uppercase tracking-widest outline-none focus:border-ink disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
