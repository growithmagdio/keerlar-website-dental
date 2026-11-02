"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisRef: Lenis | null = null;
export const getLenis = () => lenisRef;

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -88 },
    });
    lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  // New page: start at the top (or at the #hash) and re-measure triggers.
  useEffect(() => {
    const hash = window.location.hash;
    const lenis = lenisRef;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        requestAnimationFrame(() => {
          if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -88, immediate: true });
          else (el as HTMLElement).scrollIntoView();
        });
      }
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
