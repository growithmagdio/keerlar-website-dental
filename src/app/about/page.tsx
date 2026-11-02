import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ParallaxFrame, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Our Practice at Keeler Family Dental Ak | Eagle River, Alaska" },
  description:
    "About Keeler Family Dentist for all your family dentistry, emergency dentistry, and family dentistry, Eagle River, Alaska, dentist after hours available",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Keeler Family Dental Eagle River AK"
        title="Hello from Dr. Keeler"
        image={{ src: "/assets/team/dr-keeler-office.webp", w: 665, h: 393, alt: "Dr. Keeler outside the Keeler Family Dental office in Eagle River, Alaska" }}
      >
        <p>At Keeler Family Dental we have delivered high quality and trusted care, building long-term caring relationships with patients of all ages.</p>
      </PageHero>

      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow" data-reveal>Our team</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Hello from Dr. Keeler and Our Team,</SplitHeading>
            <p className="mt-6 font-display text-xl font-medium text-brand" data-reveal>A Beautiful Healthy Smile for Confidence in Your Life!</p>
          </Reveal>
          <Reveal className="grid gap-5 text-lg leading-relaxed text-slate lg:col-span-6 lg:col-start-7">
            <p data-reveal>At Keeler Family Dental we have delivered high quality and trusted care, building long-term caring relationships with patients of all ages.</p>
            <p className="font-semibold text-brand-ink" data-reveal>Trust us to enhance your oral health wellbeing!</p>
            <p data-reveal>
              Building a foundation of trust has been beneficial to our success. We understand how uncomfortable some patients may feel about their dental visits, and how we understand that we can make a difference in providing a relaxing and positive experience.
            </p>
            <p data-reveal>We are dedicated to providing you an excellent, personalized oral health care providing comfortable and pleasant visits everytime for your all ages.</p>
            <p data-reveal>Keeler Family Dental denistry services is for all ages of your family in Eagle River, Alaska.</p>
          </Reveal>
        </div>
      </section>

      <section id="why-invest" className="scroll-mt-24 bg-mist py-24 md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow" data-reveal>About Keeler Family Dental Care...</span>
            <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">Let us help you for Dental Wellness</SplitHeading>
            <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
              Maintaining healthy teeth takes a lifetime of care. Even when we are complemented that we have nice teeth, it&apos;s beneficial to take the preventative steps every day to take care of them and prevent problems. This involves getting the right oral care products, as well as being diligent with your daily habits.
            </p>
            <h3 className="mt-10 text-2xl font-semibold text-brand-ink" data-reveal>Regular Checkups and Exams; provide great oral health...</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate" data-reveal>
              Providing for your families dentistry planning, Keeler Family Dental delivers a variety of treatments that provides many with a healthy, beautiful smile. We encourage regular preventative dentistry check-ups, dental cleaning, and daily oral hygiene care.
            </p>
          </Reveal>
          <ParallaxFrame className="lg:col-span-5 lg:col-start-8">
            <div data-parallax className="relative aspect-square">
              <Image src="/assets/services/family.webp" alt="Smiling family of three, parents with their young daughter" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </ParallaxFrame>
        </div>
      </section>

      <section className="bg-brand-ink py-16 text-white">
        <Reveal className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold md:text-3xl" data-reveal>
            We do offer after hour Emergency Service ... Call now {site.phoneDisplay}.
          </h2>
          <div data-reveal>
            <Button href={site.phoneHref} variant="light" icon={<Phone className="h-4 w-4" />}>Call now</Button>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-24 md:py-32">
        <Reveal className="container-x max-w-3xl">
          <span className="eyebrow" data-reveal>Oral health</span>
          <SplitHeading className="mt-5 text-4xl font-semibold leading-[1.05] text-brand-ink md:text-5xl">How Can We Maintain Our Oral Health?</SplitHeading>
          <p className="mt-6 text-lg leading-relaxed text-slate" data-reveal>
            Your own everyday habits are crucial to your overall oral health. Still, even the most dutiful brushers and flossers need to see a dentist regularly. At minimum, you should see your dentist for cleanings and checkups twice a year. Not only can a dentist remove calculus and look for cavities, but they will also be able to spot potential issues and offer treatment solutions.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-slate" data-reveal>
            Some dental insurance companies even cover more frequent dental checkups. If this is the case for you, take advantage of it. Doing so is especially helpful if you have a history of dental issues, such as gingivitis or frequent cavities.
          </p>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
