/**
 * Empirical Adversarial Stress Harness — Milestone 1 Iteration 2
 *
 * Authored by: challenger_m1_4 (Empirical Challenger)
 * Working Directory: /home/pwn/geo-engine/.agents/teamwork/challenger_m1_4
 *
 * Rigorously validates:
 * 1. All 40 adversarial probes originally designed by challenger_m1_2.
 * 2. Dr. Marvin Abarca (1316388820, 1223P0221X) live query rejection.
 * 3. Non-dental MD (Cardiology, Family Medicine, Dermatology) rejection vs approved OMFS dual-degree.
 * 4. Associate doctor (sole_proprietor: NO) rejection in both evaluateNpiRecord and Gate 6.
 * 5. Empty taxonomy array rejection without synthetic fabrication.
 * 6. Gate 2 NaN and fractional rank (4.5) rejection.
 * 7. Gate 7 undefined competitor / missing distance / distance > 5.0 miles rejection.
 * 8. DSO evasion and clinical Medicaid negation edge cases.
 */

import {
  lookupNpi,
  verifySoloDoctor,
  evaluateNpiRecord,
  parseDoctorName,
  isDentalCredential,
  isValidDentalTaxonomy,
  seedNpiCache,
  clearNpiCache,
  APPROVED_DENTAL_TAXONOMY_CODES,
  DISQUALIFIED_TAXONOMY_CODES,
} from '../../../src/lib/qualification/npi-verifier';

import {
  qualifyPractice,
  evaluateGate,
  calculateHaversineMiles,
  CandidatePractice,
  QualificationGate,
} from '../../../src/lib/qualification/index';

import {
  checkDsoAffiliation,
  normalizeDomain,
} from '../../../src/lib/qualification/dso-filter';

import {
  scoreClinicalSpecialization,
} from '../../../src/lib/qualification/clinical-filter';

import {
  isAffluentZip,
  normalizeZipCode,
} from '../../../src/lib/qualification/affluent-zips';

interface TestRecord {
  id: string;
  category: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  notes?: string;
}

const testRecords: TestRecord[] = [];

