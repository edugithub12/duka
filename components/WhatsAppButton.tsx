"use client";

import { Product } from "@/lib/types";
import { buildOrderLink } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

export default function WhatsAppButton({
  product,
  full = false,
}: {
  product: Product;
  full?: boolean;
}) {
  // Fire-and-forget: if a customer is signed in, log the order intent
  // against their account so it shows up under Account → Order history.
  // Never blocks the WhatsApp link from opening.
  async function logOrderIntent() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("orders").insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      price_kes: product.sale_price_kes ?? product.price_kes,
    });
  }

  return (
    <a
      href={buildOrderLink(product)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={logOrderIntent}
      className={`inline-flex items-center justify-center gap-2 bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brandDark ${
        full ? "w-full" : ""
      }`}
    >
      Order on WhatsApp
    </a>
  );
}
