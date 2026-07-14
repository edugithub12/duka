"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  PackageX,
  Wallet,
  ClipboardList,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminContext";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { buildDashboardStats, fetchOrders, fetchProducts } from "@/lib/adminData";
import type { DashboardStats } from "@/lib/adminData";
import { formatKes } from "@/lib/format";

export default function AdminDashboardPage() {
  const { user } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [products, orders] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
        ]);
        setStats(buildDashboardStats(products, orders));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard.");
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-12">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back, {user.email?.split("@")[0]}.
        </p>
      </div>

      {loading && (
        <p className="mt-10 text-sm text-muted">Loading dashboard…</p>
      )}

      {error && <p className="mt-10 text-sm text-alert">{error}</p>}

      {stats && (
        <div className="mt-8 flex flex-col gap-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Boxes}
              label="Products"
              value={String(stats.totalProducts)}
              sub={`${stats.inStock} in stock`}
            />
            <StatCard
              icon={PackageX}
              label="Out of stock"
              value={String(stats.outOfStock)}
              tone={stats.outOfStock > 0 ? "alert" : "default"}
            />
            <StatCard
              icon={Wallet}
              label="Catalog value"
              value={formatKes(stats.catalogValueKes)}
              sub="In-stock items, at listed price"
            />
            <StatCard
              icon={TrendingUp}
              label="Revenue"
              value={formatKes(stats.revenueKes)}
              sub="Paid + fulfilled orders"
              tone="brand"
            />
            <StatCard
              icon={ClipboardList}
              label="Total orders"
              value={String(stats.totalOrders)}
            />
            <StatCard
              icon={Clock}
              label="Pending orders"
              value={String(stats.pendingOrders)}
              tone={stats.pendingOrders > 0 ? "alert" : "default"}
              sub="Awaiting payment confirmation"
            />
            <StatCard
              icon={ClipboardList}
              label="Paid"
              value={String(stats.paidOrders)}
            />
            <StatCard
              icon={ClipboardList}
              label="Fulfilled"
              value={String(stats.fulfilledOrders)}
            />
          </div>

          {stats.outOfStock > 0 && (
            <div className="flex items-center gap-3 border border-alert/30 bg-alert/5 px-4 py-3 text-sm text-alert">
              <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {stats.outOfStock} product{stats.outOfStock === 1 ? "" : "s"} marked
              out of stock.
              <Link href="/admin/products" className="ml-auto underline underline-offset-2">
                Review
              </Link>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Category breakdown */}
            <div className="border border-line bg-white">
              <p className="border-b border-line bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-paper">
                Catalog by category
              </p>
              <ul className="divide-y divide-line">
                {stats.categoryBreakdown.map((c) => {
                  const pct = stats.totalProducts
                    ? Math.round((c.count / stats.totalProducts) * 100)
                    : 0;
                  return (
                    <li key={c.slug} className="px-4 py-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{c.label}</span>
                        <span className="font-mono text-xs text-muted">
                          {c.count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full bg-line">
                        <div
                          className="h-1.5 bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent orders */}
            <div className="border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-2">
                <p className="font-mono text-[11px] uppercase tracking-widest text-paper">
                  Recent orders
                </p>
                <Link
                  href="/admin/orders"
                  className="font-mono text-[11px] uppercase tracking-widest text-brand hover:text-paper"
                >
                  View all
                </Link>
              </div>
              {stats.recentOrders.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  No orders yet.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {stats.recentOrders.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate">{o.product_name}</p>
                        <p className="font-mono text-xs text-muted">
                          {formatKes(o.price_kes)}
                        </p>
                      </div>
                      <OrderStatusBadge status={o.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent products */}
          <div className="border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-paper">
                Recently added products
              </p>
              <Link
                href="/admin/products"
                className="font-mono text-[11px] uppercase tracking-widest text-brand hover:text-paper"
              >
                Manage products
              </Link>
            </div>
            {stats.recentProducts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                No products yet.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {stats.recentProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate">{p.name}</p>
                      <p className="font-mono text-xs text-muted">
                        {formatKes(p.sale_price_kes ?? p.price_kes)}
                        {" · "}
                        {p.category}
                        {!p.in_stock && " · sold out"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
