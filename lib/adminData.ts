import { supabase } from "./supabase";
import { siteConfig } from "./siteConfig";
import { Customer, Order, OrderStatus, Product } from "./types";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Product[]) ?? [];
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Order[]) ?? [];
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Customer[]) ?? [];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export type CustomerSummary = {
  id: string;
  email: string | null;
  joinedAt: string;
  orders: Order[];
  orderCount: number;
  totalSpentKes: number; // paid + fulfilled orders only
  lastOrderAt: string | null;
};

// Joins the admin-readable `profiles` and `orders` tables client-side by
// user_id — there's no FK between them, so this is done in JS rather
// than as a Postgres join.
export function buildCustomerSummaries(
  customers: Customer[],
  orders: Order[]
): CustomerSummary[] {
  return customers
    .map((customer) => {
      const customerOrders = orders
        .filter((o) => o.user_id === customer.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      const totalSpentKes = customerOrders
        .filter((o) => o.status === "paid" || o.status === "fulfilled")
        .reduce((sum, o) => sum + o.price_kes, 0);

      return {
        id: customer.id,
        email: customer.email,
        joinedAt: customer.created_at,
        orders: customerOrders,
        orderCount: customerOrders.length,
        totalSpentKes,
        lastOrderAt: customerOrders[0]?.created_at ?? null,
      };
    })
    .sort((a, b) => {
      // Customers with orders first (most recent order first), then
      // everyone else by signup date.
      if (a.lastOrderAt && b.lastOrderAt) {
        return (
          new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
        );
      }
      if (a.lastOrderAt) return -1;
      if (b.lastOrderAt) return 1;
      return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
    });
}

export type CategoryBreakdown = {
  slug: string;
  label: string;
  count: number;
};

export type DashboardStats = {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  catalogValueKes: number;
  categoryBreakdown: CategoryBreakdown[];
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  fulfilledOrders: number;
  revenueKes: number;
  recentProducts: Product[];
  recentOrders: Order[];
};

export function buildDashboardStats(
  products: Product[],
  orders: Order[]
): DashboardStats {
  const inStock = products.filter((p) => p.in_stock).length;

  const catalogValueKes = products
    .filter((p) => p.in_stock)
    .reduce((sum, p) => sum + (p.sale_price_kes ?? p.price_kes), 0);

  const categoryBreakdown: CategoryBreakdown[] = siteConfig.categories.map(
    (c) => ({
      slug: c.slug,
      label: c.label,
      count: products.filter((p) => p.category === c.slug).length,
    })
  );

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const paidOrders = orders.filter((o) => o.status === "paid").length;
  const fulfilledOrders = orders.filter((o) => o.status === "fulfilled").length;

  const revenueKes = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.price_kes, 0);

  return {
    totalProducts: products.length,
    inStock,
    outOfStock: products.length - inStock,
    catalogValueKes,
    categoryBreakdown,
    totalOrders: orders.length,
    pendingOrders,
    paidOrders,
    fulfilledOrders,
    revenueKes,
    recentProducts: products.slice(0, 5),
    recentOrders: orders.slice(0, 5),
  };
}
