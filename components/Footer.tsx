import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="hairline mt-16 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-8 text-sm text-muted">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4">
          Pay via M-Pesa Buy Goods, then confirm your order on WhatsApp.
          Installation and site visits available on request.
        </p>
        <p className="mt-2 font-mono text-xs">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.{" "}
          <Link href="/admin" className="hover:text-ink">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
