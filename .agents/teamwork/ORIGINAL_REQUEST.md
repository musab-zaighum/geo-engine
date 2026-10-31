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
