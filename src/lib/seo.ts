import { siteConfig } from "@/content/site";
import { htmlLangMap, type Locale } from "@/i18n/routing";

const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;
const logoUrl = `${siteConfig.url}/brand/logo-512.png`;

function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

export function organizationJsonLd({ locale, description }: { locale: Locale; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": organizationId,
    name: siteConfig.name,
    description,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    // Service-area business: no public street address, so only locality-level fields.
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    knowsLanguage: ["en", "id", "zh-Hans"],
    priceRange: "IDR 5,000,000+",
    inLanguage: htmlLangMap[locale],
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin, siteConfig.social.github],
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 512,
      height: 512,
    },
    image: logoUrl,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: htmlLangMap[locale],
    publisher: { "@id": organizationId },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function servicesJsonLd({
  locale,
  url,
  items,
}: {
  locale: Locale;
  url: string;
  items: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url,
    inLanguage: htmlLangMap[locale],
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.name,
        description: item.description,
        provider: { "@id": organizationId },
        areaServed: { "@type": "Country", name: "Indonesia" },
      },
    })),
  };
}

export function projectPageJsonLd({
  locale,
  name,
  description,
  url,
  image,
  keywords,
}: {
  locale: Locale;
  name: string;
  description: string;
  url: string;
  image: string;
  keywords: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name,
    description,
    url,
    image: absoluteUrl(image),
    keywords: keywords.join(", "),
    inLanguage: htmlLangMap[locale],
    creator: { "@id": organizationId },
    isPartOf: { "@id": websiteId },
  };
}

/** Home → page breadcrumb for a top-level localized page. */
export function pageBreadcrumbJsonLd({
  locale,
  homeName,
  trail,
}: {
  locale: Locale;
  homeName: string;
  trail: { name: string; path: string }[];
}) {
  return breadcrumbJsonLd([
    { name: homeName, url: `${siteConfig.url}/${locale}` },
    ...trail.map((item) => ({ name: item.name, url: `${siteConfig.url}/${locale}${item.path}` })),
  ]);
}
