# Comprehensive Survey Report: Test Suite Architecture, Qualification DAG, & Acceptance Verification

**Agent:** Explorer 3 (`explorer_survey_3_3`)  
**Mission:** Read-only architectural survey of Test Suite (`tests/e2e/`, `tests/unit/`), Qualification DAG, and Acceptance Verification (`scripts/verify-leads.ts`, `TEST_READY.md`) under the follow-up request (2026-11-01T02:55:38Z).  
**Status:** COMPLETE (Hard Handoff)  
**Date:** 2026-11-01T08:08:00Z  

---

## 1. Observation

### 1.1 Test Suite Architecture & Current Execution Status
We inspected the test files and executed the test commands directly in the environment:
1. **E2E Unified Test Suite Runner:**
   - **Command:** `npx tsx tests/e2e/run-all-tests.ts`
   - **Result:** Exited code `0` in `34ms`. Total tests: **125**, Passed: **125 (100%)**, Failed: **0**.
   - Breakdown:
     - Tier 1: Feature Coverage (Equivalence Class Isolation) — 48 tests (6 per feature × 8 features)
     - Tier 2: Boundary & Negative Cases — 48 tests (6 per feature × 8 features)
     - Tier 3: Cross-Feature Interactions (Pairwise Combinations) — 13 tests
     - Tier 4: Real-World Application Scenarios & Acceptance Criteria Audit — 16 tests
2. **Independent Acceptance Criteria Verifier:**
   - **Command:** `npx tsx scripts/verify-leads.ts`
   - **Result:** Exited code `0`. Verified all 6 Acceptance Criteria at 100% across all 25 compiled Goated Leads in `leads/goated_leads.json` and `leads/goated_leads.csv`.
3. **Unit Test Suites (`tests/unit/`):**
   - `npx tsx tests/unit/qualification.test.ts`: **145/145 passed (100%)**
   - `npx tsx tests/unit/dossier.test.ts`: **79/79 passed (100%)**
   - `npx tsx tests/unit/scrapers.test.ts`: **79/79 passed (100%)**

---

### 1.2 Inspection of the 125 E2E Tests Across the 7 Gates & Schemas

#### Gate 1: Target Metros & Affluent Zip Code Scouting (R1)
- **Implementation in Oracle (`tests/e2e/helpers/qualification-oracle.ts:14-60`):**
  - Contains `AFFLUENT_ZIPS: Record<string, AffluentZipInfo>` with exactly **26 zip codes** covering 7 original metro areas (Scottsdale, Newport Beach, Beverly Hills, Dallas/Plano, Boca Raton/Delray/Naples, Bellevue, Greenwich).
  - Function `isAffluentZip(zip: string): boolean` (`lines 90-95`) checks `AFFLUENT_ZIPS[clean]?.medianHhi >= 120000`.
- **Tier 1 (`tier1-feature-coverage.test.ts:26-62`):** Tests positive validation for 6 specific zips: `85260` (Scottsdale), `92660` (Newport Beach), `75034` (Dallas/Plano), `33496` (Boca Raton), `98004` (Bellevue), `06830` (Greenwich).
- **Tier 2 (`tier2-boundary-negative.test.ts:24-49`):** Tests rejection of non-affluent and malformed zips: `48201` (Detroit), `38126` (Memphis), `9021A`, `8526`, `""`, `null`, `59715` (Bozeman MT).
- **Tier 3 (`tier3-pairwise-combinations.test.ts:67-96`):** Pairwise tests assert `isAffluentZip("48201") === false` (P3-04) and `isAffluentZip("85260") === true` (P3-05).
- **Tier 4 (`tier4-application-scenarios.test.ts:40-197`):** Tests `isAffluentZip(lead.location.zip_code)` for GOAT-001 through GOAT-010.

#### Gate 2: Solo Owner Doctor Verification (R2, AC1)
- **Implementation in Oracle (`qualification-oracle.ts:97-126`):**
  - Requires `name.trim().length >= 3`.
  - Requires credentials matching `/\b(DDS|D\.D\.S\.|DMD|D\.M\.D\.|MD|M\.D\.)\b/i`.
  - Rejects associate/non-owner titles matching `/\b(associate|hygienist|assistant|manager|coordinator|administrator)\b/i`.
  - Requires ownership/leadership title matching `/\b(solo|owner|founder|principal|director|surgeon|specialist|head)\b/i`.
