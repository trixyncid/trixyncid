export const siteConfig = {
  name: "Trixync",
  domain: "trixync.id",
  tagline: "Software House in Medan",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.trixync.id",
  email: "hello@trixync.id",
  /** Sitemap lastModified — bump when page content meaningfully changes. */
  contentUpdatedAt: "2026-10-12",
  /** Used for WhatsApp links and structured data only — not shown in the UI */
  telephone: "+62 878 9338 8812",
  whatsapp: "6287893388812",
  address: {
    street: "Medan, North Sumatra",
    city: "Medan",
    region: "North Sumatra",
    country: "Indonesia",
    postalCode: "20111",
  },
  geo: {
    latitude: 3.5952,
    longitude: 98.6722,
  },
  social: {
    linkedin: "https://linkedin.com/company/trixync",
    github: "https://github.com/trixync",
    instagram: "https://instagram.com/trixync.id",
    instagramHandle: "@trixync.id",
  },
} as const;

export const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const pageKeys = [
  "home",
  "about",
  "services",
  "projects",
  "faq",
  "contact",
] as const;

export type PageKey = (typeof pageKeys)[number];
