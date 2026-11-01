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
