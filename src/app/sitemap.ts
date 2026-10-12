import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { projectIds } from "@/content/projects";
import { htmlLangMap, routing } from "@/i18n/routing";

const pages = ["", "/about", "/services", "/projects", "/faq", "/contact"];

function buildSitemapAlternates(path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [htmlLangMap[loc], `${siteConfig.url}/${loc}${path}`]),
  );
  languages["x-default"] = `${siteConfig.url}/en${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: siteConfig.contentUpdatedAt,
      changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
      alternates: buildSitemapAlternates(page),
    })),
  );

  const projectRoutes: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    projectIds.map((slug) => ({
      url: `${baseUrl}/${locale}/projects/${slug}`,
      lastModified: siteConfig.contentUpdatedAt,
      changeFrequency: "monthly" as const,
      alternates: buildSitemapAlternates(`/projects/${slug}`),
    })),
  );

  return [...staticRoutes, ...projectRoutes];
}
