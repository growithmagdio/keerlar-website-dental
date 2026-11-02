import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, CalendarCheck, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HoursList } from "@/components/ui/Bits";
import { LocalClock } from "@/components/ui/LocalClock";
import { PatientForms } from "@/components/ui/PatientForms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Us at Keeler Family Dental Ak | Eagle River, Alaska" },
  description: "Contact us at Keeler Family Dentist for in Eagle River, Alaska, also our driving directions map.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Keeler Family Dental Eagle River AK"
        title="Our Contact Information"
        image={{ src: "/assets/clinic/keeler-office-street.webp", w: 862, h: 366, alt: "Dr. Keeler beside Old Glenn Highway near the Keeler Family Dental office" }}
      >
        <p>
          For Appointment Scheduling Call{" "}
          <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a>
        </p>
      </PageHero>

      {/* Quick contact */}
      <section className="bg-white py-20 md:py-24">
        <Reveal className="container-x grid gap-5 md:grid-cols-3">
          <a href={site.phoneHref} className="group rounded-[28px] bg-mist p-8 ring-1 ring-line transition hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(10,42,66,0.35)]" data-reveal>
            <Phone className="h-6 w-6 text-brand" aria-hidden />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-slate">Call Us Today at</p>
            <p className="mt-2 font-display text-2xl font-semibold text-brand-ink">{site.phoneDisplay}</p>
          </a>
          <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="group rounded-[28px] bg-mist p-8 ring-1 ring-line transition hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(10,42,66,0.35)]" data-reveal>
            <MapPin className="h-6 w-6 text-brand" aria-hidden />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-slate">Visit</p>
            <p className="mt-2 font-display text-2xl font-semibold text-brand-ink">{site.address.street}<br />{site.address.city}, {site.address.regionLong}</p>
          </a>
          <a href={site.membershipUrl} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-[28px] bg-brand p-8 text-white transition hover:bg-brand-deep" data-reveal>
            <Image src="/assets/other/promotions/join-membership-club.webp" alt="Join Membership Club: no insurance? Our patients don't need it" width={240} height={144} className="w-36 rounded-xl" />
            <p className="mt-6 font-display text-2xl font-semibold">Keeler Family Dental Membership Club</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-white/90">Join <ArrowUpRight className="h-4 w-4" aria-hidden /></span>
          </a>
        </Reveal>
      </section>

      {/* Request appointment (original anchor target) */}
      <section id="request-appointment" className="scroll-mt-24 bg-mist py-24 md:py-28">
        <Reveal className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="eyebrow" data-reveal>Request appointment</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Book online or give us a call.</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Call <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a> today to set up your appointment or come on down to our office.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <Button href={site.portalUrl} external icon={<CalendarCheck className="h-4 w-4" />}>Book an Appointment</Button>
              <Button href={site.phoneHref} variant="secondary" icon={<Phone className="h-4 w-4" />}>Call Our Office</Button>
            </div>
          </div>
          <a href={site.portalUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-line transition hover:ring-brand/40 lg:col-span-5 lg:col-start-8" data-reveal>
            <Image src="/assets/other/promotions/online-patient-appointment-portal.webp" alt="Online Patient Appointment Portal" width={582} height={263} className="w-full" />
          </a>
        </Reveal>
      </section>

      {/* Directions */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow" data-reveal>Driving directions...</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Keeler Family Dentistry</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              We provide convenient office hours and flexible appointment scheduling. All ages friendly Keeler Family Dental is the dental practice to visit in Eagle River when you need dependable oral care. Call{" "}
              <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a> today to set up your appointment or come on down to our office.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Achieving healthy teeth takes a lifetime of care. Even when we are complemented that we have nice teeth, it&apos;s beneficial to take the preventative steps every day to take care of them and prevent problems. This involves getting the right oral care products, as well as being diligent with your daily habits.
            </p>
            <h3 className="mt-10 text-2xl font-semibold text-brand-ink" data-reveal>Regular Checkups and Exams; provide great oral health...</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Providing for your families dentistry planning, Keeler Family Dental delivers a variety of treatments that provides many with a healthy, beautiful smile. We encourage regular preventative dentistry check-ups, dental cleaning, and daily oral hygiene care.
            </p>
            <p className="mt-4 font-semibold text-brand-ink" data-reveal>
              We do offer after hour Emergency Service ... Call now <a href={site.phoneHref} className="text-brand">{site.phoneDisplay}</a>.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <h3 className="sr-only">Keeler Family Dental Driving Directions</h3>
            <div className="overflow-hidden rounded-[28px] ring-1 ring-line" data-reveal>
              <iframe
                title="Keeler Family Dental Driving Directions map"
                src={site.mapEmbedUrl}
                className="block h-[460px] w-full md:h-[560px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-5" data-reveal>
              <Button href={site.directionsUrl} external variant="secondary" icon={<Navigation className="h-4 w-4" />}>Open in Google Maps</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hours */}
      <section className="bg-brand-ink py-24 text-white md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow !text-sky" data-reveal>Come on in</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] md:text-5xl">We&apos;re open during these hours</SplitHeading>
            <p className="mt-6 text-lg font-semibold text-sky" data-reveal>Call for 24hr emergency services</p>
            <div className="mt-8 rounded-2xl bg-white p-5" data-reveal>
              <LocalClock />
            </div>
            <div className="mt-8 grid gap-2 text-white/80" data-reveal>
              <p>13012 Old Glenn Hwy<br />Eagle River, Alaska</p>
              <p className="mt-2">Call Us Today at <a href={site.phoneHref} className="font-semibold text-white">{site.phoneDisplay}</a></p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <div data-reveal>
              <HoursList dark />
            </div>
            <div className="mt-10 overflow-hidden rounded-2xl bg-white" data-reveal>
              <iframe title="Eagle River weather" src={site.weatherWidgetUrl} loading="lazy" className="block h-[200px] w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* New patient forms */}
      <section className="bg-mist py-24 md:py-28">
        <Reveal className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow" data-reveal>New patients</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">New Patient Forms</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>Bring completed forms with you at the time of your appointment.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <PatientForms />
          </div>
        </Reveal>
      </section>
    </>
  );
}
