/**
 * Adversarial Test Harness for Milestone 1 (Qualification Engine)
 *
 * Authored by: challenger_m1_1 (Critic & Specialist)
 * Focus: Empirical stress-testing of edge cases, evasion vectors, and assumption boundaries.
 */

import {
  isAffluentZip,
  normalizeZipCode,
  getAffluentZipInfo,
} from '../../../src/lib/qualification/affluent-zips';
import {
  checkDsoAffiliation,
  isBlacklistedDomain,
  normalizeDomain,
  matchesDsoLegalDisclaimer,
  matchesCorporateCareers,
} from '../../../src/lib/qualification/dso-filter';
import {
  scoreClinicalSpecialization,
  detectMedicaidSignals,
  detectPediatricSignals,
  detectRoutineOnlySignals,
  calculateImplantDensity,
} from '../../../src/lib/qualification/clinical-filter';
import {
  parseDoctorName,
  isDentalCredential,
  isValidDentalTaxonomy,
  evaluateNpiRecord,
} from '../../../src/lib/qualification/npi-verifier';
import {
  evaluateGate,
  qualifyPractice,
  calculateHaversineMiles,
} from '../../../src/lib/qualification/index';
import { CandidatePractice } from '../../../src/lib/qualification/types';

interface TestCaseResult {
  category: string;
  testName: string;
  input: any;
  observed: any;
  expected: any;
  passed: boolean;
  notes: string;
}

const results: TestCaseResult[] = [];

function record(
  category: string,
  testName: string,
  input: any,
  observed: any,
  expected: any,
  passed: boolean,
  notes: string
) {
  results.push({ category, testName, input, observed, expected, passed, notes });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${category}] ${testName}`);
  if (!passed) {
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Observed: ${JSON.stringify(observed)}`);
    console.log(`   Notes: ${notes}`);
  }
}

