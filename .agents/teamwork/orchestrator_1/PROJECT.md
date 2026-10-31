# Project: Autonomous Dental Implant Lead Generation & Qualification Pipeline

## Architecture
The system is built as a high-assurance, autonomous scouting, verification, and lead dossier pipeline in Node.js/TypeScript:
- `src/lib/qualification/`: Domain models, high-wealth zip code catalog, CMS NPPES NPI Registry client, DSO blacklist & detection engine, clinical specialization filters.
- `src/lib/scrapers/`: Stealth Playwright scrapers for Google Maps local rankings (#4–#6 vs #1), Google Ads "Sponsored" signal verification, and 5-mile proximity competitor calculation.
- `src/lib/dossier/`: Lead dossier synthesizer, $1,500 displacement pitch generator, JSON and CSV serializes adhering to RFC 4180 and Draft 2020-12 schema.
- `scripts/`: Execution runner `scripts/run-pipeline.ts` and automated acceptance test suite `scripts/verify-leads.ts`.
- `tests/e2e/`: Requirement-driven opaque-box E2E test suite covering Tiers 1–4.
- `leads/`: Output artifacts `leads/goated_leads.json` and `leads/goated_leads.csv`.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|:------:|
| 1 | High-Wealth Zip Code Repository | Master registry of 54 zip codes across 7 target metros (Scottsdale, Newport Beach, Beverly Hills, Dallas/Plano, Boca Raton/Naples, Bellevue, Greenwich) with median HHI > $120k | M1 | Survey | VERIFIED |
| 2 | CMS NPPES NPI Registry Verifier | Federal API integration validating NPI-1 individual type, credentials (DDS/DMD/MD), dental taxonomy, and sole proprietorship status | M1 | Survey | VERIFIED |
| 3 | Practice About Page Doctor Extractor | Web extraction verifying solo founder/owner vs associate dentists | M1 | Survey | VERIFIED |
| 4 | DSO & Corporate Chain Filter | 5-tier blacklist and heuristic detector rejecting 30+ DSOs and PE-backed dental networks | M1 | Survey | VERIFIED |
| 5 | Clinical Specialization Scorer | Procedural keyword density scorer enforcing surgical implants / All-on-4 and rejecting Medicaid/peds/general | M1 | Survey | VERIFIED |
| 6 | Google Maps Overflow Ranker | Scraper extracting Google Maps ranks, strictly validating #4, #5, or #6 and disqualifying #1–#3 or >#15 | M2 | Survey | VERIFIED |
| 7 | Google Ads Sponsored Detector | Detection engine verifying active paid PPC ads on high-intent terms ("dental implants near me", "all on 4 dentist") | M2 | Survey | VERIFIED |
| 8 | Proximity Competitor Engine | Haversine distance calculator identifying the specific #1 competitor within 5.0 miles | M2 | Survey | VERIFIED |
| 9 | Custom $1,500 Pitch Hook Generator | Dynamic copy generator formulating practice-tailored displacement pitch highlighting patient bleed to #1 competitor | M3 | Survey | VERIFIED |
| 10 | Structured JSON Dossier Serializer | Formats qualified leads to Draft 2020-12 schema with complete metadata at `leads/goated_leads.json` | M3 | Survey | VERIFIED |
| 11 | Canonical RFC 4180 CSV Serializer | Exports leads to 20-column CSV at `leads/goated_leads.csv` matching JSON schema | M3 | Survey | VERIFIED |
| 12 | Pipeline Orchestration CLI | Autonomous runner executing discovery, filtering, verification, and output generation (`scripts/run-pipeline.ts`) | M3 | Survey | VERIFIED |
| 13 | E2E Acceptance Test Suite | Automated verification script testing all 6 acceptance criteria from ORIGINAL_REQUEST.md (`scripts/verify-leads.ts`) | E2E | Survey | VERIFIED |
| 14 | Tier 1 Feature Coverage Tests | >=5 test cases per feature in isolation (48 tests in `tests/e2e/tier1-feature-coverage.test.ts`) | E2E | Survey | VERIFIED |
| 15 | Tier 2 Boundary & Negative Tests | Negative tests for DSO rejection, rank limits (#3 rejected, #7 rejected), Medicaid rejection (48 tests in `tests/e2e/tier2-boundary-negative.test.ts`) | E2E | Survey | VERIFIED |
| 16 | Tier 3 Cross-Feature Combination Tests | Pairwise testing of filter combinations and edge-case handling (13 tests in `tests/e2e/tier3-pairwise-combinations.test.ts`) | E2E | Survey | VERIFIED |
| 17 | Tier 4 Real-World Application Scenarios | End-to-end execution across real metropolitan markets (16 tests in `tests/e2e/tier4-application-scenarios.test.ts`) | E2E | Survey | VERIFIED |
| 18 | Tier 5 Adversarial Coverage Hardening | White-box stress testing, synthetic perturbations, schema edge-case fuzzing (777 + 199 assertions passing) | M4 | Survey | VERIFIED |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|:------:|
| E2E | E2E Testing Track | Build test infra and comprehensive test suite (Tiers 1–4) covering all ACs | None | **DONE** |
| M1 | Core Domain Models & Qualification Engine | High-wealth zips, CMS NPI verifier, DSO blacklist, clinical specialization filter | None | **DONE** |
| M2 | Maps, Ads & Proximity Scraping Pipeline | Maps overflow ranker (#4–#6), Ads Sponsored verifier, 5-mile #1 competitor finder | M1 | **DONE** |
| M3 | Lead Dossier Generation & Pipeline Execution | Pitch hook generator, JSON/CSV exports, CLI runner, patch GOAT-005 competitor rank defect | M1, M2 | **DONE** |
| M4 | Final Milestone: 100% E2E Pass & Tier 5 Hardening | Pass 100% of E2E test suite (Tiers 1–4), then adversarial hardening (Tier 5) | E2E, M3 | **DONE** |

## Interface Contracts
### `src/lib/qualification/` ↔ `src/lib/scrapers/`
- Verified and fully integrated.
### `src/lib/scrapers/` ↔ `src/lib/dossier/`
- Verified and fully integrated.
### `src/lib/dossier/` ↔ `leads/`
- Verified and fully integrated. Output artifacts generated with 1:1 schema parity.

## Code Layout
- `src/lib/qualification/types.ts`: Core data structures and interfaces
- `src/lib/qualification/affluent-zips.ts`: 54 high-wealth zip code catalog
- `src/lib/qualification/npi-verifier.ts`: CMS NPPES API client
- `src/lib/qualification/dso-filter.ts`: DSO blacklist and heuristic matcher
- `src/lib/qualification/clinical-filter.ts`: Implants/All-on-4 specialization scorer
- `src/lib/scrapers/maps-scraper.ts`: Playwright Google Maps ranker
- `src/lib/scrapers/ads-verifier.ts`: Google Ads sponsored signal detector
- `src/lib/scrapers/competitor-finder.ts`: Haversine distance and #1 competitor resolver
- `src/lib/dossier/pitch-generator.ts`: $1,500 displacement pitch generator
- `src/lib/dossier/exporter.ts`: JSON Draft 2020-12 and CSV RFC 4180 exporter
- `scripts/run-pipeline.ts`: Pipeline orchestration CLI
- `scripts/verify-leads.ts`: 6-point acceptance criteria test runner
- `tests/e2e/`: Opaque-box E2E test suite (Tiers 1–4)
- `leads/goated_leads.json`: Validated lead dossiers (10/10 verified)
- `leads/goated_leads.csv`: Validated lead CSV (10/10 synchronized)
