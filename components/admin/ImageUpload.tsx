"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const BUCKET = "product-images";
const MAX_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function sanitizeFileName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = crypto.randomUUID();
  return `${base}.${ext}`;
}

export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Please use a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    const path = sanitizeFileName(file.name);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(
        uploadError.message.includes("Bucket not found")
          ? `Storage bucket "${BUCKET}" doesn't exist yet — create it in Supabase first.`
          : uploadError.message
      );
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span>Product photo</span>

      {value ? (
        <div className="relative flex items-center gap-4 border border-line bg-white p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-line">
            <Image
              src={value}
              alt="Product"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="truncate font-mono text-xs text-muted">{value}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="font-mono text-xs uppercase tracking-widest text-muted hover:text-alert"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 border border-dashed px-4 py-8 text-center transition-colors ${
            dragActive ? "border-ink bg-line/40" : "border-line bg-white"
          }`}
        >
          {uploading ? (
            <p className="text-sm text-muted">Uploading…</p>
          ) : (
            <>
              <p className="text-sm">Drag a photo here, or click to choose</p>
              <p className="font-mono text-xs text-muted">
                JPG, PNG or WEBP, up to {MAX_SIZE_MB}MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-alert">{error}</p>}
    </div>
  );
}
