"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "@/components/AuthForm";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatKes } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

type AccountOrder = Pick<
  Order,
  "id" | "product_name" | "price_kes" | "status" | "created_at"
>;

// Short, customer-facing explanation for each status — the admin side
// uses the same words but customers need a bit more context.
const STATUS_NOTE: Record<OrderStatus, string> = {
  pending: "We've received your order intent and are awaiting payment confirmation.",
  paid: "Payment confirmed. We're preparing your order.",
  fulfilled: "Delivered / picked up. Thanks for your order!",
  cancelled: "This order was cancelled.",
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from("orders")
        .select("id, product_name, price_kes, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-16 text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-16">
        <h1 className="mb-8 text-center font-display text-3xl font-semibold">
          Your account
        </h1>
        <AuthForm onAuth={loadUser} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-semibold">Your account</h1>
        <button
          onClick={handleSignOut}
          className="font-mono text-xs uppercase tracking-widest text-muted hover:text-alert"
        >
          Sign out
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">{user.email}</p>

      <div className="hairline mt-10 border border-line">
        <div className="flex items-center justify-between border-b border-line bg-ink px-4 py-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-paper">
            Order history
          </p>
          <button
            onClick={loadUser}
            className="font-mono text-[11px] uppercase tracking-widest text-paper/70 hover:text-paper"
          >
            Refresh
          </button>
        </div>
        {orders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No orders yet. Orders you place via WhatsApp will show up here.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p>{order.product_name}</p>
                    <p className="font-mono text-xs text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-xs">
                      {formatKes(order.price_kes)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {STATUS_NOTE[order.status]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
