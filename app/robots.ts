import { MetadataRoute } from "next";
import { SITE_URL } from "./lib/constants";

/**
 * Dynamic robots.txt handler for Next.js App Router.
 * Configures robot crawling rules and points search engine crawlers to sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
