import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { tillNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ordering, payment, delivery, and installation at ${siteConfig.name}.`,
  alternates: { canonical: "/faq" },
};

// Edit freely — these are written generically on purpose so they don't
// commit you to specific warranty/return terms you haven't set yet.
const FAQS = [
  {
    question: "How do I place an order?",
    answer:
      'Open any product page and tap "Order on WhatsApp." It opens a pre-filled message with the product and price — send it and we\'ll confirm availability and next steps.',
  },
  {
    question: "How do I pay?",
    answer: `Pay via M-Pesa Buy Goods, Till Number ${tillNumber()}. Send us the M-Pesa confirmation message on WhatsApp and we'll process your order.`,
  },
  {
    question: "Do you install the equipment?",
    answer:
      "Yes, installation and site visits are available on request. Message us on WhatsApp with your location and setup for a quote.",
  },
  {
    question: `Do you deliver outside ${siteConfig.location.city}?`,
    answer:
      "Yes, delivery is available countrywide on request. Ask us on WhatsApp for cost and timing to your area.",
  },
  {
    question: "What warranty do your products come with?",
    answer:
      "Warranty terms vary by product and manufacturer. Message us on WhatsApp with the specific item you're interested in and we'll confirm the warranty before you order.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Message us on WhatsApp as soon as possible if there's an issue with your order — we'll go over the options for your specific case.",
  },
  {
    question: "How do I check my order status?",
    answer:
      'Sign in at "Account" and check "Order history" — each order shows pending, paid, or fulfilled.',
  },
  {
    question: "Do you have a physical shop I can visit?",
    answer: `Yes — ${siteConfig.location.building}, ${siteConfig.location.shop}, ${siteConfig.location.street}, ${siteConfig.location.area}, ${siteConfig.location.city}. See the Contact page for hours and a map.`,
  },
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <FaqJsonLd />
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        FAQ
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-sm text-muted">
        Can&apos;t find what you&apos;re looking for?{" "}
        <Link href="/contact" className="text-brandDark hover:underline">
          Contact us
        </Link>{" "}
        directly.
      </p>

      <div className="mt-8 divide-y divide-line border border-line bg-white">
        {FAQS.map((f) => (
          <details key={f.question} className="group px-4 py-3.5">
            <summary className="cursor-pointer list-none text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.question}
                <span className="shrink-0 font-mono text-lg leading-none text-muted group-open:hidden">
                  +
                </span>
                <span className="hidden shrink-0 font-mono text-lg leading-none text-muted group-open:inline">
                  −
                </span>
              </span>
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
