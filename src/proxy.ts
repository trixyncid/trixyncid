import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Every path except API routes, Next internals, the generated OG image, and
  // files with an extension (public assets, sitemap.xml, robots.txt, favicon.ico).
  // Unprefixed paths like /about get redirected to their locale.
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
