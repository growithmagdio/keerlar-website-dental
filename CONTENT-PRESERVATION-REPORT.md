# Content Preservation Report

Original site: https://keelerdental.org (audited 2026-11-02). Full verbatim inventory: `CONTENT-INVENTORY.md`. Images: `ASSET-INVENTORY.md`.

## 1. Pages

| Original page | New page | Redirect |
|---|---|---|
| / and /index.html | / (3D scroll story) | /index.html → / (308 permanent) |
| /about.html | /about | /about.html → /about |
| /services.html (and /services.html?) | /services | /services.html → /services |
| /financing.html | /financing | /financing.html → /financing |
| /contact.html (and /contact.html?) | /contact | /contact.html → /contact |

All original in-page anchors still exist: `/services#implant`, `#cosmetic`, `#fillings`, `#special`; `/about#why-invest`; `/contact#request-appointment`.

## 2. Content sections: where each appears now

### Home (index.html)

| Original content | New location |
|---|---|
| Hero "LOVE YOUR SMILE AND WELCOME TO ... KEELER FAMILY DENTISTRY" | Home scene 01, eyebrow above the headline |
| "A family friendly dental practice...located in scenic Eagle River, Alaska" + both body paragraphs | Home scene 02 "Healthy Teeth. Happy Families." |
| Five service tiles (Whitening, Implant, Cosmetic, Family, Emergency) with images and original link targets | Home scene 04 (one full-screen panel each, same destinations); Services page overview |
| Promotion banners: New Patient Special badge, No Insurance membership, Online Appointment Portal, Call Now button | Hero floating cards; membership banner (scene 08); Contact request section; floating Call Now + phone action bar |
| "Why Choose Keeler Family Dental" list (5 items) + 3 paragraphs | Home scene 08 |
| Insurance logos (FEP, Delta Dental, Denali KidCare, BCBS, MetLife) | Home scene 08, Financing page |
| "Comprehensive Treatment Planning Exam Specials" intro + 9-item list | Home scene 08 card; Services #special |
| "Dentistry with family in mind; big or small we treat them all!" | Home scene 02, footer |
| "2021 New Patient Special" + Save over $200 image | Home scene 08 and Services #special, shown as "New Patient Special" (see section 5) |

### About (about.html)

All headings and paragraphs are on /about, in original order: Hello from Dr. Keeler and Our Team; A Beautiful Healthy Smile for Confidence in Your Life!; the trust paragraphs; About Keeler Family Dental Care... / Let us help you for Dental Wellness; Regular Checkups and Exams; after-hours emergency line; How Can We Maintain Our Oral Health? (both paragraphs). Dr. Keeler's office photo is the hero image.

### Services (services.html)

All content is on /services: phone and address header; "We provide many dental procedures as non-invasive as possible."; the 9-service list; after-hours emergency line; Solutions for Missing Teeth (2 paragraphs); Dental Implants and Bridges; Dental Partials and Dentures (with both denture images); What is Cosmetic Dentistry?; the fillings paragraphs and "What Can Be Done About Old and Discolored Fillings?"; "New Patient Special" Just Call Us list + "Savings up to $200 off regular price!"; Insurance and Payment Plans (5 items); Call Now graphic linking to /contact#request-appointment.

### Financing (financing.html)

All content is on /financing: Membership Club (link + graphic); consultation phone; insurance logos; Financing Your Family Dental Care; How Can We Help You with Dental Wellness + both paragraphs; We Offer these Financing Options intro; options 1 (with A and B courtesy reductions), 2 and 3; CareCredit link; "Available low monthly payments. Use for preventative care and other needs."; call for additional information; Broken Appointments policy; Patient Forms section.

### Contact (contact.html)

