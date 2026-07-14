import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import WhatsAppButton from "./WhatsAppButton";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.sale_price_kes !== null;
  const displayPrice = product.sale_price_kes ?? product.price_kes;

  return (
    <div className="fade-up group flex flex-col">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-line"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted">
            no image
          </div>
        )}
        {!product.in_stock && (
          <span className="absolute left-2 top-2 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-paper">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-display text-lg leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`price-tag ${onSale ? "price-tag--sale" : ""}`}>
            KSh {displayPrice.toLocaleString("en-KE")}
          </span>
          {onSale && (
            <span className="font-mono text-xs text-muted line-through">
              {product.price_kes.toLocaleString("en-KE")}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
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
  );
}
