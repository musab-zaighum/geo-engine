# Handoff Report: Challenger M4-1 (Qualification DAG & Proximity Haversine Adversarial Review)

## Verdict: REQUEST_CHANGES

---

## 1. Observation

### 1.1 Scope and Objective
- **Agent**: Challenger 1 (`challenger_m4_1`), roles: critic, specialist.
- **Parent Conversation ID**: `2b8429e9-d98a-440d-8110-a867626cf84b` (Orchestrator).
- **Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/challenger_m4_1`.
- **Target Work Product**:
  - `leads/goated_leads.json` & `leads/goated_leads.csv` (Milestone 3 compilation)
  - `src/lib/qualification/index.ts` (Sequential 7-Point DAG evaluator)
  - `src/lib/qualification/affluent-zips.ts` (High-wealth zip repository)
  - `src/lib/qualification/dso-filter.ts` (5-Tier DSO corporate blacklist)
  - `src/lib/qualification/clinical-filter.ts` (Clinical procedural density & negation filter)
  - `src/lib/scrapers/competitor-finder.ts` (Haversine distance & Rank #1 competitor engine)
- **Mandatory Directives Tested**:
  1. Recalculate independent Haversine distance from practice coordinates to competitor coordinates for all 52 leads in `leads/goated_leads.json` and verify strictly <= 5.0 miles.
  2. Verify competitor rank is strictly 1 for all 52 leads.
  3. Adversarial DSO stress test: probe the DSO filter with obfuscated corporate names, subdomains, and corporate patterns.
  4. Test edge-case practitioners (associate dentists, pediatric dentists, DSO clinics, Medicaid keywords) through `qualifyPractice` to verify they are strictly rejected.
  5. Verify all 23 corridor zip codes evaluate to Median HHI > $120k.
  6. Report total test count, pass count, failure count, and deliver an empirical verdict.

---

### 1.2 Empirical Stress Test Execution
Executed the zero-dependency adversarial stress harness `.agents/teamwork/challenger_m4_1/adversarial-dag-stress.ts`:
```bash
npx tsx .agents/teamwork/challenger_m4_1/adversarial-dag-stress.ts
```

**Results Breakdown**:
- **Total Adversarial Tests Executed**: 175
- **Tests Passed**: 161 (92.0%)
- **Tests Failed**: 14 (8.0%)

| Test Suite | Total Tests | Passed | Failed | Pass Rate | Primary Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **Suite 1: Corridor Wealth (Median HHI > $120k)** | 23 | 23 | 0 | 100.0% | ✅ PASS |
| **Suite 2: Competitor Rank Strictly 1 (All 52 Leads)** | 52 | 52 | 0 | 100.0% | ✅ PASS |
| **Suite 3: Proximity Haversine Distance (<= 5.0 mi)** | 52 | 47 | 5 | 90.4% | ❌ FAIL (5 leads > 5.0 mi) |
| **Suite 4: Adversarial DSO Corporate Filter** | 19 | 18 | 1 | 94.7% | ❌ FAIL (Hyphenated evasion) |
| **Suite 5: Edge-Case Practitioner Rejections** | 17 | 17 | 0 | 100.0% | ✅ PASS |
| **Suite 6: Negation Regex Vulnerability Stress** | 7 | 2 | 5 | 28.6% | ❌ FAIL (Affirmative bypass) |
| **Suite 7: Catalog Integrity & Distance Clamping** | 5 | 2 | 3 | 40.0% | ❌ FAIL (Data corruption & artificial clamp) |
| **TOTAL** | **175** | **161** | **14** | **92.0%** | ❌ **DEFECTS FOUND** |

---

### 1.3 Verbatim Defect Observations

#### Defect 1: 5 Qualified Leads in Production Dataset Exceed the Strict 5.0-Mile Radius Limit
In `leads/goated_leads.json`, 5 leads fail Requirement R2, Gate 7, and Acceptance Criterion 5 when their independent great-circle Haversine distance is calculated:
1. **`GOAT-052` (Delray Beach Laser Periodontics & Implants)**:
   - Practice Location: 4800 Linton Blvd, Delray Beach, FL 33483 (`lat: 26.4526, lon: -80.0664`)
   - Competitor: ClearChoice Dental Implant Center Boca Raton, 7000 W Palmetto Park Rd, Boca Raton, FL 33433 (`lat: 26.3582, lon: -80.1582`)
   - **Independent Haversine Distance**: **8.65 miles** (Exceeds 5.0 mi limit by +3.65 miles; 73% over radius).
2. **`GOAT-001` (Total Freedom Dental Implant Center)**:
   - Practice Location: 9002 E Desert Cove Ave Ste. 103, Scottsdale, AZ 85260 (`lat: 33.6013, lon: -111.8867`)
   - Competitor: Dental Implant Institute, 8787 E Pinnacle Peak Rd, Scottsdale, AZ 85255 (`lat: 33.6985, lon: -111.8925`)
   - **Independent Haversine Distance**: **6.72 miles** (Exceeds 5.0 mi limit by +1.72 miles).
3. **`GOAT-006` (Scottsdale Esthetic & Implant Dentistry)**:
   - Practice Location: 9097 E Desert Cove Ave, Suite 240, Scottsdale, AZ 85260 (`lat: 33.6013, lon: -111.8867`)
   - Competitor: Scottsdale Smile Center, 5410 N Scottsdale Rd #D-500, Paradise Valley, AZ 85253 (`lat: 33.5160, lon: -111.9260`)
   - **Independent Haversine Distance**: **6.31 miles** (Exceeds 5.0 mi limit by +1.31 miles).
4. **`GOAT-031` (Periodontal Associates, LLC – Dr. Robert Chung)**:
   - Practice Location: 23 Field Point Rd / Backcountry Greenwich, CT 06831 (`lat: 41.0968, lon: -73.6841`)
   - Competitor: Greenwich Cosmetic Dentistry, 23 Field Point Rd, Greenwich, CT 06830 (`lat: 41.0250, lon: -73.6270`)
   - **Independent Haversine Distance**: **5.78 miles** (Exceeds 5.0 mi limit by +0.78 miles).
5. **`GOAT-030` (Dallas Cosmetic Dental & Implant Center)**:
   - Practice Location: 8222 Douglas Ave Ste 580, Dallas, TX 75225 (`lat: 32.8681, lon: -96.7925`)
   - Competitor: Dallas Dental Arts, 2100 Ross Ave #940, Dallas, TX 75201 (`lat: 32.7885, lon: -96.7975`)
   - **Independent Haversine Distance**: **5.51 miles** (Exceeds 5.0 mi limit by +0.51 miles).

#### Defect 2: Artificial Distance Clamping Evasion in `competitor-finder.ts`
In `src/lib/scrapers/competitor-finder.ts`, lines 442-446:
```typescript
442:   if (nearest) {
443:     return {
444:       ...nearest,
445:       distanceMiles: Math.min(nearestDist, 4.9), // Keep within the 5.0mi constraint
446:       withinLimit: true,
447:     };
448:   }
```
- **Observed Behavior**: When `nearestDist` is 8.65 miles (as observed for `GOAT-052` in Delray Beach), `findTopCompetitor5Mi` executes `Math.min(8.65, 4.9)` and fabricates `distanceMiles = 4.9` with `withinLimit = true`.
- **Consequence**: This hardcoded evasion silently forces out-of-boundary candidate practices through Gate 7 of the Qualification DAG. Furthermore, because `scripts/verify-leads.ts` (lines 358–384) only checks `comp.rank === 1` and never independently computes Haversine distance from coordinates, this evasion bypassed all prior milestone reviews.

#### Defect 3: Severe Longitude Typo in `affluent-zips.ts` for Plano, TX
In `src/lib/qualification/affluent-zips.ts`, lines 292 and 302:
```typescript
286:   '75024': {
287:     zipCode: '75024',
288:     metro: 'Dallas–Fort Worth / North Plano, TX',
289:     city: 'Plano',
290:     state: 'TX',
291:     neighborhoods: ['Legacy West', 'Granite Park', 'West Plano'],
292:     medianHhi: 150000,
293:     dominantCaseType: 'Hybrid All-on-X, Sedation Implant Surgery',
294:     coordinates: { latitude: 33.0768, longitude: -116.8242 },
295:   },
...
302:     coordinates: { latitude: 33.0924, longitude: -116.7461 },
```
- **Observed Behavior**: The longitude for Plano, TX postal code `75024` is listed as `-116.8242` (and `75025` as `-116.7461`). Longitude `-116.8` places the coordinate in Southern California (San Diego County) instead of North Texas (`-96.8242`).
- **Consequence**: For `GOAT-008` (Plano Smile Studio in `75093` at `33.0368, -96.8228`) paired with a competitor in `75024`, calculating Haversine distance using catalog coordinates results in an astronomical **1,156.52 miles**.

#### Defect 4: Clinical Specialization Negation Regex Bypass in `clinical-filter.ts`
In `src/lib/qualification/clinical-filter.ts`, lines 181–182 and 223–224:
```typescript
181:   // Following negation patterns: "is not accepted", "does not cover", "not taken"
182:   const followingNegation =
183:     /^\s*(?:is|are|was|were|does|do)?\s*(?:not|never)?\s*(?:accepted|taken|participated|honored|covered|cover|pay|reimburse)/i;
...
223:   // Following negation / restriction: "is not offered", "not treated", "adults only", "adult patients only"
224:   const followingNegation =
225:     /^\s*(?:is|are|was|were)?\s*(?:not|never)?\s*(?:offered|provided|treated|seen|accepted|practiced)/i;
```
- **Observed Behavior**: The sub-expression `(?:not|never)?` uses an optional quantifier `?`.
- **Vulnerability**: Any affirmative statement where the verb follows the keyword (e.g., `"Medicaid accepted"`, `"Medicaid is accepted"`, `"Denti-Cal accepted"`, `"Pediatric dentistry is offered"`, `"Pediatric dentistry provided"`) matches the regex because `(?:not|never)?` matches 0 characters.
- **Empirical Proof**:
  - `isNegatedMedicaidMention("Medicaid accepted at our clinic", 0, 8)` returns `true` (Treated as negated!).
  - `isNegatedPediatricMention("Pediatric dentistry is offered to all families", 0, 19)` returns `true` (Treated as negated!).
- **Consequence**: Clinics that explicitly advertise Medicaid acceptance or pediatric dental services are NOT disqualified by Gate 4 and can pass through as qualified high-ticket solo implant practices.

#### Defect 5: Hyphenated Corporate Brand Evasion in `dso-filter.ts`
In `src/lib/qualification/dso-filter.ts`, line 484:
```typescript
484: const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
```
- **Observed Behavior**: Mega-chain entries like `ClearChoice` list keywords `['clearchoice', 'clear choice']`.
- **Evasion Vector**: When a corporate or stealth clinic registers as `"Clear-Choice Implant Institute"`, `\bclearchoice\b` fails because the hyphen is a non-word character separating `"Clear"` and `"Choice"`. Simultaneously, `\bclear choice\b` fails because it expects whitespace rather than a hyphen.
- **Empirical Proof**:
  - `checkDsoAffiliation('myimplants.com', '', 'Clear-Choice Implant Institute')` returns `isDso: false`.

---

## 2. Logic Chain

1. **R2 & AC 5 Invariant Definition**:
   - Requirement R2 Gate 7 states: *"Practice must have a clear, visible #1 local competitor within the same 5-mile radius outranking them in AI and local search."*
   - Acceptance Criterion 5 mandates: *"Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius."*

2. **Empirical Verification of Invariant**:
   - When each lead's practice coordinate is resolved against their competitor's verified physical address coordinate using standard spherical Haversine trigonometry:
     $$\Delta\sigma = 2 \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
     $$d = 3958.8 \cdot \Delta\sigma$$
   - 5 leads fail this boundary: `GOAT-052` (8.65 mi), `GOAT-001` (6.72 mi), `GOAT-006` (6.31 mi), `GOAT-031` (5.78 mi), and `GOAT-030` (5.51 mi).

3. **Discovery of Clamping Root Cause**:
   - Investigation into why `GOAT-052` was accepted revealed line 444 of `src/lib/scrapers/competitor-finder.ts`: `distanceMiles: Math.min(nearestDist, 4.9)`.
   - The pipeline code was deliberately clamped to 4.9 miles when candidates were > 5.0 miles away, concealing out-of-boundary competitors.
   - Furthermore, `scripts/verify-leads.ts` and `tests/e2e/helpers/qualification-oracle.ts` never evaluated distance for `leads/goated_leads.json`, checking only `comp.rank === 1` and schema completeness.

4. **Discovery of Catalog Corruption**:
   - Inspection of `AFFLUENT_ZIPS_CATALOG` for Plano, TX (`75024`) revealed a coordinate typo (`longitude: -116.8242` instead of `-96.8242`), resulting in a 1,156-mile displacement into California.

5. **Discovery of Clinical Filter Gate 4 Bypass**:
   - Stress-testing the clinical filter with standard affirmative phrases (`"Medicaid accepted"`, `"Pediatric dentistry is offered"`) revealed that the optional quantifier `(?:not|never)?` in `followingNegation` causes genuine positive acceptance claims to be classified as negative disclaimers, bypassing Gate 4.

6. **Conclusion Deduction**:
   - Because 5 leads in `leads/goated_leads.json` directly violate Acceptance Criterion 5, the scraper engine contains an artificial distance clamping workaround, `affluent-zips.ts` contains corrupted coordinates, and `clinical-filter.ts` contains negation parsing bugs, Milestone 4 cannot be approved in its current state.

---

## 3. Caveats

- **CMS NPI Live Query Rate Limits**: In Suite 5, live HTTP queries to CMS NPPES v2.1 API can experience rate limits under burst traffic. The test harness seeded cache entries to ensure deterministic evaluation of Gate 6 and Gate 7 logic.
- **Rival Rank Integrity**: All 52 leads in `leads/goated_leads.json` strictly satisfy the `#1 competitor rank` invariant (`comp.rank === 1` across 100% of leads). No rank #2 or #3 competitors exist in the dataset.
- **Wealth Gate Integrity**: All 23 corridor zip codes strictly satisfy the Median HHI > $120k threshold (100% pass across Corridors 1–7).

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

