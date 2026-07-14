import Link from "next/link";
import {
  Camera,
  Network,
  Fingerprint,
  Zap,
  BellRing,
  ShieldCheck,
  MessageCircle,
  Wallet,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cctv: Camera,
  networking: Network,
  "access-control": Fingerprint,
  "electric-fence": Zap,
  alarms: BellRing,
};

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    label: "Genuine equipment",
    detail: "Sourced from vetted suppliers",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp ordering",
    detail: "No checkout form, just chat",
  },
  {
    icon: Wallet,
    label: "Pay with M-Pesa",
    detail: "Buy Goods, confirmed same day",
  },
  {
    icon: MapPin,
    label: "Nairobi & environs",
    detail: "Delivery countrywide on request",
  },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-10 pt-14 sm:pt-20 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            Order on WhatsApp · Pay with M-Pesa
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Security &amp; networking equipment, sourced and shipped.
          </h1>
          <p className="mt-4 max-w-md text-muted">
            CCTV, structured cabling, access control, electric fencing and
            alarm systems. Message us on WhatsApp for any product and pay
            directly by M-Pesa — no checkout form required.
          </p>
        </div>

        {/* Signature element: a "rating plate" for the whole shop, in the
            same engraved-hardware language as the product price tags —
            rivets at the corners, mono spec rows, a live status dot. */}
        <div className="spec-plate w-full max-w-xs shrink-0 self-center justify-self-center lg:justify-self-end">
          <span className="spec-plate__rivet spec-plate__rivet--tl" />
          <span className="spec-plate__rivet spec-plate__rivet--tr" />
          <span className="spec-plate__rivet spec-plate__rivet--bl" />
          <span className="spec-plate__rivet spec-plate__rivet--br" />

          <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-paper">
            <span className="spec-plate__dot" />
            {siteConfig.name}
          </p>
          <div className="mt-4 flex flex-col gap-2 border-t border-paper/15 pt-4 font-mono text-[11px] uppercase tracking-widest text-paper/70">
            <div className="flex justify-between gap-3">
              <span>Type</span>
              <span className="text-right text-paper">
                CCTV · Network · Access
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Coverage</span>
              <span className="text-right text-paper">Nairobi &amp; env.</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Order via</span>
              <span className="text-right text-paper">WhatsApp</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Settlement</span>
              <span className="text-right text-paper">M-Pesa</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hairline mx-auto max-w-[1400px] px-5 py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-0.5 text-xs text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {siteConfig.categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Camera;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="hairline group flex flex-col items-center gap-2.5 border border-line bg-white/40 px-4 py-6 text-center transition-colors hover:border-ink hover:bg-white"
              >
                <Icon className="h-6 w-6 text-muted transition-colors group-hover:text-brandDark" />
                <span className="font-display text-sm font-medium leading-snug">
                  {c.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold">
            Latest stock
          </h2>
          <Link
            href="/category/cctv"
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
          >
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="hairline border border-line px-6 py-16 text-center">
            <p className="font-display text-xl">No products yet</p>
            <p className="mt-2 text-sm text-muted">
              Add products from the{" "}
              <Link href="/admin" className="underline hover:text-ink">
                admin panel
              </Link>{" "}
              and they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
