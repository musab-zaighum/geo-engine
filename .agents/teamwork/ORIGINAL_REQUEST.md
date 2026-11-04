# Original User Request

## Initial Request — 2026-10-31T20:23:29Z

Use a very large team of agents. Build and execute an autonomous multi-agent research and scraping pipeline to discover, qualify, and compile "Goated" high-ticket dental implant clinic leads and their #1 local competitors across affluent US metro zip codes.

Working directory: /home/pwn/geo-engine/leads
Integrity mode: development

## Requirements

### R1. Target Metro & Affluent Zip Code Scouting
The agent team must scout clinics in high-wealth metropolitan zip codes (e.g., Scottsdale AZ, Newport Beach CA, Dallas/Plano TX, Boca Raton/Naples FL, Beverly Hills CA, Bellevue WA, Greenwich CT) with high median household incomes where dental implants and full-arch procedures have high local demand.

### R2. Strict 7-Point Qualification & Disqualification Engine
Every discovered practice must be evaluated against strict admission criteria:
- **Decision Maker:** Must be a solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Disqualify associate dentists, hygienists, or clinic managers.
- **Organization Structure:** Must be a single independent private clinic. Strictly disqualify corporate chains and DSOs (ClearChoice, Heartland Dental, Aspen Dental, Pacific Dental Services, Smile Brands).
- **Service Specialization:** Core clinical focus must be surgical dental implants, All-on-4, and full-arch restoration. Disqualify practices focused primarily on routine cleanings, pediatric dentistry, general checkups, or Medicaid.
- **Map Pack Positioning:** Practice must be ranked #4 to #6 on Google Maps / Local 3-Pack overflow ("More Places"). Disqualify clinics already ranked #1 to #3 or buried past #15.
- **Paid Google Ads Signal:** Practice must be actively running paid Google Ads (verified by the "Sponsored" tag on high-intent terms like "dental implants near me" or "all on 4 dentist"), proving active marketing budget ($50–$100/click).
- **Competitive Proximity Hook:** Practice must have a clear, visible #1 local competitor within the same 5-mile radius outranking them in AI and local search.
- **Location Wealth:** Practice address must reside in an affluent zip code.

### R3. Competitor Intelligence & Displacement Hook
For every qualified clinic, identify the specific #1 competing practice in their 5-mile radius, including competitor name, Google Maps rank (#1), review count, rating, and procedural positioning.

