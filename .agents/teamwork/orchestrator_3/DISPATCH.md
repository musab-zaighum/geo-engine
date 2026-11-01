# Dispatch Log

## 2026-11-01T02:56:56Z

You are the Project Orchestrator (orchestrator_3).
Your working directory is: /home/pwn/geo-engine/.agents/teamwork/orchestrator_3
The project repository is: /home/pwn/geo-engine

The authoritative user request is recorded in: /home/pwn/geo-engine/.agents/teamwork/ORIGINAL_REQUEST.md
Please read the latest follow-up request in ORIGINAL_REQUEST.md immediately.

The user request states:
"Use a very large team of agents. Build and execute an active, continuous multi-agent deep research and scraping pipeline to discover, qualify, and compile "Goated" high-ticket dental implant clinic leads and their #1 local competitors across affluent US metro zip codes on every cycle.

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
