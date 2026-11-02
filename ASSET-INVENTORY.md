# Asset Inventory

Every image found on keelerdental.org (audited 2026-11-02) was downloaded, converted to WebP (the logo is also kept as PNG) and stored under `public/assets/`. Nothing in the site uses stock photography or AI-generated images. The 3D tooth is generated in code (no external model file).

| Original URL | Local asset path | Description | Used in redesign |
|---|---|---|---|
| https://keelerdental.org/img/2023-Reduced/logo-kfd.png | /assets/logo/keeler-family-dental-logo.webp (+ .png) | Keeler Family Dental logo (three smiling teeth, wordmark) | Header, footer, mobile menu, structured data, no-WebGL hero fallback |
| https://keelerdental.org/_assets/icons/ms-icon-70x70.png | /assets/logo/ms-icon-70x70.png | Site icon (teeth logo) | Favicon and Apple touch icon |
| https://keelerdental.org/img/2023-Reduced/DoctorKeeler-office.png | /assets/team/dr-keeler-office.webp | Dr. Keeler in front of the log-cabin style office building | Home (dentist scene, clinic gallery), About hero, Open Graph image |
| https://keelerdental.org/img/2023-Reduced/contact.jpg | /assets/clinic/keeler-office-street.webp | Dr. Keeler beside Old Glenn Highway near the office | Home clinic gallery, Contact hero |
| https://keelerdental.org/img/2023-Reduced/Financing-Options1.jpg | /assets/clinic/dr-keeler-finance-insurance.webp | Dr. Keeler with "Finance and Insurance Options" text | Home clinic gallery, Financing hero |
| https://keelerdental.org/img/2023-Reduced/whitening.png | /assets/services/whitening.webp | Smiling woman, whitening | Home treatments (Whitening), Services overview + Cosmetic section |
| https://keelerdental.org/img/2023-Reduced/implants.png | /assets/services/implants.webp | Implant illustration | Home treatments (Implant), Services overview |
| https://keelerdental.org/img/2023-Reduced//cosmetic.png | /assets/services/cosmetic.webp | Patient checking smile in a mirror | Home treatments (Cosmetic), Services overview + Cosmetic section |
| https://keelerdental.org/img/2023-Reduced//family.png | /assets/services/family.webp | Family of three | Home treatments (Family), Services overview, About |
| https://keelerdental.org/img/index/emergency.png | /assets/services/emergency.webp | Man in tooth pain | Home treatments (Emergency), Services overview |
| https://keelerdental.org/img/2023-Reduced/services11.png | /assets/services/services-available.webp | Collage of services | Services hero |
| https://keelerdental.org/img/2023-Reduced/removable-dentures-versus-denture-implants-2.png | /assets/services/removable-dentures-vs-denture-implants.webp | Implant-supported denture illustration | Services (Dental Implants and Bridges) |
| (same image, top half) | /assets/services/implant-denture-placement.webp | Crop: implants placed, denture lifted | Before/after slider (Home scene 05, Services) |
| (same image, bottom half) | /assets/services/implant-denture-seated.webp | Crop: denture seated on implants | Before/after slider (Home scene 05, Services) |
| https://keelerdental.org/img/2023-Reduced/complete-partial-dentures.jpg | /assets/services/complete-partial-dentures.webp | Partial denture and complete denture | Services (Dental Partials and Dentures) |
| https://keelerdental.org/img/2023-Reduced/types-of-partial-dentures.jpg | /assets/services/types-of-partial-dentures.webp | Types of partial dentures | Services (Dental Partials and Dentures) |
| https://keelerdental.org/_assets/image-treatment.jpg | /assets/services/build-a-better-treatment-plan.webp | "Build a better treatment plan" graphic | Services (New Patient Special) |
| https://keelerdental.org/img/2023-Reduced/5-1_specials.png | /assets/other/promotions/new-patient-special-badge.webp | Pink starburst: New Patient Special, Cleaning Exam X-rays | Home hero promotion card |
| https://keelerdental.org/img/index/5-2_specials.png | /assets/other/promotions/new-patient-special-save-200.webp | Starburst: New Patient Special, Save over $200 | Home exam-special card, Services (New Patient Special) |
| https://keelerdental.org/img/2023-Reduced/ins-no.png | /assets/other/promotions/no-insurance-membership.webp | "No insurance? Our patients don't need it!" | Home hero promotion card, Home membership banner |
| https://keelerdental.org/_assets/image.png | /assets/other/promotions/join-membership-club.webp | "No insurance?" membership graphic (contact/financing version) | Financing membership card, Contact membership card |
| https://keelerdental.org/img/img/index/call-now-cal.png | /assets/other/promotions/online-patient-appointment-portal.webp | "Online Patient Appointment Portal" graphic | Contact (Request appointment) |
| https://keelerdental.org/img/index/call-now.png | /assets/other/promotions/call-now.webp | "Call now" button graphic | Services (Insurance and Payment Plans) |
| https://keelerdental.org/_assets/CareCreditLogo.png | /assets/other/carecredit-apply-now.webp | CareCredit "Apply Now" logo | Financing (option 3) |
| https://keelerdental.org/img/img/index/bcbsa-fep-logo@2x.png | /assets/other/insurance/fep-blue.webp | FEP Blue logo | Insurance strip (Home, Financing) |
| https://keelerdental.org/img/img/index/logo-ddpa-green.png | /assets/other/insurance/delta-dental.webp | Delta Dental logo | Insurance strip (Home, Financing) |
| https://keelerdental.org/img/img/index/chip-dkc.jpg | /assets/other/insurance/denali-kidcare.webp | Denali KidCare logo | Insurance strip (Home, Financing) |
| https://keelerdental.org/img/img/index/bcbk-logo.png | /assets/other/insurance/blue-cross-blue-shield.webp | Blue Cross Blue Shield logo | Insurance strip (Home, Financing) |
| https://keelerdental.org/img/img/index/metlife.png | /assets/other/insurance/metlife.webp | MetLife logo | Insurance strip (Home, Financing) |
| https://keelerdental.org/_assets/logo-paws.png | /assets/other/alaska-web-solutions-logo.webp | Previous web developer's logo (Alaska Web Solutions) | Kept in assets, not shown (replaced by the Magdio credit; see preservation report) |

