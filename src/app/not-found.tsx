import "./globals.css";
import Link from "next/link";

// Fallback for URLs the proxy doesn't localize (e.g. missing files). The root
// layout renders no <html>/<body>, so this page provides its own.
export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center px-6 text-center font-sans antialiased">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-light"
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}
