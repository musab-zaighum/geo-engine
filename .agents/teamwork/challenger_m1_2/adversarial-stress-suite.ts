/**
 * Milestone 1 Adversarial Stress Test Suite: CMS NPI Registry Verifier & DAG Engine
 *
 * Authored by: challenger_m1_2 (Empirical Challenger)
 * Working Directory: /home/pwn/geo-engine/.agents/teamwork/challenger_m1_2
 *
 * Verifies:
 * 1. CMS NPI Registry verification under network timeout, malformed payloads, entity types,
 *    missing taxonomy codes, and non-sole-proprietor entities.
 * 2. DAG evaluation short-circuiting, graceful failure modes, boundary anomalies, and crash resistance.
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

interface TestCaseResult {
  suite: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  isVulnerability?: boolean;
  notes?: string;
}

const testResults: TestCaseResult[] = [];

function recordTest(
  suite: string,
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  opts?: { isVulnerability?: boolean; notes?: string }
) {
  testResults.push({
    suite,
    name,
    passed,
    expected,
    actual,
    isVulnerability: opts?.isVulnerability,
    notes: opts?.notes,
  });

  const tag = passed ? '✅ PASS' : (opts?.isVulnerability ? '🚨 VULN' : '❌ FAIL');
  console.log(`  ${tag}: [${suite}] ${name}`);
  if (!passed) {
    console.log(`     Expected: ${expected}`);
    console.log(`     Actual:   ${actual}`);
    if (opts?.notes) console.log(`     Notes:    ${opts.notes}`);
  }
}

async function runAdversarialStressSuite() {
  console.log('========================================================================');
  console.log('⚔️  RUNNING ADVERSARIAL STRESS SUITE (challenger_m1_2)');
  console.log('========================================================================\n');

  const originalFetch = globalThis.fetch;

  try {
    // ========================================================================
    // SUITE 1: NETWORK TIMEOUT & TRANSPORT CHAOS
    // ========================================================================
    console.log('--- Suite 1: Network Timeout & Transport Chaos ---');

    // 1.1 Network Timeout in lookupNpi
    globalThis.fetch = async () => {
      return new Promise((_, reject) => {
        const err = new Error('The operation was aborted due to timeout');
        err.name = 'TimeoutError';
        setTimeout(() => reject(err), 5);
      });
    };
    clearNpiCache();
    const timeoutLookupRes = await lookupNpi('1487796843', 20);
    recordTest(
      'Suite 1',
      'lookupNpi handles timeout gracefully without throwing',
      timeoutLookupRes.verified === false && Boolean(timeoutLookupRes.disqualificationReason?.includes('timeout')),
      'verified: false with timeout reason',
      `verified: ${timeoutLookupRes.verified}, reason: "${timeoutLookupRes.disqualificationReason}"`
    );

    // 1.2 Network Timeout in verifySoloDoctor
    clearNpiCache();
    const timeoutVerifyRes = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ', undefined, undefined, 20);
    recordTest(
      'Suite 1',
      'verifySoloDoctor handles timeout gracefully without throwing',
      timeoutVerifyRes.verified === false && Boolean(timeoutVerifyRes.disqualificationReason?.includes('timeout')),
      'verified: false with timeout reason',
      `verified: ${timeoutVerifyRes.verified}, reason: "${timeoutVerifyRes.disqualificationReason}"`
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
    recordTest(
      'Suite 1',
      'lookupNpi handles HTTP 500 without crashing',
      http500Res.verified === false && Boolean(http500Res.disqualificationReason?.includes('500')),
      'verified: false with HTTP 500 error',
      `verified: ${http500Res.verified}, reason: "${http500Res.disqualificationReason}"`
    );

    // 1.4 HTTP 503 Service Unavailable in verifySoloDoctor
    globalThis.fetch = async () => ({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers(),
      json: async () => ({ error: 'CMS NPPES under maintenance' }),
    } as any);
    clearNpiCache();
    const http503Res = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ');
    recordTest(
      'Suite 1',
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
    recordTest(
      'Suite 1',
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
    const econnrefusedRes = await verifySoloDoctor('Dr. Gerald Kaiser', 'AZ');
    recordTest(
      'Suite 1',
      'verifySoloDoctor handles ECONNREFUSED network failure',
      econnrefusedRes.verified === false && Boolean(econnrefusedRes.disqualificationReason?.includes('ECONNREFUSED')),
      'verified: false with ECONNREFUSED error',
      `verified: ${econnrefusedRes.verified}, reason: "${econnrefusedRes.disqualificationReason}"`
    );
    console.log();

    // ========================================================================
    // SUITE 2: MALFORMED & CORRUPTED RESPONSES
    // ========================================================================
    console.log('--- Suite 2: Malformed & Corrupted Response Payloads ---');

    // 2.1 Non-JSON HTML response (e.g. Cloudflare / WAF block)
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
    recordTest(
      'Suite 2',
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
    recordTest(
      'Suite 2',
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
    recordTest(
      'Suite 2',
      'lookupNpi handles results: [null] without unhandled crash',
      nullInResultsLookup.verified === false,
      'verified: false',
      `verified: ${nullInResultsLookup.verified}, reason: "${nullInResultsLookup.disqualificationReason}"`
    );

    // 2.4 Direct evaluateNpiRecord(null) call (Vulnerability Check)
    let nullEvalCrashed = false;
    try {
      evaluateNpiRecord(null);
    } catch (e: any) {
      nullEvalCrashed = true;
    }
    recordTest(
      'Suite 2',
      'evaluateNpiRecord(null) robustness',
      !nullEvalCrashed,
      'Should return verified: false without crashing',
      nullEvalCrashed ? 'CRASHED with TypeError: Cannot read properties of null' : 'Handled gracefully',
      {
        isVulnerability: true,
        notes: 'evaluateNpiRecord(null) throws uncaught TypeError because raw.enumeration_type lacks null guard',
      }
    );

    // 2.5 Direct evaluateNpiRecord(undefined) call (Vulnerability Check)
    let undefEvalCrashed = false;
    try {
      evaluateNpiRecord(undefined);
    } catch (e: any) {
      undefEvalCrashed = true;
    }
    recordTest(
      'Suite 2',
      'evaluateNpiRecord(undefined) robustness',
      !undefEvalCrashed,
      'Should return verified: false without crashing',
      undefEvalCrashed ? 'CRASHED with TypeError: Cannot read properties of undefined' : 'Handled gracefully',
      {
        isVulnerability: true,
        notes: 'evaluateNpiRecord(undefined) throws uncaught TypeError',
      }
    );

    // 2.6 Corrupted basic object (basic: null)
    const corruptedBasicRecord = {
      number: '1487796843',
      enumeration_type: 'NPI-1',
      basic: null,
      taxonomies: [],
    };
    const corBasicEval = evaluateNpiRecord(corruptedBasicRecord);
    recordTest(
      'Suite 2',
      'evaluateNpiRecord with basic: null',
      corBasicEval.verified === false,
      'verified: false without crash',
      `verified: ${corBasicEval.verified}, reason: "${corBasicEval.disqualificationReason}"`
    );
    console.log();

    // ========================================================================
    // SUITE 3: INDIVIDUAL VS ORGANIZATION NPI TYPES
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
    recordTest(
      'Suite 3',
      'Valid NPI-1 individual practitioner passes',
      evalNpi1.verified === true && evalNpi1.enumerationType === 'NPI-1',
      'verified: true, enumerationType: NPI-1',
      `verified: ${evalNpi1.verified}, enumerationType: ${evalNpi1.enumerationType}`
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
    recordTest(
      'Suite 3',
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
    recordTest(
      'Suite 3',
      'Missing enumeration_type is rejected',
      evalMissingEnum.verified === false,
      'verified: false',
      `verified: ${evalMissingEnum.verified}, reason: "${evalMissingEnum.disqualificationReason}"`
    );

    // 3.4 Non-standard enumeration type (e.g. "NPI-3", "ORGANIZATION")
    const weirdEnum = {
      number: '1487796843',
      enumeration_type: 'ORGANIZATION',
      basic: { first_name: 'John', last_name: 'Doe', credential: 'DDS' },
    };
    const evalWeirdEnum = evaluateNpiRecord(weirdEnum);
    recordTest(
      'Suite 3',
      'Non-standard enumeration_type is rejected',
      evalWeirdEnum.verified === false,
      'verified: false',
      `verified: ${evalWeirdEnum.verified}`
    );
    console.log();

    // ========================================================================
    // SUITE 4: TAXONOMY CODES & CREDENTIAL CROSS-CHECK
    // ========================================================================
    console.log('--- Suite 4: Taxonomy Codes & Credential Cross-Check ---');

    // 4.1 Disqualified Pediatric Dentistry taxonomy
    const pediatricDoc = {
      number: '1234567890',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Jane', last_name: 'Smith', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ code: '1223P0106X', desc: 'Pediatric Dentistry', primary: true }],
    };
    const evalPed = evaluateNpiRecord(pediatricDoc);
    recordTest(
      'Suite 4',
      'Pediatric dentistry taxonomy (1223P0106X) is strictly disqualified',
      evalPed.verified === false && Boolean(evalPed.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false',
      `verified: ${evalPed.verified}, reason: "${evalPed.disqualificationReason}"`
    );

    // 4.2 Disqualified Dental Public Health taxonomy
    const publicHealthDoc = {
      number: '1234567891',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Bob', last_name: 'Jones', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ code: '1223D0001X', desc: 'Dental Public Health', primary: true }],
    };
    const evalPubHealth = evaluateNpiRecord(publicHealthDoc);
    recordTest(
      'Suite 4',
      'Dental Public Health taxonomy (1223D0001X) is strictly disqualified',
      evalPubHealth.verified === false && Boolean(evalPubHealth.disqualificationReason?.includes('Disqualified taxonomy')),
      'verified: false',
      `verified: ${evalPubHealth.verified}, reason: "${evalPubHealth.disqualificationReason}"`
    );

    // 4.3 Multi-taxonomy conflict: Approved Dentist + Disqualified Pediatric
    const multiTaxConflict = {
      number: '1234567892',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Alice', last_name: 'Taylor', credential: 'DMD', sole_proprietor: 'YES' },
      taxonomies: [
        { code: '122300000X', desc: 'Dentist', primary: true },
        { code: '1223P0106X', desc: 'Pediatric Dentistry', primary: false },
      ],
    };
    const evalMultiConflict = evaluateNpiRecord(multiTaxConflict);
    recordTest(
      'Suite 4',
      'Secondary pediatric taxonomy triggers disqualification',
      evalMultiConflict.verified === false,
      'verified: false',
      `verified: ${evalMultiConflict.verified}, reason: "${evalMultiConflict.disqualificationReason}"`
    );

    // 4.4 CRITICAL VULNERABILITY: Non-dental MD (Family Medicine / Psychiatry / Derm)
    // An MD specializing in non-dental field should NOT qualify as dental implant surgeon!
    const familyMedDoc = {
      number: '1234567893',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Charles', last_name: 'Barkley', credential: 'MD', sole_proprietor: 'YES' },
      taxonomies: [{ code: '207Q00000X', desc: 'Family Medicine', primary: true }],
    };
    const evalFamilyMed = evaluateNpiRecord(familyMedDoc);
    const familyMedShouldBeRejected = evalFamilyMed.verified === false;
    recordTest(
      'Suite 4',
      'Non-dental MD (Family Medicine 207Q00000X) must NOT qualify as dental surgeon',
      familyMedShouldBeRejected,
      'verified: false (lacks dental taxonomy)',
      `verified: ${evalFamilyMed.verified}, isApprovedTaxonomy: ${evalFamilyMed.isApprovedTaxonomy}`,
      {
        isVulnerability: true,
        notes:
          'CRITICAL BUG: passesCredentials uses isDental || isApprovedTaxonomy. Credential "MD" causes isDental=true, erroneously verifying non-dental MDs as approved dental implant doctors with isApprovedTaxonomy=true.',
      }
    );

    // 4.5 Empty taxonomies array: does it fabricate primaryTaxonomy = 'Dentist'?
    const emptyTaxDoc = {
      number: '1234567894',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Empty', last_name: 'Tax', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [],
    };
    const evalEmptyTax = evaluateNpiRecord(emptyTaxDoc);
    const doesNotFabricateTaxonomy = evalEmptyTax.taxonomyCode === '' && evalEmptyTax.primaryTaxonomy === '';
    recordTest(
      'Suite 4',
      'Empty taxonomies array must NOT fabricate default Dentist taxonomy',
      doesNotFabricateTaxonomy,
      'taxonomyCode should remain empty when missing in registry',
      `primaryTaxonomy: "${evalEmptyTax.primaryTaxonomy}", taxonomyCode: "${evalEmptyTax.taxonomyCode}", isApprovedTaxonomy: ${evalEmptyTax.isApprovedTaxonomy}`,
      {
        isVulnerability: true,
        notes:
          'DEFECT: evaluateNpiRecord fabricates "Dentist" and "122300000X" when taxonomies array is completely empty.',
      }
    );

    // 4.6 Missing taxonomy code field in taxonomy entry
    const missingCodeDoc = {
      number: '1234567895',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Dan', last_name: 'White', credential: 'DDS', sole_proprietor: 'YES' },
      taxonomies: [{ desc: 'Some Uncoded Specialty', primary: true }],
    };
    const evalMissingCode = evaluateNpiRecord(missingCodeDoc);
    recordTest(
      'Suite 4',
      'Taxonomy entry missing code field handling',
      evalMissingCode.verified === true, // passes on DDS credential
      'verified: true (passes on DDS credential)',
      `verified: ${evalMissingCode.verified}, code: "${evalMissingCode.taxonomyCode}"`
    );

    // 4.7 Non-dental profession (Chiropractor DC)
    const chiroDoc = {
      number: '1234567896',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Carl', last_name: 'Spackler', credential: 'DC', sole_proprietor: 'YES' },
      taxonomies: [{ code: '111N00000X', desc: 'Chiropractor', primary: true }],
    };
    const evalChiro = evaluateNpiRecord(chiroDoc);
    recordTest(
      'Suite 4',
      'Non-dental profession (Chiropractor DC) is disqualified',
      evalChiro.verified === false,
      'verified: false',
      `verified: ${evalChiro.verified}`
    );
    console.log();

    // ========================================================================
    // SUITE 5: SOLE PROPRIETOR & ASSOCIATE DOCTOR ENFORCEMENT
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
    recordTest(
      'Suite 5',
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
    recordTest(
      'Suite 5',
      'DDS PC credential identifies sole owner entity',
      evalPcOwner.verified === true && evalPcOwner.soleProprietor === true,
      'verified: true, soleProprietor: true',
      `verified: ${evalPcOwner.verified}, soleProprietor: ${evalPcOwner.soleProprietor}`
    );

    // 5.3 CRITICAL VULNERABILITY: Non-Sole-Proprietor Associate Doctor
    // (sole_proprietor: "NO", plain DDS credential, no PC/PLLC)
    // Requirement R2 states: "Decision Maker: Must be a solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Disqualify associate dentists, hygienists, or clinic managers."
    const associateDoctor = {
      number: '1487796845',
      enumeration_type: 'NPI-1',
      basic: { first_name: 'Associate', last_name: 'Dentist', credential: 'DDS', sole_proprietor: 'NO' },
      taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
    };
    const evalAssociate = evaluateNpiRecord(associateDoctor);
    const associateRejectedInRecord = evalAssociate.verified === false;
    recordTest(
      'Suite 5',
      'evaluateNpiRecord: Non-sole-proprietor associate doctor (sole_proprietor: NO) must NOT be verified',
      associateRejectedInRecord,
      'verified: false (must disqualify non-sole proprietor)',
      `verified: ${evalAssociate.verified}, soleProprietor: ${evalAssociate.soleProprietor}`,
      {
        isVulnerability: true,
        notes:
          'CRITICAL DEFECT: evaluateNpiRecord marks verified: true despite soleProprietor: false. Non-sole proprietors pass verification!',
      }
    );

    // 5.4 CRITICAL VULNERABILITY: Gate 6 (SOLO_DOCTOR) evaluation of non-sole proprietor
    seedNpiCache('ASSOCIATE_DENTIST_AZ', evalAssociate);
    const gate6Candidate: CandidatePractice = {
      name: 'Associate Dental Clinic',
      domain: 'associatedental.com',
      zipCode: '85260',
      doctorName: 'Dr. Associate Dentist',
      state: 'AZ',
    };
    const gate6Res = await evaluateGate('SOLO_DOCTOR', gate6Candidate);
    const gate6DisqualifiedAssociate = gate6Res.passed === false;
    recordTest(
      'Suite 5',
      'Gate 6 (SOLO_DOCTOR): Must disqualify non-sole-proprietor associate doctor',
      gate6DisqualifiedAssociate,
      'passed: false (disqualified as associate/non-owner)',
      `passed: ${gate6Res.passed}, details.soleProprietor: ${gate6Res.details?.soleProprietor}`,
      {
        isVulnerability: true,
        notes:
          'CRITICAL DEFECT: evaluateGate("SOLO_DOCTOR") only checks if (!result.verified). It NEVER checks result.soleProprietor! An associate dentist passes Gate 6!',
      }
    );
    console.log();

    // ========================================================================
    // SUITE 6: DAG EVALUATION & SHORT-CIRCUITING
    // ========================================================================
    console.log('--- Suite 6: DAG Pipeline Evaluation & Short-Circuiting ---');

    // 6.1 Gate 1 Failure stops execution early
    let npiFetchAttemptedInShortCircuit = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInShortCircuit = true;
      throw new Error('NPI API should never be called when Gate 1 fails!');
    };
    clearNpiCache();

    const nonAffluentCandidate: CandidatePractice = {
      name: 'Anytown Dental',
      domain: 'anytowndental.com',
      zipCode: '99999', // Disqualified: not in high-wealth catalog
      mapsRank: 5,
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
      htmlContent: 'dental implants All-on-4 full arch',
    };

    const shortCircuitRes = await qualifyPractice(nonAffluentCandidate, true);
    recordTest(
      'Suite 6',
      'Gate 1 failure terminates pipeline immediately (overallQualified = false)',
      shortCircuitRes.qualified === false && shortCircuitRes.failedGate === 'AFFLUENT_ZIP',
      'qualified: false, failedGate: AFFLUENT_ZIP',
      `qualified: ${shortCircuitRes.qualified}, failedGate: ${shortCircuitRes.failedGate}`
    );

    recordTest(
      'Suite 6',
      'Gate 1 short-circuit skips Gate 2 through Gate 7 in gateResults',
      shortCircuitRes.gateResults['MAPS_RANK'] === undefined &&
        shortCircuitRes.gateResults['SOLO_DOCTOR'] === undefined &&
        shortCircuitRes.gateResults['PROXIMITY_COMPETITOR'] === undefined,
      'Downstream gate results undefined',
      `Evaluated gates: [${Object.keys(shortCircuitRes.gateResults).join(', ')}]`
    );

    recordTest(
      'Suite 6',
      'Gate 1 short-circuit prevented expensive Gate 6 NPI network call',
      !npiFetchAttemptedInShortCircuit,
      'No fetch attempted',
      npiFetchAttemptedInShortCircuit ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.2 Mid-pipeline short-circuiting: Gate 2 failure stops before Gate 6 NPI call
    let npiFetchAttemptedInGate2Fail = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInGate2Fail = true;
      throw new Error('NPI API should not be called when Gate 2 fails!');
    };
    clearNpiCache();

    const rank3Candidate: CandidatePractice = {
      name: 'Rank 3 Practice',
      domain: 'rank3practice.com',
      zipCode: '85260',
      mapsRank: 3, // Disqualified: rank 3 is already in 3-pack
      hasSponsoredAd: true,
      doctorName: 'Dr. Gerald Kaiser',
      state: 'AZ',
    };
    const gate2FailRes = await qualifyPractice(rank3Candidate, true);
    recordTest(
      'Suite 6',
      'Gate 2 failure terminates pipeline at MAPS_RANK',
      gate2FailRes.qualified === false && gate2FailRes.failedGate === 'MAPS_RANK',
      'qualified: false, failedGate: MAPS_RANK',
      `qualified: ${gate2FailRes.qualified}, failedGate: ${gate2FailRes.failedGate}`
    );
    recordTest(
      'Suite 6',
      'Gate 2 short-circuit prevented Gate 6 NPI network call',
      !npiFetchAttemptedInGate2Fail,
      'No fetch attempted',
      npiFetchAttemptedInGate2Fail ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.3 Gate 5 DSO failure short-circuiting stops before Gate 6 NPI call
    let npiFetchAttemptedInDsoFail = false;
    globalThis.fetch = async () => {
      npiFetchAttemptedInDsoFail = true;
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
    recordTest(
      'Suite 6',
      'Gate 5 DSO failure terminates pipeline at DSO_FILTER',
      dsoFailRes.qualified === false && dsoFailRes.failedGate === 'DSO_FILTER',
      'qualified: false, failedGate: DSO_FILTER',
      `qualified: ${dsoFailRes.qualified}, failedGate: ${dsoFailRes.failedGate}`
    );
    recordTest(
      'Suite 6',
      'Gate 5 DSO failure prevented Gate 6 NPI call',
      !npiFetchAttemptedInDsoFail,
      'No fetch attempted',
      npiFetchAttemptedInDsoFail ? 'Fetch WAS attempted!' : 'No fetch attempted'
    );

    // 6.4 Full DAG evaluation (stopOnFirstFailure: false) fails gracefully without crashing
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
      zipCode: '00000', // Gate 1 fails
      mapsRank: 10,     // Gate 2 fails
      hasSponsoredAd: false, // Gate 3 fails
      htmlContent: 'pediatric dentistry for kids', // Gate 4 fails
      doctorName: 'Dr. NonExistentDoctor12345',   // Gate 6 fails
      competitor: { name: 'Far Comp', rank: 4, distanceMiles: 15.0 }, // Gate 7 fails
    };

    let noCrashOnFullEval = false;
    let fullEvalRes: any;
    try {
      fullEvalRes = await qualifyPractice(brokenCandidate, false);
      noCrashOnFullEval = true;
    } catch (err: any) {
      noCrashOnFullEval = false;
    }
    recordTest(
      'Suite 6',
      'Full DAG evaluation (stopOnFirstFailure: false) runs all gates without crashing',
      noCrashOnFullEval && fullEvalRes?.qualified === false,
      'Graceful completion with qualified: false',
      noCrashOnFullEval ? `All 7 gates evaluated gracefully, qualified: ${fullEvalRes?.qualified}` : 'CRASHED!'
    );

    // 6.5 Gate 2 Boundary Anomaly: mapsRank = NaN (Vulnerability Check)
    const nanRankRes = await evaluateGate('MAPS_RANK', {
      name: 'NaN Practice',
      domain: 'nan.com',
      zipCode: '85260',
      mapsRank: NaN,
    });
    const nanRankDisqualified = nanRankRes.passed === false;
    recordTest(
      'Suite 6',
      'Gate 2: mapsRank = NaN must be disqualified',
      nanRankDisqualified,
      'passed: false',
      `passed: ${nanRankRes.passed}`,
      {
        isVulnerability: true,
        notes: 'DEFECT: evaluateGate("MAPS_RANK") returns passed: true for NaN because NaN < 4 is false and NaN > 6 is false!',
      }
    );

    // 6.6 Gate 2 Boundary Anomaly: mapsRank = 4.5 (Fractional rank)
    const floatRankRes = await evaluateGate('MAPS_RANK', {
      name: 'Float Practice',
      domain: 'float.com',
      zipCode: '85260',
      mapsRank: 4.5,
    });
    recordTest(
      'Suite 6',
      'Gate 2: mapsRank = 4.5 float behavior check',
      floatRankRes.passed === true, // Currently passes because 4.5 >= 4 and <= 6
      'passed: true (float is between 4 and 6)',
      `passed: ${floatRankRes.passed}`,
      {
        notes: 'mapsRank allows non-integer 4.5 because it only checks < 4 and > 6.',
      }
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
    const noDistRejected = noDistanceCompRes.passed === false;
    recordTest(
      'Suite 6',
      'Gate 7: Competitor missing both distanceMiles and coordinates must be disqualified',
      noDistRejected,
      'passed: false (cannot verify 5-mile proximity requirement)',
      `passed: ${noDistanceCompRes.passed}`,
      {
        isVulnerability: true,
        notes:
          'DEFECT: Gate 7 returns passed: true when competitor has rank: 1 but lacks distanceMiles and coordinates, bypassing the 5.0-mile limit.',
      }
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
    // Seed NPI so Gate 6 passes
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
    recordTest(
      'Suite 6',
      'qualifyPractice without competitor object: Gate 7 is skipped and marked passed',
      noCompPipelineRes.gateResults['PROXIMITY_COMPETITOR']?.passed === true,
      'gateResults[PROXIMITY_COMPETITOR].passed: true (skipped)',
      `passed: ${noCompPipelineRes.gateResults['PROXIMITY_COMPETITOR']?.passed}, reason: "${(noCompPipelineRes.gateResults['PROXIMITY_COMPETITOR']?.details as any)?.reason}"`,
      {
        notes:
          'In qualifyPractice, lines 299-307 skip Gate 7 if candidate.competitor is missing, allowing practices without competitors to qualify in M1.',
      }
    );

    // 6.9 qualifyPractice(null) crash vulnerability
    let qualifyNullCrashed = false;
    try {
      await qualifyPractice(null as any);
    } catch (e: any) {
      qualifyNullCrashed = true;
    }
    recordTest(
      'Suite 6',
      'qualifyPractice(null) crash resilience',
      !qualifyNullCrashed,
      'Should return gracefully or reject with informative error',
      qualifyNullCrashed ? 'CRASHED with TypeError: Cannot read properties of null' : 'Handled gracefully',
      {
        isVulnerability: true,
        notes: 'qualifyPractice(null) crashes immediately at line 296 trying to access candidate.zipCode.',
      }
    );
    console.log();

  } finally {
    globalThis.fetch = originalFetch;
  }

  // ========================================================================
  // SUMMARY REPORT
  // ========================================================================
  console.log('========================================================================');
  console.log('📊 ADVERSARIAL STRESS TEST SUMMARY');
  console.log('========================================================================');
  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  const vulns = testResults.filter((r) => !r.passed && r.isVulnerability).length;

  console.log(`Total Adversarial Probes: ${total}`);
  console.log(`Passed Validations:       ${passed}`);
  console.log(`Failed / Defect Findings: ${failed}`);
  console.log(`Identified Vulnerabilities: ${vulns}\n`);

  if (vulns > 0) {
    console.log('🚨 VULNERABILITIES & DEFECTS DISCOVERED:');
    testResults
      .filter((r) => !r.passed && r.isVulnerability)
      .forEach((r, idx) => {
        console.log(`  ${idx + 1}. [${r.suite}] ${r.name}`);
        console.log(`     Impact: ${r.notes || 'See test details'}`);
      });
  }
  console.log('========================================================================\n');
}

runAdversarialStressSuite().catch((err) => {
  console.error('Fatal unhandled error in adversarial stress suite:', err);
  process.exit(1);
});
