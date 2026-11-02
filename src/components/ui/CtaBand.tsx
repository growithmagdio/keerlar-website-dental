import { CalendarCheck, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "./Button";
import { Reveal, SplitHeading } from "./Reveal";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-ice py-24 md:py-32">
      <div aria-hidden className="orb orb-b" style={{ width: "36vw", height: "36vw", left: "-8%", bottom: "-30%", background: "rgba(73,183,245,0.25)" }} />
      <Reveal className="container-x relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow" data-reveal>Book your visit</span>
          <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Your Smile Deserves the Best Care.</SplitHeading>
          <p className="mt-5 text-lg text-slate" data-reveal>Let&apos;s make your next dental visit comfortable, simple, and stress-free.</p>
        </div>
        <div className="flex flex-wrap gap-3" data-reveal>
          <Button href={site.portalUrl} external icon={<CalendarCheck className="h-4 w-4" />}>Book an Appointment</Button>
          <Button href={site.phoneHref} variant="light" icon={<Phone className="h-4 w-4" />}>Call Our Office</Button>
        </div>
      </Reveal>
    </section>
  );
}
