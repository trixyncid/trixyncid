import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { htmlLangMap, ogLocaleMap, routing, type Locale } from "@/i18n/routing";

type MetaMessages = {
  title: string;
  description: string;
};

type PageMetadataOptions = {
  locale: Locale;
  path: string;
  meta: MetaMessages;
  image?: string;
  imageAlt?: string;
  openGraphType?: "website" | "article";
};

function buildLanguageAlternates(path: string) {
  const normalizedPath = path === "/" ? "" : path;
  const languages: Record<string, string> = {};

  // hreflang codes match <html lang> (zh-Hans for Simplified Chinese); URL paths keep /zh.
  for (const locale of routing.locales) {
    languages[htmlLangMap[locale]] = `${siteConfig.url}/${locale}${normalizedPath}`;
  }
  languages["x-default"] = `${siteConfig.url}/en${normalizedPath}`;

  return languages;
}

export function localeUrl(locale: Locale, path = "/") {
  return `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;
}

export function buildAlternates(path: string) {
  return {
    languages: buildLanguageAlternates(path),
  };
}

function buildOgImages(image?: string, alt?: string) {
  if (image) {
    // Project screenshots vary in size, so let crawlers read the real dimensions.
    return [{ url: image, alt: alt ?? siteConfig.name }];
  }
  return [{ url: `${siteConfig.url}/opengraph-image`, width: 1200, height: 630, alt: siteConfig.name }];
}

export function createPageMetadata({
  locale,
  path,
  meta,
  image,
  imageAlt,
  openGraphType = "website",
}: PageMetadataOptions): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const pageUrl = `${siteConfig.url}/${locale}${normalizedPath}`;
  const ogImages = buildOgImages(image, imageAlt);
  const alternateLocales = routing.locales
    .filter((loc) => loc !== locale)
    .map((loc) => ogLocaleMap[loc as Locale]);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      ...buildAlternates(normalizedPath || "/"),
      canonical: pageUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: pageUrl,
      siteName: siteConfig.name,
      locale: ogLocaleMap[locale],
      alternateLocale: alternateLocales,
      type: openGraphType,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ogImages.map((item) => item.url),
    },
  };
}

export function notFoundMetadata(title = "Page not found"): Metadata {
  return {
    title: `${title} — Trixync`,
    robots: { index: false, follow: false },
  };
}
