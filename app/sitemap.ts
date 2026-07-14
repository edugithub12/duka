import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/faq`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/search`,
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories.map(
    (c) => ({
      url: `${siteConfig.url}/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const { data: products } = await supabase
    .from("products")
    .select("id, created_at")
    .eq("in_stock", true);

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${siteConfig.url}/product/${p.id}`,
    lastModified: p.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