async function runAdversarialTests() {
  console.log('================================================================');
  console.log('🔥 STARTING EMPIRICAL ADVERSARIAL STRESS-TEST HARNESS (M1)');
  console.log('================================================================\n');

  // ===========================================================================
  // CATEGORY 1: DSO EVASION ATTEMPTS
  // ===========================================================================
  console.log('--- CATEGORY 1: DSO EVASION ATTEMPTS ---');

  // 1.1 Casing variation in domain
  const d1 = checkDsoAffiliation('CLEARCHOICE.COM');
  record(
    'DSO Evasion',
    'Domain uppercase: CLEARCHOICE.COM',
    'CLEARCHOICE.COM',
    d1.isDso,
    true,
    d1.isDso === true,
    'Uppercase domain should be caught by blacklist'
  );

  // 1.2 URL casing with scheme
  const d2 = checkDsoAffiliation('https://WWW.HEARTLAND.COM/locations');
  record(
    'DSO Evasion',
    'URL scheme & path casing: https://WWW.HEARTLAND.COM/locations',
    'https://WWW.HEARTLAND.COM/locations',
    d2.isDso,
    true,
    d2.isDso === true,
    'Normalize domain should strip https://, www., and paths'
  );

  // 1.3 Subtle name change: "Clear Choice Implant Center" on independent domain
  // ClearChoice keyword is 'clearchoice' and 'clear choice dental'
  const d3 = checkDsoAffiliation('scottsdaleimplants.com', '', 'Clear Choice Implant Center');
  record(
    'DSO Evasion',
    'Subtle name variation: "Clear Choice Implant Center" on unlisted domain',
    'Clear Choice Implant Center',
    d3.isDso,
    true,
    d3.isDso === true,
    d3.isDso ? 'Detected' : 'VULNERABILITY: ClearChoice keywords missed "Clear Choice Implant Center"'
  );

  // 1.4 Subtle name change: "Pacific Dental" (omits "Services")
  const d4 = checkDsoAffiliation('pacificimplantcare.com', '', 'Pacific Dental');
  record(
    'DSO Evasion',
    'Subtle name variation: "Pacific Dental" (without "Services")',
    'Pacific Dental',
    d4.isDso,
    true,
    d4.isDso === true,
    d4.isDso ? 'Detected' : 'VULNERABILITY: Misses "Pacific Dental" without "Services"'
  );

  // 1.5 Obfuscated URL: Trailing FQDN dot "clearchoice.com."
  const d5 = checkDsoAffiliation('clearchoice.com.');
  record(
    'DSO Evasion',
    'Obfuscated URL: Trailing FQDN dot "clearchoice.com."',
    'clearchoice.com.',
    d5.isDso,
    true,
    d5.isDso === true,
    d5.isDso ? 'Detected' : 'VULNERABILITY: normalizeDomain fails to strip trailing DNS dot'
  );

  // 1.6 Obfuscated URL: Basic auth URL format "http://user:pass@clearchoice.com"
  const d6 = checkDsoAffiliation('http://user:pass@clearchoice.com');
  record(
    'DSO Evasion',
    'Obfuscated URL: Basic auth "http://user:pass@clearchoice.com"',
    'http://user:pass@clearchoice.com',
    d6.isDso,
    true,
    d6.isDso === true,
    d6.isDso ? 'Detected' : 'VULNERABILITY: normalizeDomain truncates at colon before removing auth'
  );

  // 1.7 Obfuscated URL: Port in domain "clearchoice.com:8443"
  const d7 = checkDsoAffiliation('clearchoice.com:8443');
  record(
    'DSO Evasion',
    'URL with port: clearchoice.com:8443',
    'clearchoice.com:8443',
    d7.isDso,
    true,
    d7.isDso === true,
    'Domain with port correctly stripped'
  );

  // 1.8 HTML tag insertion inside legal disclaimer:
  // "Supported by <strong>Heartland Dental</strong>"
  const htmlDisclaimerWithTag = '<p>Dental services supported by <strong>Heartland Dental</strong>, LLC.</p>';
  const d8 = checkDsoAffiliation('localpractice.com', htmlDisclaimerWithTag, 'Local Practice');
  record(
    'DSO Evasion',
    'HTML tag injection inside legal disclaimer: "supported by <strong>Heartland Dental</strong>"',
    htmlDisclaimerWithTag,
    d8.isDso,
    true,
    d8.isDso === true,
    d8.isDso ? 'Detected' : 'VULNERABILITY: Regex fails when HTML tags interrupt text'
  );

  // 1.9 HTML anchor tag inside legal disclaimer:
  // "Supported by <a href="...">MB2 Dental</a>"
  const htmlDisclaimerAnchor = '<footer>Supported by <a href="https://mb2dental.com">MB2 Dental</a></footer>';
  const d9 = checkDsoAffiliation('localpractice.com', htmlDisclaimerAnchor, 'Local Practice');
  record(
    'DSO Evasion',
    'HTML link inside legal disclaimer: "Supported by <a href="...">MB2 Dental</a>"',
    htmlDisclaimerAnchor,
    d9.isDso,
    true,
    d9.isDso === true,
    d9.isDso ? 'Detected' : 'VULNERABILITY: Disclaimer check does not strip HTML tags before regex'
  );

  // 1.10 Greenhouse embedded job board:
  // "boards.greenhouse.io/embed/job_board?for=heartland"
  const htmlGreenhouseEmbed = '<div><iframe src="https://boards.greenhouse.io/embed/job_board?for=heartland"></iframe></div>';
  const d10 = checkDsoAffiliation('localpractice.com', htmlGreenhouseEmbed, 'Local Practice');
  record(
    'DSO Evasion',
    'Greenhouse embedded ATS URL: boards.greenhouse.io/embed/job_board?for=heartland',
    htmlGreenhouseEmbed,
    d10.isDso,
    true,
    d10.isDso === true,
    d10.isDso ? 'Detected' : 'VULNERABILITY: ATS regex misses Greenhouse embed query parameter format'
  );

  // ===========================================================================
  // CATEGORY 2: DOCTOR VERIFICATION EDGE CASES
  // ===========================================================================
  console.log('\n--- CATEGORY 2: DOCTOR VERIFICATION EDGE CASES ---');

  // 2.1 Associate dentist with sole_proprietor === "NO"
  // Requirement R2: "Decision Maker: Must be a solo owner, founder, or principal dentist/surgeon (DDS, DMD, MD). Disqualify associate dentists..."
  const associateNpiRaw = {
    enumeration_type: 'NPI-1',
    number: '1234567890',
    basic: {
      first_name: 'David',
      last_name: 'Associate',
      credential: 'DDS',
      sole_proprietor: 'NO', // EXPLICITLY NOT A SOLE PROPRIETOR
    },
    taxonomies: [
      {
        code: '122300000X',
        desc: 'Dentist',
        primary: true,
      },
    ],
  };
  const docEval1 = evaluateNpiRecord(associateNpiRaw);
  record(
    'Doctor Verification',
    'Associate dentist with sole_proprietor: "NO" should be rejected from solo owner gate',
    associateNpiRaw,
    { verified: docEval1.verified, soleProprietor: docEval1.soleProprietor },
    { verified: false, soleProprietor: false },
    docEval1.verified === false, // Should be rejected if Gate 6 enforces solo owner!
    docEval1.verified ? 'VULNERABILITY: evaluateNpiRecord returns verified: true for associate dentists (sole_proprietor: NO)!' : 'Rejected'
  );

  // 2.2 Gate 6 evaluation with associate dentist
  const candidateAssociate: CandidatePractice = {
    name: 'Premier Implants',
    domain: 'premierimplants.com',
    zipCode: '85260',
    doctorName: 'Dr. David Associate, DDS',
  };
  // Mock NPI result directly to test Gate 6 logic
  const gate6Eval = await evaluateGate('SOLO_DOCTOR', candidateAssociate);
  // (Note: verifySoloDoctor will query CMS NPPES unless seeded or mocked)

  // 2.3 Non-dental Medical Doctor (MD) - Pediatrician (Taxonomy 208000000X)
  const pediatricianMdRaw = {
    enumeration_type: 'NPI-1',
    number: '1987654321',
    basic: {
      first_name: 'Emily',
      last_name: 'Pediatrics',
      credential: 'MD',
      sole_proprietor: 'YES',
    },
    taxonomies: [
      {
        code: '208000000X',
        desc: 'Pediatrics (Medical)',
        primary: true,
      },
    ],
  };
  const docEvalMd = evaluateNpiRecord(pediatricianMdRaw);
  record(
    'Doctor Verification',
    'Medical Doctor (MD) Pediatrician should NOT pass as verified dental doctor',
    pediatricianMdRaw,
    { verified: docEvalMd.verified, isDentalDoctor: docEvalMd.isDentalDoctor, isApprovedTaxonomy: docEvalMd.isApprovedTaxonomy },
    { verified: false, isDentalDoctor: false },
    docEvalMd.verified === false,
    docEvalMd.verified ? 'VULNERABILITY: Non-dental MD (Pediatrician) passes as dental doctor because MD matches DENTAL_CREDENTIAL_REGEX!' : 'Rejected'
  );

  // 2.4 Non-dental Medical Doctor (MD) - Cardiologist (Taxonomy 207RC0000X)
  const cardiologistMdRaw = {
    enumeration_type: 'NPI-1',
    number: '1122334455',
    basic: {
      first_name: 'Robert',
      last_name: 'Heart',
      credential: 'MD',
      sole_proprietor: 'YES',
    },
    taxonomies: [
      {
        code: '207RC0000X',
        desc: 'Cardiovascular Disease',
        primary: true,
      },
    ],
  };
  const docEvalCardio = evaluateNpiRecord(cardiologistMdRaw);
  record(
    'Doctor Verification',
    'Medical Doctor (MD) Cardiologist should NOT pass as verified dental doctor',
    cardiologistMdRaw,
    { verified: docEvalCardio.verified, isDentalDoctor: docEvalCardio.isDentalDoctor },
    { verified: false, isDentalDoctor: false },
    docEvalCardio.verified === false,
    docEvalCardio.verified ? 'VULNERABILITY: Cardiologist MD verified as dental doctor due to passesCredentials = isDental || isApprovedTaxonomy' : 'Rejected'
  );

  // 2.5 Pediatric Dentist Taxonomy (1223P0106X) attempting to pass
  const pediatricDentistRaw = {
    enumeration_type: 'NPI-1',
    number: '1555666777',
    basic: {
      first_name: 'Timmy',
      last_name: 'Tooth',
      credential: 'DDS',
      sole_proprietor: 'YES',
    },
    taxonomies: [
      {
        code: '1223P0106X',
        desc: 'Pediatric Dentistry',
        primary: true,
      },
    ],
  };
  const docEvalPeds = evaluateNpiRecord(pediatricDentistRaw);
  record(
    'Doctor Verification',
    'Pediatric Dentist taxonomy (1223P0106X) must be disqualified',
    pediatricDentistRaw,
    docEvalPeds.verified,
    false,
    docEvalPeds.verified === false,
    'Properly disqualified by DISQUALIFIED_TAXONOMY_CODES'
  );

  // 2.6 Associate title in raw doctor name string
  const parsedAssociateName = parseDoctorName('Dr. Jennifer Lopez, DDS, Associate Dentist');
  record(
    'Doctor Verification',
    'parseDoctorName with "Associate Dentist" suffix',
    'Dr. Jennifer Lopez, DDS, Associate Dentist',
    parsedAssociateName,
    { firstName: 'Jennifer', lastName: 'Lopez' },
    parsedAssociateName.lastName === 'Lopez',
    parsedAssociateName.lastName === 'Lopez'
      ? 'Cleanly isolated doctor name'
      : `VULNERABILITY: Associate suffix corrupted last name into "${parsedAssociateName.lastName}"`
  );

  // 2.7 Multi-doctor practice name string
  const parsedMultiDoc = parseDoctorName('Dr. Mark Sloan DDS & Dr. Derek Shepherd DDS');
  record(
    'Doctor Verification',
    'parseDoctorName with multi-doctor string',
    'Dr. Mark Sloan DDS & Dr. Derek Shepherd DDS',
    parsedMultiDoc,
    'Should flag or reject multi-doctor practice',
    parsedMultiDoc.cleanName.includes('Derek') === false, // Checks how it handles multi-doctor
    `Parsed cleanName: "${parsedMultiDoc.cleanName}" (Extracts first doctor, ignores second doctor)`
  );

  // 2.8 Registered Dental Hygienist (RDH)
  const rdhRaw = {
    enumeration_type: 'NPI-1',
    number: '1999888777',
    basic: {
      first_name: 'Nancy',
      last_name: 'Floss',
      credential: 'RDH',
      sole_proprietor: 'YES',
    },
    taxonomies: [
      {
        code: '124Q00000X',
        desc: 'Dental Hygienist',
        primary: true,
      },
    ],
  };
  const docEvalRdh = evaluateNpiRecord(rdhRaw);
  record(
    'Doctor Verification',
    'Dental Hygienist (RDH) must be disqualified',
    rdhRaw,
    docEvalRdh.verified,
    false,
    docEvalRdh.verified === false,
    'Properly rejected as non-dental doctor credential'
  );

  // ===========================================================================
  // CATEGORY 3: CLINICAL FILTER EDGE CASES
  // ===========================================================================
  console.log('\n--- CATEGORY 3: CLINICAL FILTER EDGE CASES ---');

  // 3.1 Negative Medicaid mention: High-end cash practice explicitly rejecting Medicaid
  const cashOnlyHtml = `
    <html>
      <body>
        <h1>Center for Elite Dental Implantology</h1>
        <p>We provide full-arch All-on-4 restorations and computer-guided 3D dental implants.</p>
        <p>Notice: Our clinic does not accept Medicaid, Denti-Cal, or insurance. We are 100% fee-for-service cash pay.</p>
      </body>
    </html>
  `;
  const clinEvalMedNeg = scoreClinicalSpecialization(cashOnlyHtml);
  record(
    'Clinical Filter',
    'Practice explicitly stating "does not accept Medicaid" (false positive check)',
    cashOnlyHtml,
    { qualified: clinEvalMedNeg.qualified, disqualified: clinEvalMedNeg.disqualified },
    { qualified: true, disqualified: false },
    clinEvalMedNeg.qualified === true,
    clinEvalMedNeg.qualified ? 'Properly qualified' : 'LIMITATION/FALSE POSITIVE: Negative Medicaid mention ("does not accept Medicaid") triggers strict auto-disqualification!'
  );

  // 3.2 Pediatric clinic with one mention of implants
  const pedsOneImplantHtml = `
    <html>
      <body>
        <h1>Sunshine Pediatric Dentistry</h1>
        <p>Dr. Sunny is a board-certified pediatric dentist specializing in children's dentistry and baby teeth.</p>
        <p>For adult parents who need it, we offer dental implants.</p>
      </body>
    </html>
  `;
  const clinEvalPeds = scoreClinicalSpecialization(pedsOneImplantHtml);
  record(
    'Clinical Filter',
    'Pediatric clinic with 1 implant mention must be rejected',
    pedsOneImplantHtml,
    clinEvalPeds.disqualified,
    true,
    clinEvalPeds.disqualified === true,
    'Properly rejected by pediatric check'
  );

  // 3.3 Cosmetic / Whitening clinic with ZERO implants
  const cosmeticHtml = `
    <html>
      <body>
        <h1>Beverly Hills Cosmetic Smiles</h1>
        <p>Specializing in teeth whitening, porcelain veneers, Invisalign, and routine cleanings.</p>
      </body>
    </html>
  `;
  const clinEvalCosmetic = scoreClinicalSpecialization(cosmeticHtml);
  record(
    'Clinical Filter',
    'Cosmetic/whitening clinic without surgical implants must be rejected',
    cosmeticHtml,
    clinEvalCosmetic.qualified,
    false,
    clinEvalCosmetic.qualified === false,
    'Properly disqualified (routine / no implant score)'
  );

  // 3.4 Cosmetic clinic with exactly ONE mention of dental implants
  // Score should be 8, which is below the 15 threshold
  const cosmeticOneImplantHtml = `
    <html>
      <body>
        <h1>Beverly Hills Glamour Dental</h1>
        <p>Specializing in teeth whitening, porcelain veneers, cosmetic smile makeovers, and dental implants.</p>
      </body>
    </html>
  `;
  const clinEvalCosmeticOne = scoreClinicalSpecialization(cosmeticOneImplantHtml);
  record(
    'Clinical Filter',
    'Cosmetic clinic with single implant mention (Score = 8 < 15 threshold)',
    cosmeticOneImplantHtml,
    { score: clinEvalCosmeticOne.implantScore, qualified: clinEvalCosmeticOne.qualified },
    { score: 8, qualified: false },
    clinEvalCosmeticOne.qualified === false && clinEvalCosmeticOne.implantScore < 15,
    'Properly rejected because score 8 is below 15 minimum threshold'
  );

  // 3.5 Cosmetic clinic keyword stuffing to reach 16 points (2 implant keywords)
  const cosmeticStuffingHtml = `
    <html>
      <body>
        <h1>Whitening Studio</h1>
        <p>Teeth whitening and veneers. We also do dental implants and dental implant restoration.</p>
      </body>
    </html>
  `;
  const clinEvalStuffing = scoreClinicalSpecialization(cosmeticStuffingHtml);
  record(
    'Clinical Filter',
    'Whitening clinic stuffing 2 implant keywords (Score 16 >= 15 threshold)',
    cosmeticStuffingHtml,
    { score: clinEvalStuffing.implantScore, qualified: clinEvalStuffing.qualified },
    { qualified: false },
    clinEvalStuffing.qualified === false,
    clinEvalStuffing.qualified ? 'SURFACED BEHAVIOR: 2 mentions of implant reach score 16 and qualify a whitening clinic without full-arch focus' : 'Rejected'
  );

  // ===========================================================================
  // CATEGORY 4: HIGH-WEALTH ZIP BOUNDARY TESTS
  // ===========================================================================
  console.log('\n--- CATEGORY 4: HIGH-WEALTH ZIP BOUNDARY TESTS ---');

  // 4.1 Adjacent low-income zip codes in target metros
  const lowIncomeAdjacentZips = [
    { zip: '85008', metro: 'Phoenix (Low HHI ~$45k)' },
    { zip: '85009', metro: 'Phoenix (Low HHI ~$38k)' },
    { zip: '92701', metro: 'Santa Ana / Orange County (Adjacent to Newport Beach)' },
    { zip: '90011', metro: 'South Los Angeles (Adjacent to Beverly Hills)' },
    { zip: '75216', metro: 'South Dallas (Adjacent to Dallas/Plano)' },
    { zip: '33407', metro: 'West Palm Beach (Adjacent to Palm Beach/Boca Raton)' },
    { zip: '98118', metro: 'Seattle Rainier Valley (Adjacent to Bellevue)' },
    { zip: '06604', metro: 'Bridgeport (Adjacent to Greenwich/Fairfield)' },
  ];

  for (const { zip, metro } of lowIncomeAdjacentZips) {
    const isAff = isAffluentZip(zip);
    record(
      'Zip Boundary',
      `Adjacent low-income zip ${zip} (${metro}) must be rejected`,
      zip,
      isAff,
      false,
      isAff === false,
      'Correctly excluded from high-wealth catalog'
    );
  }

  // 4.2 East Coast unpadded 4-digit zip code: "6830" (representing 06830 Greenwich CT)
  const z4DigitStr = isAffluentZip('6830');
  record(
    'Zip Boundary',
    'Unpadded 4-digit string "6830" (Greenwich CT 06830)',
    '6830',
    z4DigitStr,
    true, // Or should it normalize with padStart(5, '0')?
    z4DigitStr === true,
    z4DigitStr ? 'Normalized' : 'LIMITATION: normalizeZipCode does not pad 4-digit East Coast zip strings with leading zero'
  );

  // 4.3 Number format East Coast zip: 6830 (parsed from JSON number)
  const z4DigitNum = isAffluentZip(6830 as any);
  record(
    'Zip Boundary',
    'Number format East Coast zip 6830 (Greenwich CT 06830)',
    6830,
    z4DigitNum,
    true,
    z4DigitNum === true,
    z4DigitNum ? 'Normalized' : 'LIMITATION: Number format 6830 fails length === 5 check'
  );

  // 4.4 ZIP+4 postal code format: "85253-1234"
  const zZipPlus4 = isAffluentZip('85253-1234');
  record(
    'Zip Boundary',
    'ZIP+4 format "85253-1234"',
    '85253-1234',
    zZipPlus4,
    true,
    zZipPlus4 === true,
    'Properly truncated to 5-digit normalized zip'
  );

  // 4.5 Postal code with trailing spaces: " 90210 "
  const zSpaces = isAffluentZip(' 90210 ');
  record(
    'Zip Boundary',
    'Zip code with surrounding spaces " 90210 "',
    ' 90210 ',
    zSpaces,
    true,
    zSpaces === true,
    'Whitespace trimmed successfully'
  );

  // 4.6 Invalid / non-existent postal codes
  const invalidZips = ['', 'ABCDE', '00000', '99999', '12345'];
  for (const inv of invalidZips) {
    const isAff = isAffluentZip(inv);
    record(
      'Zip Boundary',
      `Invalid postal code "${inv}" must be rejected`,
      inv,
      isAff,
      false,
      isAff === false,
      'Properly rejected'
    );
  }

  // ===========================================================================
  // CATEGORY 5: PROXIMITY COMPETITOR & DAG ENGINE INTEGRATION
  // ===========================================================================
  console.log('\n--- CATEGORY 5: PROXIMITY COMPETITOR & DAG ENGINE INTEGRATION ---');

  // 5.1 Missing competitor in qualifyPractice
  // Requirement R2: "Every lead has exactly one #1 local competitor identified in their immediate 5-mile radius."
  const candidateNoCompetitor: CandidatePractice = {
    name: 'Scottsdale Dental Implants',
    domain: 'scottsdaleimplants.com',
    zipCode: '85260',
    mapsRank: 5,
    hasSponsoredAd: true,
    htmlContent: '<p>All-on-4 dental implants full-arch zirconia reconstruction bone grafting 3D guided surgery</p>',
    doctorName: 'Dr. Gerald L. Kaiser',
    state: 'AZ',
    // NO competitor object provided!
  };
  const pipelineNoComp = await qualifyPractice(candidateNoCompetitor, false);
  const compGatePassed = pipelineNoComp.gateResults['PROXIMITY_COMPETITOR']?.passed;
  record(
    'DAG Integration',
    'Candidate without competitor should fail Gate 7 in qualifyPractice',
    candidateNoCompetitor,
    { compGatePassed, overallQualified: pipelineNoComp.qualified },
    { compGatePassed: false, overallQualified: false },
    pipelineNoComp.qualified === false,
    pipelineNoComp.qualified
      ? 'VULNERABILITY: qualifyPractice SKIPS Gate 7 if candidate.competitor is undefined and qualifies practice without a competitor!'
      : 'Properly rejected'
  );

  // 5.2 Competitor with rank #1 but distance > 5.0 miles
  const compFarDistance = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateNoCompetitor,
    competitor: {
      name: 'Rival Full Arch Center',
      rank: 1,
      distanceMiles: 5.1,
    },
  });
  record(
    'DAG Integration',
    'Competitor at 5.1 miles (> 5.0 miles) must be rejected',
    5.1,
    compFarDistance.passed,
    false,
    compFarDistance.passed === false,
    'Properly rejected distance > 5.0 miles'
  );

  // 5.3 Competitor with rank #2 within 5.0 miles
  const compRank2 = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateNoCompetitor,
    competitor: {
      name: 'Rival Center',
      rank: 2,
      distanceMiles: 2.0,
    },
  });
  record(
    'DAG Integration',
    'Competitor with rank #2 (must strictly be #1) must be rejected',
    2,
    compRank2.passed,
    false,
    compRank2.passed === false,
    'Properly rejected non-#1 competitor rank'
  );

  // 5.4 Google Maps float rank (e.g. 4.5)
  const rankFloat = await evaluateGate('MAPS_RANK', {
    ...candidateNoCompetitor,
    mapsRank: 4.5,
  });
  record(
    'DAG Integration',
    'Maps rank with float 4.5 (boundary check)',
    4.5,
    rankFloat.passed,
    false,
    rankFloat.passed === false,
    rankFloat.passed ? 'SURFACED BEHAVIOR: Float rank 4.5 passes rank >= 4 && rank <= 6' : 'Rejected'
  );

  // 5.5 Short-circuit verification when Gate 1 fails
  const candShortCircuit: CandidatePractice = {
    name: 'Any Practice',
    domain: 'any.com',
    zipCode: '99999', // Disqualified Gate 1
    mapsRank: 5,
  };
  const pipelineShort = await qualifyPractice(candShortCircuit, true);
  record(
    'DAG Integration',
    'Pipeline short-circuits on Gate 1 failure',
    candShortCircuit,
    { failedGate: pipelineShort.failedGate, gatesEvaluated: Object.keys(pipelineShort.gateResults).length },
    { failedGate: 'AFFLUENT_ZIP', gatesEvaluated: 1 },
    pipelineShort.failedGate === 'AFFLUENT_ZIP' && Object.keys(pipelineShort.gateResults).length === 1,
    'Short-circuit behaves efficiently'
  );

  // ===========================================================================
  // SUMMARY OF ADVERSARIAL RUN
  // ===========================================================================
  console.log('\n================================================================');
  console.log('📊 ADVERSARIAL TEST HARNESS SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`Total Adversarial Test Cases: ${total}`);
  console.log(`Passed (Expected Behavior): ${passedCount}`);
  console.log(`Failed (Vulnerabilities / Edge Cases Discovered): ${failedCount}`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    console.log('🚨 DISCOVERED VULNERABILITIES & FAILURE MODES:');
    results
      .filter((r) => !r.passed)
      .forEach((r, idx) => {
        console.log(`\n[#${idx + 1}] Category: ${r.category} | Test: ${r.testName}`);
        console.log(`     Details: ${r.notes}`);
      });
  }
}

runAdversarialTests().catch((err) => {
  console.error('Fatal harness error:', err);
  process.exit(1);
});
