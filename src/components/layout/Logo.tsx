import Image from "next/image";
import { brandAssets, logoSizes, type LogoSize, type LogoVariant } from "@/content/brand";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  /** Load eagerly (above-the-fold header logo). */
  priority?: boolean;
};

/**
 * Theme-aware logo. Both colour variants are rendered and CSS picks one via the
 * `dark` class (set before paint by ThemeScript), so there's no wrong-colour
 * flash while the theme store hydrates.
 */
export function Logo({
  variant = "full",
  size = "md",
  className,
  priority = false,
}: LogoProps) {
  const asset = brandAssets[variant];
  const sizeClass = logoSizes[size][variant];
  const loading = priority ? "eager" : "lazy";

  return (
    <span className={cn("relative inline-flex shrink-0 items-center", className)}>
      <Image
        src={asset.light}
        alt="Trixync"
        width={asset.width}
        height={asset.height}
        loading={loading}
        className={cn("w-auto dark:hidden", sizeClass)}
      />
      <Image
        src={asset.dark}
        alt="Trixync"
        width={asset.width}
        height={asset.height}
        loading={loading}
        className={cn("hidden w-auto dark:block", sizeClass)}
      />
    </span>
  );
}
