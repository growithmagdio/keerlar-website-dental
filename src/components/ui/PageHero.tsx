import Image from "next/image";
import type { ReactNode } from "react";
import { ParallaxFrame, SplitHeading } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  image: { src: string; w: number; h: number; alt: string };
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ice/70 via-mist to-white pb-20 pt-[calc(var(--header-h)+56px)] md:pb-28 md:pt-[calc(var(--header-h)+80px)]">
      <div aria-hidden className="orb orb-a" style={{ width: "40vw", height: "40vw", right: "-10%", top: "-10%", background: "rgba(73,183,245,0.22)" }} />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">{eyebrow}</p>
          <SplitHeading as="h1" immediate className="mt-5 text-[2.5rem] font-semibold leading-[1.03] text-brand-ink sm:text-5xl lg:text-[4rem]">
            {title}
          </SplitHeading>
          {children ? <div className="mt-6 text-lg leading-relaxed text-slate">{children}</div> : null}
        </div>
        <ParallaxFrame className="lg:col-span-6" strength={8}>
          <div data-parallax className="relative" style={{ aspectRatio: `${image.w} / ${image.h}` }}>
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </ParallaxFrame>
      </div>
    </section>
  );
}
