"use client";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme")||"system";var r=t;if(t==="system"){r=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var e=document.documentElement;e.classList.remove("light","dark");e.classList.add(r);e.style.colorScheme=r}catch(n){}})();`;

// Lets `.reveal` blocks start hidden (JS is running). If RevealObserver hasn't
// taken over within 4s (slow hydration, script error), show everything.
const REVEAL_INIT_SCRIPT = `(function(){var e=document.documentElement;e.classList.add("js-reveal");setTimeout(function(){if(e.dataset.reveal!=="live")e.classList.remove("js-reveal")},4000)})();`;

/**
 * Blocking theme init for SSR only.
 * React 19 rejects <script> in the client tree — skip rendering on the client;
 * the tag from SSR stays in the document and runs before paint.
 */
export function ThemeScript() {
  if (typeof window !== "undefined") {
    return null;
  }

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT + REVEAL_INIT_SCRIPT }}
    />
  );
}
