# Milestone 1 Adversarial Challenge Report

- **Challenger**: `challenger_m1_1` (Milestone 1 Adversarial Challenger 1)
- **Role**: Critic & Domain Specialist
- **Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/challenger_m1_1`
- **Parent Conversation ID**: `f1e9e290-ce66-4f4f-88d5-1005ccaeca98`
- **Target Under Test**: Milestone 1 Qualification Engine (`src/lib/qualification/**`)
- **Date**: 2026-10-31
- **Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Baseline Verification Commands & Results
Before initiating adversarial challenges, baseline tests and builds were executed:
1. **Unit Test Suite**:
   ```bash
   $ npx tsx tests/unit/qualification.test.ts
   ```
   *Result*: 99/99 passed, exit code 0.
2. **TypeScript Compilation**:
   ```bash
   $ npx tsc --noEmit
   ```
   *Result*: 0 type errors, exit code 0.
3. **Next.js Production Build**:
   ```bash
   $ npm run build
   ```
   *Result*: Next.js 16.3.4 (Turbopack) compiled cleanly, exit code 0.

### 1.2 Adversarial Test Harness Execution
An empirical adversarial test harness was authored and executed at `/home/pwn/geo-engine/.agents/teamwork/challenger_m1_1/adversarial-harness.ts`:
```bash
$ npx tsx /home/pwn/geo-engine/.agents/teamwork/challenger_m1_1/adversarial-harness.ts
```
**Verbatim Output Summary**:
```text
================================================================
📊 ADVERSARIAL TEST HARNESS SUMMARY
================================================================
Total Adversarial Test Cases: 44
Passed (Expected Behavior): 27
Failed (Vulnerabilities / Edge Cases Discovered): 17
================================================================
```

### 1.3 Exact Code Findings and Verbatim Discrepancies

#### A. Gate 6: Associate Dentists Pass Solo Owner Check
- **File**: `src/lib/qualification/npi-verifier.ts`, lines 349–398:
  ```typescript
  const isSoleProprietor =
    basic.sole_proprietor === 'YES' ||
    /\b(PC|PLLC|PA|P\.C\.|P\.L\.L\.C\.)\b/i.test(credential) ||
    /pc|pllc/i.test(basic.last_name || '');
  ...
  const passesCredentials = isDental || isApprovedTaxonomy;

  if (!passesCredentials) {
    return { verified: false, ... };
  }

  return {
    verified: true, // ALWAYS true when passesCredentials is true
    doctorName: docName,
    npiNumber,
    enumerationType,
    credentials: credential || 'DDS',
    isDentalDoctor: true,
    soleProprietor: isSoleProprietor, // Evaluates to false, but object.verified is true!
    ...
  };
  ```
- **File**: `src/lib/qualification/index.ts`, lines 188–196:
  ```typescript
  const result = await verifySoloDoctor(doctorName, state, candidate.address);
  if (!result.verified) {
    return {
      gate,
      passed: false,
      failureReason: result.disqualificationReason || `Doctor ${doctorName} failed CMS NPI-1 verification`,
      details: result,
    };
  }
  return { gate, passed: true, details: result };
  ```
- **Verbatim Empirical Result**:
  When tested with an associate dentist record (`basic.sole_proprietor === 'NO'`):
  ```text
  evaluateNpiRecord result: {
    verified: true,
    doctorName: 'David Smith',
    soleProprietor: false,
    isDentalDoctor: true,
    isApprovedTaxonomy: true
  }
  ```
  Gate 6 returns `passed: true`. Associate dentists who are not sole owners pass qualification.

#### B. Gate 6: Non-Dental MDs (Pediatrician, Cardiologist) Verified as Dental Implant Surgeons
- **File**: `src/lib/qualification/npi-verifier.ts`, line 34:
  ```typescript
  const DENTAL_CREDENTIAL_REGEX = /\b(DDS|DMD|MD|D\.D\.S|D\.M\.D|M\.D)\b/i;
  ```
- **File**: `src/lib/qualification/npi-verifier.ts`, lines 360–392:
  ```typescript
  const passesCredentials = isDental || isApprovedTaxonomy;
  ...
  return {
    verified: true,
    doctorName: docName,
    credentials: credential || 'DDS',
    isDentalDoctor: true,
    primaryTaxonomy: primaryTaxonomy || 'Dentist',
    taxonomyCode: taxonomyCode || '122300000X',
    isApprovedTaxonomy: true, // FORCED true
    ...
  };
  ```
- **Verbatim Empirical Result**:
  When evaluated with a Medical Doctor Pediatrician (`taxonomy: 208000000X`, Pediatrics) or Cardiologist (`taxonomy: 207RC0000X`):
  ```text
  Pediatrician MD eval: {
    verified: true,
    doctorName: 'Emily Jones',
    credentials: 'MD',
    isDentalDoctor: true,
    primaryTaxonomy: 'Pediatrics',
    taxonomyCode: '208000000X',
    isApprovedTaxonomy: true
  }
  ```
  Any Medical Doctor (MD) is verified as an approved dental practitioner.

#### C. Gate 6: Doctor Name Parsing Corrupted by Associate / Title Suffixes
- **File**: `src/lib/qualification/npi-verifier.ts`, lines 46–67:
  ```typescript
  export function parseDoctorName(rawName: string) { ... }
  ```
- **Verbatim Empirical Result**:
  - `parseDoctorName("Dr. Jennifer Lopez, DDS, Associate Dentist")` yields `{ firstName: 'Jennifer', lastName: 'Dentist', cleanName: 'Jennifer Dentist' }`.
  - `parseDoctorName("Dr. Jennifer Lopez (Associate)")` yields `{ firstName: 'Jennifer', lastName: 'Associate', cleanName: 'Jennifer Associate' }`.
  - The associate title is not removed and corrupts the NPPES query instead of flagging the associate title.

#### D. Gate 5: DSO Evasion via Trailing DNS Dot, Basic Auth, and Subtle Names
- **File**: `src/lib/qualification/dso-filter.ts`, lines 361–372:
  ```typescript
  export function normalizeDomain(rawDomain: string): string {
    if (!rawDomain) return '';
    let clean = rawDomain.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '');
    clean = clean.split('/')[0];
    clean = clean.split('?')[0];
    clean = clean.split(':')[0];
    if (clean.startsWith('www.')) { clean = clean.slice(4); }
    return clean;
  }
  ```
- **Verbatim Empirical Result 1 (Trailing Dot)**:
  `checkDsoAffiliation("midatlanticdental.com.")` returns:
  `{ isDso: false, reason: "Verified independent private clinic (passed all 5 DSO detection tiers)" }`.
- **Verbatim Empirical Result 2 (Basic Auth)**:
  `checkDsoAffiliation("http://user:pass@midatlanticdental.com")` returns:
  `{ isDso: false, reason: "Verified independent private clinic (passed all 5 DSO detection tiers)" }` because `split(':')[0]` truncates to `"user"`.
- **Verbatim Empirical Result 3 (Subtle Names)**:
  `checkDsoAffiliation("dallasimplantinstitute.com", "", "Clear Choice Implant Center")` returns `isDso: false`.
  `checkDsoAffiliation("irvineimplants.com", "", "Pacific Dental Implant Center")` returns `isDso: false`.

#### E. Gate 5: HTML Tag Injection Bypasses Tier 4 Legal Regulatory Disclaimers
- **File**: `src/lib/qualification/dso-filter.ts`, lines 393–409:
  `matchesDsoLegalDisclaimer` inspects raw HTML directly with whitespace-only regexes (`supported\s+by\s+heartland\s+dental`).
- **Verbatim Empirical Result**:
  - `<p>Dental care is supported by <strong>Heartland Dental</strong>, LLC.</p>` -> returns `isDso: false`.
  - `<footer>Supported by <a href="https://heartland.com">Heartland Dental</a></footer>` -> returns `isDso: false`.
  Both evade Tier 4 regulatory disclosure detection because HTML markup breaks `\s+`.

#### F. Gate 4: Clinical Filter Disqualifies Cash Clinics on "Does Not Accept Medicaid"
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 164–169:
  ```typescript
  for (const kw of MEDICAID_KEYWORDS) {
    const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) { terms.push(kw); }
  }
  ```
- **Verbatim Empirical Result**:
  Input: `"Center for Elite Dental Implantology ... Notice: Our clinic does not accept Medicaid, Denti-Cal, or insurance. We are 100% fee-for-service cash pay."`
  Result: `{ qualified: false, disqualified: true, disqualificationReason: "Medicaid / state welfare acceptance detected: [medicaid, denti-cal]" }`.
  Elite high-ticket cash practices explicitly disclaiming Medicaid acceptance are falsely disqualified.

#### G. Gate 4: Single Mention of "Dental Implants" Double-Counts to 16 Points
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 16–18:
  `IMPLANT_KEYWORDS` contains both `'dental implants'` and `'dental implant'`.
- **Verbatim Empirical Result**:
  Input: `"Beverly Hills Teeth Whitening. We offer whitening, veneers, cleanings, and dental implants."`
  Matches: `['dental implants', 'dental implant']` (count: 2 * 8 = 16 points).
  Result: `{ qualified: true, implantScore: 16, disqualified: false }`.
  A routine cosmetic teeth-whitening studio qualifies as a surgical implant center on a single casual mention of "dental implants".

#### H. Gate 7: `qualifyPractice` Passes Leads Without Any Competitor
- **File**: `src/lib/qualification/index.ts`, lines 299–307:
  ```typescript
  if (gate === 'PROXIMITY_COMPETITOR' && !candidate.competitor) {
    gateResults[gate] = {
      gate,
      passed: true,
      details: { skipped: true, reason: 'No competitor data provided on candidate practice' },
    };
    continue;
  }
  ```
- **Verbatim Empirical Result**:
  A candidate practice with NO competitor submitted to `qualifyPractice` returns:
  `{ qualified: true, failedGate: undefined }`.
  The practice is certified as qualified despite having 0 competitors identified.
  Furthermore, if `candidate.competitor` has no coordinates or `distanceMiles` is undefined/NaN, `evaluateGate('PROXIMITY_COMPETITOR')` evaluates to `passed: true`.

#### I. Gate 1: Unpadded 4-Digit East Coast Zips Fail Normalization
- **File**: `src/lib/qualification/affluent-zips.ts`, lines 582–596:
  `normalizeZipCode('6830')` or `normalizeZipCode(6830)` yields `'6830'`.
  Length is 4, failing `norm.length !== 5`, rejecting Greenwich CT `06830` when ingested without leading zero.

---

## 2. Logic Chain

1. **Step 1 (Solo Owner Mandate vs. Observation 1.3.A)**:
   - Requirement R2 mandates: *"Must be a solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Disqualify associate dentists, hygienists, or clinic managers."*
   - Acceptance Criteria AC1 mandates: *"100% of outputted leads have a verified solo owner doctor (DDS/DMD/MD)"*.
   - Observation 1.3.A shows that `evaluateNpiRecord` returns `verified: true` regardless of `sole_proprietor === 'NO'`, and `index.ts` Gate 6 accepts this.
   - *Inference*: Associate dentists will be admitted into the output pipeline, violating AC1.

2. **Step 2 (Dental Specialty Mandate vs. Observation 1.3.B)**:
   - Requirement R2 specifies credentials for dentists/surgeons.
   - Observation 1.3.B shows `passesCredentials = isDental || isApprovedTaxonomy`. Because credential "MD" sets `isDental = true`, medical doctors in pediatrics, cardiology, or general medicine pass with `isApprovedTaxonomy: true`.
   - *Inference*: Non-dental medical doctors can pass Gate 6 as dental implant surgeons.

3. **Step 3 (DSO Disqualification vs. Observation 1.3.D & 1.3.E)**:
   - Acceptance Criteria AC2 mandates: *"0 DSOs, private-equity groups, or corporate chains (ClearChoice, Aspen, Heartland) present in the qualified list."*
   - Observation 1.3.D and 1.3.E show that trailing dots (`domain.com.`), basic auth URLs (`user:pass@domain.com`), subtle brand names ("Clear Choice Implant Center", "Pacific Dental"), and HTML-formatted disclosures (`supported by <strong>Heartland Dental</strong>`) bypass all 5 DSO tiers.
   - *Inference*: Corporate chains and MSOs will evade detection and leak into qualified leads, violating AC2.

4. **Step 4 (Implant Specialization vs. Observation 1.3.F & 1.3.G)**:
   - Requirement R2 and AC3 mandate core clinical focus on surgical implants and disqualification of routine cleanings, cosmetic clinics, and Medicaid.
   - Observation 1.3.F shows false-positive disqualification of elite cash practices disclaiming Medicaid.
   - Observation 1.3.G shows cosmetic whitening studios qualifying after a single mention of "dental implants" due to substring double-counting.
   - *Inference*: The clinical filter generates both false disqualifications of target clinics and false admissions of cosmetic clinics.

5. **Step 5 (Competitor Mandate vs. Observation 1.3.H)**:
   - Requirement R2 and AC5 mandate: *"Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius."*
   - Observation 1.3.H shows that `qualifyPractice` explicitly marks Gate 7 `passed: true` when `candidate.competitor` is completely missing, and permits undefined/NaN distances.
   - *Inference*: Leads without any competitor or with invalid distances will be outputted as qualified, violating AC5.

---

## 3. Caveats

1. **Unit Test Pass Status**:
   - The worker's 99 unit tests in `tests/unit/qualification.test.ts` pass 100%. The unit tests, however, tested "happy path" positive cases and simple negative cases (e.g., ClearChoice on clean root domain, pure Medicaid acceptance text, standard 10-digit NPIs). They did not test subtle brand variants, HTML tag injection, associate dentists with `sole_proprietor: NO`, or non-dental MDs.
2. **Review-Only Constraint**:
   - As an empirical challenger, this agent is constrained to review-only and cannot edit `src/lib/qualification/**` directly.
   - All 17 identified failure modes must be resolved by the implementation worker.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The Milestone 1 Qualification Engine contains significant architectural and logic gaps that violate the project acceptance criteria (AC1, AC2, AC3, and AC5). The implementation must be hardened before downstream Milestone 2 scrapers and Milestone 3 lead dossier synthesizers integrate with it.

### Required Changes for Implementation Worker (`worker_m1_1`):

1. **Gate 6 (Solo Doctor & Associate Enforcement)**:
   - Enforce `soleProprietor` in `evaluateNpiRecord`: If `basic.sole_proprietor === 'NO'` and credentials do not contain PC/PLLC, set `verified: false` with reason `Associate dentist detected (non-solo owner)`.
   - Restrict MD credentials: An `MD` credential must strictly require an approved oral & maxillofacial surgery taxonomy (`204E00000X` or dental surgery description). Non-dental MD taxonomies (pediatrics, cardiology, etc.) must be disqualified.
   - Update `parseDoctorName` to sanitize and flag associate titles (`Associate Dentist`, `Junior Associate`, `Hygienist`, `Clinic Manager`).
2. **Gate 5 (DSO Filter Hardening)**:
   - Normalize domains by stripping trailing dots (`clean.replace(/\.+$/, '')`) and stripping basic auth (`clean.replace(/^[^@]+@/, '')`).
   - Strip HTML tags (`html.replace(/<[^>]+>/g, ' ')`) before running `matchesDsoLegalDisclaimer`.
   - Expand brand keywords: Add `'clear choice'` (space separated), `'pacific dental'` (without services), `'mb2'`, and support Greenhouse embed query formats.
3. **Gate 4 (Clinical Specialization Filter)**:
   - Check for negative Medicaid assertions: Do not disqualify if Medicaid keywords are preceded by `do not accept|no|not accepted|fee-for-service|cash only`.
   - De-duplicate implant keyword matches: When `'dental implants'` is matched, do not double-count `'dental implant'`. Enforce higher threshold or distinct procedural categories.
4. **Gate 7 & DAG Engine (`qualifyPractice`)**:
   - Remove the `if (!candidate.competitor) continue;` skip logic in `qualifyPractice`. A candidate practice without a verified #1 competitor within 5.0 miles must fail Gate 7.
   - Validate that `distanceMiles` is a finite number `<= 5.0` and `mapsRank` is an integer `[4, 5, 6]`.
5. **Gate 1 (Zip Code Normalization)**:
   - Pad 4-digit zip strings or numbers with a leading zero (`cleaned.padStart(5, '0')`) to support East Coast zip codes like `06830`.

---

## 5. Verification Method

To independently reproduce and verify all 17 empirical findings:

1. **Run the Adversarial Test Suite**:
   ```bash
   npx tsx /home/pwn/geo-engine/.agents/teamwork/challenger_m1_1/adversarial-harness.ts
   ```
   *Expected Output*: Displays 17 failed test cases detailing each vulnerability.

2. **Verify Associate Dentist Bypass**:
   ```bash
   npx tsx -e '
   import { evaluateNpiRecord } from "./src/lib/qualification/npi-verifier";
   const r = evaluateNpiRecord({
     enumeration_type: "NPI-1",
     number: "1234567890",
     basic: { first_name: "Dave", last_name: "Smith", credential: "DDS", sole_proprietor: "NO" },
     taxonomies: [{ code: "122300000X", desc: "Dentist", primary: true }]
   });
   console.log("Verified:", r.verified, "SoleProprietor:", r.soleProprietor);
   '
   ```
   *Observed*: Prints `Verified: true SoleProprietor: false` (Demonstrates Gate 6 bypass).

3. **Verify Non-Dental MD Bypass**:
   ```bash
   npx tsx -e '
   import { evaluateNpiRecord } from "./src/lib/qualification/npi-verifier";
   const r = evaluateNpiRecord({
     enumeration_type: "NPI-1",
     number: "1987654321",
     basic: { first_name: "Emily", last_name: "Jones", credential: "MD", sole_proprietor: "YES" },
     taxonomies: [{ code: "208000000X", desc: "Pediatrics", primary: true }]
   });
   console.log("Pediatrician MD Verified:", r.verified, "isApprovedTaxonomy:", r.isApprovedTaxonomy);
   '
   ```
   *Observed*: Prints `Pediatrician MD Verified: true isApprovedTaxonomy: true` (Demonstrates Medical Doctor bypass).

4. **Verify DSO Trailing Dot Bypass**:
   ```bash
   npx tsx -e '
   import { checkDsoAffiliation } from "./src/lib/qualification/dso-filter";
   console.log(checkDsoAffiliation("midatlanticdental.com."));
   '
   ```
   *Observed*: Returns `isDso: false` (Demonstrates DSO evasion).

5. **Verify `qualifyPractice` Missing Competitor Bypass**:
   ```bash
   npx tsx -e '
   import { qualifyPractice } from "./src/lib/qualification/index";
   qualifyPractice({
     name: "Test Practice",
     domain: "test.com",
     zipCode: "85260",
     mapsRank: 5,
     hasSponsoredAd: true,
     htmlContent: "all-on-4 dental implants full-arch reconstruction",
     doctorName: "Dr. Gerald L. Kaiser",
     state: "AZ"
   }).then(r => console.log("Qualified with NO competitor:", r.qualified));
   '
   ```
   *Observed*: Prints `Qualified with NO competitor: true` (Demonstrates AC5 violation).
