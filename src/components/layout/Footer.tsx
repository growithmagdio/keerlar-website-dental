import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-brand-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/30 blur-[120px]" />
      <div className="container-x relative grid gap-12 pb-28 pt-20 md:grid-cols-12 md:pb-14">
        <div className="md:col-span-4">
          <div className="inline-block rounded-2xl bg-white px-4 py-3">
            <Image src="/assets/logo/keeler-family-dental-logo.webp" alt="Keeler Family Dental" width={700} height={357} className="h-14 w-auto" />
          </div>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/70">
            A family friendly dental practice...located in scenic Eagle River, Alaska. Dentistry with family in mind; big or small we treat them all!
          </p>
          <a
            href={site.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-ice"
          >
            Patient Portal <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-sky">Explore</h2>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            {nav.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/75 transition-colors hover:text-white">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="text-white/75 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <a href={site.membershipUrl} target="_blank" rel="noopener noreferrer" className="text-white/75 transition-colors hover:text-white">
                Membership Club
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-sky">Visit</h2>
          <ul className="mt-5 grid gap-4 text-[0.95rem] text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden />
              <a href={site.directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.regionLong}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden />
              <a href={site.phoneHref} className="hover:text-white">{site.phoneDisplay}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden />
              <span>
                Monday to Friday, 8:00 AM to 4:20 PM
                <br />
                Saturday and Sunday closed
                <br />
                Call for 24hr emergency services
              </span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-sky">Payment</h2>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            <li>
              <a href={site.membershipUrl} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white">
                No insurance? Join the Membership Club
              </a>
            </li>
            <li>
              <a href={site.careCreditUrl} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white">
                Apply with CareCredit
              </a>
            </li>
            <li>
              <Link href="/financing" className="text-white/75 hover:text-white">
                Financing and insurance options
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-7 pb-28 text-[0.82rem] text-white/60 md:flex-row md:items-center md:justify-between md:pb-7">
          <p>{site.copyright}</p>
          <p className="flex items-center gap-2">
            <span>Designed &amp; Developed by Magdio</span>
            <span aria-hidden className="text-white/25">·</span>
            <a
              href="https://www.magdio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-medium text-white/85 transition-colors hover:text-white"
            >
              Magdio — www.magdio.com
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-sky transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