- **Tier 1 (`tier1-feature-coverage.test.ts:67-133`):** 6 tests validating DDS, DMD, MD/DDS, multi-credentials (DDS, FICOI), board-certified prosthodontist (DDS, FACP), and Malo-trained implantologist.
- **Tier 2 (`tier2-boundary-negative.test.ts:54-120`):** 6 tests disqualifying associate dentists, RDH hygienists, clinic operations managers, empty names, MBA degrees, and treatment coordinators.
- **Tier 4 AC 1 (`tier4-application-scenarios.test.ts:203-215`):** Audits 100% of leads in `leads/goated_leads.json`, verifying `validateDoctor(lead.solo_owner).valid === true`.
- **Live CMS NPPES Integration (`src/lib/qualification/npi-verifier.ts:280-520`):**
  - Verifies NPI-1 individual practitioner (rejects NPI-2 corporate organization).
  - Enforces `sole_proprietor: YES` (or PC/PLLC ownership indicator).
  - Validates dental taxonomy codes (`122300000X`, `1223G0001X`, `1223P0300X`, `1223P0700X`, `1223S0112X`, `204E00000X`).
  - Disqualifies pediatric (`1223P0221X`), pathology (`1223P0106X`), public health (`1223D0001X`).

#### Gate 3: 0 DSOs / Corporate Chains (R2, AC2)
- **Implementation in Oracle (`qualification-oracle.ts:62-88, 128-137`):**
  - Scans text against `DSO_BLACKLIST` containing 25 corporate entities (ClearChoice, Aspen Dental, Heartland, Pacific Dental, Smile Brands, Western Dental, Sonrava, Gentle Dental, 42 North, Dental Care Alliance, Affordable Dentures, MB2, NADG, etc.).
- **Tier 1 (`tier1-feature-coverage.test.ts:138-173`):** 6 tests verifying independent clinic passes and major corporate chains fail.
- **Tier 2 (`tier2-boundary-negative.test.ts:121-175`):** 6 tests detecting MB2 partner, Heartland regulatory disclaimers, Gentle Dental, etc.
- **Tier 4 AC 2 (`tier4-application-scenarios.test.ts:217-228`):** Scans all leads in `leads/goated_leads.json` and asserts `dsoCount === 0`.

#### Gate 4: Explicit Surgical Dental Implant Specialization (R2, AC3)
- **Implementation in Oracle (`qualification-oracle.ts:139-172`):**
  - Disqualifies Medicaid / Denti-Cal / state insurance / CHIP (`/\b(medicaid|denti-cal|state insurance|chip)\b/i`).
  - Disqualifies pediatric-only practices (`/\b(pediatric dentistry only|pediatric only|children'?s dentistry only)\b/i`).
  - Requires at least one positive surgical implant term (`implant`, `all-on-4`, `all-on-four`, `full-arch`, `full arch`, `periodont`, `prosthodont`, `zygomatic`, `surgical restoration`, `bone graft`, `sinus lift`).
- **Tier 1 (`tier1-feature-coverage.test.ts:178-214`):** 6 tests validating surgical implants, All-on-4, periodontics/sinus lifts, prosthodontics, zygomatic, and high-intent query matching.
- **Tier 2 (`tier2-boundary-negative.test.ts:176-228`):** 6 tests disqualifying Medicaid, pediatric-only, routine-only cleanings, general family checkups, empty text, and state CHIP.
- **Tier 4 AC 3 (`tier4-application-scenarios.test.ts:230-240`):** Checks 100% of leads in `leads/goated_leads.json` and asserts `qualifiedCount === leads.length`.

#### Gate 5: Map Pack Positioning (#4–#6) (R2)
- **Implementation in Oracle (`qualification-oracle.ts:174-185`):**
  - Requires integer rank.
  - Rejects ranks 1, 2, 3 (already in Local 3-Pack).
  - Rejects ranks < 4 or > 6 (outside required overflow fold).
- **Tier 1 (`tier1-feature-coverage.test.ts:219-253`):** Accepts ranks 4, 5, 6; validates commercial intent query and review count integer >= 1.
- **Tier 2 (`tier2-boundary-negative.test.ts:229-281`):** Rejects ranks 1, 2, 3, 7, 16, and non-integer/negative (4.5, -1).

