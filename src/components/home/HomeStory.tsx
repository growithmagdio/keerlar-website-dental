"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, MapPin, Phone } from "lucide-react";
import { story } from "@/components/three/store";
import { Button } from "@/components/ui/Button";
import { ParallaxFrame, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { ExamSpecialList, InsuranceStrip } from "@/components/ui/Bits";
import { featuredServices, servicesList, site, whyChoose } from "@/lib/site";
import { HeroToothFamily } from "@/components/home/HeroToothFamily";

gsap.registerPlugin(ScrollTrigger);

const ToothScene = dynamic(() => import("@/components/three/ToothScene"), { ssr: false, loading: () => null });

const BG = ["#e8f5fd", "#eef8fe", "#f7fbff", "#eaf6fe", "#ddf5ff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ddf5ff"];
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const BGN = BG.map(hex);

const layers = [
  { name: "Enamel", text: "The hard, protective outer layer of the crown, and the hardest tissue in the human body." },
  { name: "Dentin", text: "The layer beneath the enamel. It is softer and carries sensations toward the nerve." },
  { name: "Pulp", text: "The living centre of the tooth, holding its nerves and blood vessels." },
  { name: "Root", text: "Anchors the tooth in the jawbone, below the gum line." },
];

const implantSteps = [
  { name: "Implant post", text: "A post is placed in the jawbone where the tooth is missing." },
  { name: "Abutment", text: "A connector is fitted to the post to hold the new tooth." },
  { name: "Crown", text: "A crown is fitted on top, between the neighbouring teeth." },
];

const gallery = [
  { src: "/assets/team/dr-keeler-office.webp", w: 665, h: 393, alt: "Dr. Keeler standing outside the log-cabin style dental office building in Eagle River", caption: "Dr. Keeler at our office", sub: "13012 Old Glenn Hwy, Eagle River" },
  { src: "/assets/clinic/keeler-office-street.webp", w: 862, h: 366, alt: "Dr. Keeler beside Old Glenn Highway near the Keeler Family Dental office", caption: "Easy to find on Old Glenn Hwy", sub: "Driving directions on our contact page", href: "/contact" },
  { src: "/assets/clinic/dr-keeler-finance-insurance.webp", w: 665, h: 317, alt: "Dr. Keeler with the words Finance and Insurance Options", caption: "Finance and Insurance Options", sub: "Payment plans that fit your budget", href: "/financing" },
];

export function HomeStory() {
  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const heroCopy = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const clinicPin = useRef<HTMLDivElement>(null);
  const clinicTrack = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [mount3D, setMount3D] = useState(false);

  // The hero is pure DOM; the WebGL stage loads once the hero has played (or as soon as the visitor scrolls).
  useEffect(() => {
    const go = () => setMount3D(true);
    const t = window.setTimeout(go, 2200);
    window.addEventListener("scroll", go, { once: true, passive: true });
    window.addEventListener("pointerdown", go, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", go);
      window.removeEventListener("pointerdown", go);
    };
  }, []);

  // Capability checks
  useEffect(() => {
    story.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    story.fast = new URLSearchParams(window.location.search).has("qa");
    const c = document.createElement("canvas");
    const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    setWebgl(ok);
    setLowPower((navigator.hardwareConcurrency || 8) <= 4 || window.innerWidth < 768);
  }, []);

  // Scroll -> scene index, treatment index, anatomy progress, backdrop colour
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let scenes: { top: number; h: number }[] = [];
    let treats: { top: number; h: number }[] = [];
    let anat = { top: 0, h: 1 };
    let impl = { top: 0, h: 1 };
    let steps: HTMLElement[] = [];
    const measure = () => {
      const y = window.scrollY;
      const rect = (n: Element) => {
        const r = n.getBoundingClientRect();
        return { top: r.top + y, h: Math.max(1, r.height) };
      };
      scenes = Array.from(el.querySelectorAll("[data-scene]")).map(rect);
      treats = Array.from(el.querySelectorAll("[data-treat]")).map(rect);
      const a = el.querySelector('[data-scene="1"]');
      if (a) anat = rect(a);
      const im = el.querySelector('[data-scene="3"]');
      if (im) impl = rect(im);
      steps = Array.from(el.querySelectorAll<HTMLElement>("[data-impl-step]"));
      update();
    };
    const locate = (list: { top: number; h: number }[], center: number) => {
      if (!list.length) return 0;
      let i = list.findIndex((s) => center >= s.top && center < s.top + s.h);
      if (i === -1) i = center < list[0].top ? 0 : list.length - 1;
      const f = Math.min(1, Math.max(0, (center - list[i].top) / list[i].h));
      return i + f;
    };
    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const center = y + vh * 0.5;
      // Each scene's 3D state is reached while its section enters the screen, then held.
      let s = 0;
      for (let k = 1; k < scenes.length; k++) {
        const e = Math.min(1, Math.max(0, (vh - (scenes[k].top - y)) / (vh * 0.7)));
        if (e > 0) s = k - 1 + e;
      }
      // The illustrated family owns the hero; the 3D trio only grows in once it has started to leave.
      story.scene = s < 1 ? Math.max(0, (s - 0.45) / 0.55) : s;
      const tStart = treats[0]?.top ?? 0;
      const tEnd = treats.length ? treats[treats.length - 1].top + treats[treats.length - 1].h : 0;
      story.treat = treats.length && center >= tStart && center < tEnd ? locate(treats, center) : -1;
      story.anat = Math.min(1, Math.max(0, (center - anat.top) / anat.h));
      const ip = Math.min(1, Math.max(0, (y - impl.top) / Math.max(1, impl.h - vh)));
      story.impl = ip;
      const active = ip < 0.04 ? -1 : ip < 0.5 ? 0 : ip < 0.68 ? 1 : 2;
      steps.forEach((n, k) => {
        const st = k === active ? "active" : k < active ? "done" : "todo";
        if (n.dataset.state !== st) n.dataset.state = st;
      });
      const i = Math.floor(s);
      const j = Math.min(BGN.length - 1, i + 1);
      const f = s - i;
      const mix = BGN[i].map((v, k) => Math.round(v + (BGN[j][k] - v) * f));
      backdrop.current?.style.setProperty("--stage-bg", `rgb(${mix.join(",")})`);
    };
    const onMove = (e: PointerEvent) => {
      story.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      story.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    ScrollTrigger.addEventListener("refresh", measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "0px 0px -2px 0px" });
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      ScrollTrigger.removeEventListener("refresh", measure);
      ro.disconnect();
      io.disconnect();
      story.scene = 0;
      story.treat = -1;
    };
  }, []);

  // Hero copy fades and lifts away; clinic gallery scrolls sideways while pinned (desktop)
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (heroCopy.current) {
        gsap.to(heroCopy.current, {
          autoAlpha: 0,
          y: -80,
          ease: "none",
          scrollTrigger: { trigger: heroCopy.current, start: "top top+=10%", end: "bottom top+=15%", scrub: true },
        });
      }
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = clinicTrack.current;
        const pin = clinicPin.current;
        if (!track || !pin) return;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const fallback = webgl === false;

  return (
    <div ref={root} className="relative">
      {/* Fixed 3D stage */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div ref={backdrop} className="stage-backdrop absolute inset-0 overflow-hidden">
          <div className="orb orb-a" style={{ width: "44vw", height: "44vw", left: "52%", top: "6%", background: "rgba(73,183,245,0.22)" }} />
          <div className="orb orb-b" style={{ width: "38vw", height: "38vw", left: "-12%", top: "52%", background: "rgba(221,245,255,0.95)" }} />
        </div>
        {webgl && mount3D ? <ToothScene active={active} lowPower={lowPower} /> : null}
      </div>

      <div className="relative z-10">
        {/* 01 HERO */}
        <section ref={heroRef} data-scene="0" className="relative flex min-h-[100svh] items-end overflow-x-clip pb-24 pt-[var(--header-h)] lg:items-center lg:pb-0">
          {/* Light-blue stage light for the hero; brightens as the family comes forward */}
          <div data-hero-light className="hero-light pointer-events-none absolute inset-x-0 top-0 h-[130%] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" aria-hidden />
          {/* The animated tooth family (layered illustration) */}
          <div className="pointer-events-none absolute left-1/2 top-[calc(var(--header-h)-5vw)] w-[122vw] max-w-[780px] -translate-x-1/2 sm:w-[104vw] lg:left-auto lg:right-[-6vw] lg:top-1/2 lg:w-[69vw] lg:max-w-[1380px] lg:translate-x-0 lg:-translate-y-[50%]">
            <HeroToothFamily sectionRef={heroRef} />
          </div>
          <div className="container-x relative grid w-full lg:grid-cols-12">
            <div ref={heroCopy} className="pt-[min(64vw,500px)] lg:col-span-5 lg:pt-0">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                Love your smile and welcome to Keeler Family Dentistry
              </motion.p>
              <SplitHeading as="h1" immediate className="mt-4 text-[2.35rem] font-semibold leading-[1.02] text-brand-ink sm:text-6xl lg:mt-5 lg:text-[4.3rem]">
                A Beautiful Smile Starts Here.
              </SplitHeading>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <p className="mt-4 max-w-md text-lg lg:mt-6 leading-relaxed text-slate">Personalized dental care for every member of your family.</p>
                <div className="mt-6 flex lg:mt-9 flex-wrap gap-3">
                  <Button href={site.portalUrl} external icon={<CalendarCheck className="h-4 w-4" />}>
                    Book an Appointment
                  </Button>
                  <Button href="/services" variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
                    Explore Our Treatments
                  </Button>
                </div>
                <ul className="mt-6 flex lg:mt-10 flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink/80">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky" />Same Day Appointments Available</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky" />24 Hour Emergency Dental Services</li>
                </ul>
                {/* Original home-page promotions */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/services#special" className="group flex items-center gap-3 promo-chip">
                  <Image src="/assets/other/promotions/new-patient-special-badge.webp" alt="New Patient Special: cleaning, exam, X-rays" width={372} height={383} className="h-11 w-11" />
                  <span className="text-sm font-semibold text-brand-ink">New Patient Special<br /><span className="font-normal text-slate">Cleaning, Exam, X-rays</span></span>
                  </Link>
                  <a href={site.membershipUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 promo-chip">
                  <Image src="/assets/other/promotions/no-insurance-membership.webp" alt="No insurance? Our patients don't need it. Click to get your preventive care for a low monthly fee" width={240} height={144} className="h-11 w-auto rounded-lg" />
                  <span className="text-sm font-semibold text-brand-ink">Join the Membership Club<br /><span className="font-normal text-slate">Preventive care, low monthly fee</span></span>
                  </a>
                </div>
                {fallback ? (
                  <Image src="/assets/logo/keeler-family-dental-logo.webp" alt="" width={700} height={357} className="mt-10 w-64" />
                ) : null}
              </motion.div>
            </div>
          </div>


          <div className="scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate md:flex">
            Scroll
            <div className="relative h-12 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-brand" />
            </div>
          </div>
        </section>

        {/* 02 ANATOMY: the tooth turns, opens and separates into its layers */}
        <section data-scene="1" className="pointer-events-none relative min-h-[175svh] py-24 lg:min-h-[250svh]">
          <div className="container-x grid lg:min-h-[230svh] lg:grid-cols-12">
            <Reveal className="pointer-events-auto mt-[40svh] rounded-[28px] bg-white/80 p-5 shadow-[0_30px_60px_-40px_rgba(10,42,66,0.45)] ring-1 ring-white/70 backdrop-blur-xl lg:sticky lg:top-28 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-start lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 lg:backdrop-blur-0">
              <span className="eyebrow" data-reveal>Inside a healthy tooth</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink lg:text-[2.75rem]">Healthy teeth take a lifetime of care.</SplitHeading>
              <p className="mt-5 leading-relaxed text-slate" data-reveal>
                Maintaining healthy teeth takes a lifetime of care. Even when we are complemented that we have nice teeth, it&apos;s beneficial to take the preventative steps every day to take care of them and prevent problems.
              </p>
              <p className="mt-6 text-sm font-medium text-brand" data-reveal>Scroll to turn the tooth and open it up. Point at a layer to highlight it.</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {layers.map((l, i) => (
                  <div
                    key={l.name}
                    className="layer-card grid cursor-pointer grid-cols-[2rem_1fr] gap-3 rounded-2xl bg-white/75 p-4 ring-1 ring-line backdrop-blur"
                    data-reveal
                    data-layer={i}
                    tabIndex={0}
                    onPointerEnter={() => (story.focus = i)}
                    onPointerLeave={() => (story.focus = -1)}
                    onFocus={() => (story.focus = i)}
                    onBlur={() => (story.focus = -1)}
                    onClick={() => (story.focus = story.focus === i ? -1 : i)}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ice font-display text-sm font-semibold text-brand">{i + 1}</span>
                    <div>
                      <dt className="font-display font-semibold text-brand-ink">{l.name}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate">{l.text}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="mt-7 text-sm leading-relaxed text-slate" data-reveal>
                Your own everyday habits are crucial to your overall oral health. Still, even the most dutiful brushers and flossers need to see a dentist regularly.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 03 TREATMENTS: each service gets its own 3D state */}
        <section data-scene="2" id="treatments" className="relative">
          <Reveal className="container-x pb-10 pt-24 lg:pt-32">
            <div className="max-w-2xl">
              <span className="eyebrow" data-reveal>Dental treatments</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-6xl">We provide many dental procedures as non-invasive as possible.</SplitHeading>
              <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
                Our team offers a variety of dental services, from basic preventive services to more complex dental implant and cosmetic procedures.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
                {servicesList.map((s) => (
                  <li key={s} className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-brand-ink ring-1 ring-line backdrop-blur">{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          {featuredServices.map((svc, i) => (
            <div key={svc.key} data-treat={i} className="flex min-h-[92svh] items-center py-12">
              <Reveal className="container-x grid w-full lg:grid-cols-12">
                <article className="service-card mt-[34svh] lg:col-span-6 lg:mt-0">
                  <div className="flex items-center gap-5" data-reveal>
                    <Image src={svc.img} alt={svc.alt} width={488} height={486} className="h-24 w-24 rounded-full object-cover shadow-[0_20px_40px_-20px_rgba(10,42,66,0.45)] ring-4 ring-white md:h-28 md:w-28" />
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-sky">
                      {String(i + 1).padStart(2, "0")} <span className="text-line">/</span> 05
                    </span>
                  </div>
                  <h3 className="mt-8 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-[3.4rem]" data-reveal>{svc.title}</h3>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate" data-reveal>{svc.blurb}</p>
                  <div className="mt-8" data-reveal>
                    <Link href={svc.href} className="group inline-flex items-center gap-3 font-semibold text-brand">
                      <span className="border-b border-brand/30 pb-1 transition-colors group-hover:border-brand">{svc.cta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </section>

        {/* 04 IMPLANT STORY: post, abutment and crown come together in a jaw section */}
        <section data-scene="3" id="implant-story" className="relative h-[240svh]">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <div className="container-x grid w-full lg:grid-cols-12">
              <Reveal className="pt-[38svh] lg:col-span-5 lg:pt-0">
                <span className="eyebrow" data-reveal>Implant dentistry</span>
                <SplitHeading className="mt-4 text-[2.1rem] font-semibold leading-[1.05] text-brand-ink md:text-[3.1rem]">Dental Implants and Bridges</SplitHeading>
                <p className="mt-5 hidden leading-relaxed text-slate md:block" data-reveal>
                  If you have lost or missing teeth, you may wish to consider dental implants from Keeler Family Dental. We offer implant dentistry services designed to restore your teeth and maintain the structural integrity of your mouth.
                </p>
                <ol className="mt-5 grid gap-2.5 md:mt-7 md:gap-3" data-reveal>
                  {implantSteps.map((st, i) => (
                    <li key={st.name} data-impl-step={i} className="impl-step flex items-start gap-4 rounded-2xl bg-white/70 p-3 ring-1 ring-line backdrop-blur md:p-4">
                      <span className="impl-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ice text-sm font-bold text-brand">{i + 1}</span>
                      <span>
                        <span className="block font-semibold text-brand-ink">{st.name}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-slate">{st.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 hidden text-xs text-slate md:block" data-reveal>3D illustration of how an implant-supported tooth is put together. Your treatment plan is discussed in person.</p>
                <div className="mt-6" data-reveal>
                  <Button href="/services#implant" variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>Implants and bridges</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 05 FAMILY DENTISTRY */}
        <section data-scene="4" className="relative flex min-h-[105svh] items-center py-24">
          <Reveal className="container-x grid lg:grid-cols-12">
            <div className="pt-[40svh] lg:col-span-5 lg:col-start-8 lg:pt-0">
              <span className="eyebrow" data-reveal>Your smile</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-6xl">Healthy Teeth. Happy Families.</SplitHeading>
              <p className="mt-7 font-display text-xl leading-snug text-brand" data-reveal>
                A family friendly dental practice...located in scenic Eagle River, Alaska
              </p>
              <p className="mt-5 leading-relaxed text-slate" data-reveal>
                promoting a classic and modern, gentle approach to oral health providing quality care to every patient who walks through our doors, by being attentive to our patients with open communication patient consultation.
              </p>
              <p className="mt-4 leading-relaxed text-slate" data-reveal>
                Whether you desire a general cleaning, whitening, dentures, teeth alignment, or are experiencing tooth pain, we will satisfy your concerns in a relaxed environment and take the time to answer any questions you have by calling our team at{" "}
                <a href={site.phoneHref} className="font-semibold text-brand underline-offset-4 hover:underline">{site.phoneDisplay}</a> or come into our Keeler Family Dental office located in Eagle River, Alaska today.
              </p>
              <p className="mt-8 border-l-2 border-sky pl-5 font-display text-lg font-medium text-brand-ink" data-reveal>
                Dentistry with family in mind; big or small we treat them all!
              </p>
            </div>
          </Reveal>
        </section>

        {/* 06 SMILE GALLERY (original illustration, no patient photos exist on the original site) */}
        <section data-scene="5" className="relative bg-white py-28 lg:py-36">
          <Reveal className="container-x grid items-center gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow" data-reveal>Smile gallery</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">A vision of dental wellness: solutions for missing teeth.</SplitHeading>
              <p className="mt-6 leading-relaxed text-slate" data-reveal>
                If you have lost or missing teeth, you may wish to consider dental implants from Keeler Family Dental. We offer implant dentistry services designed to restore your teeth and maintain the structural integrity of your mouth.
              </p>
              <p className="mt-4 text-sm text-slate" data-reveal>
                Drag the slider to compare. Illustration of an implant-supported denture, before and after it is seated.
              </p>
              <div className="mt-8" data-reveal>
                <Button href="/services#implant" variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>Dental implants and bridges</Button>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <BeforeAfter
                before="/assets/services/implant-denture-placement.webp"
                after="/assets/services/implant-denture-seated.webp"
                beforeLabel="Implants placed"
                afterLabel="Denture seated"
                width={465}
                height={330}
                alt="Implant-supported denture illustration"
              />
            </div>
          </Reveal>
        </section>

        {/* 07 DENTIST AND TEAM */}
        <section data-scene="6" className="relative bg-mist py-28 lg:py-36">
          <div className="container-x grid items-center gap-14 lg:grid-cols-12">
            <ParallaxFrame className="aspect-[665/393] lg:col-span-7">
              <div data-parallax className="absolute inset-0">
                <Image src="/assets/team/dr-keeler-office.webp" alt="Dr. Keeler outside the Keeler Family Dental office building" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
              </div>
            </ParallaxFrame>
            <Reveal className="lg:col-span-5">
              <span className="eyebrow" data-reveal>Hello from Dr. Keeler</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Hello from Dr. Keeler and Our Team,</SplitHeading>
              <p className="mt-6 font-display text-xl font-medium text-brand" data-reveal>A Beautiful Healthy Smile for Confidence in Your Life!</p>
              <p className="mt-5 leading-relaxed text-slate" data-reveal>
                At Keeler Family Dental we have delivered high quality and trusted care, building long-term caring relationships with patients of all ages.
              </p>
              <p className="mt-4 leading-relaxed text-slate" data-reveal>
                Dr. Keeler and his knowledgeable staff want you to be completely satisfied, which is why we strive to make your visit comfortable, convenient, and anxiety-free.
              </p>
              <p className="mt-4 font-semibold text-brand-ink" data-reveal>Trust us to enhance your oral health wellbeing!</p>
              <div className="mt-8" data-reveal>
                <Button href="/about" variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>About our practice</Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 08 CLINIC EXPERIENCE */}
        <section data-scene="7" className="relative bg-brand-ink text-white">
          <div ref={clinicPin} className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
            <Reveal className="container-x">
              <span className="eyebrow !text-sky" data-reveal>Our office</span>
              <SplitHeading className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">Dependable oral care in Eagle River.</SplitHeading>
              <p className="mt-6 max-w-2xl leading-relaxed text-white/70" data-reveal>
                We provide convenient office hours and flexible appointment scheduling. All ages friendly Keeler Family Dental is the dental practice to visit in Eagle River when you need dependable oral care.
              </p>
            </Reveal>
            <div ref={clinicTrack} className="mt-14 flex gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:px-10 lg:overflow-visible lg:pl-[max(40px,calc((100vw-1240px)/2+40px))]">
              {gallery.map((g) => {
                const card = (
                  <figure className="group relative w-[82vw] shrink-0 overflow-hidden rounded-[28px] bg-white/5 ring-1 ring-white/10 sm:w-[60vw] lg:w-[46vw]">
                    <div className="relative overflow-hidden" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
                      <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 46vw, 82vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
                    </div>
                    <figcaption className="flex items-end justify-between gap-4 p-6">
                      <span>
                        <span className="block font-display text-xl font-semibold">{g.caption}</span>
                        <span className="mt-1 block text-sm text-white/60">{g.sub}</span>
                      </span>
                      {g.href ? <ArrowUpRight className="h-5 w-5 text-sky" aria-hidden /> : null}
                    </figcaption>
                  </figure>
                );
                return g.href ? (
                  <Link key={g.src} href={g.href} className="shrink-0">{card}</Link>
                ) : (
                  <div key={g.src} className="shrink-0">{card}</div>
                );
              })}
              <div className="flex w-[82vw] shrink-0 flex-col justify-end rounded-[28px] bg-brand p-8 sm:w-[40vw] lg:w-[30vw]">
                <MapPin className="h-8 w-8 text-white" aria-hidden />
                <p className="mt-6 font-display text-2xl font-semibold">{site.address.street}<br />{site.address.city}, {site.address.regionLong}</p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-white/90 hover:text-white">
                  Keeler Family Dental Driving Directions <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 09 WHY US + SPECIALS + INSURANCE (the original site has no testimonials, so none are shown) */}
        <section data-scene="8" className="relative bg-white py-28 lg:py-36">
          <div className="container-x grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <span className="eyebrow" data-reveal>Why us</span>
              <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Why Choose Keeler Family Dental</SplitHeading>
              <ul className="mt-10 grid gap-0 border-t border-line">
                {whyChoose.map((w) => (
                  <li key={w} className="flex gap-4 border-b border-line py-5 text-lg text-brand-ink" data-reveal>
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-8 leading-relaxed text-slate" data-reveal>
                With so many dentists to choose from in the Eagle River, Alaska area, how do you know which dentist is right for you?
              </p>
              <p className="mt-4 leading-relaxed text-slate" data-reveal>
                Contact us for a consultation to see why others have put their trust with Keeler Family Dental and Team as their dental office of choice!
              </p>
              <p className="mt-4 leading-relaxed text-slate" data-reveal>
                Keeler Family Dental offers convenient hours for same-day emergency care, so that you don&apos;t have to wait in pain or risk your injury getting worse.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-5 lg:col-start-8">
              <div className="rounded-[32px] bg-mist p-8 ring-1 ring-line md:p-10" data-reveal>
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-2xl font-semibold leading-tight text-brand-ink">Comprehensive Treatment Planning Exam Specials</h3>
                  <Image src="/assets/other/promotions/new-patient-special-save-200.webp" alt="New Patient Special: save over $200" width={559} height={576} className="h-24 w-24 shrink-0 -rotate-6" />
                </div>
                <p className="mt-4 text-slate">During an initial dental treatment plan exam special offer, we will:</p>
                <div className="mt-6">
                  <ExamSpecialList />
                </div>
                <p className="mt-6 font-display font-semibold text-brand">New Patient Special: savings up to $200 off regular price!</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={site.phoneHref} icon={<Phone className="h-4 w-4" />}>Just Call Us</Button>
                  <Button href="/services#special" variant="secondary">Details</Button>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="container-x mt-24">
            <div className="flex flex-col gap-10 rounded-[32px] p-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-sm" data-reveal>
                <span className="eyebrow">Preferred provider</span>
                <p className="mt-3 text-slate">Preferred Provider: Denali Kid Care, Delta Insurance, Blue Cross/Blue Shield, FEP Blue Shield, and Metlife</p>
              </div>
              <div data-reveal>
                <InsuranceStrip />
              </div>
            </div>
            <a
              href={site.membershipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-12 flex flex-col items-start gap-6 rounded-[32px] bg-gradient-to-br from-brand to-brand-deep p-8 text-white sm:flex-row sm:items-center md:p-10"
              data-reveal
            >
              <Image src="/assets/other/promotions/no-insurance-membership.webp" alt="No insurance? Our patients don't need it." width={240} height={144} className="h-24 w-auto rounded-xl" />
              <div className="flex-1">
                <p className="font-display text-2xl font-semibold">No insurance? Our patients don&apos;t need it!</p>
                <p className="mt-2 text-white/80">Click to get your preventive care for a low monthly fee: join the Keeler Family Dental Membership Club.</p>
              </div>
              <ArrowUpRight className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </a>
          </Reveal>
        </section>

        {/* 10 BOOKING */}
        <section data-scene="9" className="relative flex min-h-[100svh] items-center py-28">
          <Reveal className="container-x grid w-full lg:grid-cols-12">
            <div className="pt-[38svh] lg:col-span-6 lg:pt-0">
              <span className="eyebrow" data-reveal>Book your visit</span>
              <SplitHeading className="mt-5 text-[2.6rem] font-semibold leading-[1.02] text-brand-ink sm:text-6xl">Your Smile Deserves the Best Care.</SplitHeading>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate" data-reveal>Let&apos;s make your next dental visit comfortable, simple, and stress-free.</p>
              <div className="mt-9 flex flex-wrap gap-3" data-reveal>
                <Button href={site.portalUrl} external icon={<CalendarCheck className="h-4 w-4" />}>Book an Appointment</Button>
                <Button href={site.phoneHref} variant="secondary" icon={<Phone className="h-4 w-4" />}>Call Our Office</Button>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2" data-reveal>
                <p className="flex gap-3 text-sm leading-relaxed text-slate">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  <span>{site.address.street}<br />{site.address.city}, {site.address.regionLong}</span>
                </p>
                <p className="flex gap-3 text-sm leading-relaxed text-slate">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  <span>Monday to Friday, 8:00 AM to 4:20 PM<br />Call for 24hr emergency services: {site.phoneDisplay}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
