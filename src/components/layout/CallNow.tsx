"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Phone } from "lucide-react";
import { site } from "@/lib/site";

/** The original site's floating "Call Now!" button (compact; opens on hover so it never covers content), plus a two-button action bar on phones. */
export function CallNow() {
  return (
    <>
      <motion.a
        href={site.phoneHref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="group fixed bottom-6 right-6 z-40 hidden items-center gap-0 rounded-full bg-white/90 p-2 text-sm transition-[padding,gap] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:gap-3 hover:pr-5 focus-visible:gap-3 focus-visible:pr-5 font-semibold text-brand-ink shadow-[0_18px_40px_-18px_rgba(10,42,66,0.45)] ring-1 ring-line backdrop-blur md:inline-flex"
        aria-label={`Call Now! ${site.phoneDisplay}`}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" aria-hidden />
          <Phone className="relative h-4 w-4" aria-hidden />
        </span>
        <span className="flex max-w-0 flex-col overflow-hidden whitespace-nowrap leading-tight opacity-0 transition-[max-width,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:opacity-100">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate">Call Now!</span>
          {site.phoneDisplay}
        </span>
      </motion.a>

      <div
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/90 px-3 pt-3 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        <a href={site.phoneHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ice font-semibold text-brand-ink">
          <Phone className="h-4 w-4" aria-hidden /> Call Now!
        </a>
        <a href={site.portalUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white">
          <CalendarCheck className="h-4 w-4" aria-hidden /> Book
        </a>
      </div>
    </>
  );
}
