// Business facts, taken verbatim from keelerdental.org (audited 2026-11-02).
export const site = {
  name: "Keeler Family Dental",
  altName: "Keeler Family Dentistry",
  url: "https://keelerdental.org",
  phoneDisplay: "(907) 694-2129",
  phoneHref: "tel:19076942129",
  address: {
    street: "13012 Old Glenn Hwy",
    city: "Eagle River",
    region: "AK",
    regionLong: "Alaska",
    postal: "99577",
  },
  geo: { lat: 61.338104, lng: -149.563397 },
  portalUrl: "https://klr.identalcloud.com/KeelerFamilyDentalCare/Patient/_practice/1/Welcome",
  membershipUrl: "https://keeler-dental.illumitrac.com/",
  careCreditUrl:
    "https://www.carecredit.com/doctor-locator/General-Dentistry-in-EAGLE-RIVER-AK-99577/Keeler-Dental/",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d7872.547494253986!2d-149.57329260973796!3d61.33437007834981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x56c88cc064294b89%3A0x8366249c4a18f5a7!2sEagle+River%2C+Anchorage%2C+AK!3m2!1d61.3293186!2d-149.56805!4m5!1s0x56c8eb9f8fc6fe1d%3A0x305c7136b4d30100!2sKeeler+Family+Dental%3A+Eagle+River+Family+Dentist!3m2!1d61.338103999999994!2d-149.56339699999998!5e1!3m2!1sen!2sus!4v1555782800695!5m2!1sen!2sus",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Keeler+Family+Dental+13012+Old+Glenn+Hwy+Eagle+River+AK",
  weatherWidgetUrl: "https://www.theweather.com/getwid/7ceb3d168f71fd4d3ebcd7b5cffc87dd",
  copyright:
    "Copyright © 2024 Keeler Family Dental | 13012 Old Glenn Hwy | Eagle River, Ak | (907) 694-2129",
  hours: [
    { day: "Sunday", short: "Sun", open: null, close: null },
    { day: "Monday", short: "Mon", open: "8:00 AM", close: "4:20 PM" },
    { day: "Tuesday", short: "Tue", open: "8:00 AM", close: "4:20 PM" },
    { day: "Wednesday", short: "Wed", open: "8:00 AM", close: "4:20 PM" },
    { day: "Thursday", short: "Thu", open: "8:00 AM", close: "4:20 PM" },
    { day: "Friday", short: "Fri", open: "8:00 AM", close: "4:20 PM" },
    { day: "Saturday", short: "Sat", open: null, close: null },
  ],
  insurers: [
    { name: "FEP Blue (Federal Employee Program)", src: "/assets/other/insurance/fep-blue.webp", w: 558, h: 127 },
    { name: "Delta Dental", src: "/assets/other/insurance/delta-dental.webp", w: 2044, h: 229 },
    { name: "Denali KidCare", src: "/assets/other/insurance/denali-kidcare.webp", w: 215, h: 167 },
    { name: "Blue Cross Blue Shield", src: "/assets/other/insurance/blue-cross-blue-shield.webp", w: 107, h: 90 },
    { name: "MetLife", src: "/assets/other/insurance/metlife.webp", w: 240, h: 52 },
  ],
  // Original links point to these PDFs; all three return 404 on the live site (see CONTENT-PRESERVATION-REPORT.md).
  patientForms: [
    { name: "Our Notice of Privacy", file: "/site/downloads/NoticeOfPrivacy_KeelerDental.pdf" },
    { name: "Privacy Acknowledgment Form", file: "/site/downloads/NoticeOfPrivacyAcknowledgement_KeelerDental.pdf" },
    { name: "Insurance Payment and Financing", file: "/site/downloads/Financing_Options_KeelerDental.pdf" },
  ],
  developer: { name: "Magdio", url: "https://www.magdio.com/", label: "www.magdio.com" },
} as const;

export type NavItem = { label: string; href: string; external?: boolean };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Financing", href: "/financing" },
  { label: "Patient Portal", href: site.portalUrl, external: true },
  { label: "Contact Us", href: "/contact" },
];

// The five services featured on the original home page, with their original link targets.
export const featuredServices = [
  {
    key: "whitening",
    title: "Whitening Dentistry",
    img: "/assets/services/whitening.webp",
    alt: "Smiling woman with bright, white teeth after whitening",
    href: "/services#fillings",
    blurb:
      "Teeth whitening done at Keeler Family Dental to get your teeth brighter faster. The whitening solution is usually much stronger than at-home kits. Also, heat, light, or a combination of the two may be used to speed and intensify the whitening process.",
    cta: "Whitening and fillings",
  },
  {
    key: "implant",
    title: "Implant Dentistry",
    img: "/assets/services/implants.webp",
    alt: "Illustration of a dental implant post placed among natural teeth",
    href: "/services#implant",
    blurb:
      "If you have lost or missing teeth, you may wish to consider dental implants from Keeler Family Dental. We offer implant dentistry services designed to restore your teeth and maintain the structural integrity of your mouth.",
    cta: "Implants and bridges",
  },
  {
    key: "cosmetic",
    title: "Cosmetic Dentistry",
    img: "/assets/services/cosmetic.webp",
    alt: "Patient checking her smile in a hand mirror with her dentist",
    href: "/services#cosmetic",
    blurb:
      "Cosmetic Dentistry procedures enhance the appearance by procedures such as teeth whitening, stain removal, or veneers.",
    cta: "What is cosmetic dentistry?",
  },
  {
    key: "family",
    title: "Family Dentistry",
    img: "/assets/services/family.webp",
    alt: "Smiling family of three, parents with their young daughter",
    href: "/about#why-invest",
    blurb:
      "Keeler Family Dental denistry services is for all ages of your family in Eagle River, Alaska. Dentistry with family in mind; big or small we treat them all!",
    cta: "About our family practice",
  },
  {
    key: "emergency",
    title: "Emergency Dentistry",
    img: "/assets/services/emergency.webp",
    alt: "Man holding his jaw in tooth pain",
    href: "/contact#request-appointment",
    blurb:
      "Keeler Family Dental offers convenient hours for same-day emergency care, so that you don't have to wait in pain or risk your injury getting worse. Call for after hour Emergency Service (907) 694-2129.",
    cta: "Request an appointment",
  },
] as const;

export const servicesList = [
  "Teeth Whitening",
  "Fluoride Treatment",
  "Dental Implants",
  "Crowns and Bridges",
  "Composite Fillings",
  "Restorative Dentistry",
  "Tooth Extraction",
  "Invisalign Braces and Orthodontics",
  "Exams & Cleanings",
] as const;

export const whyChoose = [
  "Same Day Appointments Available",
  "24 Hour Emergency Dental Services",
  "Comfortable, Relaxing Environment",
  "Locally Owned & Operated",
  "Preferred Provider: Denali Kid Care, Delta Insurance, Blue Cross/Blue Shield, FEP Blue Shield, and Metlife",
] as const;

export const examSpecial = [
  "One Teeth cleaning",
  "Evaluate Oral health",
  "Evaluate and discuss any Oral Health Risks",
  "Check your bite and jaw",
  "Demonstrate proper cleaning techniques for teeth or dentures",
  "Assess need for fluoride treatment",
  "Take dental X-rays, if necessary,",
  "Other diagnostics procedures as may be warranted",
  "Create a personalized care plan for maximum Oral Health",
] as const;
