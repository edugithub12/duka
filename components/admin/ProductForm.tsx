"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";
import { Product } from "@/lib/types";
import ImageUpload from "./ImageUpload";

type SpecRow = { key: string; value: string };

function specsToRows(specs: Record<string, string> | null): SpecRow[] {
  if (!specs) return [{ key: "", value: "" }];
  const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
  return rows.length ? rows : [{ key: "", value: "" }];
}

function rowsToSpecs(rows: SpecRow[]): Record<string, string> | null {
  const entries = rows
    .map((r) => [r.key.trim(), r.value.trim()])
    .filter(([k, v]) => k && v);
  return entries.length ? Object.fromEntries(entries) : null;
}

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceKes, setPriceKes] = useState(
    product ? String(product.price_kes) : ""
  );
  const [salePriceKes, setSalePriceKes] = useState(
    product?.sale_price_kes ? String(product.sale_price_kes) : ""
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [category, setCategory] = useState(
    product?.category ?? siteConfig.categories[0].slug
  );
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [specRows, setSpecRows] = useState<SpecRow[]>(
    specsToRows(product?.specs ?? null)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateSpecRow(i: number, field: "key" | "value", value: string) {
    setSpecRows((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
  }

  function addSpecRow() {
    setSpecRows((rows) => [...rows, { key: "", value: "" }]);
  }

  function removeSpecRow(i: number) {
    setSpecRows((rows) => rows.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !priceKes) {
      setError("Name and price are required.");
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price_kes: parseInt(priceKes, 10),
      sale_price_kes: salePriceKes ? parseInt(salePriceKes, 10) : null,
      image_url: imageUrl.trim() || null,
      category,
      specs: rowsToSpecs(specRows),
      in_stock: inStock,
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-line bg-white p-5"
    >
      <h2 className="font-display text-xl font-semibold">
        {product ? "Edit product" : "Add product"}
      </h2>

      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Description
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          Price (KES)
          <input
            required
            type="number"
            min={0}
            value={priceKes}
            onChange={(e) => setPriceKes(e.target.value)}
            className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Sale price (KES, optional)
          <input
            type="number"
            min={0}
            value={salePriceKes}
            onChange={(e) => setSalePriceKes(e.target.value)}
            className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>
      </div>

      <ImageUpload value={imageUrl} onChange={setImageUrl} />

      <label className="flex flex-col gap-1.5 text-sm">
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
        >
          {siteConfig.categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2 text-sm">
        <span>Specs</span>
        {specRows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Key (e.g. Resolution)"
              value={row.key}
              onChange={(e) => updateSpecRow(i, "key", e.target.value)}
              className="w-1/2 border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <input
              placeholder="Value (e.g. 4MP)"
              value={row.value}
              onChange={(e) => updateSpecRow(i, "value", e.target.value)}
              className="w-1/2 border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={() => removeSpecRow(i)}
              className="px-2 font-mono text-xs text-muted hover:text-alert"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecRow}
          className="self-start font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
        >
          + Add spec
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
        />
        In stock
      </label>

      {error && <p className="text-sm text-alert">{error}</p>}

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brandDark disabled:opacity-60"
        >
          {loading ? "Saving…" : product ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
