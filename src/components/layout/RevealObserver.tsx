"use client";

import { useEffect } from "react";

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 5;

function show(el: HTMLElement, instant: boolean) {
  if (instant) el.setAttribute("data-instant", "");
  el.setAttribute("data-shown", "");
}

/**
 * Plays each `.reveal` entrance once, as it enters the viewport from below.
 * Blocks entering together cascade in reading order. Anything above the
 * viewport (scrolling back up, back/forward, anchor jumps) is shown at once
 * with no motion, so scrolling up never meets half-faded content.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        let step = 0;
        for (const entry of entering) {
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (entry.boundingClientRect.top < 0) {
            show(el, true);
            continue;
          }
          el.style.setProperty("--reveal-stagger", `${Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
          show(el, false);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    function track(el: Element) {
      if (!(el instanceof HTMLElement) || el.hasAttribute("data-shown")) return;
      if (el.getBoundingClientRect().bottom < 0) {
        show(el, true);
        return;
      }
      io.observe(el);
    }

    function scan(node: ParentNode) {
      node.querySelectorAll(".reveal:not([data-shown])").forEach(track);
    }

    scan(document);
    // Client navigations and filtered lists add new `.reveal` blocks later.
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(".reveal")) track(node);
          scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // Tells the head script's failsafe that reveals are being driven.
    root.dataset.reveal = "live";

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
