import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Software House in Medan`,
    short_name: siteConfig.name,
    description: "Custom web apps, mobile apps, ERP and IoT systems built in Medan, Indonesia.",
    start_url: "/",
    display: "browser",
    background_color: "#101726",
    theme_color: "#101726",
    icons: [
      { src: "/brand/logo-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
