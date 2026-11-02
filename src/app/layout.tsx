import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CallNow } from "@/components/layout/CallNow";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/site";

// Headlines: Fraunces, a soft, warm serif with optical sizes. Text and UI: Plus Jakarta Sans.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["SOFT", "WONK", "opsz"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Family Dentist in Eagle River | Keeler Family Dental (Cosmetic, Emergency, Fillings, Family Dentistry)",
    template: "%s | Keeler Family Dental",
  },
  description:
    "Keeler Family Dentist, Eagle River Alaska for all your family dentistry, emergency dentistry, and family dentistry. We are a preferred provider of dental services. Schedule an appointment with our dental team today.",
  applicationName: site.name,
  alternates: { canonical: "/" },
  icons: { icon: "/assets/logo/ms-icon-70x70.png", apple: "/assets/logo/ms-icon-70x70.png" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    images: [{ url: "/assets/team/dr-keeler-office.webp", width: 665, height: 393, alt: "Dr. Keeler outside the Keeler Family Dental office in Eagle River" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": `${site.url}/#dentist`,
  name: site.name,
  alternateName: site.altName,
  url: site.url,
  logo: `${site.url}/assets/logo/keeler-family-dental-logo.png`,
  image: `${site.url}/assets/team/dr-keeler-office.webp`,
  telephone: "+1-907-694-2129",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postal,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:20",
    },
  ],
  areaServed: "Eagle River, Alaska",
  medicalSpecialty: "Dentistry",
  availableService: [
    "Teeth Whitening", "Fluoride Treatment", "Dental Implants", "Crowns and Bridges", "Composite Fillings",
    "Restorative Dentistry", "Tooth Extraction", "Invisalign Braces and Orthodontics", "Exams & Cleanings",
    "Dental Partials and Dentures", "Cosmetic Dentistry", "Emergency Dentistry",
  ].map((name) => ({ "@type": "MedicalProcedure", name })),
  paymentAccepted: "Cash, Check, Credit Card, Dental Insurance, CareCredit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CallNow />
      </body>
    </html>
  );
}
