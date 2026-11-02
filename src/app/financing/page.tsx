import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { Button } from "@/components/ui/Button";
import { InsuranceStrip } from "@/components/ui/Bits";
import { PatientForms } from "@/components/ui/PatientForms";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Financing Information for Keeler Family Dental Ak | Eagle River, Alaska" },
  description: "Payment and Financing options at Keeler Family Dental, Eagle River, Alaska",
  alternates: { canonical: "/financing" },
};

export default function FinancingPage() {
  return (
    <>
      <PageHero
        eyebrow="Keeler Family Dental Eagle River AK"
        title="Financing and Insurance"
        image={{ src: "/assets/clinic/dr-keeler-finance-insurance.webp", w: 665, h: 317, alt: "Dr. Keeler with the words Finance and Insurance Options" }}
      >
        <p>
          For dental consultation call{" "}
          <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a>
        </p>
      </PageHero>

      {/* Membership + insurers */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <a
              href={site.membershipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between gap-8 rounded-[32px] bg-gradient-to-br from-brand to-brand-deep p-8 text-white md:p-10"
              data-reveal
            >
              <Image src="/assets/other/promotions/join-membership-club.webp" alt="No insurance? Our patients don't need it. Click to get your preventive care for a low monthly fee" width={240} height={144} className="w-48 rounded-xl" />
              <div>
                <p className="font-display text-3xl font-semibold">Keeler Family Dental Membership Club</p>
                <p className="mt-3 text-white/80">No insurance? Our patients don&apos;t need it! Get your preventive care for a low monthly fee.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                  Join Membership Club <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </a>
          </Reveal>
          <Reveal className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <span className="eyebrow" data-reveal>Preferred provider</span>
            <p className="mt-4 text-lg text-slate" data-reveal>
              Preferred Provider for: Denali Kid Care, Delta Insurance, Blue Cross/Blue Shield, FEP Blue Shield, and Metlife
            </p>
            <div className="mt-8" data-reveal>
              <InsuranceStrip />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Wellness copy */}
      <section className="bg-mist py-24 md:py-32">
        <Reveal className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow" data-reveal>At Keeler Family Dentistry</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Financing Your Family Dental Care</SplitHeading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="text-2xl font-semibold text-brand-ink" data-reveal>How Can We Help You with Dental Wellness</h3>
            <h4 className="mt-6 font-display text-lg font-semibold text-brand" data-reveal>Regular Checkups and Exams, provide great oral health...</h4>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Providing for your families dentistry planning, Keeler Family Dental delivers a variety of treatments that provides many with a healthy, beautiful smile. We encourage regular preventative dentistry check-ups, dental cleaning, and daily oral hygiene care.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Achieving healthy teeth takes a lifetime of care. Even when we are complemented that we have nice teeth, it&apos;s beneficial to take the preventative steps every day to take care of them and prevent problems. This involves getting the right oral care products, as well as being diligent with your daily habits.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Financing options */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <span className="eyebrow" data-reveal>Payment options</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">We Offer these Financing Options</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Thank you for considering Keeler Family Dental for your dental needs. We understand that everyone&apos;s financial situation is different. For this reason we worked hard to provide you and your family with a variety of payment options to provide you with the dental care you need and deserve, with a focus to your budget. Please evaluate the options:
            </p>
          </Reveal>

          <Reveal className="mt-16 grid gap-0 border-t border-line">
            <article className="grid gap-6 border-b border-line py-10 lg:grid-cols-12" data-reveal>
              <p className="font-display text-5xl font-semibold text-ice lg:col-span-2" aria-hidden>01</p>
              <div className="lg:col-span-10">
                <h3 className="text-2xl font-semibold text-brand-ink">1. Pay As You Go</h3>
                <p className="mt-3 text-lg leading-relaxed text-slate">
                  Our &ldquo;Pay-As-You Go&rdquo; option allows you to be in control of your insurance benefits, by paying fully at each appointment for treatment and by being reimbursed directly from your insurance company.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-mist p-6 ring-1 ring-line">
                    <p className="font-display font-semibold text-brand-ink">A. 10% Courtesy Reduction for Prepayment with Cash or Check (Fees in Excess of $400)</p>
                    <p className="mt-2 text-slate">We offer 10% courtesy reduction in your treatment fee for prepayment in full with cash or check at time of scheduling to reserve time in the schedule with Dr. Keeler.</p>
                  </div>
                  <div className="rounded-2xl bg-mist p-6 ring-1 ring-line">
                    <p className="font-display font-semibold text-brand-ink">B. 5% Courtesy Reduction for Prepayment with Credit Card (Fees in excess of $400)</p>
                    <p className="mt-2 text-slate">We offer a 5% courtesy reduction in your treatment fee for prepayment in full with accepted credit card at time of scheduling to reserve time with Dr. Keeler.</p>
                  </div>
                </div>
              </div>
            </article>
            <article className="grid gap-6 border-b border-line py-10 lg:grid-cols-12" data-reveal>
              <p className="font-display text-5xl font-semibold text-ice lg:col-span-2" aria-hidden>02</p>
              <div className="lg:col-span-10">
                <h3 className="text-2xl font-semibold text-brand-ink">2. Assignment of Benefits</h3>
                <p className="mt-3 text-lg leading-relaxed text-slate">
                  Our &ldquo;Assignment of Benefits,&rdquo; options offer you the convenience of using your dental benefits as a form of direct payment by assigning payment from your dental insurance company directly to Keeler Dental.
                </p>
              </div>
            </article>
            <article className="grid gap-6 border-b border-line py-10 lg:grid-cols-12" data-reveal>
              <p className="font-display text-5xl font-semibold text-ice lg:col-span-2" aria-hidden>03</p>
              <div className="lg:col-span-10">
                <h3 className="text-2xl font-semibold text-brand-ink">3. Interest Free or Low Interest Financing</h3>
                <p className="mt-3 text-lg leading-relaxed text-slate">
                  Our &ldquo;Interest Free or Low Interest Financing&rdquo; option offers you an arrangement with one of our financial partners (CareCredit or Patient Financing).
                </p>
                <a
                  href={site.careCreditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-line transition hover:ring-brand/40"
                >
                  <Image src="/assets/other/carecredit-apply-now.webp" alt="CareCredit: making care possible today. Apply now" width={1000} height={388} className="w-64" />
                </a>
                <ul className="mt-6 grid gap-1 text-slate">
                  <li>Available low monthly payments.</li>
                  <li>Use for preventative care and other needs.</li>
                </ul>
                <p className="mt-4 text-slate">
                  Please call our office: <a href={site.phoneHref} className="font-semibold text-brand">{site.phoneDisplay}</a> for additional information.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal className="mt-14">
            <div className="rounded-[28px] bg-brand-ink p-8 text-white md:p-10" data-reveal>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-sky">Broken appointments</p>
              <p className="mt-3 text-lg leading-relaxed text-white/85">
                A specific frame of time is reserved especially for you with our hygenist or Dr. Keeler and we strongly encourage our guests to keep their appointments. If you have to change your appointment, we request 48 hrs. notice to avoid charging any cancellation fees.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Patient forms */}
      <section id="forms" className="scroll-mt-24 bg-mist py-24 md:py-32">
        <Reveal className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow" data-reveal>Keeler Family Dental</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Patient Forms</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Please download and fill out completly for your convenience. Do Not E-mail these forms, bring them with you at the time of your appointment.
            </p>
            <div className="mt-8" data-reveal>
              <Button href={site.phoneHref} variant="secondary" icon={<Phone className="h-4 w-4" />}>{site.phoneDisplay}</Button>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <PatientForms />
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
