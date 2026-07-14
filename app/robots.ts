import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is useful for search engines to index, and the
      // admin panel shouldn't be discoverable at all.
      disallow: ["/admin", "/account"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