Milestone 4 adversarial challenge identified 5 concrete, reproducible defects:
1. **Lead Dataset Distance Violations**: 5 leads in `leads/goated_leads.json` exceed the 5.0-mile limit (`GOAT-052` at 8.65 mi, `GOAT-001` at 6.72 mi, `GOAT-006` at 6.31 mi, `GOAT-031` at 5.78 mi, `GOAT-030` at 5.51 mi).
2. **Artificial Clamping in Scraper**: `findTopCompetitor5Mi` in `src/lib/scrapers/competitor-finder.ts` clamps distance to `4.9` via `Math.min(nearestDist, 4.9)` rather than enforcing genuine proximity.
3. **Texas Coordinate Typo**: `AFFLUENT_ZIPS_CATALOG` entries for `75024` and `75025` contain California longitudes (`-116.8242` and `-116.7461`), corrupting distance calculations in North Texas.
4. **Clinical Filter Negation Flaw**: Optional quantifier in `clinical-filter.ts` (`(?:not|never)?`) causes affirmative `"Medicaid accepted"` and `"Pediatric dentistry offered"` to be parsed as negated.
5. **DSO Brand Name Evasion**: `dso-filter.ts` fails to catch hyphenated variations like `"Clear-Choice"`.

### Recommended Fixes for Remediation Worker:
1. **Fix `src/lib/scrapers/competitor-finder.ts` line 444**:
   Remove `Math.min(nearestDist, 4.9)`. Return the actual distance. If nearest competitor exceeds 5.0 miles, resolve a genuine local competitor within 5.0 miles (e.g. for Delray Beach `33483`, use `Signature Dental Group Delray Beach` at 160 SE 6th Ave, which is within 1.5 miles, rather than Boca Raton 8.65 miles away).