function record(
  id: string,
  category: string,
  description: string,
  passed: boolean,
  expected: string,
  actual: string,
  notes?: string
) {
  testRecords.push({ id, category, description, passed, expected, actual, notes });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status}: [${id}] ${category} — ${description}`);
  if (!passed) {
    console.log(`     Expected: ${expected}`);
    console.log(`     Actual:   ${actual}`);
    if (notes) console.log(`     Notes:    ${notes}`);
  }
}

async function runEmpiricalStressHarness() {
  console.log('========================================================================');
  console.log('🔥 RUNNING EMPIRICAL ADVERSARIAL STRESS HARNESS (challenger_m1_4)');
  console.log('========================================================================\n');

  const originalFetch = globalThis.fetch;

  try {
    // ========================================================================
    // SUITE 1: NETWORK TIMEOUT & TRANSPORT CHAOS (PROBES 1-6)
    // ========================================================================
    console.log('--- Suite 1: Network Timeout & Transport Chaos ---');

    // 1.1 lookupNpi timeout
    globalThis.fetch = async () => {
      return new Promise((_, reject) => {
        const err = new Error('The operation was aborted due to timeout');
        err.name = 'TimeoutError';
        setTimeout(() => reject(err), 5);
      });
    };
    clearNpiCache();
    const timeoutLookup = await lookupNpi('1487796843', 20);
    record(
      'P-01',
      'Transport Chaos',
      'lookupNpi handles network timeout gracefully without throwing',
      timeoutLookup.verified === false && Boolean(timeoutLookup.disqualificationReason?.includes('timeout')),
      'verified: false with timeout reason',
      `verified: ${timeoutLookup.verified}, reason: "${timeoutLookup.disqualificationReason}"`
    );

    // 1.2 verifySoloDoctor timeout
    clearNpiCache();
    const timeoutVerify = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ', undefined, undefined, 20);
    record(
      'P-02',
      'Transport Chaos',
      'verifySoloDoctor handles network timeout gracefully without throwing',
      timeoutVerify.verified === false && Boolean(timeoutVerify.disqualificationReason?.includes('timeout')),
      'verified: false with timeout reason',
      `verified: ${timeoutVerify.verified}, reason: "${timeoutVerify.disqualificationReason}"`
    );

    // 1.3 HTTP 500 Internal Server Error
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers(),
      json: async () => ({ error: 'Internal Server Error' }),
    } as any);
    clearNpiCache();
    const http500Res = await lookupNpi('1487796843');
    record(
      'P-03',
      'Transport Chaos',
      'lookupNpi handles HTTP 500 without crashing',
      http500Res.verified === false && Boolean(http500Res.disqualificationReason?.includes('500')),
      'verified: false with HTTP 500 error',
      `verified: ${http500Res.verified}, reason: "${http500Res.disqualificationReason}"`
    );

    // 1.4 HTTP 503 Service Unavailable
    globalThis.fetch = async () => ({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers(),
      json: async () => ({ error: 'CMS NPPES under maintenance' }),
    } as any);
    clearNpiCache();
    const http503Res = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ');
    record(
      'P-04',
      'Transport Chaos',
      'verifySoloDoctor handles HTTP 503 without crashing',
      http503Res.verified === false && Boolean(http503Res.disqualificationReason?.includes('503')),
      'verified: false with HTTP 503 error',
      `verified: ${http503Res.verified}, reason: "${http503Res.disqualificationReason}"`
    );

    // 1.5 HTTP 429 Rate Limit Exceeded
    globalThis.fetch = async () => ({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      headers: new Headers(),
      json: async () => ({ error: 'Rate limit exceeded' }),
    } as any);
    clearNpiCache();
    const http429Res = await lookupNpi('1487796843');
    record(
      'P-05',
      'Transport Chaos',
      'lookupNpi handles HTTP 429 rate limit gracefully',
      http429Res.verified === false && Boolean(http429Res.disqualificationReason?.includes('429')),
      'verified: false with 429 status',
      `verified: ${http429Res.verified}, reason: "${http429Res.disqualificationReason}"`
    );

    // 1.6 Network Connection Refused (ECONNREFUSED)
    globalThis.fetch = async () => {
      throw new Error('connect ECONNREFUSED 127.0.0.1:443');
    };
    clearNpiCache();
    const econnRes = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ');
    record(
      'P-06',
      'Transport Chaos',
      'verifySoloDoctor handles ECONNREFUSED network failure',
      econnRes.verified === false && Boolean(econnRes.disqualificationReason?.includes('ECONNREFUSED')),
      'verified: false with ECONNREFUSED error',
      `verified: ${econnRes.verified}, reason: "${econnRes.disqualificationReason}"`
    );
    console.log();

    // ========================================================================
    // SUITE 2: MALFORMED & CORRUPTED RESPONSES (PROBES 7-12)
    // ========================================================================
    console.log('--- Suite 2: Malformed & Corrupted Response Payloads ---');

    // 2.1 Non-JSON HTML response
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON at position 0');
      },
    } as any);
    clearNpiCache();
    const badJsonRes = await lookupNpi('1487796843');
    record(
      'P-07',
      'Malformed Payloads',
      'lookupNpi handles non-JSON response body safely',
      badJsonRes.verified === false && Boolean(badJsonRes.disqualificationReason?.includes('Unexpected token')),
      'verified: false with JSON syntax error caught',
      `verified: ${badJsonRes.verified}, reason: "${badJsonRes.disqualificationReason}"`
    );

    // 2.2 Response with results = null
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ result_count: 0, results: null }),
    } as any);
    clearNpiCache();
    const nullResultsLookup = await lookupNpi('1487796843');
    record(
      'P-08',
      'Malformed Payloads',
      'lookupNpi handles results: null safely',
      nullResultsLookup.verified === false,
      'verified: false',
      `verified: ${nullResultsLookup.verified}, reason: "${nullResultsLookup.disqualificationReason}"`
    );

    // 2.3 Response with results = [null]
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ result_count: 1, results: [null] }),
    } as any);
    clearNpiCache();
    const nullInResultsLookup = await lookupNpi('1487796843');
    record(
      'P-09',
      'Malformed Payloads',
      'lookupNpi handles results: [null] without unhandled crash',
      nullInResultsLookup.verified === false,
      'verified: false',
      `verified: ${nullInResultsLookup.verified}, reason: "${nullInResultsLookup.disqualificationReason}"`
    );

    // 2.4 Direct evaluateNpiRecord(null) call
    const nullEvalRes = evaluateNpiRecord(null);
    record(
      'P-10',
      'Malformed Payloads',
      'evaluateNpiRecord(null) returns verified: false without crashing',
      nullEvalRes.verified === false && Boolean(nullEvalRes.disqualificationReason),
      'verified: false with disqualificationReason',
      `verified: ${nullEvalRes.verified}, reason: "${nullEvalRes.disqualificationReason}"`
    );

    // 2.5 Direct evaluateNpiRecord(undefined) call
    const undefEvalRes = evaluateNpiRecord(undefined);
    record(
      'P-11',
      'Malformed Payloads',
      'evaluateNpiRecord(undefined) returns verified: false without crashing',
      undefEvalRes.verified === false && Boolean(undefEvalRes.disqualificationReason),
      'verified: false with disqualificationReason',
      `verified: ${undefEvalRes.verified}, reason: "${undefEvalRes.disqualificationReason}"`
    );

    // 2.6 Corrupted basic object (basic: null)
    const corruptedBasicRecord = {
      number: '1487796843',
      enumeration_type: 'NPI-1',
      basic: null,
      taxonomies: [],
    };
    const corBasicEval = evaluateNpiRecord(corruptedBasicRecord);
    record(
      'P-12',
      'Malformed Payloads',
      'evaluateNpiRecord with basic: null handles safely',
      corBasicEval.verified === false,
      'verified: false without crash',
      `verified: ${corBasicEval.verified}, reason: "${corBasicEval.disqualificationReason}"`
    );
    console.log();

    // ========================================================================
    // SUITE 3: INDIVIDUAL VS ORGANIZATION NPI TYPES (PROBES 13-16)
    // ========================================================================
    console.log('--- Suite 3: Individual vs Organization NPI Types ---');

    // 3.1 NPI-1 Individual Solo Doctor (Positive Control)
    const npi1Doctor = {
      number: '1487796843',
      enumeration_type: 'NPI-1',
      basic: {
        first_name: 'GERALD',
        last_name: 'KAISER',
        credential: 'DDS PC',
        sole_proprietor: 'YES',
      },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalNpi1 = evaluateNpiRecord(npi1Doctor);
    record(
      'P-13',
      'NPI Entity Types',
      'Valid NPI-1 individual solo practitioner passes',
      evalNpi1.verified === true && evalNpi1.enumerationType === 'NPI-1' && evalNpi1.soleProprietor === true,
      'verified: true, enumerationType: NPI-1, soleProprietor: true',
      `verified: ${evalNpi1.verified}, enumerationType: ${evalNpi1.enumerationType}, soleProprietor: ${evalNpi1.soleProprietor}`
    );

    // 3.2 NPI-2 Corporate Organization (Must be disqualified)
    const npi2Org = {
      number: '1982736450',
      enumeration_type: 'NPI-2',
      basic: {
        organization_name: 'ClearChoice Management Services LLC',
      },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalNpi2 = evaluateNpiRecord(npi2Org);
    record(
      'P-14',
      'NPI Entity Types',
      'NPI-2 corporate organization is strictly disqualified',
      evalNpi2.verified === false && Boolean(evalNpi2.disqualificationReason?.includes('NPI-2')),
      'verified: false with NPI-2 reason',
      `verified: ${evalNpi2.verified}, reason: "${evalNpi2.disqualificationReason}"`
    );

    // 3.3 Missing enumeration_type
    const missingEnum = {
      number: '1487796843',
      basic: {
        first_name: 'John',
        last_name: 'Doe',
        credential: 'DDS',
        sole_proprietor: 'YES',
      },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalMissingEnum = evaluateNpiRecord(missingEnum);
    record(
      'P-15',
      'NPI Entity Types',
      'Missing enumeration_type is rejected',
      evalMissingEnum.verified === false,
      'verified: false',
      `verified: ${evalMissingEnum.verified}, reason: "${evalMissingEnum.disqualificationReason}"`
    );

    // 3.4 Non-standard enumeration type
    const weirdEnum = {
      number: '1487796843',
      enumeration_type: 'ORGANIZATION',
      basic: { first_name: 'John', last_name: 'Doe', credential: 'DDS' },
    };
    const evalWeirdEnum = evaluateNpiRecord(weirdEnum);
    record(
      'P-16',
      'NPI Entity Types',
      'Non-standard enumeration_type is rejected',
      evalWeirdEnum.verified === false,
      'verified: false',
      `verified: ${evalWeirdEnum.verified}`
    );
    console.log();

    // ========================================================================
    // SUITE 4: TAXONOMY CODES & CREDENTIAL ENFORCEMENT (PROBES 17-23)
    // ========================================================================
    console.log('--- Suite 4: Taxonomy Codes & Credential Cross-Check ---');

    // 4.1 Disqualified Pediatric Dentistry taxonomy (1223P0221X)
    const pediatricDoc = {
      number: '1234567890',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Jane', last_name: 'Smith', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ code: '1223P0221X', desc: 'Dentist, Pediatric Dentistry', primary: true }],
    };
    const evalPed = evaluateNpiRecord(pediatricDoc);
    record(
      'P-17',
      'Taxonomy Enforcement',
      'Pediatric dentistry taxonomy (1223P0221X) is strictly disqualified',
      evalPed.verified === false && Boolean(evalPed.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false with Disqualified taxonomy reason',
      `verified: ${evalPed.verified}, reason: "${evalPed.disqualificationReason}"`
    );

    // 4.2 Disqualified Dental Public Health taxonomy (1223D0001X)
    const publicHealthDoc = {
      number: '1234567891',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Bob', last_name: 'Jones', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ code: '1223D0001X', desc: 'Dental Public Health', primary: true }],
    };
    const evalPubHealth = evaluateNpiRecord(publicHealthDoc);
    record(
      'P-18',
      'Taxonomy Enforcement',
      'Dental Public Health taxonomy (1223D0001X) is strictly disqualified',
      evalPubHealth.verified === false && Boolean(evalPubHealth.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false with Disqualified taxonomy reason',
      `verified: ${evalPubHealth.verified}, reason: "${evalPubHealth.disqualificationReason}"`
    );

    // 4.3 Multi-taxonomy conflict: Approved Dentist + Disqualified Pediatric
    const multiTaxConflict = {
      number: '1234567892',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Alice', last_name: 'Taylor', credential: 'DMD', sole_proprietor: 'YES' },
      taxonomies: [
        { code: '122300000X', desc: 'Dentist', primary: true },
        { code: '1223P0221X', desc: 'Pediatric Dentistry', primary: false },
      ],
    };
    const evalMultiConflict = evaluateNpiRecord(multiTaxConflict);
    record(
      'P-19',
      'Taxonomy Enforcement',
      'Secondary pediatric taxonomy triggers strict disqualification',
      evalMultiConflict.verified === false && Boolean(evalMultiConflict.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false',
      `verified: ${evalMultiConflict.verified}, reason: "${evalMultiConflict.disqualificationReason}"`
    );

    // 4.4 Non-dental MD: Family Medicine (207Q00000X)
    const familyMedDoc = {
      number: '1234567893',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Charles', last_name: 'Barkley', credential: 'MD', sole_proprietor: 'YES' },
      taxonomies: [{ code: '207Q00000X', desc: 'Family Medicine', primary: true }],
    };
    const evalFamilyMed = evaluateNpiRecord(familyMedDoc);
    record(
      'P-20',
      'Taxonomy Enforcement',
      'Non-dental MD (Family Medicine 207Q00000X) is strictly disqualified',
      evalFamilyMed.verified === false && evalFamilyMed.isApprovedTaxonomy === false,
      'verified: false, isApprovedTaxonomy: false',
      `verified: ${evalFamilyMed.verified}, isApprovedTaxonomy: ${evalFamilyMed.isApprovedTaxonomy}, reason: "${evalFamilyMed.disqualificationReason}"`
    );

    // 4.5 Empty taxonomies array: must NOT fabricate "Dentist" / "122300000X"
    const emptyTaxDoc = {
      number: '1234567894',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Empty', last_name: 'Tax', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [],
    };
    const evalEmptyTax = evaluateNpiRecord(emptyTaxDoc);
    record(
      'P-21',
      'Taxonomy Enforcement',
      'Empty taxonomies array is strictly rejected (zero fabricated taxonomy)',
      evalEmptyTax.verified === false && evalEmptyTax.primaryTaxonomy === '' && evalEmptyTax.taxonomyCode === '',
      'verified: false with empty taxonomy strings',
      `verified: ${evalEmptyTax.verified}, primaryTaxonomy: "${evalEmptyTax.primaryTaxonomy}", taxonomyCode: "${evalEmptyTax.taxonomyCode}"`
    );

    // 4.6 Missing taxonomy code field in entry
    const missingCodeDoc = {
      number: '1234567895',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Dan', last_name: 'White', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ desc: 'Dentist - General Practice', primary: true }],
    };
    const evalMissingCode = evaluateNpiRecord(missingCodeDoc);
    record(
      'P-22',
      'Taxonomy Enforcement',
      'Taxonomy entry with approved description and DDS credential succeeds',
      evalMissingCode.verified === true && evalMissingCode.isDentalDoctor === true,
      'verified: true (approved dentist)',
      `verified: ${evalMissingCode.verified}`
    );

    // 4.7 Non-dental profession (Chiropractor DC)
    const chiroDoc = {
      number: '1234567896',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Carl', last_name: 'Spackler', credential: 'DC', sole_proprietor: 'YES' },
      taxonomies: [{ code: '111N00000X', desc: 'Chiropractor', primary: true }],
    };
    const evalChiro = evaluateNpiRecord(chiroDoc);
    record(
      'P-23',
      'Taxonomy Enforcement',
      'Non-dental profession (Chiropractor DC) is strictly disqualified',
      evalChiro.verified === false && evalChiro.isApprovedTaxonomy === false,
      'verified: false',
      `verified: ${evalChiro.verified}`
    );
    console.log();

    // ========================================================================
    // SUITE 5: SOLE PROPRIETOR & ASSOCIATE DOCTOR ENFORCEMENT (PROBES 24-27)
    // ========================================================================
    console.log('--- Suite 5: Sole Proprietor & Associate Doctor Enforcement ---');

    // 5.1 Sole Proprietor YES (Positive Control)
    const solePropYes = {
      number: '1487796843',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Gerald', last_name: 'Kaiser', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalSoleYes = evaluateNpiRecord(solePropYes);
    record(
      'P-24',
      'Sole Owner Enforcement',
      'Verified sole proprietor (sole_proprietor: YES) passes',
      evalSoleYes.verified === true && evalSoleYes.soleProprietor === true,
      'verified: true, soleProprietor: true',
      `verified: ${evalSoleYes.verified}, soleProprietor: ${evalSoleYes.soleProprietor}`
    );

    // 5.2 Professional Corporation (PC) owner passes
    const pcOwner = {
      number: '1487796844',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Gerald', last_name: 'Kaiser', credential: 'DDS PC', sole_proprietor: 'NO' },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalPcOwner = evaluateNpiRecord(pcOwner);
    record(
      'P-25',
      'Sole Owner Enforcement',
      'DDS PC credential identifies sole owner entity even if sole_proprietor flag is NO',
      evalPcOwner.verified === true && evalPcOwner.soleProprietor === true,
      'verified: true, soleProprietor: true',
      `verified: ${evalPcOwner.verified}, soleProprietor: ${evalPcOwner.soleProprietor}`
    );

    // 5.3 Associate Doctor (sole_proprietor: NO, plain DDS) must be disqualified in evaluateNpiRecord
    const associateDoctor = {
      number: '1487796845',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Associate', last_name: 'Dentist', credential: 'DDS', sole_proprietor: 'NO' },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalAssociate = evaluateNpiRecord(associateDoctor);
    record(
      'P-26',
      'Sole Owner Enforcement',
      'evaluateNpiRecord: Non-sole-proprietor associate doctor (sole_proprietor: NO) is disqualified',
      evalAssociate.verified === false && evalAssociate.soleProprietor === false,
      'verified: false, soleProprietor: false',
      `verified: ${evalAssociate.verified}, soleProprietor: ${evalAssociate.soleProprietor}, reason: "${evalAssociate.disqualificationReason}"`
    );

    // 5.4 Gate 6 (SOLO_DOCTOR) evaluation of non-sole proprietor
    seedNpiCache('ASSOCIATE_DENTIST_AZ', evalAssociate);
    const gate6AssociateCandidate: CandidatePractice = {
      name: 'Associate Dental Clinic',
      domain: 'associatedental.com',
      zipCode: '85260',
      doctorName: 'Dr. Associate Dentist',
      state: 'AZ',
    };
    const gate6AssociateRes = await evaluateGate('SOLO_DOCTOR', gate6AssociateCandidate);
    record(
      'P-27',
      'Sole Owner Enforcement',
      'Gate 6 (SOLO_DOCTOR): Disqualifies non-sole-proprietor associate doctor',
      gate6AssociateRes.passed === false,
      'passed: false',
      `passed: ${gate6AssociateRes.passed}, reason: "${gate6AssociateRes.failureReason}"`
    );
    console.log();

    // ========================================================================
    // SUITE 6: DAG EVALUATION & SHORT-CIRCUITING (PROBES 28-36)
    // ========================================================================
    console.log('--- Suite 6: DAG Pipeline Evaluation & Short-Circuiting ---');

    // 6.1 Gate 1 Failure stops execution early
    let npiFetchAttemptedInGate1 = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInGate1 = true;
      throw new Error('NPI API should never be called when Gate 1 fails!');
    };
    clearNpiCache();

    const nonAffluentCandidate: CandidatePractice = {
      name: 'Anytown Dental',
      domain: 'anytowndental.com',
      zipCode: '99999', // Disqualified
      mapsRank: 5,
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
      htmlContent: 'dental implants All-on-4 full arch',
    };

    const shortCircuitRes = await qualifyPractice(nonAffluentCandidate, true);
    record(
      'P-28',
      'DAG Short-Circuit',
      'Gate 1 failure terminates pipeline immediately (qualified = false, failedGate = AFFLUENT_ZIP)',
      shortCircuitRes.qualified === false && shortCircuitRes.failedGate === 'AFFLUENT_ZIP',
      'qualified: false, failedGate: AFFLUENT_ZIP',
      `qualified: ${shortCircuitRes.qualified}, failedGate: ${shortCircuitRes.failedGate}`
    );

    record(
      'P-29',
      'DAG Short-Circuit',
      'Gate 1 short-circuit skips downstream gates in gateResults',
      shortCircuitRes.gateResults['MAPS_RANK'] === undefined &&
        shortCircuitRes.gateResults['SOLO_DOCTOR'] === undefined &&
        shortCircuitRes.gateResults['PROXIMITY_COMPETITOR'] === undefined,
      'Downstream gate results undefined',
      `Evaluated gates: [${Object.keys(shortCircuitRes.gateResults).join(', ')}]`
    );

    record(
      'P-30',
      'DAG Short-Circuit',
      'Gate 1 short-circuit prevented expensive Gate 6 NPI network call',
      !npiFetchAttemptedInGate1,
      'No fetch attempted',
      npiFetchAttemptedInGate1 ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.2 Gate 2 Failure short-circuits before Gate 6
    let npiFetchAttemptedInGate2 = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInGate2 = true;
      throw new Error('NPI API should not be called when Gate 2 fails!');
    };
    clearNpiCache();

    const rank3Candidate: CandidatePractice = {
      name: 'Rank 3 Practice',
      domain: 'rank3practice.com',
      zipCode: '85260',
      mapsRank: 3, // Disqualified
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
    };
    const gate2FailRes = await qualifyPractice(rank3Candidate, true);
    record(
      'P-31',
      'DAG Short-Circuit',
      'Gate 2 failure terminates pipeline at MAPS_RANK',
      gate2FailRes.qualified === false && gate2FailRes.failedGate === 'MAPS_RANK',
      'qualified: false, failedGate: MAPS_RANK',
      `qualified: ${gate2FailRes.qualified}, failedGate: ${gate2FailRes.failedGate}`
    );

    record(
      'P-32',
      'DAG Short-Circuit',
      'Gate 2 short-circuit prevented Gate 6 NPI network call',
      !npiFetchAttemptedInGate2,
      'No fetch attempted',
      npiFetchAttemptedInGate2 ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.3 Gate 5 DSO failure short-circuiting stops before Gate 6 NPI call
    let npiFetchAttemptedInGate5 = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInGate5 = true;
      throw new Error('NPI API should not be called when Gate 5 DSO fails!');
    };
    clearNpiCache();

    const dsoCandidate: CandidatePractice = {
      name: 'ClearChoice Dental Implant Center',
      domain: 'clearchoice.com',
      zipCode: '85260',
      mapsRank: 5,
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
      htmlContent: 'dental implants full arch',
    };
    const dsoFailRes = await qualifyPractice(dsoCandidate, true);
    record(
      'P-33',
      'DAG Short-Circuit',
      'Gate 5 DSO failure terminates pipeline at DSO_FILTER',
      dsoFailRes.qualified === false && dsoFailRes.failedGate === 'DSO_FILTER',
      'qualified: false, failedGate: DSO_FILTER',
      `qualified: ${dsoFailRes.qualified}, failedGate: ${dsoFailRes.failedGate}`
    );

    record(
      'P-34',
      'DAG Short-Circuit',
      'Gate 5 DSO failure prevented Gate 6 NPI call',
      !npiFetchAttemptedInGate5,
      'No fetch attempted',
      npiFetchAttemptedInGate5 ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.4 Full DAG evaluation (stopOnFirstFailure: false) runs all gates without crashing
    globalThis.fetch = async () => ({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers(),
      json: async () => ({ error: 'Not found' }),
    } as any);
    clearNpiCache();

    const brokenCandidate: any = {
      name: 'Broken Candidate Practice',
      domain: 'broken.com',
      zipCode: '00000',
      mapsRank: 10,
      hasSponsoredAd: false,
      htmlContent: 'pediatric dentistry for kids',
      doctorName: 'Dr. NonExistentDoctor12345',
      competitor: { name: 'Far Comp', rank: 4, distanceMiles: 15.0 },
    };

    let noCrashOnFullEval = false;
    let fullEvalRes: any;
    try {
      fullEvalRes = await qualifyPractice(brokenCandidate, false);
      noCrashOnFullEval = true;
    } catch {
      noCrashOnFullEval = false;
    }
    record(
      'P-35',
      'DAG Engine',
      'Full DAG evaluation (stopOnFirstFailure: false) executes all gates gracefully without crashing',
      noCrashOnFullEval && fullEvalRes?.qualified === false && Object.keys(fullEvalRes.gateResults).length === 7,
      'All 7 gates evaluated gracefully with qualified: false',
      `All 7 gates evaluated: ${Object.keys(fullEvalRes?.gateResults || {}).length === 7}, qualified: ${fullEvalRes?.qualified}`
    );

    // 6.5 Gate 2 Boundary: mapsRank = NaN rejected
    const nanRankRes = await evaluateGate('MAPS_RANK', {
      name: 'NaN Practice',
      domain: 'nan.com',
      zipCode: '85260',
      mapsRank: NaN,
    });
    record(
      'P-36',
      'Boundary Verification',
      'Gate 2: mapsRank = NaN is strictly disqualified',
      nanRankRes.passed === false,
      'passed: false',
      `passed: ${nanRankRes.passed}, reason: "${nanRankRes.failureReason}"`
    );

    // 6.6 Gate 2 Boundary: mapsRank = 4.5 fractional rank rejected
    const floatRankRes = await evaluateGate('MAPS_RANK', {
      name: 'Float Practice',
      domain: 'float.com',
      zipCode: '85260',
      mapsRank: 4.5,
    });
    record(
      'P-37',
      'Boundary Verification',
      'Gate 2: mapsRank = 4.5 fractional rank is strictly disqualified',
      floatRankRes.passed === false,
      'passed: false',
      `passed: ${floatRankRes.passed}, reason: "${floatRankRes.failureReason}"`
    );

    // 6.7 Gate 7 Anomaly: competitor missing distanceMiles and coordinates
    const noDistanceCompRes = await evaluateGate('PROXIMITY_COMPETITOR', {
      name: 'No Distance Practice',
      domain: 'nodist.com',
      zipCode: '85260',
      competitor: {
        name: 'Competitor Without Distance',
        rank: 1,
      } as any,
    });
    record(
      'P-38',
      'Boundary Verification',
      'Gate 7: Competitor missing both distanceMiles and coordinates is disqualified',
      noDistanceCompRes.passed === false,
      'passed: false',
      `passed: ${noDistanceCompRes.passed}, reason: "${noDistanceCompRes.failureReason}"`
    );

    // 6.8 Gate 7 Anomaly: candidate has NO competitor in qualifyPractice
    const noCompPractice: CandidatePractice = {
      name: 'No Comp Practice',
      domain: 'nocomp.com',
      zipCode: '85260',
      mapsRank: 5,
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
      htmlContent: 'dental implants all on 4 full arch',
    };
    seedNpiCache('GERALD_KAISER_AZ', {
      verified: true,
      doctorName: 'Gerald Kaiser',
      npiNumber: '1487796843',
      enumerationType: 'NPI-1',
      credentials: 'DDS PC',
      isDentalDoctor: true,
      soleProprietor: true,
      primaryTaxonomy: 'Dentist',
      taxonomyCode: '122300000X',
      isApprovedTaxonomy: true,
    });
    const noCompPipelineRes = await qualifyPractice(noCompPractice, true);
    record(
      'P-39',
      'Boundary Verification',
      'qualifyPractice without competitor object fails Gate 7 (no bypass)',
      noCompPipelineRes.qualified === false && noCompPipelineRes.failedGate === 'PROXIMITY_COMPETITOR',
      'qualified: false, failedGate: PROXIMITY_COMPETITOR',
      `qualified: ${noCompPipelineRes.qualified}, failedGate: ${noCompPipelineRes.failedGate}, reason: "${noCompPipelineRes.disqualificationReason}"`
    );

    // 6.9 qualifyPractice(null) crash resilience
    let qualifyNullCrashed = false;
    let qualifyNullRes: any;
    try {
      qualifyNullRes = await qualifyPractice(null as any);
    } catch {
      qualifyNullCrashed = true;
    }
    record(
      'P-40',
      'Boundary Verification',
      'qualifyPractice(null) returns qualified: false without crashing',
      !qualifyNullCrashed && qualifyNullRes?.qualified === false,
      'qualified: false without uncaught exception',
      qualifyNullCrashed ? 'CRASHED!' : `Gracefully returned qualified: ${qualifyNullRes?.qualified}`
    );
    console.log();

    // ========================================================================
    // SUITE 7: LIVE CMS NPPES REGISTRY VERIFICATION (PROBES 41-42)
    // ========================================================================
    console.log('--- Suite 7: Live CMS NPPES Registry Verification ---');
    // Restore originalFetch for real federal network queries
    globalThis.fetch = originalFetch;
    clearNpiCache();

    // 7.1 Dr. Marvin Abarca live query rejection
    const abarceLive = await lookupNpi('1316388820');
    record(
      'P-41',
      'Live CMS NPPES',
      'Dr. Marvin Abarca (1316388820, 1223P0221X) live query is strictly disqualified',
      abarceLive.verified === false &&
        abarceLive.taxonomyCode === '1223P0221X' &&
        abarceLive.isApprovedTaxonomy === false &&
        Boolean(abarceLive.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false, taxonomy: 1223P0221X, reason includes Disqualified taxonomy',
      `verified: ${abarceLive.verified}, taxonomy: "${abarceLive.taxonomyCode}", reason: "${abarceLive.disqualificationReason}"`
    );

    // 7.2 Dr. Gerald Kaiser live query positive verification
    const kaiserLive = await lookupNpi('1487796843');
    record(
      'P-42',
      'Live CMS NPPES',
      'Dr. Gerald Kaiser (1487796843, 122300000X) live query is verified',
      kaiserLive.verified === true &&
        kaiserLive.enumerationType === 'NPI-1' &&
        kaiserLive.soleProprietor === true &&
        kaiserLive.isApprovedTaxonomy === true,
      'verified: true, NPI-1, soleProprietor: true',
      `verified: ${kaiserLive.verified}, soleProprietor: ${kaiserLive.soleProprietor}, taxonomy: "${kaiserLive.taxonomyCode}"`
    );
    console.log();

    // ========================================================================
    // SUITE 8: ADVANCED ADVERSARIAL STRESS PROBES (PROBES 43-52)
    // ========================================================================
    console.log('--- Suite 8: Advanced Adversarial Probes (MD, DSO, Medicaid, Distance) ---');

    // 8.1 Cardiology MD
    const cardioMD = evaluateNpiRecord({
      number: '1900000001',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Cardio', last_name: 'Specialist', credential: 'MD', sole_proprietor: 'YES' },
      taxonomies: [{ code: '207RC0000X', desc: 'Cardiovascular Disease', primary: true }],
    });
    record(
      'P-43',
      'Advanced Adversarial',
      'Cardiology MD (207RC0000X) is strictly disqualified from dental surgery',
      cardioMD.verified === false && cardioMD.isApprovedTaxonomy === false,
      'verified: false, isApprovedTaxonomy: false',
      `verified: ${cardioMD.verified}, reason: "${cardioMD.disqualificationReason}"`
    );

    // 8.2 Dermatology MD
    const dermMD = evaluateNpiRecord({
      number: '1900000002',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Skin', last_name: 'Doctor', credential: 'MD', sole_proprietor: 'YES' },
      taxonomies: [{ code: '207N00000X', desc: 'Dermatology', primary: true }],
    });
    record(
      'P-44',
      'Advanced Adversarial',
      'Dermatology MD (207N00000X) is strictly disqualified from dental surgery',
      dermMD.verified === false && dermMD.isApprovedTaxonomy === false,
      'verified: false, isApprovedTaxonomy: false',
      `verified: ${dermMD.verified}, reason: "${dermMD.disqualificationReason}"`
    );

    // 8.3 OMFS Dual-Degree MD (204E00000X) passes as approved oral surgeon
    const omfsMD = evaluateNpiRecord({
      number: '1900000003',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Maxillo', last_name: 'Surgeon', credential: 'MD', sole_proprietor: 'YES' },
      taxonomies: [{ code: '204E00000X', desc: 'Oral & Maxillofacial Surgery', primary: true }],
    });
    record(
      'P-45',
      'Advanced Adversarial',
      'OMFS Dual-Degree MD (204E00000X) qualifies as approved surgical doctor',
      omfsMD.verified === true && omfsMD.isDentalDoctor === true && omfsMD.isApprovedTaxonomy === true,
      'verified: true, isDentalDoctor: true, isApprovedTaxonomy: true',
      `verified: ${omfsMD.verified}, taxonomy: ${omfsMD.taxonomyCode}`
    );

    // 8.4 Gate 6 pre-check rejects "Associate Dentist" title
    const associateTitleGate6 = await evaluateGate('SOLO_DOCTOR', {
      name: 'Associate Clinic',
      domain: 'associate.com',
      zipCode: '85260',
      doctorName: 'Dr. Jane Smith',
      doctorTitle: 'Associate Dentist',
      state: 'AZ',
    });
    record(
      'P-46',
      'Advanced Adversarial',
      'Gate 6 pre-check strictly rejects doctorTitle: "Associate Dentist"',
      associateTitleGate6.passed === false && Boolean(associateTitleGate6.failureReason?.includes('Associate dentist')),
      'passed: false with Associate dentist failure reason',
      `passed: ${associateTitleGate6.passed}, reason: "${associateTitleGate6.failureReason}"`
    );

    // 8.5 Gate 7 boundary: exactly 5.0 miles passes
    const dist50Gate7 = await evaluateGate('PROXIMITY_COMPETITOR', {
      name: 'Boundary Clinic',
      domain: 'boundary.com',
      zipCode: '85260',
      competitor: { name: 'Top Rival', rank: 1, distanceMiles: 5.0 },
    });
    record(
      'P-47',
      'Advanced Adversarial',
      'Gate 7 boundary: competitor at exactly 5.0 miles passes',
      dist50Gate7.passed === true,
      'passed: true',
      `passed: ${dist50Gate7.passed}`
    );

    // 8.6 Gate 7 boundary: 5.05 miles fails (> 5.0 miles limit)
    const dist505Gate7 = await evaluateGate('PROXIMITY_COMPETITOR', {
      name: 'Exceeding Clinic',
      domain: 'exceed.com',
      zipCode: '85260',
      competitor: { name: 'Top Rival', rank: 1, distanceMiles: 5.05 },
    });
    record(
      'P-48',
      'Advanced Adversarial',
      'Gate 7 boundary: competitor at 5.05 miles strictly fails',
      dist505Gate7.passed === false && Boolean(dist505Gate7.failureReason?.includes('exceeds strict 5.0-mile')),
      'passed: false with distance exceeds reason',
      `passed: ${dist505Gate7.passed}, reason: "${dist505Gate7.failureReason}"`
    );

    // 8.7 Gate 7: competitor rank #2 fails (strictly #1 required)
    const rank2Gate7 = await evaluateGate('PROXIMITY_COMPETITOR', {
      name: 'Rank 2 Rival Clinic',
      domain: 'rank2rival.com',
      zipCode: '85260',
      competitor: { name: 'Second Rival', rank: 2, distanceMiles: 2.1 },
    });
    record(
      'P-49',
      'Advanced Adversarial',
      'Gate 7: competitor rank #2 is rejected (strictly rank #1 required)',
      rank2Gate7.passed === false && Boolean(rank2Gate7.failureReason?.includes('strictly rank #1 competitor')),
      'passed: false with rank #1 requirement reason',
      `passed: ${rank2Gate7.passed}, reason: "${rank2Gate7.failureReason}"`
    );

    // 8.8 DSO Evasion: Workday ATS subdomain embedded in practice website HTML
    const dsoWorkday = checkDsoAffiliation(
      'independentdentistry.com',
      '<div class="footer"><a href="https://heartland.myworkdayjobs.com/careers">Careers</a></div>'
    );
    record(
      'P-50',
      'Advanced Adversarial',
      'DSO Evasion: Workday ATS subdomain (heartland.myworkdayjobs.com) in HTML is detected',
      dsoWorkday.isDso === true && dsoWorkday.matchTier === 'TIER_5_CORPORATE_FOOTER_CAREERS',
      'isDso: true, matchTier: TIER_5_CORPORATE_FOOTER_CAREERS',
      `isDso: ${dsoWorkday.isDso}, matchTier: ${dsoWorkday.matchTier}`
    );

    // 8.9 Clinical Filter: Negated Medicaid mention ("does not accept Medicaid")
    const negatedMedicaid = scoreClinicalSpecialization(
      'Our boutique surgical practice provides full-arch dental implants and All-on-4 restoration. We do not accept Medicaid. 100% fee-for-service cash practice.'
    );
    record(
      'P-51',
      'Advanced Adversarial',
      'Clinical Filter: Cash practice stating "do not accept Medicaid" is NOT disqualified',
      negatedMedicaid.disqualified === false && negatedMedicaid.implantScore >= 15 && negatedMedicaid.qualified === true,
      'disqualified: false, implantScore >= 15, qualified: true',
      `disqualified: ${negatedMedicaid.disqualified}, implantScore: ${negatedMedicaid.implantScore}, qualified: ${negatedMedicaid.qualified}`
    );

    // 8.10 Zip Code Normalization: Unpadded 4-digit East Coast zip '6830' resolves to Greenwich CT 06830
    const zipNorm = normalizeZipCode('6830');
    const isAffluent4Digit = isAffluentZip('6830');
    record(
      'P-52',
      'Advanced Adversarial',
      'Zip Normalization: 4-digit zip string "6830" normalizes to "06830" and qualifies as affluent',
      zipNorm === '06830' && isAffluent4Digit === true,
      'normalized: "06830", isAffluent: true',
      `normalized: "${zipNorm}", isAffluent: ${isAffluent4Digit}`
    );
    console.log();

  } finally {
    globalThis.fetch = originalFetch;
  }

  // ========================================================================
  // HARNESS EXECUTIVE SUMMARY
  // ========================================================================
  console.log('========================================================================');
  console.log('📊 EMPIRICAL ADVERSARIAL STRESS HARNESS SUMMARY');
  console.log('========================================================================');
  const total = testRecords.length;
  const passed = testRecords.filter((r) => r.passed).length;
  const failed = testRecords.filter((r) => !r.passed).length;

  console.log(`Total Empirical Probes Executed: ${total}`);
  console.log(`Passed Validations:              ${passed}`);
  console.log(`Failed Probes:                   ${failed}`);
  console.log(`Pass Rate:                       ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🏆 VERDICT: 100% EMPIRICAL PASS — ALL 52 ADVERSARIAL PROBES VALIDATED!');
  } else {
    console.log(`🚨 DEFECT ALERT: ${failed} probe(s) failed validation.`);
  }
  console.log('========================================================================\n');

  return { total, passed, failed };
}

runEmpiricalStressHarness()
  .then((res) => {
    if (res.failed > 0) {
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Fatal crash in stress harness:', err);
    process.exit(1);
  });
