import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionShell } from "@/components/shared/SectionShell";
import { type Locale } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as Locale;

  return (
    <SectionShell containerSize="narrow" className="py-20 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        {t("notFound.eyebrow")}
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {t("notFound.title")}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        {t("notFound.description")}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light"
      >
        {t("notFound.cta")}
      </Link>
    </SectionShell>
  );
}