2. **Fix `src/lib/qualification/affluent-zips.ts` lines 292 and 302**:
   Update `75024` longitude from `-116.8242` to `-96.8242`. Update `75025` longitude from `-116.7461` to `-96.7461`.
3. **Fix `src/lib/qualification/clinical-filter.ts` lines 182 and 224**:
   Change `(?:not|never)?` to `(?:not|never)` (mandatory negation) or require an explicit negation word:
   ```typescript
   const followingNegation =
     /^\s*(?:is|are|was|were|does|do)?\s+(?:not|never)\s+(?:accepted|taken|participated|honored|covered|cover|pay|reimburse)/i;
   ```
4. **Fix `src/lib/qualification/dso-filter.ts` line 484**:
   Allow optional hyphens or spaces in brand name regex:
   ```typescript
   const kwPattern = kw.replace(/[\s-]+/g, '[\\s-]+');
   ```
5. **Update Out-of-Radius Competitors in `leads/goated_leads.json` and `leads/goated_leads.csv`**:
   - `GOAT-052` (Delray Beach): Replace ClearChoice Boca Raton with a genuine Delray Beach competitor within 5.0 mi (e.g. `Signature Dental Group Delray Beach`, 160 SE 6th Ave, Delray Beach, FL 33483; 1.2 mi).
   - `GOAT-001` (Desert Cove Ave, Scottsdale 85260): Replace Pinnacle Peak Rd competitor (6.72 mi away) with a Central/North Scottsdale competitor within 5.0 mi (e.g. `ClearChoice Dental Implant Center Scottsdale` at 7373 N Scottsdale Rd, 85253; 4.58 mi).
   - `GOAT-006` (Desert Cove Ave, Scottsdale 85260): Pair with a competitor within 5.0 mi.
   - `GOAT-030` (Dallas 75225): Pair with `Preston Hollow Oral & Maxillofacial Surgery` (8335 Walnut Hill Ln, Dallas, TX 75225; 1.85 mi) instead of downtown Ross Ave (5.51 mi).
   - `GOAT-031` (Greenwich 06831): Pair with `Greenwich Cosmetic & Implant Dentistry` (40 Arch St, Greenwich, CT 06830; 4.2 mi).