All content is on /contact: Membership Club; appointment scheduling phone; Driving Directions paragraphs; original Google Maps embed (same URL); Regular Checkups paragraph; after-hours emergency line; full weekly hours (Sun closed, Mon to Fri 8:00 AM to 4:20 PM, Sat closed); "Call for 24hr emergency services"; address; "Call Us Today at"; New Patient Forms; Online Patient Appointment Portal graphic and link (anchor #request-appointment).

## 3. Functional features

| Original feature | Status in redesign |
|---|---|
| Navigation: Home, About Us, Services, Financing, Patient Portal (external), Contact Us | Preserved in header, mobile menu and footer |
| Patient Portal / appointment requests (iDentalCloud) | Preserved: header "Book Appointment", every "Book an Appointment" button, mobile action bar |
| Floating "Call Now!" button (tel:19076942129) | Preserved: floating button on desktop, Call/Book bar on phones |
| Membership Club link (illumitrac) | Preserved on Home, Financing, Contact, footer |
| CareCredit link | Preserved on Financing and footer |
| Google Maps directions embed | Preserved (same embed URL) plus an "Open in Google Maps" button |
| timeanddate.com clock iframe | Replaced by a built-in live Eagle River clock with open/closed status (same purpose, no third-party iframe) |
| theweather.com weather widget iframe | Preserved (same widget URL), lazy-loaded on /contact |
| Patient form PDF downloads | Listed; the PDFs return 404 on the live site, so each shows "Call to request" (see section 4) |
| Contact forms | None existed on the original site; none added |

## 4. Items needing client input or credentials

1. **Patient form PDFs.** All three original links (`/site/downloads/...pdf`) return HTTP 404 on the current site. Place the PDFs in `public/site/downloads/` with the same file names and the download buttons switch on automatically at the next build.
2. **Patient portal and membership.** These are third-party systems (iDentalCloud, illumitrac). Links were verified on the live site; their content cannot be restyled from here.
3. **Weather widget.** Kept with its original URL. If theweather.com stops serving it, remove the iframe in `src/app/contact/page.tsx`.

## 5. Intentional changes, and gaps that remain

- **Previous developer credit.** The original footer showed the "Professional Alaska Web Solutions" logo linking to akwebs.com. It is replaced by "Designed & Developed by Magdio" as requested; the logo file is kept in `/assets/other/`. Restore it if the client wants both credits.
- **"2021" removed from "2021 New Patient Special".** The offer is shown as "New Patient Special" because the year is out of date. Confirm the offer is still current.
- **Encoding errors fixed.** "donât" / "itâs" in the original are shown as "don't" / "it's". All other wording, including original spelling (for example "denistry", "complemented", "completly", "IThis", "hygenist"), is kept verbatim. Recommend a copy-edit pass with the client.
- **Duplicate paragraph.** On the original services page, "Dental Partials and Dentures" repeats the implants paragraph word for word. It is preserved as is; the client should supply proper denture copy.
- **No testimonials, reviews, FAQs, team names, staff photos, email address, social links or before/after patient photos exist on the original site.** None were invented. The home "testimonials" scene shows the original "Why Choose" content instead, and the before/after slider uses the original implant-denture illustration (clearly labelled as an illustration).
- **Educational anatomy text.** The four short layer descriptions (enamel, dentin, pulp, root) in home scene 03 are general dental facts added to explain the 3D model; they make no claims about the practice.
- **New design headlines.** "A Beautiful Smile Starts Here.", "Personalized dental care for every member of your family.", "Healthy Teeth. Happy Families.", "Your Smile Deserves the Best Care." and "Let's make your next dental visit comfortable, simple, and stress-free." come from the project brief.
- **Animated tooth-family hero.** The home hero visual is the agency-supplied tooth-family illustration (not from the original site). It is a flat image, so it is presented as layered 2D animation, not a 3D model: the three teeth were cut into separate transparent layers, and the parts hidden behind the child tooth were filled so the layers can move. Blinking, the smile and eye movement use small overlay patches cut from the same image. The heart arc, orbit ring, sparkles, glow, reflections and shadows are drawn in code. As the visitor scrolls, the family comes forward and fades while the 3D tooth trio takes over in the next scene. With reduced motion turned on, a still, fully composed frame is shown.
- **Homepage story order (upgrade pass).** Hero tooth family → tooth anatomy → dental services → implant story → family dentistry → smile gallery → Dr. Keeler and team → office → why choose us → booking → footer. Every original section is still on the page; only the order changed.
- **Implant story text.** The three step lines ("A post is placed in the jawbone where the tooth is missing", "A connector is fitted to the post to hold the new tooth", "A crown is fitted on top, between the neighbouring teeth") are general descriptions added to explain the 3D sequence, labelled as an illustration. They make no claims about results. The heading and paragraph are the original "Dental Implants and Bridges" copy.
- **Anatomy hint line.** "Scroll to turn the tooth and open it up. Point at a layer to highlight it." is interface guidance, not practice content.
- **Testimonials slot.** The story calls for testimonials, but the original site has none, so that position shows the original "Why Choose Keeler Family Dental" content. No reviews were written.
- **Smile gallery.** The original site has no patient photos; the gallery slot shows the original implant-denture illustration as a before/after slider, labelled as an illustration.
- **Typography.** Headlines use Fraunces and body text uses Plus Jakarta Sans (both Google Fonts, self-hosted by Next.js).
- **ZIP code 99577** in structured data comes from the original site's CareCredit link; the visible address matches the original exactly.

## 6. Verification performed

- `next build` passes (TypeScript and ESLint clean); all 5 pages are statically generated.
- All 5 original `.html` URLs return 308 redirects to the new pages.
- Headless Chromium run on desktop (1440 × 900) and mobile (390 × 844): no runtime errors, no failed requests, no horizontal overflow (see `qa/` screenshots).
- Hero animation checked on desktop, mobile and with reduced motion: entrance, floating, blinking (eyelids observed closing during the run), scroll hand-off to the 3D scene; no errors and no overflow.
- Upgrade pass: every homepage scene (hero, anatomy turn / cutaway / exploded view / layer highlight, the five service states, implant steps, family, booking) captured on desktop and mobile with no runtime errors and no horizontal overflow.
- Inner pages (About, Services, Financing, Contact) checked on desktop and mobile: no broken images, no runtime errors, no horizontal overflow.
