# Milestone 1 Adversarial Challenge Report (Iteration 2)

- **Challenger**: `challenger_m1_3` (Milestone 1 Iteration 2 Adversarial Challenger 1)
- **Role**: Critic & Specialist (Empirical Challenger)
- **Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/challenger_m1_3`
- **Parent Conversation ID**: `f1e9e290-ce66-4f4f-88d5-1005ccaeca98`
- **Target Under Test**: Remediated Qualification Engine (`src/lib/qualification/**`)
- **Date**: 2026-10-31
- **Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Baseline Test Suite Executions & Results
All automated tests and baseline builds were executed directly via the empirical command runner:
1. **Qualification Unit Tests**:
   ```bash
   $ npx tsx tests/unit/qualification.test.ts
   ```
   *Result*: 128/128 passed, exit code 0.
2. **E2E 4-Tier Test Suite**:
   ```bash
   $ npx tsx tests/e2e/run-all-tests.ts
   ```
   *Result*: 125/125 passed across Tiers 1–4, exit code 0.
3. **TypeScript Typecheck**:
   ```bash
   $ npx tsc --noEmit
   ```
   *Result*: 0 type errors, exit code 0.
4. **Production Build**:
   ```bash
   $ npm run build
   ```
   *Result*: Next.js 16.3.4 (Turbopack) production build compiled cleanly (15/15 static pages), exit code 0.
5. **Explorer Verification Script**:
   ```bash
   $ npx tsx .agents/teamwork/explorer_m1_fix_3/verify-fixes.ts
   ```
   *Result*: All 18 remediation probes verified successfully, exit code 0.

---

### 1.2 Re-Running Baseline Adversarial Probes from `challenger_m1_1`
All 44 original adversarial probes from `challenger_m1_1` were re-executed using the original test harness:
```bash
$ npx tsx /home/pwn/geo-engine/.agents/teamwork/challenger_m1_1/adversarial-harness.ts
```
**Verbatim Output Summary**:
```text
================================================================
📊 ADVERSARIAL TEST HARNESS SUMMARY
================================================================
Total Adversarial Test Cases: 44
Passed (Expected Behavior): 44
Failed (Vulnerabilities / Edge Cases Discovered): 0
================================================================
```
The 17 initial vulnerabilities reported by `challenger_m1_1` (such as unpadded 4-digit zip codes, basic auth domain stripping, HTML disclaimer tags, and associate `sole_proprietor: NO`) were confirmed to pass their original synthetic tests.

---

### 1.3 Extended Empirical Stress-Testing Harness Execution
A comprehensive stress-test harness was authored and executed at `/home/pwn/geo-engine/.agents/teamwork/challenger_m1_3/stress-harness.ts`:
```bash
$ npx tsx /home/pwn/geo-engine/.agents/teamwork/challenger_m1_3/stress-harness.ts
```
**Verbatim Output Summary**:
```text
================================================================
📊 HARNESS EXECUTION SUMMARY
================================================================
Total Probes Executed:                  53
Baseline 44 Probes Passed:              44 / 44 (100%)
New Empirical Vulnerabilities Confirmed: 9 / 9
================================================================
```

---

### 1.4 Exact Code Findings & Verbatim Discrepancies Discovered

#### A. VULN-01: Workday Multi-Level Datacenter Subdomains Evade DSO Tier 5 ATS Detection
- **File**: `src/lib/qualification/dso-filter.ts`, lines 355–356:
  ```typescript
  const TIER_5_ATS_REGEX =
    /(boards\.greenhouse\.io\/[^\s"'<>]*?(tag|heartland|aspendental|pacificdentalservices|mb2dental|sonrava|smilebrands|clearchoice)|(?:[a-z0-9-]+\.myworkdayjobs\.com\/(?:[^\s"'<>/]+\/)?(heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)|(heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)\.myworkdayjobs\.com)|jobs\.lever\.co\/(clearchoice|mb2dental|specialty1)|ultipro\.com\/[a-z0-9-]+\/jobboard)/i;
  ```
- **Observed Behavior**:
  Workday enterprise instances commonly employ regional datacenter subdomains (e.g., `wd1`, `wd5`, `wd12`). When tested with a standard Heartland Dental Workday career portal link:
  ```typescript
  checkDsoAffiliation('independentpractice.com', '<a href="https://heartland.wd1.myworkdayjobs.com/Careers">Join Our Team</a>')
  ```
  Returns:
  ```json
  {
    "isDso": false,
    "confidence": 0,
    "reason": "Verified independent private clinic (passed all 5 DSO detection tiers)"
  }
  ```
- **Root Cause**: `[a-z0-9-]+\.myworkdayjobs\.com` only matches a single subdomain without periods (e.g. `heartland.myworkdayjobs.com`). Because `.wd1.` introduces a second dot, neither `(heartland...)\.myworkdayjobs\.com` nor `[a-z0-9-]+\.myworkdayjobs\.com` matches unless the brand name is repeated inside the URL path segment.

#### B. VULN-02: Chained Basic Auth Credentials Cause `normalizeDomain` to Truncate to `"admin"`
- **File**: `src/lib/qualification/dso-filter.ts`, line 368:
  ```typescript
  clean = clean.replace(/^[^@]+@/, '');
  ...
  clean = clean.split(':')[0];
  ```
- **Observed Behavior**:
  When tested with multiple `@` tokens (e.g., chained basic auth or obfuscated credentials):
  ```typescript
  normalizeDomain('http://user:pass@admin:123@clearchoice.com')
  ```
  Returns: `"admin"`.
  `checkDsoAffiliation('http://user:pass@admin:123@clearchoice.com')` returns `isDso: false` (bypassing the Tier 3 DSO blacklist for ClearChoice).
- **Root Cause**: `^[^@]+@` only matches up to the *first* `@` character, leaving `admin:123@clearchoice.com`. Subsequent `clean.split(':')[0]` then chops the string at `:123`, producing `"admin"`.

#### C. VULN-03: Outbound Parent DSO Hyperlinks in HTML are Completely Ignored by `checkDsoAffiliation`
- **File**: `src/lib/qualification/dso-filter.ts`, lines 463–556
- **Observed Behavior**:
  Stealth DSO affiliates frequently maintain private brand names and domain names while linking directly to parent DSO privacy policies, terms of service, or canonical entities.
  When tested with:
  ```typescript
  checkDsoAffiliation(
    'dallasimplantinstitute.com',
    '<div><a href="https://www.clearchoice.com/privacy-policy">ClearChoice Privacy Policy</a></div>',
    'Dallas Implant Institute'
  )
  ```
  Returns: `isDso: false` (confidence: 0).
- **Root Cause**: Tier 3 blacklisted domains (`BLACKLISTED_DOMAINS`) are only checked against the candidate's primary domain (`cleanDomain`). `htmlContent` is never scanned for outgoing hyperlinks to blacklisted domains (`clearchoice.com`, `heartland.com`, etc.).

#### D. VULN-04: Oral Pathology NUCC Taxonomy (`1223P0106X`) Passes `evaluateNpiRecord`
- **File**: `src/lib/qualification/npi-verifier.ts`, lines 30–33 and 398–401:
  ```typescript
  export const DISQUALIFIED_TAXONOMY_CODES: Record<string, string> = {
    '1223P0221X': 'Pediatric Dentistry',
    '1223D0001X': 'Dental Public Health',
  };
  ...
  // If provider has dental degree (DDS/DMD) and taxonomy is not disqualified, treat as approved dental provider
  if (hasDentalDegree) {
    isApprovedTaxonomy = true;
  }
  ```
- **Observed Behavior**:
  `worker_m1_2` claimed in `handoff.md` (lines 14, 29) that `1223P0106X` (Oral and Maxillofacial Pathology) was mapped to disqualified taxonomies. However, testing an authentic NPI record with description `"Oral and Maxillofacial Pathology"`:
  ```typescript
  evaluateNpiRecord({
    enumeration_type: 'NPI-1',
    number: '1999888777',
    basic: { first_name: 'Sarah', last_name: 'Miller', credential: 'DDS', sole_proprietor: 'YES' },
    taxonomies: [{ code: '1223P0106X', desc: 'Oral and Maxillofacial Pathology', primary: true }]
  })
  ```
  Returns:
  ```json
  {
    "verified": true,
    "isApprovedTaxonomy": true,
    "primaryTaxonomy": "Oral and Maxillofacial Pathology"
  }
  ```
- **Root Cause**: `1223P0106X` is absent from `DISQUALIFIED_TAXONOMY_CODES`. Because line 399 automatically sets `isApprovedTaxonomy = true` for any provider holding a DDS/DMD whose taxonomy is not in `DISQUALIFIED_TAXONOMY_CODES`, non-surgical diagnostic oral pathologists pass Gate 6.

#### E. VULN-05: Adult Implant Clinics Stating "No Pediatric Dentistry" Are Falsely Disqualified by Gate 4
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 232–248:
  ```typescript
  export function detectPediatricSignals(text: string): { detected: boolean; terms: string[] } { ... }
  ```
- **Observed Behavior**:
  High-ticket adult implant centers explicitly stating they do not provide pediatric care:
  ```typescript
  scoreClinicalSpecialization(
    'Scottsdale Implant Center: Dedicated to adult full-arch restoration. Notice: We do not treat children or offer pediatric dentistry. Adults only.'
  )
  ```
  Returns:
  ```json
  {
    "qualified": false,
    "disqualified": true,
    "disqualificationReason": "Pediatric / children's dentistry specialization detected: [pediatric dentistry]"
  }
  ```
- **Root Cause**: Unlike Medicaid (which has `isNegatedMedicaidMention`), `detectPediatricSignals` performs unconditional regex substring matching with zero negation analysis.

#### F. VULN-06: Educational Mentions of "Baby Teeth" in Adult Implant Candidates Falsely Disqualify Practices
- **File**: `src/lib/qualification/clinical-filter.ts`, line 123:
  ```typescript
  export const PEDIATRIC_KEYWORDS = [
    ...
    'baby teeth',
    ...
  ];
  ```
- **Observed Behavior**:
  In adult full-arch implantology, congenitally missing adult teeth with retained, failing deciduous teeth is a standard clinical indication for implants:
  ```typescript
  scoreClinicalSpecialization(
    'Dental Implants for Adults: If you have congenitally missing permanent teeth or retained baby teeth that finally failed, full arch dental implants provide permanent replacement.'
  )
  ```
  Returns:
  ```json
  {
    "qualified": false,
    "disqualified": true,
    "disqualificationReason": "Pediatric / children's dentistry specialization detected: [baby teeth]"
  }
  ```
- **Root Cause**: The raw phrase `"baby teeth"` is listed as an unconditional disqualifier without requiring pediatric practice context (e.g., pediatric pulpotomy, pediatric fluoride, child patients).

#### G. VULN-07: Prestigious Credential "Associate Fellow" (AAID) is Falsely Rejected by Gate 6
- **File**: `src/lib/qualification/index.ts`, lines 195–200:
  ```typescript
  const roleText = `${doctorName} ${candidate.doctorTitle || ''}`;
  if (
    /\b(associate|hygienist|dental assistant|assistant|clinic manager|office manager|practice manager|coordinator|administrator)\b/i.test(
      roleText
    )
  ) { ... }
  ```
- **Observed Behavior**:
  The American Academy of Implant Dentistry (AAID) awards the credential "Associate Fellow" (AFAAID). When an elite solo practice founder lists their credential:
  ```typescript
  evaluateGate('SOLO_DOCTOR', {
    name: 'Elite Implant Center',
    domain: 'eliteimplants.com',
    zipCode: '85260',
    doctorName: 'Dr. Gregory House',
    doctorTitle: 'Associate Fellow, American Academy of Implant Dentistry',
    state: 'AZ'
  })
  ```
  Returns:
  ```json
  {
    "gate": "SOLO_DOCTOR",
    "passed": false,
    "failureReason": "Associate dentist or non-owner role detected: \"Associate Fellow, American Academy of Implant Dentistry\""
  }
  ```
- **Root Cause**: `\bassociate\b` matches any occurrence of the word, falsely flagging prestigious credentials like "Associate Fellow" or academic positions like "Assistant Clinical Professor".

#### H. VULN-08: East Coast ZIP+4 Strings Without Leading Zero Corrupted to 5 Digits (`"6830-1234"` -> `"68301"`)
- **File**: `src/lib/qualification/affluent-zips.ts`, lines 584–589:
  ```typescript
  const cleaned = String(zipCode).trim().replace(/[^\d]/g, '');
  if (!cleaned) return '';
  if (cleaned.length === 4) {
    return cleaned.padStart(5, '0');
  }
  return cleaned.slice(0, 5);
  ```
- **Observed Behavior**:
  ```typescript
  normalizeZipCode('6830-1234') // Returns '68301'
  isAffluentZip('6830-1234')    // Returns false (disqualifying Greenwich CT)
  ```
- **Root Cause**: When a 4-digit unpadded zip is followed by a 4-digit extension (`6830-1234`), `replace(/[^\d]/g, '')` produces an 8-character string (`68301234`). Because length is not 4, `cleaned.slice(0, 5)` slices the first 5 digits (`68301`), misidentifying Greenwich CT `06830` as a non-existent zip code.

#### I. VULN-09: Medicaid Negation Misses "Excludes Medicaid" and "Non-Medicaid"
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 177–178:
  ```typescript
  const precedingNegation =
    /\b(do(?:es)?\s+not|don'?t|doesn'?t|no|not|never|cannot|can'?t|we\s+do\s+not|without|excluding|except|unable\s+to|neither)\s+.../i;
  ```
- **Observed Behavior**:
  ```typescript
  scoreClinicalSpecialization(
    'All-on-4 dental implants. Full arch reconstructive surgery. Insurance coverage: All major PPOs accepted. Excludes Medicaid.'
  )
  ```
  Returns: `disqualified: true, reason: "Medicaid / state welfare acceptance detected: [medicaid]"`.
- **Root Cause**: The regex matches `excluding`, but does not match `excludes`, `exclude`, or `non-medicaid`.

---

## 2. Logic Chain

1. **Step 1 (DSO Disqualification Mandate vs. Observations 1.4.A, 1.4.B, 1.4.C)**:
   - Acceptance Criteria AC2 mandates: *"0 DSOs, private-equity groups, or corporate chains (ClearChoice, Aspen, Heartland) present in the qualified list."*
   - Observation 1.4.A proves that Heartland Dental corporate career links on standard Workday instances (`heartland.wd1.myworkdayjobs.com`) completely bypass Tier 5 detection.
   - Observation 1.4.B proves that ClearChoice domains prepended with multiple basic auth credentials (`user:pass@admin:123@clearchoice.com`) truncate to `"admin"` and bypass Tier 3.
   - Observation 1.4.C proves that stealth corporate practices whose HTML footers link to parent DSO policies (`clearchoice.com/privacy-policy`) pass as independent private clinics.
   - *Inference*: Corporate chains and MSOs continue to evade Gate 5 detection.

2. **Step 2 (Clinical Focus & Non-Pediatric Mandate vs. Observations 1.4.D, 1.4.E, 1.4.F, 1.4.I)**:
   - Requirement R2 mandates: *"Core clinical focus must be surgical dental implants, All-on-4, and full-arch restoration. Disqualify practices focused primarily on routine cleanings, pediatric dentistry, general checkups, or Medicaid."*
   - Observation 1.4.D proves that non-surgical Oral Pathologists (`1223P0106X`) are certified as verified surgical dental implant doctors.
   - Observations 1.4.E and 1.4.F prove that high-value adult implant centers explicitly denying pediatric care ("no pediatric dentistry") or explaining adult implant solutions for "retained baby teeth" are falsely disqualified.
   - Observation 1.4.I proves that practices stating "Excludes Medicaid" are falsely rejected as Medicaid clinics.
   - *Inference*: The clinical filter generates critical false admissions for oral pathologists and false rejections for prime cash implant clinics.

3. **Step 3 (Solo Doctor Licensure & Affluence vs. Observations 1.4.G, 1.4.H)**:
   - Requirement R2 and AC1 mandate 100% verified solo owner doctors and high-wealth zip code qualification.
   - Observation 1.4.G proves that principal implant surgeons holding prestigious credentials ("Associate Fellow, AAID") are disqualified as associate dentists.
   - Observation 1.4.H proves that Greenwich CT clinics with standard ZIP+4 format missing the leading zero (`6830-1234`) are truncated to `68301` and disqualified.
   - *Inference*: Legitimate high-ticket solo owners in target affluent metros are erroneously excluded.

---

## 3. Caveats

1. **Review-Only Role**:
   - In strict compliance with the agent prompt and role constraints, this agent did not modify any source code in `src/lib/qualification/**`.
   - All identified defects are documented with reproducible proof in `stress-harness.ts` and require resolution by the implementation worker.
2. **Offline CMS NPPES Resilience**:
   - All tests were executed in an environment with fallback caching, confirming that offline evaluation logic functions deterministically.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

While `worker_m1_2` successfully resolved the 17 initial vulnerabilities reported in Iteration 1 (retaining 100% pass rates across unit and baseline tests), empirical stress testing revealed 9 critical production vulnerabilities that compromise project acceptance criteria (AC1, AC2, AC3, AC5).

### Required Changes for Implementation Worker:

1. **DSO Filter Hardening (`src/lib/qualification/dso-filter.ts`)**:
   - **Fix Workday Datacenter Subdomains**: Update `TIER_5_ATS_REGEX` to match multi-level datacenter subdomains:
     `/(?:[a-z0-9-]+\.)*myworkdayjobs\.com\/(?:[^\s"'<>/]+\/)?(heartland|aspen|pds|...)|(?:[a-z0-9-]+\.)*(heartland|aspen|pds|...)\.(?:[a-z0-9-]+\.)*myworkdayjobs\.com/i`
   - **Fix Domain Normalization for Multiple `@` Tokens**: Replace `clean.replace(/^[^@]+@/, '')` with `clean.slice(clean.lastIndexOf('@') + 1)` so all userinfo prefixes are stripped regardless of repetition.
   - **Scan Outbound HTML Links for Blacklisted Domains**: In `checkDsoAffiliation`, extract all `href` and `src` attributes and evaluate whether any link targets a domain in `BLACKLISTED_DOMAINS`.

2. **NPI Verifier Hardening (`src/lib/qualification/npi-verifier.ts`)**:
   - **Add Oral Pathology to Disqualified Codes**: Explicitly add `'1223P0106X': 'Oral and Maxillofacial Pathology'` to `DISQUALIFIED_TAXONOMY_CODES`.
   - **Prevent Automatic Approval on Dental Degree**: In `evaluateNpiRecord`, verify that `isValidDentalTaxonomy(tax.code)` is true before allowing `isApprovedTaxonomy = true`.

3. **Clinical Specialization Filter Hardening (`src/lib/qualification/clinical-filter.ts`)**:
   - **Add Negation Logic to Pediatric Detection**: Implement bidirectional negation scanning in `detectPediatricSignals` (similar to `isNegatedMedicaidMention`) so "no pediatric dentistry" does not trigger disqualification.
   - **Refine "Baby Teeth" Keyword Context**: Require that "baby teeth" only triggers pediatric disqualification if accompanied by pediatric terms (e.g., pediatric dentist, kids dental, children).
   - **Expand Medicaid Negation Terms**: Add `excludes`, `exclude`, and `non-medicaid` to `precedingNegation`.

4. **Solo Doctor Gate Role Matching (`src/lib/qualification/index.ts`)**:
   - **Protect "Associate Fellow" and Academic Titles**: In Gate 6 `SOLO_DOCTOR`, exclude `associate fellow`, `associate member`, and `assistant professor` from the associate role disqualification regex.

5. **Zip Code Normalization (`src/lib/qualification/affluent-zips.ts`)**:
   - **Support ZIP+4 Normalization**: Split on `-` before cleaning:
     ```typescript
     const rootZip = String(zipCode).split('-')[0].trim().replace(/[^\d]/g, '');
     return rootZip.padStart(5, '0').slice(0, 5);
     ```

---

## 5. Verification Method

To independently reproduce all 9 empirical findings:

1. **Execute the Empirical Stress-Test Harness**:
   ```bash
   npx tsx /home/pwn/geo-engine/.agents/teamwork/challenger_m1_3/stress-harness.ts
   ```
   *Expected Output*: Confirms 44/44 baseline probes pass and reports all 9 vulnerabilities reproduced with exact diffs.

2. **Verify Workday Datacenter Subdomain Bypass (VULN-01)**:
   ```bash
   npx tsx -e '
   import { checkDsoAffiliation } from "./src/lib/qualification/dso-filter";
   console.log("Workday wd1 check:", checkDsoAffiliation("clinic.com", "<a href=\"https://heartland.wd1.myworkdayjobs.com/Careers\">Join</a>"));
   '
   ```
   *Observed*: Prints `isDso: false` (Demonstrates Tier 5 bypass).

3. **Verify Multi-Auth Domain Normalization (VULN-02)**:
   ```bash
   npx tsx -e '
   import { normalizeDomain, checkDsoAffiliation } from "./src/lib/qualification/dso-filter";
   console.log("Normalized:", normalizeDomain("http://user:pass@admin:123@clearchoice.com"));
   console.log("DSO check:", checkDsoAffiliation("http://user:pass@admin:123@clearchoice.com"));
   '
   ```
   *Observed*: Normalizes to `"admin"` and returns `isDso: false`.

4. **Verify Oral Pathology Bypass in NPI Licensure (VULN-04)**:
   ```bash
   npx tsx -e '
   import { evaluateNpiRecord } from "./src/lib/qualification/npi-verifier";
   const r = evaluateNpiRecord({
     enumeration_type: "NPI-1",
     number: "1999888777",
     basic: { first_name: "Sarah", last_name: "Miller", credential: "DDS", sole_proprietor: "YES" },
     taxonomies: [{ code: "1223P0106X", desc: "Oral and Maxillofacial Pathology", primary: true }]
   });
   console.log("Oral Pathology Verified:", r.verified, "isApprovedTaxonomy:", r.isApprovedTaxonomy);
   '
   ```
   *Observed*: Prints `Oral Pathology Verified: true isApprovedTaxonomy: true`.

5. **Verify Adult Clinic "No Pediatric Dentistry" False Disqualification (VULN-05)**:
   ```bash
   npx tsx -e '
   import { scoreClinicalSpecialization } from "./src/lib/qualification/clinical-filter";
   console.log(scoreClinicalSpecialization("Scottsdale Implant Center: Full-arch reconstruction. Notice: We do not offer pediatric dentistry. Adults only."));
   '
   ```
   *Observed*: Returns `disqualified: true` with reason `"Pediatric / children's dentistry specialization detected: [pediatric dentistry]"`.