#### Gate 6: Paid Google Ads Signal ($50–$140/click) (R2, AC4)
- **Implementation in Oracle (`qualification-oracle.ts:187-207`):**
  - Rejects inactive/unverified status strings (`/\b(no active|inactive|disabled|expired|unverified|none)\b/i`).
  - Requires active status (`/\b(active|verified|running|sponsored)\b/i`).
  - Requires non-empty `active_ad_count`.
  - Requires `estimated_cpc` with dollar amounts matching `/\$[0-9]+/`.
- **Tier 1 (`tier1-feature-coverage.test.ts:258-332`):** Tests Active Verified Advertiser, active PPC campaigns, SERP Sponsored tag, and CPC >= $50/click.
- **Tier 2 (`tier2-boundary-negative.test.ts:282-334`):** Rejects inactive ads status, missing ads object, missing `active_ad_count`, missing dollar signs, primitive string, and empty status.
- **Tier 4 AC 4 (`tier4-application-scenarios.test.ts:242-253`):** Verifies 100% of leads in `leads/goated_leads.json` have active ads and dollar CPC.

#### Gate 7: Proximity Competitor <= 5.0 Miles with Rank #1 (R2, R3, AC5)
- **Implementation in Oracle (`qualification-oracle.ts:209-251`):**
  - Haversine distance formula: `haversineDistanceMiles(lat1, lon1, lat2, lon2)`.
  - Requires competitor object with `practice_name.length >= 2`, address, phone, website.
  - Rejects self-referential competitor (`comp.practice_name === candidatePracticeName`).
  - Allows rank 1 (or 3 for local 3-pack gatekeeper competitor) in Oracle.
  - Rejects `distanceMiles > 5.0`.
