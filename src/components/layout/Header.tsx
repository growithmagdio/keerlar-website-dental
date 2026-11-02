"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const bar = useRef<HTMLDivElement>(null);
  // Thin reading-progress line along the bottom of the header
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ${
        solid ? "bg-white/75 shadow-[0_1px_0_rgba(12,31,46,0.06)] backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div ref={bar} className="scroll-progress" aria-hidden />
      <div className="container-x flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="relative shrink-0" aria-label="Keeler Family Dental, home">
          <Image
            src="/assets/logo/keeler-family-dental-logo.webp"
            alt="Keeler Family Dental"
            width={700}
            height={357}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <nav aria-label="Main" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = !item.external && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
              const cls = `relative block rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors duration-300 ${
                active ? "text-brand" : "text-ink/75 hover:text-ink"
              }`;
              return (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${cls} inline-flex items-center gap-1`}>
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                    </a>
                  ) : (
                    <Link href={item.href} className={cls} aria-current={active ? "page" : undefined}>
                      {active ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-ice"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-brand-ink transition-colors hover:text-brand xl:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {site.phoneDisplay}
          </a>
          <motion.a
            href={site.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="hidden min-h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(22,132,199,0.8)] transition-colors hover:bg-brand-deep sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden />
            Book Appointment
          </motion.a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand-ink ring-1 ring-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-[calc(var(--header-h)+env(safe-area-inset-top,0px))] overflow-y-auto bg-white lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 pb-10 pt-6">
              {nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b border-line py-4 font-display text-2xl font-semibold text-ink">
                      {item.label}
                      <ArrowUpRight className="h-5 w-5 text-brand" aria-hidden />
                    </a>
                  ) : (
                    <Link href={item.href} className={`block border-b border-line py-4 font-display text-2xl font-semibold ${pathname === item.href ? "text-brand" : "text-ink"}`}>
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="mt-8 grid gap-3">
                <a href={site.portalUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-semibold text-white">
                  <CalendarCheck className="h-5 w-5" aria-hidden /> Book Appointment
                </a>
                <a href={site.phoneHref} className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-ice px-6 py-4 font-semibold text-brand-ink">
                  <Phone className="h-5 w-5" aria-hidden /> Call {site.phoneDisplay}
                </a>
              </div>
              <p className="mt-6 text-sm text-slate">
                {site.address.street}, {site.address.city}, {site.address.region}
              </p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
