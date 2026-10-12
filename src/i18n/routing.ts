import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "id", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
  // hreflang alternates come from page metadata and the sitemap; the proxy's
  // Link header used a different x-default, so it's disabled to avoid conflicts.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const htmlLangMap: Record<Locale, string> = {
  en: "en",
  id: "id",
  zh: "zh-Hans",
};

export const ogLocaleMap: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
  zh: "zh_CN",
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
