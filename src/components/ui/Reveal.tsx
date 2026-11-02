"use client";

import { useLayoutEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Staggered rise for every [data-reveal] child when the block scrolls into view. */
export function Reveal({ children, className = "", as: Tag = "div", stagger = 0.08, id }: { children: ReactNode; className?: string; as?: ElementType; stagger?: number; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return;
    const ctx = gsap.context(() => {
      const items = ref.current!.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.from(items, {
        y: 36,
        autoAlpha: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [stagger]);
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}

/** Headline that rises line by line from behind a mask. */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className = "",
  immediate = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return;
    let tween: gsap.core.Tween | undefined;
    const split = SplitText.create(ref.current, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit(self) {
        tween?.kill();
        tween = gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          delay: immediate ? 0.15 : 0,
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 85%", once: true },
        });
        return tween;
      },
    });
    return () => {
      tween?.kill();
      split.revert();
    };
  }, [immediate]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Image that drifts against the scroll inside its frame and un-masks on entry. */
export function ParallaxFrame({ children, className = "", strength = 12 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || reduced()) return;
    const ctx = gsap.context(() => {
      const inner = ref.current!.querySelector("[data-parallax]");
      gsap.fromTo(ref.current, { clipPath: "inset(12% 8% 12% 8% round 28px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 40%", scrub: true },
      });
      if (inner) {
        gsap.fromTo(inner, { yPercent: -strength / 2, scale: 1.12 }, {
          yPercent: strength / 2,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, [strength]);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[28px] ${className}`}>
      {children}
    </div>
  );
}
