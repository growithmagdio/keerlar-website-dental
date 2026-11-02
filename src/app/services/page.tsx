import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ParallaxFrame, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { Button } from "@/components/ui/Button";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { ExamSpecialList } from "@/components/ui/Bits";
import { featuredServices, servicesList, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Services Informations | Keeler Family Dental Ak | Eagle River, Alaska" },
  description:
    "Dentistry Services at Keeler Family Dental for your family dentist, emergency dentist after hours available, family dentist, Eagle River, Alaska",
  alternates: { canonical: "/services" },
};

const insurancePlans = [
  "Preferred Provider of Many Insurance Providers",
  "Preferred Provider for: Denali Kid Care, Delta Insurance, Blue Cross/Blue Shield, FEP Blue Shield, and Metlife",
  "Most Major Dental Work Warranty",
  "Available low monthly payments.",
  "Use for preventative care and other needs.",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Keeler Family Dental Eagle River AK"
        title="Dental Services"
        image={{ src: "/assets/services/services-available.webp", w: 382, h: 260, alt: "Collage of dental services: cosmetic, family, emergency, whitening and implant dentistry" }}
      >
        <p>
          <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a>
          <br />
          13012 Old Glenn Hwy, Eagle River, AK
        </p>
      </PageHero>

      {/* Overview */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow" data-reveal>What we offer</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">We provide many dental procedures as non-invasive as possible.</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Our team offers a variety of dental services, from basic preventive services to more complex dental implant and cosmetic procedures.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-sm font-semibold text-brand-ink" data-reveal>
              <Phone className="h-4 w-4 text-brand" aria-hidden /> Call for after hour Emergency Service{" "}
              <a href={site.phoneHref} className="text-brand">{site.phoneDisplay}</a>.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8" stagger={0.05}>
            <ul className="grid gap-0 border-t border-line">
              {servicesList.map((s) => (
                <li key={s} className="flex items-center justify-between border-b border-line py-4 font-display text-lg font-medium text-brand-ink" data-reveal>
                  {s}
                  <Check className="h-4 w-4 text-sky" aria-hidden />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="container-x mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {featuredServices.map((svc) => (
            <Link key={svc.key} href={svc.href} className="group flex flex-col items-center rounded-[28px] bg-mist p-6 text-center ring-1 ring-line transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(10,42,66,0.35)]" data-reveal>
              <Image src={svc.img} alt={svc.alt} width={488} height={486} className="h-28 w-28 rounded-full object-cover ring-4 ring-white transition-transform duration-700 group-hover:scale-105" />
              <h2 className="mt-5 text-lg font-semibold text-brand-ink">{svc.title}</h2>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Missing teeth: implants, bridges, partials, dentures */}
      <section id="implant" className="scroll-mt-24 bg-mist py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <span className="eyebrow" data-reveal>A vision of dental wellness</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Solutions for Missing Teeth</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              We propose a plan for you and family to ensure proper oral health care, we will check for common oral problems and provide your family members with the confidence that comes with a healthy smile.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Whether you desire a general cleaning, dentures, teeth alignment, or are experiencing tooth pain, we&apos;ll address your concerns in a relaxed environment and take the time to answer any concerns you have by calling Keeler Family Dental at{" "}
              <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a> or come into our Eagle River Keeler Family Dental office today.
            </p>
          </Reveal>

          <div className="mt-20 grid items-center gap-14 lg:grid-cols-12">
            <ParallaxFrame className="bg-white lg:col-span-5" strength={6}>
              <div data-parallax className="relative aspect-[465/684]">
                <Image src="/assets/services/removable-dentures-vs-denture-implants.webp" alt="Illustration: a removable denture fitted onto dental implants in the lower jaw" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" />
              </div>
            </ParallaxFrame>
            <Reveal className="lg:col-span-6 lg:col-start-7">
              <h3 className="text-3xl font-semibold text-brand-ink md:text-4xl" data-reveal>Dental Implants and Bridges</h3>
              <p className="mt-5 text-lg leading-relaxed text-slate" data-reveal>
                If you have lost or missing teeth, you may wish to consider dental implants from Keeler Family Dental. We offer implant dentistry services designed to restore your teeth and maintain the structural integrity of your mouth.
              </p>
              <div className="mt-10" data-reveal>
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
          </div>

          <div className="mt-24 grid items-center gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h3 className="text-3xl font-semibold text-brand-ink md:text-4xl" data-reveal>Dental Partials and Dentures</h3>
              <p className="mt-5 text-lg leading-relaxed text-slate" data-reveal>
                If you have lost or missing teeth, you may wish to consider dental implants from Keeler Family Dental. We offer implant dentistry services designed to restore your teeth and maintain the structural integrity of your mouth.
              </p>
            </Reveal>
            <Reveal className="grid gap-6 lg:col-span-6 lg:col-start-7">
              <figure className="overflow-hidden rounded-[28px] bg-white ring-1 ring-line" data-reveal>
                <Image src="/assets/services/complete-partial-dentures.webp" alt="A partial denture beside a complete denture" width={550} height={312} className="w-full" />
                <figcaption className="px-6 py-4 text-sm text-slate">Partial denture and complete denture</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[28px] bg-white ring-1 ring-line" data-reveal>
                <Image src="/assets/services/types-of-partial-dentures.webp" alt="Types of partial dentures: transitional partial denture and removable partial denture" width={900} height={476} className="w-full" />
                <figcaption className="px-6 py-4 text-sm text-slate">Partial and Complete Dentures</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cosmetic */}
      <section id="cosmetic" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <ParallaxFrame className="lg:col-span-5">
            <div data-parallax className="relative aspect-square">
              <Image src="/assets/services/cosmetic.webp" alt="Patient checking her smile in a hand mirror with her dentist" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </ParallaxFrame>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <span className="eyebrow" data-reveal>A vision for dental wellness</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">What is Cosmetic Dentistry?</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Cosmetic Dentistry procedures enhance the appearance by procedures such as teeth whitening, stain removal, or veneers. Teeth whitening done at Keeler Family Dental to get your teeth brighter faster. The whitening solution is usually much stronger than at-home kits. Also, heat, light, or a combination of the two may be used to speed and intensify the whitening process.
            </p>
            <div className="mt-8 flex items-center gap-4" data-reveal>
              <Image src="/assets/services/whitening.webp" alt="Smiling woman with bright, white teeth" width={544} height={514} className="h-20 w-20 rounded-full object-cover ring-4 ring-ice" />
              <p className="font-display font-semibold text-brand-ink">Whitening Dentistry</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fillings */}
      <section id="fillings" className="scroll-mt-24 bg-mist py-24 md:py-32">
        <Reveal className="container-x max-w-3xl">
          <span className="eyebrow" data-reveal>Fillings</span>
          <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">What Can Be Done About Old and Discolored Fillings?</SplitHeading>
          <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
            You&apos;ve just gone to the dentist for your check up and the dentist tells you, you need a filling! You are not alone. Many people will need at least one filling in their lifetime. What exactly does that mean? A filling is a treatment for tooth damaged by decay or impact that restores back to its normal function and shape while preventing further decay or damage. IThis is also a common procedure that takes place in the dental office, so there&apos;s no need to worry.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-slate" data-reveal>
            Get a personal evaluation here at your Eagle River oral healthcare professional...by calling Keeler Family Dental at{" "}
            <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a> or come into our Eagle River family dental office today.
          </p>
          <div className="mt-8" data-reveal>
            <Button href={site.phoneHref} icon={<Phone className="h-4 w-4" />}>Give us call at {site.phoneDisplay}</Button>
          </div>
        </Reveal>
      </section>

      {/* New patient special */}
      <section id="special" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow" data-reveal>New Patient Special</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">&ldquo;New Patient Special&rdquo; Just Call Us</SplitHeading>
            <div className="mt-8">
              <ExamSpecialList columns={2} />
            </div>
            <p className="mt-8 font-display text-2xl font-semibold text-brand" data-reveal>Savings up to $200 off regular price!</p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <Button href={site.phoneHref} icon={<Phone className="h-4 w-4" />}>Just Call Us</Button>
              <Button href={site.portalUrl} external variant="secondary">Request Appointment</Button>
            </div>
          </Reveal>
          <Reveal className="flex flex-col items-center justify-center gap-8 lg:col-span-5 lg:col-start-8">
            <Image src="/assets/other/promotions/new-patient-special-save-200.webp" alt="New Patient Special: save over $200" width={559} height={576} className="w-56 -rotate-6 md:w-72" data-reveal />
            <Image src="/assets/services/build-a-better-treatment-plan.webp" alt="Build a better treatment plan" width={200} height={150} className="w-48 rounded-2xl ring-1 ring-line" data-reveal />
          </Reveal>
        </div>
      </section>

      {/* Insurance and payment plans */}
      <section className="bg-brand-ink py-24 text-white md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow !text-sky" data-reveal>Payment</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] md:text-5xl">Insurance and Payment Plans</SplitHeading>
            <ul className="mt-8 grid gap-4">
              {insurancePlans.map((p) => (
                <li key={p} className="flex gap-3 text-lg text-white/85" data-reveal>
                  <Check className="mt-1 h-4 w-4 shrink-0 text-sky" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <Button href="/financing" variant="light" icon={<ArrowRight className="h-4 w-4" />}>Financing options</Button>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <Link href="/contact#request-appointment" className="block overflow-hidden rounded-[28px] bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10" data-reveal>
              <Image src="/assets/other/promotions/call-now.webp" alt="Call now to request an appointment" width={626} height={206} className="w-full" />
            </Link>
            <div className="mt-8 grid gap-2" data-reveal>
              <a href={site.phoneHref} className="font-display text-3xl font-semibold">{site.phoneDisplay}</a>
              <p className="text-white/70">13012 Old Glenn Hwy<br />Eagle River, Ak</p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
