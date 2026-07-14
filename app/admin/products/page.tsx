"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { fetchProducts } from "@/lib/adminData";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";
import { formatKes } from "@/lib/format";
import { Product } from "@/lib/types";

function categoryLabel(slug: string) {
  return siteConfig.categories.find((c) => c.slug === slug)?.label ?? slug;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setProducts(await fetchProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);
    if (!error) load();
  }

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    setEditing(null);
    load();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} product{products.length === 1 ? "" : "s"} in your
            catalog.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brandDark"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add product
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-8 max-w-2xl">
          <ProductForm
            product={editing ?? undefined}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {error && <p className="mt-8 text-sm text-alert">{error}</p>}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Loading products…</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-line bg-white">
          {products.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              No products yet — add your first one above.
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink text-paper">
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Product
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-line bg-paper">
                          {p.image_url ? (
                            <Image
                              src={p.image_url}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted">
                              <ImageOff className="h-4 w-4" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[220px] truncate">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {categoryLabel(p.category)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.sale_price_kes ? (
                        <span className="flex flex-col">
                          <span>{formatKes(p.sale_price_kes)}</span>
                          <span className="text-muted line-through">
                            {formatKes(p.price_kes)}
                          </span>
                        </span>
                      ) : (
                        formatKes(p.price_kes)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest ${
                          p.in_stock
                            ? "bg-brand/15 text-brandDark"
                            : "bg-alert/15 text-alert"
                        }`}
                      >
                        {p.in_stock ? "In stock" : "Sold out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3 whitespace-nowrap font-mono text-xs uppercase tracking-widest">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-muted hover:text-ink"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-muted hover:text-alert"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
