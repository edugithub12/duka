// Edit this file to adjust copy — name, tagline, and category list are
// pulled from here everywhere they appear.

export const siteConfig = {
  name: "Novagrid Systems",
  motto: "Technology & Innovation", // from the logo lockup
  tagline: "CCTV, Networking & Access Control",
  description:
    "CCTV, networking equipment, access control, biometrics, electric fencing and alarm systems. Order on WhatsApp, pay with M-Pesa.",
  // Canonical production URL — used to build absolute URLs for metadata,
  // the sitemap, and structured data. Set NEXT_PUBLIC_SITE_URL in your
  // deployment (e.g. Vercel) to your real domain once you have one.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Physical shop location — shown on the Contact page and used in
  // LocalBusiness structured data. Edit freely if you move premises.
  location: {
    building: "Ungahouse",
    shop: "Shop 1",
    street: "Muthithi Road",
    area: "Westlands",
    city: "Nairobi",
    region: "Nairobi County",
    country: "KE",
  },
  // Shown on the Contact page — edit to match your real hours.
  hours: [
    { days: "Monday – Friday", time: "8:30 AM – 5:30 PM" },
    { days: "Saturday", time: "9:00 AM – 3:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  categories: [
    { slug: "cctv", label: "CCTV" },
    { slug: "networking", label: "Networking" },
    { slug: "access-control", label: "Access Control & Biometrics" },
    { slug: "electric-fence", label: "Electric Fencing" },
    { slug: "alarms", label: "Alarm Systems" },
  ],
};