## Added for the redesign (not from the original site)

| File | Source | Used on |
|---|---|---|
| /assets/hero/tooth-parent-left.webp, tooth-parent-right.webp, tooth-child.webp | Cut from the agency-supplied tooth-family illustration (1672 × 941 PNG) | Home hero, animated layers |
| /assets/hero/*-mouth.webp, *-iris-1.webp, *-iris-2.webp | Small patches cut from the same illustration | Smile and eye motion in the hero |

The layer cut is reproducible with `scripts/hero-layers/gen.py` (Python, OpenCV, rembg); it writes the images and `src/components/home/toothFamily.data.ts`.

## Not retrievable

| Original URL | Status | Note |
|---|---|---|
| https://keelerdental.org/img/bu-image/bg-mask11.png | 404 | Decorative background mask referenced by CSS; not needed |
| https://keelerdental.org/site/downloads/NoticeOfPrivacy_KeelerDental.pdf | 404 on the live site | Form listed, shows "Call to request" until the PDF is supplied |
| https://keelerdental.org/site/downloads/NoticeOfPrivacyAcknowledgement_KeelerDental.pdf | 404 on the live site | Same |
| https://keelerdental.org/site/downloads/Financing_Options_KeelerDental.pdf | 404 on the live site | Same |

## Empty folders, by design

`/assets/gallery/` and `/assets/patients/` are empty: the original site has no smile gallery and no patient photographs. They are ready for client-approved photos.
