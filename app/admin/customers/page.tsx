"use client";

import { useEffect, useState, Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  fetchCustomers,
  fetchOrders,
  buildCustomerSummaries,
  CustomerSummary,
} from "@/lib/adminData";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatKes } from "@/lib/format";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [profiles, orders] = await Promise.all([
        fetchCustomers(),
        fetchOrders(),
      ]);
      setCustomers(buildCustomerSummaries(profiles, orders));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const visible = customers.filter((c) =>
    (c.email ?? "").toLowerCase().includes(query.trim().toLowerCase())
  );

  const withOrders = customers.filter((c) => c.orderCount > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-12">
      <div>
        <h1 className="font-display text-3xl font-semibold">Customers</h1>
        <p className="mt-1 text-sm text-muted">
          Everyone with an account, and what they&apos;ve ordered. Tap a row
          to see order history.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className="w-full max-w-xs border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-brand"
        />
        <p className="font-mono text-xs text-muted">
          {customers.length} account{customers.length === 1 ? "" : "s"} ·{" "}
          {withOrders} with orders
        </p>
      </div>

      {error && <p className="mt-6 text-sm text-alert">{error}</p>}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Loading customers…</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-white">
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              {customers.length === 0
                ? "No customer accounts yet."
                : "No customers match that search."}
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink text-paper">
                  <th className="w-8 px-4 py-2.5" />
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Joined
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Orders
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Total spent
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Last order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((c) => {
                  const expanded = expandedId === c.id;
                  return (
                    <Fragment key={c.id}>
                      <tr
                        onClick={() => setExpandedId(expanded ? null : c.id)}
                        className="cursor-pointer hover:bg-paper"
                      >
                        <td className="px-4 py-3 text-muted">
                          {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {c.email ?? (
                            <span className="text-muted">no email on file</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {formatDate(c.joinedAt)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {c.orderCount}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {formatKes(c.totalSpentKes)}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={6} className="bg-paper px-4 py-3">
                            {c.orders.length === 0 ? (
                              <p className="text-sm text-muted">
                                No orders from this customer yet.
                              </p>
                            ) : (
                              <ul className="divide-y divide-line border border-line bg-white">
                                {c.orders.map((o) => (
                                  <li
                                    key={o.id}
                                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                                  >
                                    <div>
                                      <p>{o.product_name}</p>
                                      <p className="font-mono text-xs text-muted">
                                        {formatDate(o.created_at)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-mono text-xs">
                                        {formatKes(o.price_kes)}
                                      </span>
                                      <OrderStatusBadge status={o.status} />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
