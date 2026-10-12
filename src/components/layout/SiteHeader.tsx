"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Home, Info, Briefcase, FolderKanban, HelpCircle, Mail, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { Logo } from "./Logo";
import { navLinks } from "@/content/site";
import { type Locale } from "@/i18n/routing";
import { useScrolled } from "@/hooks/use-scrolled";
import { setBackgroundPaused } from "@/lib/background-activity";
import { cn } from "@/lib/utils";

const navIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-5 w-5" />,
  about: <Info className="h-5 w-5" />,
  services: <Briefcase className="h-5 w-5" />,
  projects: <FolderKanban className="h-5 w-5" />,
  faq: <HelpCircle className="h-5 w-5" />,
  contact: <Mail className="h-5 w-5" />,
};

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const scrolled = useScrolled(12);

  // Pause synchronously on click so WebGL/beams freeze *before* the menu
  // paints — useEffect would be one frame too late and cause the open jank.
  function setMenuOpen(next: boolean) {
    setBackgroundPaused(next);
    setMobileOpen(next);
  }

  useEffect(() => {
    return () => setBackgroundPaused(false);
  }, []);

  // Close the menu when the route changes without a link click (back/forward).
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    if (mobileOpen) setMobileOpen(false);
  }
  useEffect(() => {
    if (!mobileOpen) setBackgroundPaused(false);
  }, [mobileOpen]);

  const closeMenu = useCallback(() => {
    setBackgroundPaused(false);
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const prefix = `/${locale}`;
  const items = navLinks.map((link) => ({
    key: link.key,
    name: t(link.key),
    href: link.href,
    link: link.href === "/" ? prefix : `${prefix}${link.href}`,
    icon: navIcons[link.key],
  }));

  const desktopNavItems = items.filter((item) => item.key !== "home" && item.key !== "contact");

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full",
          mobileOpen && "z-[80]",
        )}
      >
        {mobileOpen ? (
          <div
            aria-hidden
            className="site-header-solid pointer-events-none absolute inset-0"
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "site-header-glass pointer-events-none absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
              scrolled ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        <div className="relative z-10 mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href={prefix} className="relative z-[70] flex shrink-0 items-center">
            <Logo variant="text" size="xs" className="sm:hidden" priority />
            <Logo variant="text" size="sm" className="hidden sm:inline-flex" priority />
          </Link>

          <nav
            className="hidden items-center justify-center gap-0.5 lg:flex"
            aria-label={t("mainNavigation")}
          >
            {desktopNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.link}
                  href={item.link}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    "focus-visible:text-foreground",
                    "after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out",
                    "hover:text-foreground hover:after:scale-x-100 focus-visible:after:scale-x-100",
                    active
                      ? "text-foreground after:scale-x-100"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center justify-end gap-4 lg:flex">
            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="dropdown" compact />
              <div className="h-4 w-px bg-border/50" aria-hidden />
              <ThemeToggle variant="switch" compact />
            </div>
            <Link
              href={`${prefix}/contact`}
              aria-current={isActive("/contact") ? "page" : undefined}
              className={cn(
                "rounded-full bg-brand px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-light",
                isActive("/contact") && "ring-2 ring-brand-light/50 ring-offset-2 ring-offset-background",
              )}
            >
              {t("cta")}
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-[70] col-start-3 -mr-2.5 flex h-11 w-11 items-center justify-center justify-self-end text-foreground transition-colors hover:text-brand-text lg:hidden"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={closeMenu}
        toggleRef={menuButtonRef}
        items={items}
        ctaLabel={t("cta")}
        ctaHref={`${prefix}/contact`}
        isActive={isActive}
      />
    </>
  );
}