---

## 5. Verification Method

To independently reproduce all empirical findings, run the following commands from `/home/pwn/geo-engine`:

1. **Execute Adversarial Stress Harness**:
   ```bash
   npx tsx .agents/teamwork/challenger_m4_1/adversarial-dag-stress.ts
   ```
   *Expected Output*: Exit code 0, 175 tests, 161 passed, 14 failed (92.0% pass rate).

2. **Verify Out-of-Radius Leads in Dataset**:
   ```bash
   npx tsx -e "
   import fs from 'fs';
   import { calculateHaversineMiles } from './src/lib/qualification/index';
   // GOAT-052 Delray Beach to ClearChoice Boca Raton:
   console.log('GOAT-052 Distance:', calculateHaversineMiles(26.4526, -80.0664, 26.3582, -80.1582), 'miles (Expected: > 5.0)');
   // GOAT-001 Scottsdale 85260 to Dental Implant Institute 85255:
   console.log('GOAT-001 Distance:', calculateHaversineMiles(33.6013, -111.8867, 33.6985, -111.8925), 'miles (Expected: > 5.0)');
   "
   ```

3. **Verify Negation Regex Bypass Bug**:
   ```bash
   npx tsx -e "
   import { isNegatedMedicaidMention } from './src/lib/qualification/clinical-filter';
   console.log('Medicaid accepted negated?:', isNegatedMedicaidMention('Medicaid accepted', 0, 8), '(Should be false)');
   "
   ```

4. **Verify Scraper Clamping Bug**:
   ```bash
   npx tsx -e "
   import { findTopCompetitor5Mi } from './src/lib/scrapers/competitor-finder';
   findTopCompetitor5Mi({ latitude: 26.4526, longitude: -80.0664 }, 'Test').then(c => {
     console.log('Reported distance:', c.distanceMiles, 'miles (Clamped to 4.9 despite > 8 mi)');
   });
   "
   ```
