import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, navLinks } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { type Locale } from "@/i18n/routing";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/layout/Logo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;
  const prefix = `/${locale}`;
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      href: siteConfig.social.instagram,
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <footer className="relative">
      <div className="section-divider mx-auto max-w-4xl opacity-50" aria-hidden />

      <Container className="relative pt-10 md:pt-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("ctaEyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[2rem] md:leading-tight">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("ctaDescription")}</p>
          </div>
          <Link
            href={`${prefix}/contact`}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light"
          >
            {tNav("cta")}
          </Link>
        </div>
      </Container>

      <div className="section-divider mx-auto mt-14 max-w-4xl opacity-50 md:mt-16" aria-hidden />

      <Container className="relative py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Link
              href={prefix}
              aria-label={siteConfig.name}
              className="inline-flex items-center gap-3.5"
            >
              <Logo variant="icon" size="lg" />
              <span className="h-9 w-px bg-border/70" aria-hidden />
              <span className="flex flex-col gap-1.5">
                <Logo variant="text" size="sm" />
                <span className="font-heading text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-brand-light">
                  {t("tagline")}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-brand-light" />
              {t("location")}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:pl-4">
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
                {t("navigate")}
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href === "/" ? prefix : `${prefix}${link.href}`}
                      prefetch={false}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {tNav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
                {t("connect")}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-brand-light/80" />
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={buildWhatsAppUrl(siteConfig.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-brand-light/80" />
                    WhatsApp
                  </a>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-brand-light/40 hover:text-foreground"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="section-divider mx-auto max-w-4xl opacity-40" aria-hidden />

      <Container className="relative flex flex-col gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {siteConfig.domain}
        </p>
      </Container>
    </footer>
  );
}
