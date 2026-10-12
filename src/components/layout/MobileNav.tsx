"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

type MobileNavItem = {
  name: string;
  link: string;
  href: string;
  icon?: React.ReactNode;
};

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  ctaLabel: string;
  ctaHref: string;
  isActive: (href: string) => boolean;
  className?: string;
};

/**
 * CSS-driven mobile menu — no Framer springs / staggered Motion nodes.
 * Keeps the open animation on the compositor (transform + opacity only) so it
 * stays smooth even when WebGL layers were recently active under the header.
 */
export function MobileNav({
  open,
  onClose,
  items,
  ctaLabel,
  ctaHref,
  isActive,
  className,
}: MobileNavProps) {
  const tNav = useTranslations("nav");
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("mobile-nav-root fixed inset-0 z-[60] lg:hidden", className)}>
      <button
        type="button"
        aria-label={tNav("closeMenu")}
        className="mobile-nav-backdrop absolute inset-0 bg-background/80"
        onClick={onClose}
      />

      <nav
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={tNav("mobileNavigation")}
        aria-labelledby="mobile-navigation-title"
        className="mobile-nav-panel absolute inset-x-0 top-0 flex max-h-[100dvh] min-h-[100dvh] flex-col overflow-y-auto bg-background pt-20"
      >
        <h2 id="mobile-navigation-title" className="sr-only">
          {tNav("mobileNavigation")}
        </h2>
        <div className="flex flex-1 flex-col px-6 pb-8 pt-2">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group flex items-center gap-3 rounded-xl px-1 py-3.5 transition-colors hover:bg-muted/40"
                >
                  {item.icon && (
                    <span className="shrink-0 text-brand" aria-hidden>
                      {item.icon}
                    </span>
                  )}
                  <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-5 border-t border-border/40 pt-8">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {tNav("language")}
              </p>
              <LanguageSwitcher variant="buttons" />
            </div>
            <ThemeToggle variant="switch" showLabel className="py-1" />
            <Link
              href={ctaHref}
              onClick={onClose}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
