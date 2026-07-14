import { notFound } from "next/navigation";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/lib/siteConfig";

export const revalidate = 60;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = siteConfig.categories.find((c) => c.slug === params.slug);
  if (!category) return { title: "Category not found" };

  const title = `${category.label} in ${siteConfig.location.city}`;
  const description = `Shop ${category.label} at ${siteConfig.name}. Order on WhatsApp, pay with M-Pesa, delivery across ${siteConfig.location.city}.`;

  return {
    title,
    description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title, description },
  };
}

async function getCategoryProducts(slug: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", slug)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }
  return data ?? [];
}

export function generateStaticParams() {
  return siteConfig.categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = siteConfig.categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const products = await getCategoryProducts(params.slug);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Category
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        {category.label}
      </h1>

      <div className="mt-10">
        {products.length === 0 ? (
          <div className="hairline border border-line px-6 py-16 text-center">
            <p className="font-display text-xl">
              No products in this category yet
            </p>
            <p className="mt-2 text-sm text-muted">
              Add rows in Supabase with{" "}
              <code className="font-mono">category = &quot;{params.slug}&quot;</code>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
