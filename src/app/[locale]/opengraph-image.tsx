import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export const alt = "Trixync, Built in Sync";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// One card per language, rendered at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function buildDotGrid() {
  const width = 1200;
  const height = 630;
  const gap = 46;
  const radius = 2;
  let dots = "";
  for (let y = gap; y < height; y += gap) {
    for (let x = gap; x < width; x += gap) {
      dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="#3866F2" fill-opacity="0.16"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${dots}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * The default renderer has Latin glyphs only. For Chinese, load a Noto Sans SC
 * subset holding just this text (TTF, which the renderer can read).
 */
async function loadCjkFont(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@600&text=${encodeURIComponent(text)}`,
      { cache: "force-cache" },
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url, { cache: "force-cache" }).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Image({ params }: Props) {
  const { locale: requested } = await params;
  const locale: Locale = routing.locales.includes(requested as Locale) ? (requested as Locale) : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata.og" });
  let line = t("line");
  let cta = t("cta");
  let fonts: { name: string; data: ArrayBuffer; weight: 600; style: "normal" }[] | undefined;
  if (locale === "zh") {
    const font = await loadCjkFont(`Built in Sync${line}${cta}`);
    if (font) {
      fonts = [{ name: "Noto Sans SC", data: font, weight: 600, style: "normal" }];
    } else {
      // No CJK glyphs available: an English card beats one full of empty boxes.
      const tEn = await getTranslations({ locale: "en", namespace: "metadata.og" });
      line = tEn("line");
      cta = tEn("cta");
    }
  }

  const logo = await readFile(
    join(process.cwd(), "public/brand/logo-full-white.svg"),
    "base64",
  );
  const logoSrc = `data:image/svg+xml;base64,${logo}`;
  const dotGridSrc = buildDotGrid();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#101726",
          fontFamily: fonts ? "Noto Sans SC" : "sans-serif",
        }}
      >
        <img
          src={dotGridSrc}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle at 50% 22%, rgba(56,102,242,0.34) 0%, rgba(56,102,242,0) 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
            <img src={logoSrc} width={440} height={252} alt="Trixync" />

          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              color: "#c5ccda",
              marginTop: 36,
            }}
          >
            Built in Sync
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              color: "#8b93a7",
              marginTop: 14,
            }}
          >
            {line}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              padding: "20px 44px",
              borderRadius: 999,
              background: "#3866F2",
              color: "#FCFDFF",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            {cta}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
