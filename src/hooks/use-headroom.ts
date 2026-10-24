"use client";

import { useEffect, useState } from "react";

type HeadroomOptions = {
  /** Always shown above this scroll position (px). */
  offset?: number;
  /** Scroll distance (px) in one direction before the header reacts. */
  tolerance?: number;
};

/**
 * GitHub-style header: hides while scrolling down, comes back on the first
 * scroll up, and is always shown near the top. One rAF-throttled listener.
 */
export function useHeadroom({ offset = 80, tolerance = 6 }: HeadroomOptions = {}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y <= offset) {
        setHidden(false);
        lastY = y;
        return;
      }
      if (Math.abs(delta) < tolerance) return;
      setHidden(delta > 0);
      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset, tolerance]);

  return hidden;
}
