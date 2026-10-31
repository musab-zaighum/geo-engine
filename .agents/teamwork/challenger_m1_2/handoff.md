# Milestone 1 Adversarial Challenge Report: CMS NPI Registry Verifier & DAG Engine

- **Agent Identity**: `challenger_m1_2` (Milestone 1 Adversarial Challenger 2)
- **Role**: Empirical Challenger (critic, specialist)
- **Parent Conversation ID**: `f1e9e290-ce66-4f4f-88d5-1005ccaeca98`
- **Working Directory**: `/home/pwn/geo-engine/.agents/teamwork/challenger_m1_2`
- **Date**: 2026-10-31
- **Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

An empirical adversarial test suite containing 40 automated test probes was constructed and executed via `npx tsx .agents/teamwork/challenger_m1_2/adversarial-stress-suite.ts` targeting `src/lib/qualification/npi-verifier.ts` and `src/lib/qualification/index.ts`.

### 1.1 Empirical Test Execution Summary
```text
========================================================================
⚔️  RUNNING ADVERSARIAL STRESS SUITE (challenger_m1_2)
========================================================================

Total Adversarial Probes: 40
Passed Validations:       31
Failed / Defect Findings: 9
Identified Vulnerabilities: 9
```

### 1.2 Discovered Defects and Exact Code References

#### Observation 1: Non-Sole-Proprietor Associate Doctors Pass NPI Verification & Gate 6
- **File**: `src/lib/qualification/npi-verifier.ts` (lines 349–397)
- **Code**:
  ```typescript
  const isSoleProprietor =
    basic.sole_proprietor === 'YES' ||
    /\b(PC|PLLC|PA|P\.C\.|P\.L\.L\.C\.)\b/i.test(credential) ||
    /pc|pllc/i.test(basic.last_name || '');
  ...
  const passesCredentials = isDental || isApprovedTaxonomy;
  ...
  return {
    verified: true,
    doctorName: docName,
    npiNumber,
    enumerationType,
    credentials: credential || 'DDS',
    isDentalDoctor: true,
    soleProprietor: isSoleProprietor,
    primaryTaxonomy: primaryTaxonomy || 'Dentist',
    taxonomyCode: taxonomyCode || '122300000X',
    isApprovedTaxonomy: true,
    ...
  };
  ```
