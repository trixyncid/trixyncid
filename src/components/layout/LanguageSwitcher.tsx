"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, type Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { LocaleFlag, localeNames } from "./LocaleFlag";
import { cn } from "@/lib/utils";

function setLocaleCookie(nextLocale: string) {
  document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
}

type LanguageSwitcherProps = {
  className?: string;
  variant?: "buttons" | "dropdown";
  compact?: boolean;
};

function FlagOption({
  loc,
  active,
  onSelect,
  size = "md",
}: {
  loc: Locale;
  active: boolean;
  onSelect: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      lang={loc}
      aria-label={localeNames[loc]}
      title={localeNames[loc]}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center justify-center rounded-md transition-all",
        size === "sm" ? "h-9 w-10" : "h-11 w-11",
        active
          ? "bg-brand/10 ring-1 ring-brand/40"
          : "opacity-75 hover:bg-muted/60 hover:opacity-100",
      )}
    >
      <LocaleFlag locale={loc} className={size === "sm" ? "h-3.5 w-[1.375rem]" : "h-4 w-6"} />
    </button>
  );
}

export function LanguageSwitcher({
  className,
  variant = "dropdown",
  compact = false,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }
    setLocaleCookie(nextLocale);
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "buttons") {
    return (
      <div role="group" aria-label={tNav("selectLanguage")} className={cn("flex items-center gap-1", className)}>
        {routing.locales.map((loc) => (
          <FlagOption
            key={loc}
            loc={loc}
            active={loc === locale}
            onSelect={() => switchLocale(loc)}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${tNav("language")}: ${localeNames[locale]}`}
        className={cn(
          "flex items-center justify-center gap-1 text-foreground transition-colors",
          compact
            ? cn(
                "h-9 px-2 text-muted-foreground hover:text-foreground",
                open && "text-foreground",
              )
            : "h-11 w-full gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 hover:border-border hover:bg-card/70 md:w-auto",
        )}
      >
        <LocaleFlag locale={locale} className={compact ? "h-3.5 w-[1.375rem]" : "h-4 w-6"} />
        <ChevronDown
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            compact ? "h-3 w-3" : "h-3.5 w-3.5",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full z-50 pt-1",
            compact ? "right-0" : "left-0 md:left-auto",
          )}
        >
          <ul
            id={menuId}
            aria-label={tNav("selectLanguage")}
            className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-popover p-1 shadow-md"
          >
            {routing.locales.map((loc) => (
              <li key={loc}>
                <FlagOption
                  loc={loc}
                  active={loc === locale}
                  onSelect={() => switchLocale(loc)}
                  size={compact ? "sm" : "md"}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
