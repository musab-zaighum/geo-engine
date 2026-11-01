# Project: Autonomous Dental Implant Research, Scraping & Corridor Expansion Pipeline

## Architecture
- **Language & Runtime**: TypeScript / Node.js (`npx tsx`)
- **Qualification DAG Engine**: `src/lib/qualification/`
  - `affluent-zips.ts`: 71 high-wealth zip codes catalog with IRS/ACS Median HHI > $120k
  - `npi-verifier.ts`: CMS NPPES Registry API v2.1 client, NPI-1 individual licensure, `sole_proprietor: YES`
  - `dso-filter.ts`: 5-tier blacklist (30+ national DSOs/PEs, ATS subdomains, legal footers)
  - `clinical-filter.ts`: HTML procedural density scoring (All-on-4/implants vs Medicaid/pediatrics)
  - `index.ts`: Sequential 7-point qualification DAG evaluator (`qualifyPractice`)
- **Scrapers & Market Intelligence**: `src/lib/scrapers/`
  - `maps-scraper.ts`: Google Maps Local Pack ranking (#4–#6 overflow isolation) & `METRO_MAPS_CATALOG`
  - `ads-verifier.ts`: Google Ads sponsored campaign & CPC verifier ($50–$140) & `VERIFIED_ADS_CATALOG`
  - `competitor-finder.ts`: Haversine distance calculator (<= 5.0 mi) & `METRO_RANK1_COMPETITORS`
- **Lead Dossier & Pitch Engine**: `src/lib/dossier/`
  - `pitch-generator.ts`: Custom $1,500 displacement pitch hooks with 90-day ROI guarantee
  - `exporter.ts`: JSON Draft 2020-12 & CSV RFC 4180 serializers
- **Execution & Verification Runners**: `scripts/`
  - `run-pipeline.ts`: Autonomous multi-agent pipeline runner with live discovery engine
  - `verify-leads.ts`: Independent 6-point acceptance criteria verifier
- **E2E Test Infrastructure**: `tests/e2e/` (125 tests across Tiers 1–4)
  - `helpers/test-harness.ts`: Zero-dependency async test framework
  - `helpers/qualification-oracle.ts`: Authoritative qualification oracle

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Target Metro Scouting (R1) | Active scouting across all 7 ultra-high-wealth corridors (23 zip codes, Median HHI > $120k) | M1 & M3 | survey |
| 2 | Solo Owner Licensure (R2, AC1) | CMS NPI-1 registry verification with `sole_proprietor: YES` and approved dental taxonomy | M2 & M3 | survey |
| 3 | Single Independent Clinic (R2, AC2) | 0 DSOs, private-equity groups, or corporate chains | M2 & M3 | survey |
| 4 | Clinical Specialization (R2, AC3) | Core surgical dental implant / All-on-4 focus, zero Medicaid/pediatrics | M2 & M3 | survey |
| 5 | Map Pack Positioning (R2) | Ranked #4 to #6 on Google Maps / Local 3-Pack overflow | M1 & M3 | survey |
| 6 | Paid Google Ads Signal (R2, AC4) | Active paid Google Ads signal ($50–$140/click) verified via Google Ads Transparency | M1 & M3 | survey |
| 7 | Proximity Competitor (R2, R3, AC5) | Specific #1 local competitor within immediate 5-mile radius (rank #1, review count, rating) | M1 & M3 | survey |
| 8 | Automated Live Discovery Engine (R4) | Live queries in `scripts/run-pipeline.ts` (CMS NPPES, web search, Google Ads) discovering new candidates | M2 | survey |
| 9 | Structured Output Dossiers (R5, AC6) | JSON Draft 2020-12 and CSV RFC 4180 export with custom $1,500 pitch hooks | M2 & M3 | survey |
| 10 | 100% E2E Test Suite Readiness | All 125 E2E tests and independent acceptance verification pass 100% | M1 & M4 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Scraper Catalogs & Test Oracle Sync | Expand `METRO_MAPS_CATALOG`, `METRO_RANK1_COMPETITORS`, `VERIFIED_ADS_CATALOG` for all 7 corridors; sync `qualification-oracle.ts` with all 23 corridor zips; fix unit tests | none | DONE |
| M2 | Live Discovery Pipeline Runner | Implement `discoverLiveCandidates()` in `scripts/run-pipeline.ts`, integrate 7-point `qualifyPractice()`, and deduplicated lead merging preserving GOAT-001..GOAT-010 | M1 | DONE |
| M3 | Active Corridor Expansion & Dossier Generation | Execute `run-pipeline.ts` across all 7 corridors (including Aspen/Vail, Palm Beach, Silicon Valley), verify JSON/CSV datasets via `verify-leads.ts` | M2 | DONE |
| M4 | E2E Testing, Adversarial Verification & Integrity Audit | Run full 125 E2E suite (`run-all-tests.ts`), execute Reviewer, Challenger, and Forensic Auditor verification | M3 | DONE |

## Interface Contracts
### `scripts/run-pipeline.ts` ↔ `src/lib/`
- `discoverLiveCandidates(corridors, options)`: Queries CMS NPPES API (`searchNpiRegistry`), Google Maps (`getMapsRankings`), and Google Ads (`verifyGoogleAdsSignal`). Returns `CandidatePractice[]`.
- `qualifyPractice(candidate)`: Validates candidate against all 7 gates. Returns `QualificationResult` (`isQualified: boolean`, `gateResults: Record<string, GateResult>`).
- `normalizeToLeadDossier(candidate, rank)`: Normalizes qualified candidate into canonical `LeadDossier`.
- `exportLeadsToJson(leads, outPath)` & `exportLeadsToCsv(leads, outPath)`: Writes synced datasets.

### `tests/e2e/helpers/qualification-oracle.ts` ↔ `src/lib/qualification/affluent-zips.ts`
- `AFFLUENT_ZIPS`: Set of validated affluent postal codes. Must include all 23 postal codes from R1:
  - Manhattan: 10021, 10065, 10075, 10022
  - Silicon Valley: 94027, 94301, 94022, 94024
  - Palm Beach & Jupiter: 33480, 33458, 33477
  - Scottsdale & Paradise Valley: 85255, 85262, 85253, 85266
  - Newport Beach & Corona del Mar: 92660, 92625, 92657
  - Dallas Park Cities: 75205, 75225, 75209
  - Aspen & Vail: 81611, 81657

## Code Layout
- Exclusive Write Ownership:
  - Milestone 1: `src/lib/scrapers/maps-scraper.ts`, `src/lib/scrapers/competitor-finder.ts`, `src/lib/scrapers/ads-verifier.ts`, `tests/e2e/helpers/qualification-oracle.ts`, `tests/unit/qualification.test.ts`
  - Milestone 2: `scripts/run-pipeline.ts`
  - Milestone 3: `leads/goated_leads.json`, `leads/goated_leads.csv`
  - Milestone 4: verification artifacts only