- **Important Discrepancy with `verify-leads.ts`:**
  - `scripts/verify-leads.ts` line 379:
    ```ts
    if (comp.rank !== 1) {
      ac5Failures.push(`${lead.lead_id}: Competitor rank is #${comp.rank} (strictly requires rank #1)`);
    }
    ```
  - While `qualification-oracle.ts` tolerates rank 3 for gatekeepers, **`scripts/verify-leads.ts` strictly requires `comp.rank === 1`**.
  - All leads in `leads/goated_leads.json` currently have `top_competitor_5mi.rank === 1`.

#### Output Schemas & 1:1 JSON/CSV Parity (R4, R5, AC6)
- **JSON Schema:** Validates against JSON Schema Draft 2020-12 via `validateLeadSchema(lead)` (`qualification-oracle.ts:254-358`) and `validateLeadJson(lead)` (`src/lib/dossier/exporter.ts:311-410`).
- **CSV Format:** Validates RFC 4180 parsing (`parseRFC4180Csv`) across exactly 20 canonical headers (`CANONICAL_CSV_HEADERS`).
- **Tier 4 AC 6 (`tier4-application-scenarios.test.ts:272-304`):** Verifies files exist, validates every lead in JSON, validates 20 CSV headers, asserts `parsedCsv.rows.length === leads.length`, and confirms 1:1 parity between CSV row fields and JSON object properties.

---

### 1.3 Key Desynchronizations & Hardcoded Expectations Discovered

#### Observation 1: Critical Desynchronization in `qualification-oracle.ts`
- **Location:** `/home/pwn/geo-engine/tests/e2e/helpers/qualification-oracle.ts:14-60`
- **Finding:** `AFFLUENT_ZIPS` has only **26 zip codes** from the initial 7 metros.
- We executed a live verification probe against all 18 zip codes from the expanded corridors:
  ```ts
  const checkZips = ["10021", "10065", "10075", "10022", "94027", "94301", "94022", "94024", "33480", "33458", "33477", "85262", "85253", "85266", "92657", "75209", "81611", "81657"];
  ```
- **Probe Output:** **18/18 evaluated to `false`** (`isAffluentZip(z) === false`).
- By contrast, `src/lib/qualification/affluent-zips.ts` was already updated to contain **71 zip codes across 10 metros**, correctly returning `true` for all 18.
- **Why tests pass currently:** Tier 4 AC 1–AC 6 checks `validateLeadSchema(lead)`, which only validates the regex `^[0-9]{5}(-[0-9]{4})?$`. However, if any test in `tests/e2e/` (or any new test) calls `qualification-oracle.ts::isAffluentZip` on these zips, it will fail.

#### Observation 2: Hardcoded Scenarios in Tier 4 (`tier4-application-scenarios.test.ts:40-197`)
- Tier 4 contains 10 scenario tests that explicitly lookup `GOAT-001` through `GOAT-010`:
  - `SC1-01`: Expects `GOAT-001` in Scottsdale AZ (`85260`), doctor Dr. Gerald Kaiser, rank 5, competitor "Dental Implant Institute".
  - `SC1-02`: Expects `GOAT-006` in Scottsdale AZ (`85260`), doctor Dr. Alice Hsieh, rank 5.
  - `SC2-01`: Expects `GOAT-002` in Boca Raton FL (`33496`), doctor Dr. Jason Wilner, rank 6.
  - `SC2-02`: Expects `GOAT-005` in Delray Beach FL (`33483`), doctor Dr. Marissa Matthews, rank 4.
  - `SC2-03`: Expects `GOAT-009` in Boca Raton FL (`33486`), doctor Dr. Gerard Cuomo, rank 5.
  - `SC3-01`: Expects `GOAT-004` in Newport Beach CA (`92660`), doctor Dr. Omid Haroonian, rank 6.
  - `SC3-02`: Expects `GOAT-007` in Newport Beach CA (`92660`), doctor Dr. Jeremy Heldt, rank 5.
  - `SC4-01`: Expects `GOAT-003` in Frisco TX (`75034`), doctor Dr. Dunia Korous, rank 6.
  - `SC4-02`: Expects `GOAT-008` in Plano TX (`75093`), doctor Dr. John M. Hucklebridge, rank 5.
  - `SC5-01`: Expects `GOAT-010` in Bellevue WA (`98004`), doctor Dr. John Minnoch, rank 5.
- **Impact:** Any pipeline run or lead dataset modification **MUST retain GOAT-001 through GOAT-010 intact**. Overwriting or removing them causes 10/16 Tier 4 tests to fail immediately.

#### Observation 3: Unit Test Metros Count in `tests/unit/qualification.test.ts:101`
- Line 101 previously asserted `assertEqual(metros.length, 7)`.
- When `TARGET_METROS` expanded to 10 metros, this assertion failed (`Expected 7, got 10`).
- Relaxing the assertion to `assert(metros.length >= 7)` restored 100% passing (145/145).

---

## 2. Logic Chain

1. **Premise:** The user follow-up request (2026-11-01T02:55:38Z) mandates expanding corridor scouting to 7 target clusters: Manhattan, Silicon Valley, Palm Beach & Jupiter, Scottsdale North & Paradise Valley, Newport Beach & Corona del Mar, Dallas Park Cities & Preston Hollow, and Aspen & Vail.
2. **Fact (from Observation 1.3):** The production qualification catalog (`src/lib/qualification/affluent-zips.ts`) has been expanded to 71 zips, but the E2E test oracle (`tests/e2e/helpers/qualification-oracle.ts`) retains the legacy 26-zip catalog.
3. **Inference:** Any test assertion that invokes `qualification-oracle.ts::isAffluentZip` against leads from the new corridors (e.g., Manhattan 10021, Silicon Valley 94301, Jupiter 33458, Aspen 81611) evaluates to `false`.
4. **Fact (from Observation 1.3):** Tier 4 scenario tests `SC1-01` through `SC5-01` perform targeted queries by `lead_id` (`GOAT-001` through `GOAT-010`) and assert specific doctor names, cities, and competitor names.
5. **Inference:** The discovery pipeline runner (`scripts/run-pipeline.ts`) cannot replace or truncate existing leads; it must preserve `GOAT-001` through `GOAT-010` and append newly qualified leads (e.g., `GOAT-011` through `GOAT-025+`).
6. **Fact (from Observation 1.2):** `scripts/verify-leads.ts` strictly checks `comp.rank === 1` (line 379), whereas `tests/e2e/helpers/qualification-oracle.ts` allows rank 1 or 3.
7. **Inference:** To satisfy both verification gates simultaneously, every lead in `leads/goated_leads.json` must strictly have `top_competitor_5mi.rank === 1`.
8. **Fact (from Observation 1.1 & 1.2):** Both `npx tsx tests/e2e/run-all-tests.ts` (125/125 passed) and `npx tsx scripts/verify-leads.ts` (25/25 passed across all 6 ACs) currently pass with 100% success.
9. **Conclusion:** The pipeline and test architecture are fully compatible and functioning, but synchronizing `qualification-oracle.ts` with the 71-zip catalog is required to prevent desynchronization when new E2E scenario tests are added.

---

## 3. Caveats

1. **Live CMS API Network Availability:** In unit and E2E offline mode, tests rely on seeded caches or mock records. Live queries against `https://npiregistry.cms.hhs.gov/api/` depend on outbound network access. `npi-verifier.ts` contains timeout fallbacks and cache seeding to maintain test determinism.
2. **Read-Only Explorer Scope:** As an explorer, no source code or lead file modifications were performed during this investigation. All findings were gathered via non-destructive inspection and read-only test runs.
3. **Lead Count Scalability:** `tier4-application-scenarios.test.ts` asserts `leads.length >= 10` and dynamically iterates over all leads in `leads/goated_leads.json` for AC 1–AC 6. It scales smoothly to 25, 50, or 100+ leads without code modifications, provided every lead complies with schema and validation rules.

