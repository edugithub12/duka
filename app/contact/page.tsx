import { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { buildGeneralWhatsAppLink, whatsappNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit ${siteConfig.name} at ${siteConfig.location.building}, ${siteConfig.location.street}, ${siteConfig.location.area}, ${siteConfig.location.city}, or reach us on WhatsApp.`,
  alternates: { canonical: "/contact" },
};

const fullAddress = `${siteConfig.location.building}, ${siteConfig.location.shop}, ${siteConfig.location.street}, ${siteConfig.location.area}, ${siteConfig.location.city}`;

// Formats the WhatsApp/business number for display as a phone number,
// e.g. "254712345678" -> "+254 712 345 678"
function formatPhoneDisplay(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length !== 12) return `+${digits}`;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
    6,
    9
  )} ${digits.slice(9)}`;
}

export default function ContactPage() {
  const phoneDigits = whatsappNumber();
  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Contact
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Have a question about a product, an installation, or an existing
        order? Reach us on WhatsApp for the fastest response, call us
        directly, or drop by the shop.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3 border border-line bg-white p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium">Shop address</p>
              <p className="mt-1 text-sm text-muted">
                {siteConfig.location.building}, {siteConfig.location.shop}
                <br />
                {siteConfig.location.street}
                <br />
                {siteConfig.location.area}, {siteConfig.location.city}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border border-line bg-white p-4">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <a
                href={`tel:+${phoneDigits}`}
                className="mt-1 block text-sm text-muted hover:text-ink"
              >
                {formatPhoneDisplay(phoneDigits)}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 border border-line bg-white p-4">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium">WhatsApp</p>
              <a
                href={buildGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-muted hover:text-ink"
              >
                Start a chat
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 border border-line bg-white p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium">Opening hours</p>
              <dl className="mt-1 space-y-0.5">
                {siteConfig.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 text-sm">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-mono text-xs">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden border border-line bg-line">
          <iframe
            title={`${siteConfig.name} location map`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full min-h-[320px] w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
