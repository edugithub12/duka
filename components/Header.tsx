import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg font-bold uppercase tracking-tight text-ink">
              {siteConfig.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <SearchBar />

        <Link
          href="/account"
          className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-ink"
        >
          Account
        </Link>
      </div>

      <nav className="hairline border-t border-line">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-5 py-2.5 text-sm">
          {siteConfig.categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap text-muted transition-colors hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