### R4. Structured Output & Lead Dossier Generation
Export all qualified leads into structured JSON (`leads/goated_leads.json`) and CSV (`leads/goated_leads.csv`) containing:
- Practice Name & Clean Domain URL
- Solo Owner Doctor Name & Credential (DDS/DMD)
- Direct Phone Number & Physical Address (with Zip Code)
- Google Maps Rank (#4, #5, or #6) & Review Count
- Verified "Sponsored" Google Ad keyword signal
- #1 Competitor Name, Address, and Review Count
- Custom $1,500 Pitch Hook highlighting the exact #1 competitor taking their high-ticket implant patients

## Acceptance Criteria

### Lead Verification & Data Integrity
- [ ] 100% of outputted leads have a verified solo owner doctor (DDS/DMD/MD) identified via CMS NPI Registry or practice "About" page.
- [ ] 0 DSOs, private-equity groups, or corporate chains (ClearChoice, Aspen, Heartland) present in the qualified list.
- [ ] 100% of leads show explicit promotional focus on dental implants, All-on-4, or surgical restoration.
- [ ] Every lead has an active paid Google Ads signal ("Sponsored" tag verified).
- [ ] Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius.
- [ ] Output files exist at `/home/pwn/geo-engine/leads/goated_leads.json` and `/home/pwn/geo-engine/leads/goated_leads.csv` with valid schema.


## Follow-up — 2026-11-01T02:55:38Z

Use a very large team of agents. Build and execute an active, continuous multi-agent deep research and scraping pipeline to discover, qualify, and compile "Goated" high-ticket dental implant clinic leads and their #1 local competitors across affluent US metro zip codes on every cycle.

Working directory: /home/pwn/geo-engine/leads
Integrity mode: development

## Requirements

### R1. Target Metro Scouting & Active Corridor Expansion
The agent team must actively research and scout dental implant practices in ultra-high-wealth metropolitan corridors:
1. Manhattan Upper East Side & Midtown, NY (10021, 10065, 10075, 10022)
2. Silicon Valley / Atherton / Palo Alto / Los Altos, CA (94027, 94301, 94022, 94024)
3. Palm Beach & Jupiter, FL (33480, 33458, 33477)
4. Scottsdale North & Paradise Valley, AZ (85255, 85262, 85253, 85266)
5. Newport Beach & Corona del Mar, CA (92660, 92625, 92657)
6. Dallas Park Cities & Preston Hollow, TX (75205, 75225, 75209)
7. Aspen & Vail, CO (81611, 81657)

### R2. Strict 7-Point Live Qualification DAG
Every discovered practice must be rigorously vetted against all 7 mandatory gates:
- Decision Maker: Solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Verified via CMS NPI-1 registry with sole_proprietor: YES. Disqualify associate dentists, hygienists, or clinic managers.
- Organization Structure: Single independent private clinic. Strictly disqualify corporate chains and DSOs (ClearChoice, Heartland Dental, Aspen Dental, Pacific Dental Services, Smile Brands).
- Service Specialization: Core clinical focus must be surgical dental implants, All-on-4, and full-arch restoration. Disqualify routine cleanings, pediatric dentistry, general checkups, or Medicaid.
- Map Pack Positioning: Practice must be ranked #4 to #6 on Google Maps / Local 3-Pack overflow ("More Places"). Disqualify clinics already ranked #1 to #3 or buried past #15.
- Paid Google Ads Signal: Practice must be actively running paid Google Ads (verified by the "Sponsored" tag on high-intent terms or active campaigns in Google Ads Transparency Center), spending $50–$140/click.
- Competitive Proximity Hook: Practice must have a clear, visible #1 local competitor within the same 5-mile radius outranking them in AI and local search.
- Location Wealth: Practice address must reside in a verified high-wealth zip code (Median HHI > $120k).

### R3. Competitor Intelligence & Displacement Hook
For every qualified clinic, identify the specific #1 competing practice in their 5-mile radius, including competitor name, address, Google Maps rank (#1), review count, rating, and procedural positioning.

### R4. Automated Live Discovery Engine in Pipeline Runner
Enhance scripts/run-pipeline.ts so that every execution actively queries live discovery sources (CMS NPPES Registry API, live web search, and Google Ads Transparency checks) to scout and discover NEW candidate practices instead of merely verifying existing files.

### R5. Structured Output & Lead Dossier Generation
Export all qualified leads into structured JSON (leads/goated_leads.json) and CSV (leads/goated_leads.csv).

## Acceptance Criteria
- [ ] 100% of outputted leads have a verified solo owner doctor (DDS/DMD/MD) identified via CMS NPI Registry with sole_proprietor: YES.
- [ ] 0 DSOs, private-equity groups, or corporate chains present in the qualified list.
- [ ] 100% of leads show explicit promotional focus on dental implants, All-on-4, or surgical restoration.
- [ ] Every lead has an active paid Google Ads signal ("Sponsored" tag verified in Google Ads Transparency Center).
- [ ] Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius.
- [ ] Output files exist at /home/pwn/geo-engine/leads/goated_leads.json and /home/pwn/geo-engine/leads/goated_leads.csv with valid schema.
- [ ] All 125 E2E tests and independent acceptance verification pass 100%.

## Follow-up — 2026-11-01T14:06:57Z

Use a very large team of agents. Execute an exhaustive, live browser-based functional, visual, and clinician UX test suite across the entire NexusRank1 platform on http://localhost:3000 using browser agents. Test every button, form, tab, modal, calculator slider, and export flow to guarantee 100% reliability, zero runtime crashes, and a flawless clinician user experience.

Working directory: /home/pwn/geo-engine
Integrity mode: development

## Requirements

### R1. Comprehensive Interactive UI & Flow Testing
Browser agents must systematically test every interactive UI element across all pages:
1. **Homepage (`/`) & Instant Audit Bar (`#audit-bar`):**
   - Test preset domain buttons (`dentalpractice.com`, `mayoclinic.org`, `clevelandclinic.org`, `austincosmeticdental.com`) and custom input.
   - Verify live audit progress animation and radial score gauge rendering.
   - Test all 7 tab navigations: Competitor Grid, Profile & Directories, Review Loops & QR, AI Factsheet, Live AI Simulator, Doctor Licensure Graph, and Clinical Checklist.
   - Test Webmaster Code toggle (`showRawCode`) and Copy Code / Rich Results test links.
   - Test Global Export Toolbar buttons: Whop checkout link, Live Public Report (`/report/[domain]`), Vector PDF export (`/api/report/pdf`), JSON download, and Practice Manager Dispatch modal.
2. **Patient Acquisition & Revenue Modeler (ROI Calculator):**
   - Test specialty selector buttons (Cosmetic Dentistry, Plastic Surgery, Orthopedics, Medspa).
   - Test Case Value and Expected Patient sliders; verify dynamic formula calculations.
3. **Corner Chat Widget:**
   - Test opening, sending questions, receiving streaming/fallback responses, and closing.
4. **Clinic Command Center (`/partner-console`):**
   - Test all 4 tabs: Overview, Competitor Radar, Clinical Schema, and Settings.
   - Test saving settings and verifying toast notifications.
5. **Pricing (`/pricing`), Public Report (`/report/[domain]`), Login (`/login`), and Signup (`/signup`):**
   - Verify page rendering, links, and responsive layouts.

### R2. Clinician Persona & Conversion Evaluation
Subagents must evaluate the user experience from the perspective of private practice owners (surgeons, cosmetic dentists, medspa medical directors):
- Identify any residual developer jargon, confusing labels, or cognitive friction.
- Verify that every claim and diagnostic translates into clear clinical and financial value.
- Formulate concrete code enhancements to resolve any identified defects or friction.

### R3. Automated Code Remediation & Verification
For any defect, visual glitch, broken link, or friction identified during browser testing:
- Implement immediate code fixes across relevant components and pages.
- Re-test using the browser agent to confirm resolution.
- Verify 0 TypeScript errors and clean production build.

## Acceptance Criteria

### Browser Functional Integrity
- [ ] 100% of routes (`/`, `/pricing`, `/partner-console`, `/report/dentalpractice.com`, `/login`, `/signup`) load with HTTP 200 and zero console errors.
- [ ] All 7 tabs in the Instant Audit Bar render distinct, accurate data and interactive widgets without crashing.
- [ ] The Webmaster Code toggle cleanly switches between the Executive Factsheet and the raw schema/llms.txt code view.
- [ ] The Practice Manager Modal opens, validates inputs, and triggers successful dispatch notifications.
- [ ] ROI Calculator sliders dynamically update monthly revenue and net ROI calculations without lag.
- [ ] The Corner Chat Widget successfully answers clinician inquiries with $1,500 one-time deployment terms.
- [ ] All external checkout links correctly point to `https://whop.com/checkout/plan_e37e96b86e088/`.
- [ ] Zero TypeScript errors (`npx tsc --noEmit`) and 15/15 routes pass production compilation (`npm run build`).


## 2026-11-04T11:52:08Z

Use a very large team of agents. Redesign and deploy the NexusRank1 clinical platform to transition from upfront fixed pricing to an exclusive, high-ticket Zip Code Audit intake pipeline for elective healthcare practices (surgeons, cosmetic dentists, aesthetic medical directors). Implement the exact 5-section architecture, email submission routing to name@nexusrank1.com, dual Next.js build + Netlify Drop static export, and exhaustive headless Chrome browser verification.

Working directory: /home/pwn/geo-engine
Integrity mode: development

## Requirements

### R1. Hero Header (Above the Fold)
- **Headline:** Ensure AI Search Recommends Your Clinic Over Local Competitors
- **Subheadline:** The complete, automated local growth & AI audit system engineered exclusively for medical, dental, and aesthetic clinic owners. Dominate local search proximity on ChatGPT, Perplexity, and Google AI Overviews.
- **Call to Action (CTA):** `[ Request Your Zip Code Audit ]` — button smoothly scrolls directly to the Intake Form section with clear focus indicator.
- **Visuals & Proof:** High-trust clinical badges, CMS NPPES licensure tags, and instant authority indicators.

### R2. Core Done-For-You Features Section
Highlight the 4 clinical growth pillars emphasizing complete done-for-you technical implementation:
1. **Geo-Visibility Grid Tracking & Zip Code Benchmarking:** Weekly mapping of their exact 5-mile radius to eliminate local blind spots.
2. **0-Error MedicalClinic Schema ASTs:** Enterprise technical code so AI engines recognize their clinical credentials and recommend them first.
3. **Automated Review Loops & Front-Desk Engine:** Seamless capture of 5-star Google reviews from patients right at the clinic.
4. **Strict Zip Code Exclusivity:** Locking out their local rivals permanently with territory protection.

### R3. Intake Form Section (Contact for Audit)
Replace the fixed $1,500 checkout button on the homepage with a sleek, doctor-tailored intake card:
- **Required Fields:**
  - Practice Name
  - Doctor / Surgeon Name
  - Website Domain & City/Zip Code
  - Direct Email / Phone
- **Button Text:** `[ Submit Audit Request ]`
- **Submission Routing:**
  - Route form submissions through `/api/lead` and configure submission dispatch to forward directly to `name@nexusrank1.com`.
  - Include instant user feedback with a success confirmation state and immediate toast notification.

### R4. The ROI Proof & Math Section
Show a transparent financial breakdown centered on high-ticket elective procedure production:
- Highlight full-arch case values ($20,000 to $50,000 per case).
- Demonstrate that securing just a single patient consultation covers the entire system deployment multiple times over.
- Include interactive specialty toggles (All-on-4 Implants, Facial Plastic Surgery, Orthopedics, MedSpa).

### R5. Clinical FAQ Section
Address critical healthcare practice questions:
- **Medical Board Compliance:** Adherence to state medical/dental board advertising guidelines.
- **HIPAA Safety:** Zero protected health information (PHI) processed; strict focus on public clinical credential syndication.
- **Fast Deployment:** 100% done-for-you setup deployed within 48 hours.

### R6. Dual Deployment & Headless Browser Verification
- **Dual Build:** Next.js production build (`npm run build`) AND a standalone static distribution package in `dist-netlify/` ready for immediate drag-and-drop deployment on Netlify Drop (app.netlify.com/drop).
- **Headless Browser Test Suite:** Live Chrome tests verifying all form fields, smooth scrolling, validation error states, submission dispatch, and responsive viewports.

## Acceptance Criteria

### Clinician Landing Page & Conversion Integrity
- [ ] Hero headline is exactly: "Ensure AI Search Recommends Your Clinic Over Local Competitors".
- [ ] Hero subheadline matches the user specification word-for-word.
- [ ] CTA button `[ Request Your Zip Code Audit ]` scrolls directly to the Intake Form.
- [ ] The 4 core features (Geo-Grid, Schema ASTs, Review Loops, Strict Zip Code Exclusivity) are clearly presented.
- [ ] Intake form collects Practice Name, Doctor Name, Domain & City/Zip, Email/Phone with `[ Submit Audit Request ]`.
- [ ] Form handler submits to `/api/lead` and dispatches notifications to `name@nexusrank1.com`.
- [ ] Full-arch case values ($20,000 to $50,000) are explicitly modeled in the ROI section.
- [ ] FAQ answers medical board compliance, HIPAA safety, and 48-hour turnaround.

### Build & Browser Verification
- [ ] TypeScript passes with 0 errors (`npx tsc --noEmit`).
- [ ] Next.js compiles with 0 build errors (`npm run build`).
- [ ] A clean static export directory (`dist-netlify/`) is generated and verified for Netlify Drop.
- [ ] Real headless browser tests pass 100% of functional checks with 0 console errors.
