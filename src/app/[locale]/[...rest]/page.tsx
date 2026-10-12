import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { notFoundMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return notFoundMetadata(t("notFound.title"));
}

// Catches unmatched paths under a locale so they render [locale]/not-found.tsx
// inside the localized layout instead of Next's bare default 404.
export default function CatchAllPage() {
  notFound();
}
