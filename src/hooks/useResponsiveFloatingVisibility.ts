"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number;
  footerSelector?: string;
  mobileMaxWidth?: number;
};

export function useResponsiveFloatingVisibility({
  threshold = 160,
  footerSelector = "[data-site-footer]",
  mobileMaxWidth = 1024,
}: Options = {}) {
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`);

    const computeVisibility = () => {
      const hasScrolledPastThreshold = window.scrollY > threshold;
      const footer = document.querySelector<HTMLElement>(footerSelector);
      const isResponsiveViewport = mediaQuery.matches;

      let footerInViewport = false;
      if (footer && isResponsiveViewport) {
        const rect = footer.getBoundingClientRect();
        footerInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
      }

      setVisible(hasScrolledPastThreshold && (!isResponsiveViewport || !footerInViewport));
    };

    const scheduleCompute = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        computeVisibility();
      });
    };

    computeVisibility();

    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", scheduleCompute, { passive: true });
    window.addEventListener("orientationchange", scheduleCompute);
    mediaQuery.addEventListener("change", scheduleCompute);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", scheduleCompute);
      window.removeEventListener("orientationchange", scheduleCompute);
      mediaQuery.removeEventListener("change", scheduleCompute);
    };
  }, [footerSelector, mobileMaxWidth, threshold]);

  return visible;
}