---

## 4. Conclusion

1. **Current Test Status:**
   - E2E Test Suite (`tests/e2e/run-all-tests.ts`): **125/125 tests PASS (100%)** in 34ms.
   - Acceptance Criteria Auditor (`scripts/verify-leads.ts`): **6/6 ACs PASS (100%)** on 25 leads.
   - All Unit Test Suites (`tests/unit/`): **145/145 (qualification), 79/79 (dossier), 79/79 (scrapers) PASS (100%)**.
2. **Critical Architectural Findings & Recommendations for Implementer:**
   - **Recommendation 1 (Oracle Synchronization):** Update `tests/e2e/helpers/qualification-oracle.ts`'s `AFFLUENT_ZIPS` table to include all 71 zip codes across the 10 target metros defined in `src/lib/qualification/affluent-zips.ts` so that `qualification-oracle.ts::isAffluentZip` returns `true` for all expanded corridor zips.
   - **Recommendation 2 (Lead ID Invariance):** When generating or updating `leads/goated_leads.json` and `leads/goated_leads.csv`, **never overwrite or re-assign GOAT-001 through GOAT-010**. They are pinned by Tier 4 scenarios SC1-01 through SC5-01. New leads must be appended as GOAT-011 through GOAT-025+.
   - **Recommendation 3 (Strict Competitor Rank #1):** Ensure `top_competitor_5mi.rank` is always set to integer `1` (not 3), as required by `scripts/verify-leads.ts`.
   - **Recommendation 4 (NPI-1 & Sole Proprietor Schema):** Every lead must include valid `npi_number` and `npi_verified: true` to satisfy the follow-up CMS NPI Registry criteria.

---

## 5. Verification Method

To independently verify all findings in this report, execute the following commands from `/home/pwn/geo-engine`:

```bash
# 1. Verify all 125 E2E tests pass 100%
npx tsx tests/e2e/run-all-tests.ts

# 2. Verify all 6 Acceptance Criteria pass 100% across compiled leads
npx tsx scripts/verify-leads.ts

# 3. Verify all 3 Unit test suites pass 100%
npx tsx tests/unit/qualification.test.ts
npx tsx tests/unit/dossier.test.ts
npx tsx tests/unit/scrapers.test.ts

# 4. Verify the oracle zip desynchronization
npx tsx -e '
import { isAffluentZip } from "./tests/e2e/helpers/qualification-oracle";
const check = ["10021", "94301", "33458", "81611"];
console.log(check.map(z => ({ zip: z, oracleAffluent: isAffluentZip(z) })));
'
# Expectation: all evaluate to false in qualification-oracle.ts, proving desynchronization with affluent-zips.ts.
```

**Invalidation Conditions:**
- If `tests/e2e/run-all-tests.ts` fails any of the 125 tests.
- If `scripts/verify-leads.ts` reports any failure across AC 1 through AC 6.
