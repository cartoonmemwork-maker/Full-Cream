"use client";

import { useEffect, useRef } from "react";

const easeInOutCubic = (progress: number) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

export default function SmoothAnchorFallback() {
  const frameRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleClick = (event: MouseEvent) => {
      if (
        !reducedMotion.matches ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const hash = link?.getAttribute("href");
      const target =
        hash && hash !== "#" ? document.querySelector<HTMLElement>(hash) : null;

      if (!link || !target) {
        return;
      }

      event.preventDefault();
      cancelAnimationFrame(frameRef.current);

      const start = window.scrollY;
      const offset =
        Number.parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      const destination = Math.max(
        0,
        target.getBoundingClientRect().top + start - offset,
      );
      const distance = destination - start;
      const duration = Math.min(720, Math.max(420, Math.abs(distance) * 0.45));
      const startedAt = performance.now();

      window.history.pushState(null, "", hash);

      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return null;
}
