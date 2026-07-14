import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Search",
  description: `Search products at ${siteConfig.name}.`,
  // Search-results pages are near-duplicate, low-value content in
  // Google's eyes (the real category/product pages are what should
  // rank) — keep this out of the index but still crawlable.
  robots: { index: false, follow: true },
};

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  inStock?: string;
};

async function searchProducts(params: SearchParams): Promise<Product[]> {
  let query = supabase.from("products").select("*");

  if (params.q) {
    const term = params.q.trim();
    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.inStock === "true") {
    query = query.eq("in_stock", true);
  }

  switch (params.sort) {
    case "price-asc":
      query = query.order("price_kes", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price_kes", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error("Search failed:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const products = await searchProducts(searchParams);
  const { q = "", category = "", sort = "newest", inStock } = searchParams;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brand">
        Search
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        {q ? `Results for “${q}”` : "All products"}
      </h1>

      {/* Filter bar — plain GET form, works without JS, keeps the
          search term via a hidden field so filters compose with it. */}
      <form
        action="/search"
        method="GET"
        className="mt-8 flex flex-wrap items-end gap-4 border border-line bg-white/60 p-4"
      >
        <input type="hidden" name="q" value={q} />

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted">
            Category
          </span>
          <select
            name="category"
            defaultValue={category}
            className="border border-line bg-white px-2 py-1.5 text-sm"
          >
            <option value="">All categories</option>
            {siteConfig.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-mono uppercase tracking-widest text-muted">
            Sort by
          </span>
          <select
            name="sort"
            defaultValue={sort}
            className="border border-line bg-white px-2 py-1.5 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>

        <label className="flex items-center gap-2 pb-1.5 text-sm">
          <input
            type="checkbox"
            name="inStock"
            value="true"
            defaultChecked={inStock === "true"}
            className="h-4 w-4 border-line accent-brand"
          />
          In stock only
        </label>

        <button
          type="submit"
          className="bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-brandDark"
        >
          Apply filters
        </button>
      </form>

      <div className="mt-10">
        {products.length === 0 ? (
          <div className="hairline border border-line px-6 py-16 text-center">
            <p className="font-display text-xl">No products found</p>
            <p className="mt-2 text-sm text-muted">
              Try a different search term or clear the filters.
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
