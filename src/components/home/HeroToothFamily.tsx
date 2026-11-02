"use client";

/*
 * Animated tooth family for the home hero.
 *
 * The artwork is a flat illustration, not a 3D model. It was cut into
 * separate transparent layers (left parent, right parent, child, plus mouth,
 * iris and eyelid patches). Depth comes from layering, parallax, scale,
 * perspective rotation, lighting, reflections and shadows.
 */

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TF, type ToothKey } from "./toothFamily.data";

gsap.registerPlugin(ScrollTrigger);

const { W, H } = TF;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;
const ORDER: ToothKey[] = ["adultL", "adultR", "baby"];

// How each tooth moves. Parents float slower and heavier; the child a little faster.
const PROFILE: Record<ToothKey, { amp: number; speed: number; rot: number; phase: number; depth: number; lean: number }> = {
  adultL: { amp: 9, speed: 0.62, rot: 1.1, phase: 0, depth: 0.55, lean: 1 },
  adultR: { amp: 9, speed: 0.55, rot: 1.0, phase: 2.1, depth: 0.6, lean: -1 },
  baby: { amp: 7, speed: 0.98, rot: 1.7, phase: 0.9, depth: 1, lean: 0 },
};

type Enter = { x: number; y: number; s: number; o: number; r: number };

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function HeroToothFamily({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = stage.current;
    const wrap = scroller.current;
    const section = sectionRef.current;
    const cv = canvas.current;
    if (!el || !wrap || !section || !cv) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
    const tooth = Object.fromEntries(ORDER.map((k) => [k, el.querySelector<HTMLElement>(`[data-tooth="${k}"]`)!])) as Record<ToothKey, HTMLElement>;
    const refl = Object.fromEntries(ORDER.map((k) => [k, el.querySelector<HTMLElement>(`[data-refl="${k}"]`)!])) as Record<ToothKey, HTMLElement>;
    const shadow = Object.fromEntries(ORDER.map((k) => [k, el.querySelector<HTMLElement>(`[data-shadow="${k}"]`)!])) as Record<ToothKey, HTMLElement>;
    const irises = q<HTMLElement>("[data-iris]");
    const lids = q<HTMLElement>("[data-lid]");
    const mouths = q<HTMLElement>("[data-mouth]");
    const sheens = q<HTMLElement>("[data-sheen]");
    const glowA = el.querySelector<HTMLElement>("[data-glow-a]")!;
    const fx = q<HTMLElement>("[data-fx]");
    const heart = q<SVGPathElement>("[data-heart]");
    const orbit = q<SVGElement>("[data-orbit]");
    const light = section.querySelector<HTMLElement>("[data-hero-light]");

    // ---- sparkles (one canvas, sprite based) ----
    const ctx = cv.getContext("2d")!;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    {
      const s = sprite.getContext("2d")!;
      const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(220,244,255,0.85)");
      g.addColorStop(1, "rgba(160,220,255,0)");
      s.fillStyle = g;
      s.fillRect(0, 0, 64, 64);
    }
    const small = window.innerWidth < 768;
    const N = small ? 44 : 96;
    const parts = Array.from({ length: N }, (_, i) => {
      const nearRing = i % 3 !== 0;
      const a = Math.random() * Math.PI * 2;
      return {
        x: nearRing ? 0.49 + Math.cos(a) * 0.42 * (0.9 + Math.random() * 0.2) : Math.random(),
        y: nearRing ? 0.71 + Math.sin(a) * 0.12 * (0.7 + Math.random() * 0.6) : 0.1 + Math.random() * 0.8,
        r: 0.6 + Math.random() * (i % 7 === 0 ? 2.6 : 1.4),
        v: 0.004 + Math.random() * 0.012,
        tw: Math.random() * Math.PI * 2,
        ts: 1.2 + Math.random() * 2.4,
        star: i % 7 === 0,
        bokeh: i % 11 === 5,
      };
    });
    let cw = 0;
    let ch = 0;
    let k = 1; // screen px per source px
    const resize = () => {
      const r = el.getBoundingClientRect();
      const sc = r.width / el.offsetWidth || 1;
      cw = r.width / sc;
      ch = r.height / sc;
      k = cw / W;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const drawSparkles = (t: number, dt: number, alpha: number) => {
      ctx.clearRect(0, 0, cw, ch);
      if (alpha <= 0.01) return;
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= p.v * dt * 0.6;
        if (p.y < 0.04) {
          p.y = 0.92;
          p.x = 0.08 + Math.random() * 0.84;
        }
        const tw = 0.35 + 0.65 * Math.pow(Math.sin(t * p.ts + p.tw) * 0.5 + 0.5, 2);
        const size = p.bokeh ? (cw / 900) * (26 + p.r * 14) : p.r * (cw / 900) * (p.star ? 7 : 5);
        const x = p.x * cw;
        const y = p.y * ch;
        ctx.globalAlpha = tw * alpha * (p.bokeh ? 0.16 : p.star ? 0.95 : 0.7);
        ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
        if (p.star) {
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 0.8;
          const L = size * 0.9 * tw;
          ctx.beginPath();
          ctx.moveTo(x - L, y);
          ctx.lineTo(x + L, y);
          ctx.moveTo(x, y - L);
          ctx.lineTo(x, y + L);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ---- reduced motion: a still, fully composed frame ----
    if (reduced) {
      drawSparkles(1, 0, 0.8);
      const onR = () => {
        resize();
        drawSparkles(1, 0, 0.8);
      };
      window.addEventListener("resize", onR);
      return () => window.removeEventListener("resize", onR);
    }

    // ---- animated state ----
    const enter: Record<ToothKey, Enter> = {
      adultL: { x: -560, y: 30, s: 0.92, o: 0, r: -9 },
      adultR: { x: 560, y: 30, s: 0.92, o: 0, r: 9 },
      baby: { x: 0, y: 300, s: 0.72, o: 0, r: 0 },
    };
    const bounce = { y: 0, sx: 1, sy: 1 };
    const lean = { v: 0 };
    const scene = { glow: 0, fx: 0 };
    const scroll = { p: 0, s: 0 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const look = { x: 0, y: 0 };

    gsap.set(lids, { y: 0, yPercent: -104 });
    gsap.set(heart, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(orbit, { opacity: 0 });
    gsap.set(fx, { opacity: 0 });

    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .to(scene, { glow: 1, duration: 1.4, ease: "power2.out" }, 0)
      .to(fx, { opacity: 1, duration: 1.2, ease: "power1.out", stagger: 0.1 }, 0.1)
      .to(heart, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0.15)
      .to(scene, { fx: 1, duration: 1.6, ease: "power1.out" }, 0.25)
      .to(enter.adultL, { x: 0, y: 0, s: 1, o: 1, r: 0, duration: 1.5, ease: "expo.out" }, 0.35)
      .to(enter.adultR, { x: 0, y: 0, s: 1, o: 1, r: 0, duration: 1.5, ease: "expo.out" }, 0.48)
      .to(enter.baby, { y: 0, s: 1, o: 1, duration: 1.35, ease: "back.out(1.5)" }, 0.8)
      .to(orbit, { opacity: 1, duration: 1.2, ease: "power2.out" }, 1.0);

    // ---- character loops (start once everyone is on stage) ----
    const loops: gsap.core.Animation[] = [];
    const calls: gsap.core.Tween[] = [];
    intro.call(() => {
      // smile: the mouth patches widen a touch, slow and soft
      loops.push(
        gsap.to(mouths, {
          scaleY: 1.06,
          scaleX: 1.03,
          duration: 2.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 0.7 },
        }),
      );
      // glossy highlight sweeping across the enamel
      sheens.forEach((n, i) => {
        gsap.set(n, { xPercent: -130, skewX: -16 });
        loops.push(gsap.timeline({ repeat: -1, repeatDelay: 5.2, delay: 0.3 + i * 0.45 }).to(n, { xPercent: 340, duration: 1.5, ease: "power2.inOut" }));
      });
      // child bounce, now and then
      const b = gsap.timeline({ repeat: -1, repeatDelay: 2.8, delay: 0.6 });
      b.to(bounce, { sy: 0.94, sx: 1.04, duration: 0.16, ease: "power2.out" })
        .to(bounce, { y: -30, sy: 1.04, sx: 0.97, duration: 0.34, ease: "power2.out" })
        .to(bounce, { y: 0, sy: 1, sx: 1, duration: 0.36, ease: "power2.in" })
        .to(bounce, { sy: 0.95, sx: 1.03, duration: 0.1, ease: "power1.out" })
        .to(bounce, { sy: 1, sx: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" })
        .to(bounce, { y: -14, duration: 0.24, ease: "power2.out" }, "+=0.05")
        .to(bounce, { y: 0, duration: 0.3, ease: "bounce.out" });
      loops.push(b);
      // parents lean toward the child
      const l = gsap.timeline({ repeat: -1, repeatDelay: 3.6, delay: 1.8 });
      l.to(lean, { v: 1, duration: 1.3, ease: "sine.inOut" }).to(lean, { v: 0, duration: 1.4, ease: "sine.inOut" }, "+=1.6");
      loops.push(l);
      // blinking, each parent on their own rhythm
      const groups = ["adultL", "adultR"].map((key) => lids.filter((n) => n.dataset.lid === key));
      groups.forEach((g, gi) => {
        const blink = () => {
          const double = Math.random() < 0.22;
          const tl = gsap.timeline();
          tl.to(g, { yPercent: 0, duration: 0.075, ease: "power2.in" }).to(g, { yPercent: -104, duration: 0.14, ease: "power2.out" });
          if (double) tl.to(g, { yPercent: 0, duration: 0.07, ease: "power2.in" }, "+=0.08").to(g, { yPercent: -104, duration: 0.14, ease: "power2.out" });
          calls[gi] = gsap.delayedCall(2.2 + Math.random() * 3.6, blink);
        };
        calls[gi] = gsap.delayedCall(0.4 + gi * 1.3, blink);
      });
      // eyes glance around a little when the pointer is still
      const glance = () => {
        gsap.to(look, { x: gsap.utils.random(-1, 1), y: gsap.utils.random(-0.6, 0.6), duration: 0.35, ease: "power2.out" });
        calls[5] = gsap.delayedCall(1.6 + Math.random() * 2.4, glance);
      };
      calls[5] = gsap.delayedCall(1.2, glance);
    });

    // ---- scroll: teeth come toward the viewer, the child rises, parents turn inward ----
    const isDesk = () => window.innerWidth >= 1024;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scroll.p = self.progress;
      },
    });

    // ---- pointer ----
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    // ---- visibility: pause the frame loop when off screen ----
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "120px" });
    io.observe(section);

    const irisData = irises.map((n) => ({ n, amp: Number(n.dataset.iris) || 4 }));
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const t = now / 1000;
      scroll.s += (scroll.p - scroll.s) * Math.min(1, dt * 7);
      const p = scroll.s;
      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 4);
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 4);

      // stage: grows toward the viewer and drifts into the next section, then hands off
      const desk = isDesk();
      const sh = section.offsetHeight;
      const lift = smooth(0, 1, p);
      const fade = desk ? 1 - smooth(0.2, 0.56, p) : 1 - smooth(0.12, 0.46, p);
      const dx = desk ? -0.3 * window.innerWidth * lift : 0;
      const dy = sh * (desk ? 0.46 : 0.16) * lift;
      wrap.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${(1 + (desk ? 0.32 : 0.22) * lift).toFixed(4)})`;
      wrap.style.opacity = fade.toFixed(3);
      wrap.style.visibility = fade < 0.01 ? "hidden" : "visible";

      // light: glow breathes; the hero background brightens as the teeth come forward
      const breathe = 0.92 + Math.sin(t * 0.9) * 0.08;
      glowA.style.opacity = (scene.glow * (0.85 + lift * 0.4) * breathe).toFixed(3);
      glowA.style.transform = `translate(-50%, -50%) scale(${(0.96 + Math.sin(t * 0.7) * 0.04 + lift * 0.25).toFixed(3)})`;
      if (light) light.style.setProperty("--hero-light", lift.toFixed(3));

      for (const key of ORDER) {
        const pr = PROFILE[key];
        const e = enter[key];
        const fy = Math.sin(t * pr.speed + pr.phase) * pr.amp;
        const fxv = Math.sin(t * pr.speed * 0.63 + pr.phase * 1.7) * pr.amp * 0.4;
        const fr = Math.sin(t * pr.speed * 0.82 + pr.phase + 1) * pr.rot;
        let x = e.x + fxv + mouse.x * pr.depth * 16;
        let y = e.y + fy + mouse.y * pr.depth * 9;
        let rz = e.r + fr + pr.lean * lean.v * 3.4;
        let ry = mouse.x * pr.depth * 5;
        let s = e.s;
        let sx = 1;
        let sy = 1;
        x += pr.lean * lean.v * 7;
        if (key === "baby") {
          y += bounce.y - lift * 80;
          sx = bounce.sx;
          sy = bounce.sy;
          s *= 1 + lift * 0.34;
        } else {
          // parents turn their faces toward the centre and close in
          ry += pr.lean * lift * 18;
          rz += pr.lean * lift * 2.5;
          x += pr.lean * lift * 46;
          s *= 1 + lift * 0.1;
        }
        // breathing: a slow, slight vertical stretch, each tooth on its own phase
        const br = Math.sin(t * (key === "baby" ? 2.1 : 1.5) + pr.phase * 2) * (key === "baby" ? 0.011 : 0.008);
        sy *= 1 + br;
        sx *= 1 - br * 0.45;
        const tr = tooth[key];
        tr.style.opacity = e.o.toFixed(3);
        tr.style.transform = `translate3d(${(x * k).toFixed(2)}px, ${(y * k).toFixed(2)}px, 0) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${(s * sx).toFixed(4)}, ${(s * sy).toFixed(4)})`;
        // reflection mirrors the float: when a tooth lifts, its reflection drops
        const rf = refl[key];
        rf.style.opacity = (e.o * 0.3).toFixed(3);
        rf.style.transform = `translate3d(${(x * k).toFixed(2)}px, ${(-y * k).toFixed(2)}px, 0) rotateY(${ry.toFixed(2)}deg) rotateZ(${(-rz).toFixed(2)}deg) scale(${(s * sx).toFixed(4)}, ${(-s * sy).toFixed(4)})`;
        // contact shadow: tighter and darker on the floor, softer when lifted
        const up = Math.max(0, -y);
        const sd = shadow[key];
        sd.style.opacity = (e.o * Math.max(0.15, 0.85 - up * 0.012)).toFixed(3);
        sd.style.transform = `translate3d(${(x * k).toFixed(2)}px, 0, 0) scale(${(s * (1 - Math.min(0.35, up * 0.005))).toFixed(3)})`;
      }

      // eyes follow the pointer, with small idle glances
      const lx = mouse.x * 0.75 + look.x * 0.45;
      const ly = mouse.y * 0.6 + look.y * 0.4;
      for (const { n, amp } of irisData) n.style.transform = `translate3d(${(lx * amp * k).toFixed(2)}px, ${(ly * amp * 0.7 * k).toFixed(2)}px, 0)`;

      drawSparkles(t, dt, scene.fx * (1 - lift * 0.4));
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      intro.kill();
      loops.forEach((a) => a.kill());
      calls.forEach((c) => c?.kill());
      st.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [sectionRef]);

  const box = (b: readonly number[]) => ({ left: pct(b[0], W), top: pct(b[1], H), width: pct(b[2], W), height: pct(b[3], H) });
  const inner = (b: readonly number[], parent: readonly number[]) => ({
    left: pct(b[0] - parent[0], parent[2]),
    top: pct(b[1] - parent[1], parent[3]),
    width: pct(b[2], parent[2]),
    height: pct(b[3], parent[3]),
  });

  return (
    <div ref={scroller} className="tf-scroller" aria-hidden>
      <div ref={stage} className="tf-stage" style={{ aspectRatio: `${W} / ${H}` }}>
        {/* light */}
        <div data-glow-a className="tf-glow" style={{ left: pct(TF.glow[0], W), top: pct(TF.glow[1], H) }} />

        {/* heart arc and back half of the orbit, behind the family */}
        <svg data-fx className="tf-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <filter id="tf-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id="tf-blur-s" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <linearGradient id="tf-ring" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#c9ecff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
            <clipPath id="tf-back">
              <rect x="0" y="0" width={W} height={TF.orbit.cy} />
            </clipPath>
            <clipPath id="tf-front">
              <rect x="0" y={TF.orbit.cy} width={W} height={H - TF.orbit.cy} />
            </clipPath>
          </defs>
          <path data-heart d={TF.heart} pathLength={1} fill="none" stroke="#9edbff" strokeWidth="16" strokeLinecap="round" opacity="0.55" filter="url(#tf-blur)" />
          <path data-heart d={TF.heart} pathLength={1} fill="none" stroke="#f4fbff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
          <g data-orbit clipPath="url(#tf-back)">
            <Orbit />
          </g>
        </svg>

        {/* floor: contact shadows and reflections */}
        {ORDER.map((key) => {
          const t = TF.teeth[key];
          return (
            <div key={`s-${key}`} data-shadow={key} className="tf-shadow" style={{ left: pct(t.foot[0] - t.box[2] * 0.33, W), width: pct(t.box[2] * 0.66, W), top: pct(t.foot[1] - 14, H), height: pct(28, H) }} />
          );
        })}
        {ORDER.map((key) => {
          const t = TF.teeth[key];
          const b = t.box;
          return (
            <div
              key={`r-${key}`}
              data-refl={key}
              className="tf-refl"
              style={{ ...box(b), transformOrigin: `${pct(t.foot[0] - b[0], b[2])} ${pct(t.foot[1] - b[1], b[3])}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" draggable={false} />
            </div>
          );
        })}

        {/* the family */}
        {ORDER.map((key) => {
          const t = TF.teeth[key];
          const b = t.box;
          return (
            <div
              key={key}
              data-tooth={key}
              className="tf-tooth"
              style={{ ...box(b), transformOrigin: `${pct(t.foot[0] - b[0], b[2])} ${pct(t.foot[1] - b[1], b[3])}`, zIndex: key === "baby" ? 3 : 2 }}
            >
              {/* soft blue rim / back light: the tooth's own silhouette, blurred behind it */}
              <div className="tf-halo">
                <div style={{ WebkitMaskImage: `url(${t.src})`, maskImage: `url(${t.src})` }} />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" draggable={false} fetchPriority="high" />
              {/* ambient sky-blue shading on the side away from the key light */}
              <div className="tf-ambient" style={{ WebkitMaskImage: `url(${t.src})`, maskImage: `url(${t.src})` }} />
              {TF.parts
                .filter((p) => p.tooth === key)
                .map((p, i) =>
                  p.kind === "lid" ? (
                    <div key={i} className="tf-socket" style={inner(p.box, b)}>
                      <div data-lid={key} className="tf-lid" style={{ background: `linear-gradient(180deg, ${p.color[0]} 0%, ${p.color[1]} 100%)` }} />
                    </div>
                  ) : p.kind === "iris" ? (
                    <div key={i} className="tf-socket" style={inner(p.clip, b)}>
                      <div data-iris={p.amp} className="tf-part" style={inner(p.box, p.clip)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt="" draggable={false} />
                      </div>
                    </div>
                  ) : (
                    <div key={i} data-mouth className="tf-part tf-mouth" style={inner(p.box, b)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt="" draggable={false} />
                    </div>
                  ),
                )}
              {/* glossy enamel highlight that sweeps across now and then */}
              <div className="tf-sheen" style={{ WebkitMaskImage: `url(${t.src})`, maskImage: `url(${t.src})` }}>
                <span data-sheen />
              </div>
            </div>
          );
        })}

        {/* front half of the orbit passes in front of the family */}
        <svg data-fx className="tf-svg tf-front" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <g data-orbit clipPath="url(#tf-front)">
            <Orbit />
          </g>
        </svg>

        <canvas ref={canvas} data-fx className="tf-canvas" />
      </div>
    </div>
  );
}

function Orbit() {
  const o = TF.orbit;
  const tr = `rotate(${o.rot} ${o.cx} ${o.cy})`;
  return (
    <g transform={tr}>
      <ellipse cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} fill="none" stroke="#bfe6ff" strokeWidth="14" opacity="0.45" filter="url(#tf-blur)" />
      <ellipse cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} fill="none" stroke="url(#tf-ring)" strokeWidth="2.6" opacity="0.95" />
      <ellipse className="tf-comet" cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} pathLength={1000} fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" filter="url(#tf-blur-s)" />
      <ellipse className="tf-comet tf-comet-b" cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} pathLength={1000} fill="none" stroke="#e6f7ff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