- **File**: `src/lib/qualification/index.ts` (lines 187–196)
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
  return {
    gate,
    passed: true,
    details: result,
  };
  ```
- **Verbatim Test Output**:
  ```text
  🚨 VULN: [Suite 5] evaluateNpiRecord: Non-sole-proprietor associate doctor (sole_proprietor: NO) must NOT be verified
     Expected: verified: false (must disqualify non-sole proprietor)
     Actual:   verified: true, soleProprietor: false
  🚨 VULN: [Suite 5] Gate 6 (SOLO_DOCTOR): Must disqualify non-sole-proprietor associate doctor
     Expected: passed: false (disqualified as associate/non-owner)
     Actual:   passed: true, details.soleProprietor: false
  ```

#### Observation 2: Non-Dental MDs (Family Medicine, Psychiatry, Dermatology) Verified as Dental Surgeons with Fabricated Taxonomy
- **File**: `src/lib/qualification/npi-verifier.ts` (lines 34, 360, 392)
- **Code**:
  ```typescript
  const DENTAL_CREDENTIAL_REGEX = /\b(DDS|DMD|MD|D\.D\.S|D\.M\.D|M\.D)\b/i;
  ...
  const isDental = isDentalCredential(credential);
  ...
  const passesCredentials = isDental || isApprovedTaxonomy;
  ...
  return {
    verified: true,
    ...
    isApprovedTaxonomy: true, // hardcoded overwrite
  };
  ```
- **Verbatim Test Output**:
  ```text
  🚨 VULN: [Suite 4] Non-dental MD (Family Medicine 207Q00000X) must NOT qualify as dental surgeon
     Expected: verified: false (lacks dental taxonomy)
     Actual:   verified: true, isApprovedTaxonomy: true
     Notes:    CRITICAL BUG: passesCredentials uses isDental || isApprovedTaxonomy. Credential "MD" causes isDental=true, erroneously verifying non-dental MDs as approved dental implant doctors with isApprovedTaxonomy=true.
  ```

#### Observation 3: Empty `taxonomies: []` Array Causes Verifier to Fabricate "Dentist" and "122300000X"
- **File**: `src/lib/qualification/npi-verifier.ts` (lines 390–392)
- **Code**:
  ```typescript
  primaryTaxonomy: primaryTaxonomy || 'Dentist',
  taxonomyCode: taxonomyCode || '122300000X',
  isApprovedTaxonomy: true,
  ```
- **Verbatim Test Output**:
  ```text
  🚨 VULN: [Suite 4] Empty taxonomies array must NOT fabricate default Dentist taxonomy
     Expected: taxonomyCode should remain empty when missing in registry
     Actual:   primaryTaxonomy: "Dentist", taxonomyCode: "122300000X", isApprovedTaxonomy: true
     Notes:    DEFECT: evaluateNpiRecord fabricates "Dentist" and "122300000X" when taxonomies array is completely empty.
  ```

#### Observation 4: `evaluateGate('MAPS_RANK')` Returns `passed: true` for `NaN`
- **File**: `src/lib/qualification/index.ts` (lines 93–113)
- **Code**:
  ```typescript
  if (rank < 4) { return { gate, passed: false, ... }; }
  if (rank > 6) { return { gate, passed: false, ... }; }
  return { gate, passed: true, details: { rank } };
  ```
- **Verbatim Test Output**:
  ```text
  🚨 VULN: [Suite 6] Gate 2: mapsRank = NaN must be disqualified
     Expected: passed: false
     Actual:   passed: true
     Notes:    DEFECT: evaluateGate("MAPS_RANK") returns passed: true for NaN because NaN < 4 is false and NaN > 6 is false!
  ```

#### Observation 5: Gate 7 (`PROXIMITY_COMPETITOR`) Passes Competitor Missing Distance and Coordinates
- **File**: `src/lib/qualification/index.ts` (lines 224–253)
- **Code**:
  ```typescript
  let distance = comp.distanceMiles;
  if (
    distance === undefined &&
    candidate.latitude !== undefined &&
    ...
  ) { distance = calculateHaversineMiles(...); }

  if (distance !== undefined && distance > 5.0) {
    return { gate, passed: false, ... };
  }
  return { gate, passed: true, ... };
  ```
- **Verbatim Test Output**:
  ```text
  🚨 VULN: [Suite 6] Gate 7: Competitor missing both distanceMiles and coordinates must be disqualified
     Expected: passed: false (cannot verify 5-mile proximity requirement)
     Actual:   passed: true
     Notes:    DEFECT: Gate 7 returns passed: true when competitor has rank: 1 but lacks distanceMiles and coordinates, bypassing the 5.0-mile limit.
  ```

#### Observation 6: Uncaught Exceptions on Null / Undefined Inputs
- **Direct invocation**:
  `qualifyPractice(null as any)`:
  `TypeError: Cannot read properties of null (reading 'zipCode') at qualifyPractice (src/lib/qualification/index.ts:296:56)`
  `evaluateNpiRecord(null)`:
  `TypeError: Cannot read properties of null (reading 'enumeration_type') at evaluateNpiRecord (src/lib/qualification/npi-verifier.ts:272:27)`

---

## 2. Logic Chain

1. **Failure of Solo Owner Disqualification (Observations 1)**:
   - In `ORIGINAL_REQUEST.md` (R2), the system requires: *"Decision Maker: Must be a solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Disqualify associate dentists, hygienists, or clinic managers."*
   - Acceptance Criterion 1 mandates: *"100% of outputted leads have a verified solo owner doctor (DDS/DMD/MD) identified via CMS NPI Registry or practice 'About' page."*
   - In `evaluateNpiRecord`, when `basic.sole_proprietor === 'NO'` and credentials are standard `DDS`, `isSoleProprietor` evaluates to `false`.
   - However, `evaluateNpiRecord` returns `verified: true`.
   - In `evaluateGate('SOLO_DOCTOR')`, the gate condition is solely `if (!result.verified)`. It does not check `if (!result.soleProprietor)`.
   - Consequently, non-owner associate dentists pass Gate 6 and `qualifyPractice()` marks the candidate as qualified, directly violating R2 and AC 1.

2. **Infiltration of Non-Dental Medical Doctors (Observation 2)**:
   - An MD credential can represent an Oral and Maxillofacial Surgeon (OMFS, taxonomy `204E00000X`), but also general physicians, pediatricians, psychiatrists, and dermatologists.
   - `DENTAL_CREDENTIAL_REGEX` includes `MD`. In `evaluateNpiRecord`, `isDental` is computed via `isDentalCredential(credential)`.
   - The credential check uses OR logic: `passesCredentials = isDental || isApprovedTaxonomy`.
   - For a family physician with credential "MD" and taxonomy `207Q00000X` (Family Medicine), `isDental` is true. `passesCredentials` becomes true.
   - At line 392, `isApprovedTaxonomy: true` is hardcoded on return.
   - The doctor is verified as a qualified dental surgeon despite having a non-dental medical taxonomy. This violates R2 clinical specialization requirements.

3. **Fabrication of Registry Taxonomies (Observation 3)**:
   - When a provider has no taxonomies listed in the CMS database (`taxonomies: []`), the verifier defaults to `primaryTaxonomy: 'Dentist'` and `taxonomyCode: '122300000X'`.
   - This synthetic fabrication corrupts lead dossier data integrity and bypasses taxonomy verification.

4. **Numeric and Proximity Boundary Bypasses (Observations 4 & 5)**:
   - Gate 2 validates rank bounds using `< 4` and `> 6`. JavaScript comparisons `NaN < 4` and `NaN > 6` are both `false`. Thus `mapsRank: NaN` falls through to `passed: true`.
   - Gate 7 checks `if (distance !== undefined && distance > 5.0)`. If a competitor has rank #1 but neither `distanceMiles` nor coordinates are supplied, `distance` remains `undefined`, and Gate 7 returns `passed: true`. This allows competitors outside the 5.0-mile radius (or with unverified location) to pass.

5. **Robustness of Short-Circuiting and Network Outages (Positive Findings)**:
   - When Gate 1 (`AFFLUENT_ZIP`) fails with `stopOnFirstFailure: true` (default), the loop breaks immediately.
   - Downstream gates (`MAPS_RANK` through `PROXIMITY_COMPETITOR`) are not evaluated, and no network calls to CMS NPPES are made.
   - Network timeouts (`AbortSignal.timeout`), HTTP 500/503/429 status codes, and network exceptions (`ECONNREFUSED`) are caught cleanly by `lookupNpi` and `verifySoloDoctor`, returning `verified: false` without crashing.

---

## 3. Caveats

1. **Gate 7 Bypass in `qualifyPractice`**:
   - In `src/lib/qualification/index.ts` lines 299–307, `qualifyPractice` skips Gate 7 if `!candidate.competitor`. This was noted as an accommodation for Milestone 1 prior to Milestone 2 scraper integration. However, when competitor data IS provided, Observation 5 applies.
2. **CMS API Availability**:
   - Live CMS NPPES queries depend on federal government servers. The offline mocked tests in `adversarial-stress-suite.ts` ensure deterministic verification regardless of upstream government server maintenance.
3. **No implementation modifications made**:
   - As an empirical challenger operating under review-only constraints, no changes were committed to `src/`. All findings are documented for the worker agent to remediate.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The qualification engine successfully demonstrates DAG short-circuiting on Gate 1 failure and network timeout resilience in the CMS client. However, **critical business logic defects** allow associate dentists (non-sole proprietors) and non-dental physicians (Family Medicine MDs) to qualify as solo dental implant surgeons, and empty or missing registry data is synthetically fabricated.

### Required Changes for Implementation Worker:
1. **Enforce Sole Proprietor Requirement in Gate 6**:
   - In `src/lib/qualification/npi-verifier.ts`: If `!isSoleProprietor`, set `verified: false` and set `disqualificationReason: 'Provider is not a verified sole proprietor or principal PC/PLLC owner'`.
   - In `src/lib/qualification/index.ts` (Gate 6): Explicitly verify `result.soleProprietor === true`.
2. **Restrict MD Credential to Approved OMFS Taxonomies**:
   - If credential is `MD`, strictly require approved oral maxillofacial taxonomy (`204E00000X` or `1223S0112X`). Non-dental MDs must be rejected.
   - Do not hardcode `isApprovedTaxonomy: true` on return when `isApprovedTaxonomy` was computed as false.
3. **Do Not Fabricate Missing Taxonomies**:
   - When `taxonomies` is empty, do not fabricate `'Dentist'` / `'122300000X'`. Require explicit dental taxonomy or flag as unverified.
4. **Fix Gate 2 `NaN` and Non-Integer Rank Check**:
   - Verify `typeof rank === 'number' && Number.isInteger(rank) && rank >= 4 && rank <= 6`.
5. **Fix Gate 7 Proximity Distance Validation**:
   - If `distance` cannot be computed (both `distanceMiles` and coordinates missing), fail Gate 7 with `"Unable to verify competitor distance within 5.0-mile radius"`. Reject `NaN` or negative distances.
6. **Add Null-Safety Guards**:
   - Add top-level null guards in `qualifyPractice(candidate)` and `evaluateNpiRecord(raw)`.

---

## 5. Verification Method

To independently reproduce and verify all 9 defect findings:

1. **Execute Adversarial Stress Test Suite**:
   ```bash
   npx tsx .agents/teamwork/challenger_m1_2/adversarial-stress-suite.ts
   ```
   *Expected Output*: Displays 40 probes, 31 passes, and the 9 identified vulnerability alerts.

2. **Verify Associate Doctor Pass Defect via One-Liner**:
   ```bash
   npx tsx -e '
   import { evaluateNpiRecord } from "./src/lib/qualification/npi-verifier";
   const r = evaluateNpiRecord({
     number: "1234567890",
     enumeration_type: "NPI-1",
     basic: { first_name: "JOHN", last_name: "DOE", credential: "DDS", sole_proprietor: "NO" },
     taxonomies: [{ code: "122300000X", desc: "Dentist", primary: true }]
   });
   console.log("Verified:", r.verified, "SoleProprietor:", r.soleProprietor);
   '
   ```
   *Expected Defect Output*: Prints `Verified: true SoleProprietor: false` (Proves associate dentist erroneously passes).

3. **Verify Non-Dental MD Pass Defect via One-Liner**:
   ```bash
   npx tsx -e '
   import { evaluateNpiRecord } from "./src/lib/qualification/npi-verifier";
   const r = evaluateNpiRecord({
     number: "1234567890",
     enumeration_type: "NPI-1",
     basic: { first_name: "FAMILY", last_name: "DOC", credential: "MD", sole_proprietor: "YES" },
     taxonomies: [{ code: "207Q00000X", desc: "Family Medicine", primary: true }]
   });
   console.log("Verified:", r.verified, "isApprovedTaxonomy:", r.isApprovedTaxonomy);
   '
   ```
   *Expected Defect Output*: Prints `Verified: true isApprovedTaxonomy: true` (Proves Family Medicine MD erroneously passes as dental surgeon).

4. **Verify Gate 2 NaN Pass via One-Liner**:
   ```bash
   npx tsx -e '
   import { evaluateGate } from "./src/lib/qualification/index";
   evaluateGate("MAPS_RANK", { name: "X", domain: "x.com", zipCode: "85260", mapsRank: NaN })
     .then(r => console.log("Gate 2 NaN Passed:", r.passed));
   '
   ```
   *Expected Defect Output*: Prints `Gate 2 NaN Passed: true`.
