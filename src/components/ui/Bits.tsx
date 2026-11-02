import Image from "next/image";
import { Check } from "lucide-react";
import { examSpecial, site } from "@/lib/site";

export function InsuranceStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-10 gap-y-6 ${className}`} aria-label="Preferred provider for these insurers">
      {site.insurers.map((ins) => (
        <li key={ins.name} className="flex h-14 items-center">
          <Image
            src={ins.src}
            alt={`${ins.name} logo`}
            width={ins.w}
            height={ins.h}
            className="h-auto max-h-12 w-auto max-w-[170px] object-contain opacity-90 grayscale-[20%] transition duration-500 hover:opacity-100 hover:grayscale-0"
          />
        </li>
      ))}
    </ul>
  );
}

export function ExamSpecialList({ columns = 1 }: { columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {examSpecial.map((item) => (
        <li key={item} className="flex gap-3 text-[0.98rem] leading-snug text-ink/85" data-reveal>
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ice text-brand">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function HoursList({ dark = false }: { dark?: boolean }) {
  return (
    <dl className="grid gap-0">
      {site.hours.map((h) => (
        <div key={h.day} className={`flex items-baseline justify-between gap-6 border-b py-3 ${dark ? "border-white/10" : "border-line"}`}>
          <dt className={`font-medium ${dark ? "text-white/85" : "text-ink"}`}>{h.day}</dt>
          <dd className={`tabular-nums ${h.open ? (dark ? "text-white" : "text-brand-ink") : dark ? "text-white/50" : "text-slate"}`}>
            {h.open ? `${h.open} to ${h.close}` : "Closed"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionIntro({ eyebrow, children }: { eyebrow: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <span className="eyebrow" data-reveal>
        {eyebrow}
      </span>
      {children}
    </div>
  );
}
