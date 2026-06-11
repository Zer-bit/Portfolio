import { MetadataRoute } from "next";
import { projects, toSlug } from "./lib/data";
import { ROUTES, SITE_URL } from "./lib/constants";

/**
 * Dynamic sitemap generator for Next.js App Router.
 * Generates an up-to-date sitemap.xml dynamically during build and revalidation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static site routes
  const staticRoutes = Object.values(ROUTES).map((route) => {
    // Determine priority based on page importance
    let priority = 0.8;
    if (route === "/") priority = 1.0;
    else if (route === "/world") priority = 0.9;
    else if (route === "/settings" || route === "/game") priority = 0.5;

    return {
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
    };
  });

  // 2. Dynamic project page routes
  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/projects/${toSlug(project.title)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
