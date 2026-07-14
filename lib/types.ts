export type Product = {
  id: string;
  name: string;
  description: string | null;
  price_kes: number;
  sale_price_kes: number | null;
  image_url: string | null;
  category: string; // matches a slug in siteConfig.categories
  specs: Record<string, string> | null; // e.g. { "Resolution": "4MP", "Channels": "8" }
  in_stock: boolean;
  created_at: string;
};

export type Customer = {
  id: string;
  email: string | null;
  created_at: string;
};

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  price_kes: number;
  status: OrderStatus;
  created_at: string;
};
