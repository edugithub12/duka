import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/siteConfig";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product not found" };

  const category = siteConfig.categories.find(
    (c) => c.slug === product.category
  );
  const description =
    product.description ??
    `${product.name}${category ? ` — ${category.label}` : ""}. Order on WhatsApp, pay with M-Pesa.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

// Product structured data — this is what lets Google show price and
// stock-availability rich results for individual product pages.
function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.name,
    image: product.image_url ? [product.image_url] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.sale_price_kes ?? product.price_kes,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/product/${product.id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const category = siteConfig.categories.find(
    (c) => c.slug === product.category
  );
  const onSale = product.sale_price_kes !== null;
  const displayPrice = product.sale_price_kes ?? product.price_kes;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <ProductJsonLd product={product} />
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-line">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-muted">
              no image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {category && (
            <p className="font-mono text-xs uppercase tracking-widest text-signal">
              {category.label}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className={`price-tag ${onSale ? "price-tag--sale" : ""}`}>
              KSh {displayPrice.toLocaleString("en-KE")}
            </span>
            {onSale && (
              <span className="font-mono text-sm text-muted line-through">
                {product.price_kes.toLocaleString("en-KE")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="hairline mt-8 border border-line">
              <p className="border-b border-line bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-paper">
                Specifications
              </p>
              <dl className="divide-y divide-line">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted">{key}</dt>
                    <dd className="font-mono">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8">
            {product.in_stock ? (
              <WhatsAppButton product={product} full />
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed bg-line px-4 py-2.5 text-sm font-medium text-muted"
              >
                Sold out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
