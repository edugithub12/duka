import Link from "next/link";
import { Metadata } from "next";
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
import { siteConfig } from "@/lib/siteConfig";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.name} — ${siteConfig.tagline}, based in ${siteConfig.location.area}, ${siteConfig.location.city}.`,
  alternates: { canonical: "/about" },
};

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
    detail: "Sourced from vetted suppliers, not grey-market imports.",
  },
  {
    icon: MessageCircle,
    label: "Straightforward ordering",
    detail: "No account, no checkout form — just message us on WhatsApp.",
  },
  {
    icon: Wallet,
    label: "Pay with M-Pesa",
    detail: "Buy Goods Till, confirmed the same day you order.",
  },
  {
    icon: MapPin,
    label: `${siteConfig.location.area}, ${siteConfig.location.city}`,
    detail: "Visit our shop, or we deliver countrywide on request.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        About Us
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        {siteConfig.description} We work with homes, offices, gated
        estates, and businesses across {siteConfig.location.city} who need
        equipment they can trust and a straightforward way to order it —
        no long checkout forms, just a chat and a Till number.
      </p>

      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold">What we supply</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-5">
          {siteConfig.categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Camera;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group flex flex-col items-start gap-2 border border-line bg-white p-4 transition-colors hover:border-brand"
              >
                <Icon
                  className="h-6 w-6 text-brand"
                  strokeWidth={1.5}
                />
                <span className="text-sm font-medium leading-tight group-hover:text-brandDark">
                  {c.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="hairline mt-14 border-t border-line pt-10">
        <h2 className="font-display text-xl font-semibold">
          Why customers order from us
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-0.5 text-xs text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hairline mt-14 border-t border-line pt-10 pb-4">
        <h2 className="font-display text-xl font-semibold">Visit our shop</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {siteConfig.location.building}, {siteConfig.location.shop},{" "}
          {siteConfig.location.street}, {siteConfig.location.area},{" "}
          {siteConfig.location.city}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-brandDark"
          >
            Contact &amp; directions
          </Link>
          <a
            href={buildGeneralWhatsAppLink(
              "Hi, I'd like to know more about your products."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brandDark"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
