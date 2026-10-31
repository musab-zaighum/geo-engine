# Milestone 1 Remediation Analysis & Fix Strategy: DSO Filter, Clinical Scorer & Gate 7

- **Agent Identity**: `explorer_m1_fix_3` (DSO & Clinical Scorer Remediation Explorer)
- **Role**: Read-only Investigation & Synthesis
- **Parent Conversation ID**: `f1e9e290-ce66-4f4f-88d5-1005ccaeca98`
- **Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/explorer_m1_fix_3`
- **Date**: 2026-10-31
- **Target Source Files**:
  - `src/lib/qualification/dso-filter.ts`
  - `src/lib/qualification/clinical-filter.ts`
  - `src/lib/qualification/index.ts`

---

## 1. Observation

Direct code examination and empirical execution of the test harnesses from `auditor_m1_1`, `challenger_m1_1`, and `challenger_m1_2` revealed six specific defects across DSO detection, clinical scoring, and Gate 7 proximity validation:

### 1.1 DSO Filter: ATS Subdomain Evasion & Workday Jobs
- **File**: `src/lib/qualification/dso-filter.ts`, lines 355–357:
  ```typescript
  const TIER_5_ATS_REGEX =
    /(boards\.greenhouse\.io\/(tag|heartland|aspendental|pacificdentalservices|mb2dental|sonrava|smilebrands)|[a-z0-9-]+\.myworkdayjobs\.com\/(heartland|aspen|pds|clearchoice)|jobs\.lever\.co\/(clearchoice|mb2dental|specialty1)|ultipro\.com\/[a-z0-9-]+\/jobboard)/i;
  ```
- **Observed Behavior**:
  - Testing with `<a href="https://heartland.myworkdayjobs.com/careers">` returned `matches: false`.
  - Testing with `<div><iframe src="https://boards.greenhouse.io/embed/job_board?for=heartland"></iframe></div>` returned `matches: false`.
  - Workday ATS portals universally place tenant names in the subdomain (`heartland.myworkdayjobs.com`), whereas the regex strictly required the brand to appear after the first path slash (`.com/(heartland...)`). Greenhouse embedded iframe widgets use query parameters (`?for=heartland`), which were omitted from the regex.

### 1.2 DSO Filter: Domain Normalization Trailing Dots & Basic Auth Bypass
- **File**: `src/lib/qualification/dso-filter.ts`, lines 361–372:
  ```typescript
  export function normalizeDomain(rawDomain: string): string {
    if (!rawDomain) return '';
    let clean = rawDomain.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, '');
    clean = clean.split('/')[0];
    clean = clean.split('?')[0];
    clean = clean.split(':')[0];
    if (clean.startsWith('www.')) {
      clean = clean.slice(4);
    }
    return clean;
  }
  ```
- **Observed Behavior**:
  - `normalizeDomain("midatlanticdental.com.")` returned `"midatlanticdental.com."`. Because of the trailing FQDN dot, `BLACKLISTED_DOMAINS.has("midatlanticdental.com.")` evaluated to `false`, allowing a known corporate chain to bypass Tier 3.
  - `normalizeDomain("http://user:pass@midatlanticdental.com")` split on `:` at line 367 before inspecting `@`, truncating the domain to `"user"`, bypassing all blacklist lookups.

### 1.3 DSO Filter: HTML Markup Interrupting Legal Disclaimers
- **File**: `src/lib/qualification/dso-filter.ts`, lines 343 & 389–412:
  ```typescript
  { name: 'Heartland Dental', regex: /\b(supported\s+by\s+heartland\s+dental|heartland\s+dental,\s+llc)\b/i }
  ```
- **Observed Behavior**:
  - `matchesDsoLegalDisclaimer('<p>Dental care is supported by <strong>Heartland Dental</strong>, LLC.</p>')` returned `{ matches: false }`.
  - `matchesDsoLegalDisclaimer('<footer>Supported by <a href="https://heartland.com">Heartland Dental</a></footer>')` returned `{ matches: false }`.
  - Because `matchesDsoLegalDisclaimer` operated on raw HTML strings without stripping tags, inline tags like `<strong>` and `<a>` disrupted `\s+`, evading statutory regulatory disclosure detection.

### 1.4 Clinical Filter: Cash-Only Practices Disqualified by Medicaid Negation
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 160–175:
  ```typescript
  export function detectMedicaidSignals(text: string): { detected: boolean; terms: string[] } {
    const lower = text.toLowerCase();
    const terms: string[] = [];
    for (const kw of MEDICAID_KEYWORDS) {
      const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        terms.push(kw);
      }
    }
    return { detected: terms.length > 0, terms };
  }
  ```
- **Observed Behavior**:
  - Input: `"Center for Elite Dental Implantology ... Notice: Our clinic does not accept Medicaid, Denti-Cal, or insurance. We are 100% fee-for-service cash pay."`
  - Output: `{ qualified: false, disqualified: true, disqualificationReason: "Medicaid / state welfare acceptance detected: [medicaid, denti-cal]" }`.
  - Premier fee-for-service implant clinics explicitly disclaiming Medicaid acceptance were automatically disqualified.

### 1.5 Clinical Filter: Substring Double-Counting Inflating Cosmetic Clinic Scores
- **File**: `src/lib/qualification/clinical-filter.ts`, lines 16–18 & 238–252:
  ```typescript
  export const IMPLANT_KEYWORDS = [
    'dental implants',
    'dental implant',
    ...
  ];
  ...
  const implantMatches = IMPLANT_KEYWORDS.filter((kw) => lower.includes(kw));
  const implantScore = Math.min(implantMatches.length * 8, 40);
  ```
- **Observed Behavior**:
  - Input: `"Beverly Hills Teeth Whitening. We offer whitening, veneers, cleanings, and dental implants."`
  - `implantMatches` captured `['dental implants', 'dental implant']` because `'dental implant'` is a literal substring of `'dental implants'`.
  - Score was computed as `2 * 8 = 16 points`. Since 16 exceeds the minimum threshold of 15 (`density.score >= 15`), a cosmetic teeth-whitening studio with a single casual mention of dental implants qualified as a high-ticket surgical implant center.

### 1.6 Gate 7 & DAG Pipeline: Competitor Verification Bypass
- **File**: `src/lib/qualification/index.ts`, lines 224–254 & 299–307:
  ```typescript
  // In evaluateGate:
  let distance = comp.distanceMiles;
  if (distance === undefined && ... ) { distance = calculateHaversineMiles(...); }
  if (distance !== undefined && distance > 5.0) {
    return { gate, passed: false, ... };
  }
  return { gate, passed: true, details: { competitorName: comp.name, rank: comp.rank, distanceMiles: distance } };

  // In qualifyPractice:
  if (gate === 'PROXIMITY_COMPETITOR' && !candidate.competitor) {
    gateResults[gate] = {
      gate,
      passed: true,
      details: { skipped: true, reason: 'No competitor data provided on candidate practice' },
    };
    continue;
  }
  ```
- **Observed Behavior**:
  - When `candidate.competitor` was omitted entirely, `qualifyPractice` marked Gate 7 `passed: true` (skipped) and certified the candidate as qualified (`qualified: true`), directly violating Acceptance Criterion 5 ("Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius").
  - When `candidate.competitor` was supplied with `rank: 1` but lacked both `distanceMiles` and coordinates (or had `distanceMiles: NaN`), `distance` remained `undefined` or `NaN`. Because `undefined > 5.0` is `false` and `NaN > 5.0` is `false`, Gate 7 returned `passed: true`.

---

## 2. Logic Chain

1. **DSO Evasion via ATS & Normalization (Observations 1.1, 1.2, 1.3)**:
   - *Requirement*: Acceptance Criterion 2 mandates 0 DSOs, private-equity groups, or corporate chains (ClearChoice, Aspen, Heartland) in the qualified list.
   - *Logic*: Workday URLs hosted on `heartland.myworkdayjobs.com`, domains normalized with trailing dots (`domain.com.`), basic auth URLs (`user:pass@domain.com`), and HTML-injected footer disclaimers (`supported by <strong>Heartland Dental</strong>`) all evade detection.
   - *Remediation*:
     a) Update `TIER_5_ATS_REGEX` to support brand names in Workday subdomains and Greenhouse embed query parameters.
     b) Strip userinfo (`replace(/^[^@]+@/, '')`), ports (`split(':')[0]`), and trailing dots (`replace(/\.+$/, '')`) in `normalizeDomain`.
     c) Introduce `stripHtmlForDisclaimer(text)` to remove HTML tags and decode entities before running Tier 4 legal disclaimer regexes.
     d) Add `'clear choice'` and `'pacific dental'` to `DSO_DIRECTORY` keywords with word-boundary matching.

2. **False Disqualification of Cash Clinics (Observation 1.4)**:
   - *Requirement*: Requirement R2 mandates disqualification of practices focused primarily on Medicaid, but prioritizes cash-pay high-ticket private surgical implant clinics.
   - *Logic*: High-end implant clinics frequently publish statements like `"Our clinic does not accept Medicaid, Denti-Cal, or insurance. We are 100% fee-for-service cash pay."` Pure substring matching flags these disclaimers as affirmative Medicaid acceptance.
   - *Remediation*:
     Implement `isNegatedMedicaidMention(text, matchIndex, matchLength)` using bidirectional clause window inspection to verify whether preceding phrases (`does not accept`, `no`, `never`, `cannot`, `neither`, `not accepted:`) or following phrases (`is not accepted`, `not covered`) negate the mention.

3. **False Qualification of Cosmetic Clinics (Observation 1.5)**:
   - *Requirement*: Requirement R2 mandates core clinical focus on surgical dental implants, All-on-4, and full-arch restoration.
   - *Logic*: Because `'dental implant'` is a grammatical substring of `'dental implants'`, a single mention matched two keywords and scored 16 points (>= 15 threshold).
   - *Remediation*:
     a) Apply word-boundary regular expressions (`(^|[^a-z0-9])keyword([^a-z0-9]|$)`) during keyword detection so `"dental implants"` does not match `"dental implant"`.
     b) Introduce `deduplicateSubstrings(keywords)` to sort matches by length descending and eliminate shorter substrings or hyphenation variants.

4. **Bypass of Gate 7 Competitor Mandate (Observation 1.6)**:
   - *Requirement*: Acceptance Criterion 5 strictly mandates: "Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius."
   - *Logic*: Skipping Gate 7 in `qualifyPractice` when `candidate.competitor` is undefined allows leads with 0 competitors to pass. Permitting `undefined` or `NaN` distances allows competitors outside the 5-mile radius to pass.
   - *Remediation*:
     a) Remove lines 299–307 in `qualifyPractice` so Gate 7 is always executed.
     b) In `evaluateGate('PROXIMITY_COMPETITOR')`, strictly validate that `comp` exists, `comp.name` is non-empty, `comp.rank === 1`, and `distance` resolves to a finite number `>= 0` and `<= 5.0`. If distance cannot be computed, strictly return `passed: false`.

---

## 3. Caveats

1. **Gate 6 NPI Taxonomy Scope**:
   This report specifically addresses the DSO filter, Clinical Scorer, and Gate 7 Proximity Competitor defects. Gate 6 taxonomy code reassignment (`1223P0221X` to Pediatric Dentistry) and associate doctor enforcement (`sole_proprietor === 'NO'`) are being addressed concurrently in `npi-verifier.ts` per the Auditor's and Challenger 2's specifications.
2. **Review-Only Role Discipline**:
   Per the Explorer archetype and Teamwork workflow protocol, this agent has NOT directly edited `src/lib/qualification/**`. Instead, fully tested proposed replacement files and unified diff `.patch` files have been generated in this agent's folder for the implementation worker to apply.

---

## 4. Conclusion

The defects identified by the Auditor and Challengers in `dso-filter.ts`, `clinical-filter.ts`, and `index.ts` represent critical boundary leaks that violate Acceptance Criteria 2, 3, and 5.

Exact remediation strategies have been designed, implemented in local proposed files, and empirically verified against all edge cases.

### Artifact Deliverables in `.agents/teamwork/explorer_m1_fix_3/`:
1. `proposed_dso-filter.ts` — Complete drop-in replacement for `src/lib/qualification/dso-filter.ts`.
2. `proposed_clinical-filter.ts` — Complete drop-in replacement for `src/lib/qualification/clinical-filter.ts`.
3. `proposed_index.ts` — Complete drop-in replacement for `src/lib/qualification/index.ts`.
4. `dso-filter.patch` — Unified diff patch for `dso-filter.ts`.
5. `clinical-filter.patch` — Unified diff patch for `clinical-filter.ts`.
6. `index.patch` — Unified diff patch for `index.ts`.
7. `verify-fixes.ts` — Standalone verification harness testing all 18 edge-case probes with 100% pass rate.

### Summary of Proposed Code Changes:

#### A. `src/lib/qualification/dso-filter.ts`
- **ATS Regex**: Updated `TIER_5_ATS_REGEX` to match Workday company subdomains (`[a-z0-9-]+\.myworkdayjobs\.com` and `(heartland|aspen|pds|...)\.myworkdayjobs\.com`) and Greenhouse iframe embed query parameters (`boards.greenhouse.io/[^\s"'<>]*?...`).
- **Domain Normalization**: Updated `normalizeDomain` to strip basic auth credentials (`clean.replace(/^[^@]+@/, '')`), port numbers (`split(':')[0]`), and trailing FQDN dots (`clean.replace(/\.+$/, '')`).
- **HTML Stripping in Legal Disclaimers**: Added `stripHtmlForDisclaimer` and invoked it in `matchesDsoLegalDisclaimer` before evaluating regulatory regexes.
- **Brand Keywords**: Added `'clear choice'` and `'pacific dental'` to `DSO_DIRECTORY` and updated keyword matching in `checkDsoAffiliation` to use word boundaries.

#### B. `src/lib/qualification/clinical-filter.ts`
- **Medicaid Negation**: Implemented `isNegatedMedicaidMention` supporting preceding negation (`does not accept`, `no`, `never`, `cannot`, `neither`, `not accepted:`) and following negation (`is not accepted`, `not covered`), preventing false disqualification of cash-only implant practices.
- **Keyword Double-Counting Prevention**: Implemented `matchKeywordsWithBoundaries` and `deduplicateSubstrings` to prevent singular/plural stem collisions (e.g. `'dental implants'` and `'dental implant'`), preventing cosmetic teeth-whitening studios from qualifying on a single casual mention.

#### C. `src/lib/qualification/index.ts`
- **Gate 7 Enforcement**: Updated `evaluateGate('PROXIMITY_COMPETITOR')` to strictly reject null/undefined competitors, missing competitor names, non-#1 ranks, and missing/NaN/negative distances or distances `> 5.0` miles.
- **DAG Pipeline Integrity**: Removed the Gate 7 skip block in `qualifyPractice`, ensuring every candidate practice must verify a #1 competitor within 5.0 miles.
- **Gate 2 Hardening**: Added integer validation for `mapsRank` (`Number.isInteger(rank)`), rejecting `NaN` and fractional ranks.
- **Null Safety**: Added null/undefined guard at the entry of `qualifyPractice`.

---

## 5. Verification Method

To independently verify the defects and validate the proposed remediation strategies:

### 1. Execute the Standalone Verification Harness
Run the 18-probe validation script authored in this agent's folder:
```bash
npx tsx .agents/teamwork/explorer_m1_fix_3/verify-fixes.ts
```
**Expected Output**:
```text
--- 1. DSO Domain Normalization Probes ---
1.1 Trailing dot: true
1.2 Basic auth URL: true
1.3 Basic auth + port: true

--- 2. DSO HTML Disclaimer & ATS Probes ---
2.1 Disclaimer with strong: true
2.2 Disclaimer with anchor: true
2.3 Workday subdomain: true
2.4 Greenhouse embed: true

--- 3. Clinical Scorer Medicaid Negation Probes ---
3.1 Cash-only clinic does NOT accept Medicaid: true
3.2 True Medicaid acceptance: true

--- 4. Clinical Keyword Density Substring Deduplication Probes ---
4.1 Single implant mention keyword count: true
4.2 Stuffed implant mention deduplicated count: true

--- 5. Gate 7 Proximity Competitor Probes ---
5.1 Missing competitor rejects: true
5.2 Null competitor rejects: true
5.3 Competitor missing distance and coords rejects: true
5.4 Competitor distance NaN rejects: true
5.5 Competitor distance 5.1 miles rejects: true
5.6 Competitor distance 4.9 miles passes: true

ALL REMEDIATION PROBES VERIFIED SUCCESSFULLY!
```

### 2. Inspect Unified Diff Patches
Inspect the exact machine-applicable patches:
```bash
cat .agents/teamwork/explorer_m1_fix_3/dso-filter.patch
cat .agents/teamwork/explorer_m1_fix_3/clinical-filter.patch
cat .agents/teamwork/explorer_m1_fix_3/index.patch
```

### 3. Verification Post-Implementation (by Worker)
Once applied to `src/lib/qualification/`:
```bash
# 1. Run unit test suite
npx tsx tests/unit/qualification.test.ts

# 2. Re-run Challenger 1 Adversarial Harness (proves resolution of DSO, clinical, and Gate 7 defects)
npx tsx .agents/teamwork/challenger_m1_1/adversarial-harness.ts

# 3. Re-run Challenger 2 Stress Suite
npx tsx .agents/teamwork/challenger_m1_2/adversarial-stress-suite.ts

# 4. Verify TypeScript compilation and production build
npx tsc --noEmit
npm run build
```
