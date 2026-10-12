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
  /** The header toggle button — kept in the focus loop so the menu can be closed by keyboard. */
  toggleRef: React.RefObject<HTMLButtonElement | null>;
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
  toggleRef,
  items,
  ctaLabel,
  ctaHref,
  isActive,
  className,
}: MobileNavProps) {
  const tNav = useTranslations("nav");
  const panelRef = useRef<HTMLElement>(null);

  // Keep the latest onClose without re-running the open effect on every header render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Page content behind the overlay can't be reached by Tab or screen readers.
    const background = [document.getElementById("main-content"), document.querySelector("body footer")];
    background.forEach((node) => node?.setAttribute("inert", ""));

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ].filter((node): node is HTMLElement => Boolean(node));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((node) => node?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, toggleRef]);

  if (!open) return null;

  return (
    <div className={cn("mobile-nav-root fixed inset-0 z-[60] lg:hidden", className)}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
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
            {items.map((item) => {
              const active = isActive(item.href);
              return (
              <li key={item.link}>
                <Link
                  href={item.link}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-muted/40",
                    active && "bg-brand/10",
                  )}
                >
                  {item.icon && (
                    <span className="shrink-0 text-brand-text" aria-hidden>
                      {item.icon}
                    </span>
                  )}
                  <span
                    className={cn(
                      "font-heading text-2xl font-semibold tracking-tight",
                      active ? "text-brand-text" : "text-foreground",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
              );
            })}
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
