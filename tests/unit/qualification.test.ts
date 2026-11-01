/**
 * Comprehensive Unit Test Suite: 7-Point Qualification & Disqualification Engine
 *
 * Verifies all gates across:
 * - Gate 1: Affluent Zip Code Validation & Target Metros
 * - Gate 2: Google Maps Local Rank (#4, #5, #6 vs #1-#3 and >#6)
 * - Gate 3: Paid Google Ads Signal
 * - Gate 4: Clinical Specialization (Implants/All-on-4 vs Medicaid/Peds/Routine)
 * - Gate 5: DSO & Corporate Chain 5-Tier Blacklist
 * - Gate 6: Solo Doctor NPI-1 Verification & Taxonomy Rules
 * - Gate 7: Proximity Competitor & Haversine Formula
 * - Full DAG Pipeline & Early Termination
 *
 * Execution:
 * npx tsx tests/unit/qualification.test.ts
 */

import {
  isAffluentZip,
  getAffluentZipInfo,
  getAllAffluentZips,
  getZipsByMetro,
  getTargetMetros,
  normalizeZipCode,
} from '../../src/lib/qualification/affluent-zips';

import {
  parseDoctorName,
  isDentalCredential,
  isValidDentalTaxonomy,
  evaluateNpiRecord,
  seedNpiCache,
  clearNpiCache,
  verifySoloDoctor,
  lookupNpi,
  APPROVED_DENTAL_TAXONOMY_CODES,
  DISQUALIFIED_TAXONOMY_CODES,
} from '../../src/lib/qualification/npi-verifier';

import {
  checkDsoAffiliation,
  isBlacklistedDomain,
  matchesDsoLegalDisclaimer,
  matchesCorporateCareers,
  getDsoDirectory,
  normalizeDomain,
} from '../../src/lib/qualification/dso-filter';

import {
  scoreClinicalSpecialization,
  detectMedicaidSignals,
  detectPediatricSignals,
  detectRoutineOnlySignals,
  calculateImplantDensity,
} from '../../src/lib/qualification/clinical-filter';

import {
  qualifyPractice,
  evaluateGate,
  calculateHaversineMiles,
  CandidatePractice,
} from '../../src/lib/qualification/index';

// Simple lightweight test runner assertions
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
    if (errorDetail) {
      console.error(`     Detail: ${errorDetail}`);
    }
  }
}

function assertEqual<T>(actual: T, expected: T, testName: string) {
  assert(actual === expected, testName, `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING QUALIFICATION ENGINE UNIT TEST SUITE (MILESTONE 1)');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: GATE 1 - AFFLUENT ZIP CODES & METROS
  // ============================================================================
  console.log('--- Suite 1: Gate 1 - Affluent Zip Codes ---');

  const allZips = getAllAffluentZips();
  assert(allZips.length >= 35, `Catalog contains at least 35 zip codes (found ${allZips.length})`);

  const metros = getTargetMetros();
  assert(metros.length >= 7, `Catalog includes at least 7 target US metropolitan clusters (found ${metros.length})`);

  // Positive lookups across all 7 metros
  assert(isAffluentZip('85260'), 'Scottsdale AZ 85260 qualifies as affluent');
  assert(isAffluentZip('92660'), 'Newport Beach CA 92660 qualifies as affluent');
  assert(isAffluentZip('90210'), 'Beverly Hills CA 90210 qualifies as affluent');
  assert(isAffluentZip('75093'), 'Plano TX 75093 qualifies as affluent');
  assert(isAffluentZip('33496'), 'Boca Raton FL 33496 qualifies as affluent');
  assert(isAffluentZip('98004'), 'Bellevue WA 98004 qualifies as affluent');
  assert(isAffluentZip('06830'), 'Greenwich CT 06830 qualifies as affluent');

  // Zip formatting & whitespace resilience
  assert(isAffluentZip('  85260  '), 'Handles whitespace in zip code string');
  assert(isAffluentZip('85260-1234'), 'Handles 9-digit zip code by normalizing to 5 digits');
  assertEqual(normalizeZipCode(' 06830-4567 '), '06830', 'Properly normalizes East Coast 0-padded zip codes');
  assert(isAffluentZip('6830'), 'Unpadded 4-digit East Coast zip string 6830 qualifies (06830)');
  assert(isAffluentZip(6830 as any), 'Number format East Coast zip 6830 qualifies (06830)');

  // Negative lookups (non-affluent, non-qualifying, malformed)
  assert(!isAffluentZip('99999'), 'Non-existent zip 99999 is disqualified');
  assert(!isAffluentZip('12345'), 'Schenectady NY 12345 is disqualified');
  assert(!isAffluentZip(''), 'Empty string zip is disqualified');
  assert(!isAffluentZip('43210'), 'Columbus OH 43210 is disqualified');

  // Wealth indicators: verify Median HHI >= $120k for all catalog entries
  const allAbove120k = allZips.every((z) => z.medianHhi >= 120000);
  assert(allAbove120k, '100% of catalog zip codes have verified Median HHI >= $120,000');

  // Metro search helper
  const scottsdaleZips = getZipsByMetro('Scottsdale');
  assert(scottsdaleZips.length >= 8, `Found ${scottsdaleZips.length} zips for Phoenix/Scottsdale metro`);

  const greenwichInfo = getAffluentZipInfo('06830');
  assert(greenwichInfo !== null && greenwichInfo.city === 'Greenwich', 'Zip metadata resolves correctly for 06830');
  console.log();

  // ============================================================================
  // SUITE 2: GATE 2 - GOOGLE MAPS LOCAL RANK
  // ============================================================================
  console.log('--- Suite 2: Gate 2 - Google Maps Local Rank (#4-#6) ---');

  const candidateBase: CandidatePractice = {
    name: 'Sample Dental Implant Center',
    domain: 'sampleimplants.com',
    zipCode: '85260',
  };

  // Positive: Ranks 4, 5, 6
  const rank4Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 4 });
  assert(rank4Res.passed, 'Rank #4 passes Gate 2');

  const rank5Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 5 });
  assert(rank5Res.passed, 'Rank #5 passes Gate 2');

  const rank6Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 6 });
  assert(rank6Res.passed, 'Rank #6 passes Gate 2');

  // Negative: Top 3 Map Pack (Rank 1, 2, 3) must be disqualified
  const rank1Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 1 });
  assert(!rank1Res.passed, 'Rank #1 is disqualified (already in 3-pack)');

  const rank2Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 2 });
  assert(!rank2Res.passed, 'Rank #2 is disqualified (already in 3-pack)');

  const rank3Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 3 });
  assert(!rank3Res.passed, 'Rank #3 is disqualified (already in 3-pack)');

  // Negative: Beyond overflow window (Rank 7, 8, 15, 20)
  const rank7Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 7 });
  assert(!rank7Res.passed, 'Rank #7 is disqualified (beyond #4-#6 overflow window)');

  const rank16Res = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: 16 });
  assert(!rank16Res.passed, 'Rank #16 is disqualified (buried past page 1)');

  // Negative: Invalid / missing rank
  const rankMissingRes = await evaluateGate('MAPS_RANK', { ...candidateBase, mapsRank: undefined });
  assert(!rankMissingRes.passed, 'Undefined rank is disqualified');
  console.log();

  // ============================================================================
  // SUITE 3: GATE 3 - PAID GOOGLE ADS SIGNAL
  // ============================================================================
  console.log('--- Suite 3: Gate 3 - Paid Google Ads Signal ---');

  const adsPositive1 = await evaluateGate('PAID_ADS', {
    ...candidateBase,
    hasSponsoredAd: true,
  });
  assert(adsPositive1.passed, 'hasSponsoredAd: true passes Gate 3');

  const adsPositive2 = await evaluateGate('PAID_ADS', {
    ...candidateBase,
    hasSponsoredAd: false,
    adKeywords: ['dental implants cost', 'all on 4 dentist'],
    adCreativeCount: 3,
  });
  assert(adsPositive2.passed, 'Verified PPC keywords and creative count passes Gate 3');

  const adsNegative = await evaluateGate('PAID_ADS', {
    ...candidateBase,
    hasSponsoredAd: false,
    adKeywords: [],
  });
  assert(!adsNegative.passed, 'Zero active paid ads signals is disqualified');
  console.log();

  // ============================================================================
  // SUITE 4: GATE 4 - CLINICAL SPECIALIZATION SCORER
  // ============================================================================
  console.log('--- Suite 4: Gate 4 - Clinical Specialization Filter ---');

  const validImplantHtml = `
    <html>
      <head><title>Scottsdale Dental Implant Center</title></head>
      <body>
        <h1>Permanent Teeth Replacement with Dental Implants</h1>
        <p>We specialize in All-on-4 dental implants, full-arch zirconia restorations, and teeth in a day.</p>
        <p>Our 3D guided implant surgery with CBCT cone beam imaging ensures precise placement.</p>
        <p>Advanced sinus lift, bone grafting, and immediate load implants.</p>
      </body>
    </html>
  `;
  const implantRes = scoreClinicalSpecialization(validImplantHtml);
  assert(implantRes.qualified, 'High-ticket All-on-4 and surgical implants content qualifies');
  assert(implantRes.implantScore >= 30, `Implant density score is high (${implantRes.implantScore}/100)`);
  assert(implantRes.detectedCategories.allOnFour, 'Detects All-on-4 category');
  assert(implantRes.detectedCategories.implants, 'Detects Implants category');
  assert(implantRes.detectedCategories.boneGrafting, 'Detects Bone Grafting category');

  // Negative 1: Medicaid / Denti-Cal Detection
  const medicaidHtml = `
    <html>
      <body>
        <h1>Affordable Family Dental</h1>
        <p>We provide dental implants. We proudly accept Medicaid and Denti-Cal for state assistance patients.</p>
      </body>
    </html>
  `;
  const medicaidRes = scoreClinicalSpecialization(medicaidHtml);
  assert(!medicaidRes.qualified, 'Practice accepting Medicaid is strictly disqualified');
  assert(medicaidRes.disqualified, 'Disqualification flag is true for Medicaid');
  assert(medicaidRes.detectedCategories.medicaid, 'Detected Medicaid category correctly');

  // Negative 2: Pediatric Dentistry Detection
  const pediatricHtml = `
    <html>
      <body>
        <h1>Happy Smiles Pediatric Dentistry</h1>
        <p>Expert pediatric dentist specializing in children's dentistry, infant oral care, and baby teeth.</p>
      </body>
    </html>
  `;
  const pediatricRes = scoreClinicalSpecialization(pediatricHtml);
  assert(!pediatricRes.qualified, 'Pediatric practice is strictly disqualified');
  assert(pediatricRes.detectedCategories.pediatrics, 'Detected Pediatric category correctly');

  // Negative 3: Routine Family Dentistry Only (No Implants)
  const routineHtml = `
    <html>
      <body>
        <h1>Family Care Dental</h1>
        <p>We provide routine cleanings, cavity fillings, preventative care, and teeth whitening.</p>
      </body>
    </html>
  `;
  const routineRes = scoreClinicalSpecialization(routineHtml);
  assert(!routineRes.qualified, 'Routine-only family dentistry without implants is disqualified');
  assert(routineRes.detectedCategories.routineOnly, 'Detected routineOnly category');

  // Negative 4: Low procedural density
  const lowDensityHtml = `<html><body><p>Welcome to our dental office. We do general things.</p></body></html>`;
  const lowDensityRes = scoreClinicalSpecialization(lowDensityHtml);
  assert(!lowDensityRes.qualified, 'Generic low-density page without surgical procedures is disqualified');

  // Positive: Fee-for-Service Cash Practice with Medicaid Negation (Must NOT be disqualified)
  const ffsNegationHtml = `
    <html>
      <body>
        <h1>Elite Dental Implant Center</h1>
        <p>Comprehensive All-on-4 dental implants and full-arch reconstruction.</p>
        <p>Notice: Our clinic does not accept Medicaid, Denti-Cal, or insurance. We are 100% fee-for-service cash pay.</p>
      </body>
    </html>
  `;
  const ffsRes = scoreClinicalSpecialization(ffsNegationHtml);
  assert(ffsRes.qualified, 'Cash-pay practice explicitly stating "does not accept Medicaid" qualifies');
  assert(!ffsRes.disqualified, 'Negated Medicaid mention does not trigger disqualification');

  // Substring deduplication: "dental implants" should not double count "dental implant"
  const cosmeticHtml = `
    <html><body><p>Beverly Hills Teeth Whitening. We offer whitening, veneers, cleanings, and dental implants.</p></body></html>
  `;
  const cosmeticRes = scoreClinicalSpecialization(cosmeticHtml);
  assert(!cosmeticRes.qualified, 'Cosmetic teeth whitening clinic with single implant mention does not qualify (score < 15)');
  console.log();

  // ============================================================================
  // SUITE 5: GATE 5 - DSO & CORPORATE CHAIN BLACKLIST (5 TIERS)
  // ============================================================================
  console.log('--- Suite 5: Gate 5 - DSO 5-Tier Detection ---');

  const dsoDir = getDsoDirectory();
  assert(dsoDir.length >= 25, `DSO Directory contains 25+ corporate entities (found ${dsoDir.length})`);

  // Tier 1: Mega-Chains
  const clearChoiceCheck = checkDsoAffiliation('clearchoice.com', '', 'ClearChoice Dental Implant Center');
  assert(clearChoiceCheck.isDso, 'Tier 1: ClearChoice is identified as DSO');
  assertEqual(clearChoiceCheck.matchTier, 'TIER_3_DOMAIN_BLACKLIST', 'ClearChoice matched Tier 3 domain blacklist');

  const heartlandCheck = checkDsoAffiliation('heartlanddental.com', '', 'Heartland Dental Care');
  assert(heartlandCheck.isDso, 'Tier 1: Heartland Dental is identified as DSO');

  const aspenCheck = checkDsoAffiliation('aspendental.com', '', 'Aspen Dental');
  assert(aspenCheck.isDso, 'Tier 1: Aspen Dental is identified as DSO');

  const pdsCheck = checkDsoAffiliation('pacificdentalservices.com', '', 'Pacific Dental Services');
  assert(pdsCheck.isDso, 'Tier 1: Pacific Dental Services is identified as DSO');

  // Tier 2: Surgical Specialty MSOs / Stealth Networks
  const mb2Check = checkDsoAffiliation('localpractice.com', '', 'MB2 Dental Partner Clinic');
  assert(mb2Check.isDso, 'Tier 2: MB2 Dental brand match is identified as DSO');

  const alliedOmsCheck = checkDsoAffiliation('alliedoms.com', '', 'Allied OMS Surgical Center');
  assert(alliedOmsCheck.isDso, 'Tier 2: Allied OMS is identified as DSO');

  const beaconCheck = checkDsoAffiliation('beaconoralspecialists.com', '', 'Beacon Oral Specialists');
  assert(beaconCheck.isDso, 'Tier 2: Beacon Oral Specialists is identified as DSO');

  // Tier 3: Subdomain & Domain Blacklist
  assert(isBlacklistedDomain('scottsdale.clearchoice.com'), 'Subdomain of clearchoice.com is blacklisted');
  assert(isBlacklistedDomain('heartland.com'), 'heartland.com is blacklisted');
  assert(!isBlacklistedDomain('totalfreedomdental.com'), 'Independent domain is not blacklisted');

  // Tier 4: Legal Regulatory Disclaimers in HTML
  const heartlandFooter = `
    <footer>
      <p>Copyright 2026. This practice is supported by Heartland Dental.</p>
    </footer>
  `;
  const t4Heartland = matchesDsoLegalDisclaimer(heartlandFooter);
  assert(t4Heartland.matches, 'Tier 4: Detects "supported by Heartland Dental" regulatory disclaimer');

  const mb2Footer = `
    <footer>
      <p>An MB2 Dental partner practice. All rights reserved.</p>
    </footer>
  `;
  const t4Mb2 = matchesDsoLegalDisclaimer(mb2Footer);
  assert(t4Mb2.matches, 'Tier 4: Detects "An MB2 Dental partner" regulatory disclaimer');

  // Tier 5: Corporate Careers ATS Links
  const greenhouseHtml = `<a href="https://boards.greenhouse.io/tag/jobs/12345">Join Our Team</a>`;
  const t5Greenhouse = matchesCorporateCareers(greenhouseHtml);
  assert(t5Greenhouse.matches, 'Tier 5: Detects corporate Greenhouse ATS recruitment slug');

  // Tier 5: Workday ATS company subdomain
  const workdayHtml = `<a href="https://heartland.myworkdayjobs.com/careers">Careers at Heartland</a>`;
  const t5Workday = matchesCorporateCareers(workdayHtml);
  assert(t5Workday.matches, 'Tier 5: Detects Workday ATS company subdomain (heartland.myworkdayjobs.com)');

  // Normalization with trailing FQDN dot
  const trailingDotCheck = checkDsoAffiliation('clearchoice.com.');
  assert(trailingDotCheck.isDso, 'normalizeDomain strips trailing FQDN dot');

  // Normalization with basic auth URL
  const basicAuthCheck = checkDsoAffiliation('http://user:pass@clearchoice.com');
  assert(basicAuthCheck.isDso, 'normalizeDomain strips basic auth credentials');

  // HTML tags inside legal regulatory disclaimer
  const htmlDisclaimer = `<p>Dental care is supported by <strong>Heartland Dental</strong>, LLC.</p>`;
  const t4HtmlDisclaimer = matchesDsoLegalDisclaimer(htmlDisclaimer);
  assert(t4HtmlDisclaimer.matches, 'Tier 4: Strips HTML tags inside legal disclaimers');

  // Clean Independent Practice: Must Pass 100%
  const cleanSoloCheck = checkDsoAffiliation(
    'totalfreedomdental.com',
    '<footer>Dr. Gerald Kaiser DDS PC. All rights reserved.</footer>',
    'Total Freedom Dental Implant Center'
  );
  assert(!cleanSoloCheck.isDso, 'Independent solo clinic cleanly passes all 5 DSO tiers');
  console.log();

  // ============================================================================
  // SUITE 6: GATE 6 - SOLO DOCTOR NPI-1 VERIFICATION & TAXONOMIES
  // ============================================================================
  console.log('--- Suite 6: Gate 6 - Solo Doctor NPI Licensure ---');

  // Name Parsing
  const parsed1 = parseDoctorName('Dr. Gerald L. Kaiser, DDS PC');
  assertEqual(parsed1.firstName, 'Gerald', 'Doctor first name parsed correctly');
  assertEqual(parsed1.lastName, 'Kaiser', 'Doctor last name parsed correctly');

  const parsed2 = parseDoctorName('Doctor Marissa Matthews DMD');
  assertEqual(parsed2.firstName, 'Marissa', 'Doctor first name parsed correctly for DMD');
  assertEqual(parsed2.lastName, 'Matthews', 'Doctor last name parsed correctly for DMD');

  // Credentials Verification
  assert(isDentalCredential('DDS'), 'DDS is valid dental credential');
  assert(isDentalCredential('DMD'), 'DMD is valid dental credential');
  assert(isDentalCredential('DDS PC'), 'DDS PC is valid dental credential');
  assert(isDentalCredential('MD'), 'MD (oral maxillofacial surgeon) is valid credential');
  assert(!isDentalCredential('RDH'), 'RDH (hygienist) is rejected as non-doctor credential');
  assert(!isDentalCredential('RN'), 'RN is rejected as non-dental credential');
  assert(!isDentalCredential('MBA'), 'MBA is rejected as non-doctor credential');

  // Taxonomy Verification: NUCC Official Code Standard
  assert(isValidDentalTaxonomy('122300000X'), '122300000X (Dentist) is approved taxonomy');
  assert(isValidDentalTaxonomy('1223G0001X'), '1223G0001X (General Practice Dentist) is approved taxonomy');
  assert(isValidDentalTaxonomy('1223P0300X'), '1223P0300X (Periodontics) is approved taxonomy');
  assert(isValidDentalTaxonomy('1223P0700X'), '1223P0700X (Prosthodontics) is approved taxonomy');
  assert(isValidDentalTaxonomy('1223S0112X'), '1223S0112X (Oral Surgery) is approved taxonomy');
  assert(isValidDentalTaxonomy('204E00000X'), '204E00000X (Oral & Maxillofacial Surgery MD/DO) is approved taxonomy');
  assert(!isValidDentalTaxonomy('1223P0221X'), '1223P0221X (Pediatric Dentistry) is strictly disqualified taxonomy');
  assert(!isValidDentalTaxonomy('1223D0001X'), '1223D0001X (Public Health) is disqualified taxonomy');
  assert(!isValidDentalTaxonomy('1223P0106X'), '1223P0106X (Oral Pathology) is not approved taxonomy');

  // Mock NPI Record Evaluation: Positive NPI-1
  const validNpi1Record = {
    number: '1487796843',
    enumeration_type: 'NPI-1',
    basic: {
      first_name: 'GERALD',
      last_name: 'KAISER',
      credential: 'DDS PC',
      sole_proprietor: 'YES',
      status: 'A',
    },
    taxonomies: [
      {
        code: '122300000X',
        desc: 'Dentist',
        license: '2338',
        primary: true,
        state: 'AZ',
      },
    ],
    addresses: [
      {
        address_1: '9002 E DESERT COVE STE 103',
        address_purpose: 'LOCATION',
        city: 'SCOTTSDALE',
        state: 'AZ',
        postal_code: '85260',
      },
    ],
  };
  const evalNpi1 = evaluateNpiRecord(validNpi1Record);
  assert(evalNpi1.verified, 'Valid NPI-1 solo practitioner evaluates as verified');
  assert(evalNpi1.soleProprietor, 'Identifies sole proprietorship');
  assert(evalNpi1.isDentalDoctor, 'Confirms dental credentials');

  // Mock NPI Record Evaluation: Negative NPI-2 (Corporate Organization)
  const invalidNpi2Record = {
    number: '1982736450',
    enumeration_type: 'NPI-2',
    basic: {
      organization_name: 'Corporate Dental Partners LLC',
      status: 'A',
    },
  };
  const evalNpi2 = evaluateNpiRecord(invalidNpi2Record);
  assert(!evalNpi2.verified, 'NPI-2 corporate organization is rejected');
  assert(Boolean(evalNpi2.disqualificationReason?.includes('NPI-2')), 'Explains NPI-2 corporate reason');

  // Mock NPI Record Evaluation: Negative Pediatric Taxonomy (NUCC 1223P0221X)
  const pediatricNpiRecord = {
    number: '1827364519',
    enumeration_type: 'NPI-1',
    basic: {
      first_name: 'Jane',
      last_name: 'Smith',
      credential: 'DDS',
      sole_proprietor: 'YES',
      status: 'A',
    },
    taxonomies: [
      {
        code: '1223P0221X',
        desc: 'Dentist, Pediatric Dentistry',
        primary: true,
      },
    ],
  };
  const evalPedNpi = evaluateNpiRecord(pediatricNpiRecord);
  assert(!evalPedNpi.verified, 'Pediatric dentistry taxonomy (1223P0221X) in NPI record is disqualified');
  assertEqual(evalPedNpi.taxonomyCode, '1223P0221X', 'Captures disqualified taxonomy code 1223P0221X');
  assert(!evalPedNpi.isApprovedTaxonomy, 'isApprovedTaxonomy is false for pediatric dentist');

  // Negative: Non-sole proprietor associate doctor must be disqualified
  const associateNpiRecord = {
    number: '1234567890',
    enumeration_type: 'NPI-1',
    basic: {
      first_name: 'Dave',
      last_name: 'Smith',
      credential: 'DDS',
      sole_proprietor: 'NO',
      status: 'A',
    },
    taxonomies: [{ code: '122300000X', desc: 'Dentist', primary: true }],
  };
  const evalAssocNpi = evaluateNpiRecord(associateNpiRecord);
  assert(!evalAssocNpi.verified, 'Associate dentist (sole_proprietor: NO) is disqualified from Gate 6');
  assert(!evalAssocNpi.soleProprietor, 'Identifies associate as non-sole-proprietor');

  // Negative: Non-dental MD (Pediatrics) must be disqualified
  const nonDentalMdRecord = {
    number: '1987654321',
    enumeration_type: 'NPI-1',
    basic: {
      first_name: 'Emily',
      last_name: 'Jones',
      credential: 'MD',
      sole_proprietor: 'YES',
      status: 'A',
    },
    taxonomies: [{ code: '208000000X', desc: 'Pediatrics', primary: true }],
  };
  const evalNonDentalMd = evaluateNpiRecord(nonDentalMdRecord);
  assert(!evalNonDentalMd.verified, 'Non-dental MD (Pediatrics) is disqualified');
  assert(!evalNonDentalMd.isApprovedTaxonomy, 'Non-dental MD taxonomy is not approved');

  // Negative: Empty taxonomies array must not fabricate Dentist
  const emptyTaxRecord = {
    number: '1234567894',
    enumeration_type: 'NPI-1',
    basic: { first_name: 'Empty', last_name: 'Tax', credential: 'DDS', sole_proprietor: 'YES' },
    taxonomies: [],
  };
  const evalEmptyTax = evaluateNpiRecord(emptyTaxRecord);
  assert(!evalEmptyTax.verified, 'Empty taxonomies array is rejected (does not fabricate Dentist)');

  // Name parsing sanitizes Associate Dentist suffix
  const parsedAssoc = parseDoctorName('Dr. Jennifer Lopez, DDS, Associate Dentist');
  assertEqual(parsedAssoc.lastName, 'Lopez', 'parseDoctorName cleans "Associate Dentist" suffix');
  console.log();

  // ============================================================================
  // SUITE 7: GATE 7 - PROXIMITY COMPETITOR & HAVERSINE DISTANCE
  // ============================================================================
  console.log('--- Suite 7: Gate 7 - Proximity Competitor & Haversine Distance ---');

  // Haversine Distance test: Boca Raton (33496: 26.4023, -80.1705) to East Boca (33431: 26.3776, -80.1191)
  const distMiles = calculateHaversineMiles(26.4023, -80.1705, 26.3776, -80.1191);
  assert(distMiles > 3.0 && distMiles < 4.0, `Haversine distance accurate (${distMiles.toFixed(2)} miles, expected ~3.6 mi)`);

  // Positive: Competitor rank #1 within 5 miles
  const compValidRes = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateBase,
    latitude: 33.6013,
    longitude: -111.8867,
    competitor: {
      name: 'Dental Implant Institute of Scottsdale',
      rank: 1,
      rating: 4.9,
      reviewCount: 380,
      latitude: 33.6138,
      longitude: -111.9431,
    },
  });
  assert(compValidRes.passed, 'Rank #1 competitor within 5 miles passes Gate 7');

  // Negative 1: Competitor is Rank #3 (Defect prevention as noted in survey)
  const compRank3Res = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateBase,
    competitor: {
      name: 'Signature Dental Group',
      rank: 3,
      rating: 4.9,
      reviewCount: 1200,
      distanceMiles: 1.8,
    },
  });
  assert(!compRank3Res.passed, 'Competitor with rank #3 is rejected (Must strictly be rank #1)');

  // Negative 2: Competitor beyond 5.0 miles
  const compTooFarRes = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateBase,
    competitor: {
      name: 'Distant Implant Center',
      rank: 1,
      rating: 4.8,
      reviewCount: 150,
      distanceMiles: 6.8,
    },
  });
  assert(!compTooFarRes.passed, 'Competitor at 6.8 miles is rejected (> 5.0 miles)');

  // Negative 3: Competitor missing distanceMiles and coordinates
  const compMissingDistRes = await evaluateGate('PROXIMITY_COMPETITOR', {
    ...candidateBase,
    competitor: {
      name: 'Missing Coords Dental',
      rank: 1,
    },
  });
  assert(!compMissingDistRes.passed, 'Competitor missing distanceMiles and coordinates is rejected');
  console.log();

  // ============================================================================
  // SUITE 8: FULL 7-GATE DAG QUALIFICATION PIPELINE
  // ============================================================================
  console.log('--- Suite 8: Unified DAG Qualification Engine ---');

  // Seed NPI cache for deterministic pipeline test
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
    licenseState: 'AZ',
  });

  const goatedCandidate: CandidatePractice = {
    name: 'Total Freedom Dental Implant Center',
    domain: 'totalfreedomdental.com',
    zipCode: '85260',
    mapsRank: 5,
    hasSponsoredAd: true,
    doctorName: 'Dr. Gerald L. Kaiser',
    state: 'AZ',
    htmlContent: validImplantHtml,
    competitor: {
      name: 'Dental Implant Institute of Scottsdale',
      rank: 1,
      distanceMiles: 2.3,
      rating: 4.9,
      reviewCount: 420,
    },
  };

  const pipelineRes = await qualifyPractice(goatedCandidate);
  assert(pipelineRes.qualified, 'Goated practice passes all 7 qualification gates');
  assertEqual(pipelineRes.failedGate, undefined, 'No failed gate reported');
  assert(pipelineRes.evaluationDurationMs < 2000, `Execution completed rapidly in ${pipelineRes.evaluationDurationMs}ms`);

  // Disqualification test: non-affluent zip terminates early
  const nonAffluentCandidate: CandidatePractice = {
    ...goatedCandidate,
    zipCode: '99999',
  };
  const nonAffluentRes = await qualifyPractice(nonAffluentCandidate, true);
  assert(!nonAffluentRes.qualified, 'Non-affluent zip practice is disqualified');
  assertEqual(nonAffluentRes.failedGate, 'AFFLUENT_ZIP', 'Pipeline halted at Gate 1 (AFFLUENT_ZIP)');
  assertEqual(
    nonAffluentRes.gateResults['MAPS_RANK'],
    undefined,
    'Short-circuit: downstream gates skipped after first failure'
  );

  // Disqualification test: DSO practice terminates at Gate 5
  const dsoCandidate: CandidatePractice = {
    ...goatedCandidate,
    domain: 'clearchoice.com',
    name: 'ClearChoice Dental Implant Center Scottsdale',
  };
  const dsoRes = await qualifyPractice(dsoCandidate);
  assert(!dsoRes.qualified, 'ClearChoice candidate is disqualified');
  assertEqual(dsoRes.failedGate, 'DSO_FILTER', 'Pipeline correctly identifies Gate 5 DSO failure');

  // Gate 2 integer check: float rank 4.5 is disqualified
  const floatRankCandidate: CandidatePractice = {
    ...goatedCandidate,
    mapsRank: 4.5,
  };
  const floatRankRes = await qualifyPractice(floatRankCandidate);
  assert(!floatRankRes.qualified, 'Float mapsRank 4.5 is disqualified by Gate 2');

  // Gate 2 NaN check: mapsRank NaN is disqualified
  const nanRankCandidate: CandidatePractice = {
    ...goatedCandidate,
    mapsRank: NaN,
  };
  const nanRankRes = await qualifyPractice(nanRankCandidate);
  assert(!nanRankRes.qualified, 'NaN mapsRank is disqualified by Gate 2');

  // Gate 7 strictly required: practice without competitor must fail Gate 7
  const noCompCandidate: CandidatePractice = {
    ...goatedCandidate,
    competitor: undefined,
  };
  const noCompRes = await qualifyPractice(noCompCandidate);
  assert(!noCompRes.qualified, 'Candidate without competitor is disqualified');
  assertEqual(noCompRes.failedGate, 'PROXIMITY_COMPETITOR', 'Pipeline identifies Gate 7 failure when competitor is missing');

  // Null candidate safety
  const nullCandidateRes = await qualifyPractice(null as any);
  assert(!nullCandidateRes.qualified, 'Null candidate practice returns qualified: false without crashing');
  console.log();

  // ============================================================================
  // SUITE 9: LIVE CMS NPPES API VERIFICATION
  // ============================================================================
  console.log('--- Suite 9: Live CMS NPPES API Network Resolution ---');
  try {
    const liveDoc = await verifySoloDoctor('Dr. Gerald L. Kaiser', 'AZ', undefined, undefined, 8000);
    assert(liveDoc.verified, `Live CMS NPPES resolves Dr. Gerald Kaiser (NPI: ${liveDoc.npiNumber})`);
    assertEqual(liveDoc.npiNumber, '1487796843', 'Live NPI matches expected 1487796843');
    assertEqual(liveDoc.enumerationType, 'NPI-1', 'Live provider is NPI-1 individual');
    assert(liveDoc.soleProprietor, 'Live provider is verified sole proprietor');
  } catch (err: any) {
    console.warn('  ⚠️ Live NPPES API network call skipped or timed out:', err.message);
  }

  // Live Disqualification Check: Dr. Marvin Abarca (Active Pediatric Dentist, NPI: 1316388820)
  try {
    const livePed = await lookupNpi('1316388820', 8000);
    assert(!livePed.verified, 'Live CMS NPPES pediatric dentist (Dr. Marvin Abarca, NPI: 1316388820) is strictly disqualified');
    assertEqual(livePed.taxonomyCode, '1223P0221X', 'Live provider taxonomy code is 1223P0221X (Pediatric Dentistry)');
    assert(!livePed.isApprovedTaxonomy, 'Live pediatric provider isApprovedTaxonomy is false');
  } catch (err: any) {
    console.warn('  ⚠️ Live NPPES API network call skipped or timed out:', err.message);
  }

  // ============================================================================
  // SUITE 10: 9 ADVERSARIAL EDGE CASES (challenger_m1_3)
  // ============================================================================
  console.log('--- Suite 10: 9 Adversarial Edge Cases ---');

  // Edge 1: Workday multi-level datacenter subdomains
  const wd1Res = checkDsoAffiliation('independentpractice.com', '<a href="https://heartland.wd1.myworkdayjobs.com/Careers">Join Our Team</a>');
  assert(wd1Res.isDso, 'Workday wd1 subdomain is detected as DSO');
  assertEqual(wd1Res.matchTier, 'TIER_5_CORPORATE_FOOTER_CAREERS', 'Workday wd1 matched Tier 5 corporate careers');

  // Edge 2: Chained basic auth credentials
  const chainedAuthDomain = normalizeDomain('http://user:pass@admin:123@clearchoice.com');
  assertEqual(chainedAuthDomain, 'clearchoice.com', 'Chained basic auth credentials clean properly to target domain');
  const chainedAuthRes = checkDsoAffiliation('http://user:pass@admin:123@clearchoice.com');
  assert(chainedAuthRes.isDso, 'Chained basic auth URL is identified as DSO');

  // Edge 3: Outbound parent DSO link in HTML
  const outboundLinkRes = checkDsoAffiliation(
    'scottsdaleimplants.com',
    '<div><p>Private Practice</p><a href="https://www.clearchoice.com/privacy-policy">ClearChoice Privacy Policy</a></div>',
    'Scottsdale Implants'
  );
  assert(outboundLinkRes.isDso, 'Outbound link to clearchoice.com is identified as DSO');
  assertEqual(outboundLinkRes.matchTier, 'TIER_3_DOMAIN_BLACKLIST', 'Outbound link matched Tier 3 DSO domain blacklist');

  // Edge 4: Oral and Maxillofacial Pathology (1223P0106X)
  const oralPathRes = evaluateNpiRecord({
    enumeration_type: 'NPI-1',
    number: '1999888777',
    basic: { first_name: 'Sarah', last_name: 'Miller', credential: 'DDS', sole_proprietor: 'YES' },
    taxonomies: [{ code: '1223P0106X', desc: 'Oral and Maxillofacial Pathology', primary: true }],
  });
  assert(!oralPathRes.verified, 'Oral Pathology NPI is not verified as surgical implant doctor');
  assert(!oralPathRes.isApprovedTaxonomy, 'Oral Pathology is not an approved taxonomy');

  // Edge 5: Pediatric negation ("We do not offer pediatric dentistry")
  const pedsNegRes = scoreClinicalSpecialization(
    'Scottsdale Implant Center: Dedicated to adult full-arch restoration. Notice: We do not treat children or offer pediatric dentistry. Adults only.'
  );
  assert(!pedsNegRes.disqualified, 'Negated pediatric dentistry does not disqualify adult implant clinic');
  assert(pedsNegRes.qualified, 'Adult implant clinic with negated pediatric mention qualifies');

  // Edge 6: Disregard "baby teeth" in adult congenital missing teeth / implant context
  const babyTeethRes = scoreClinicalSpecialization(
    'Dental Implants for Adults: If you have congenitally missing permanent teeth or retained baby teeth that finally failed, full arch dental implants provide permanent replacement.'
  );
  assert(!babyTeethRes.disqualified, 'Retained baby teeth in adult implant context does not disqualify');
  assert(babyTeethRes.qualified, 'Adult implant context with baby teeth qualifies');

  // Edge 7: Allow "Associate Fellow, American Academy of Implant Dentistry" (AAID) in doctor titles
  seedNpiCache('GREGORY_HOUSE_AZ', {
    verified: true,
    doctorName: 'Dr. Gregory House',
    credentials: 'DDS',
    isDentalDoctor: true,
    soleProprietor: true,
    isApprovedTaxonomy: true,
  });
  const assocFellowRes = await evaluateGate('SOLO_DOCTOR', {
    name: 'Elite Implant Center',
    domain: 'eliteimplants.com',
    zipCode: '85260',
    doctorName: 'Dr. Gregory House',
    doctorTitle: 'Associate Fellow, American Academy of Implant Dentistry',
    state: 'AZ',
  });
  assert(assocFellowRes.passed, 'Associate Fellow credential passes Gate 6 SOLO_DOCTOR');

  // Edge 8: Unpadded East Coast ZIP+4 ("6830-1234") normalizes to "06830"
  const zipPlus4Norm = normalizeZipCode('6830-1234');
  assertEqual(zipPlus4Norm, '06830', 'Unpadded East Coast ZIP+4 "6830-1234" normalizes to "06830"');
  assert(isAffluentZip('6830-1234'), 'Unpadded East Coast ZIP+4 "6830-1234" qualifies as affluent Greenwich CT');

  // Edge 9: Medicaid negation ("Excludes Medicaid", "non-medicaid")
  const excludesMedicaidRes = scoreClinicalSpecialization(
    'All-on-4 dental implants. Full arch reconstructive surgery. Insurance coverage: All major PPOs accepted. Excludes Medicaid.'
  );
  assert(!excludesMedicaidRes.disqualified, '"Excludes Medicaid" is recognized as negated and not disqualified');
  assert(excludesMedicaidRes.qualified, 'Practice with "Excludes Medicaid" qualifies');

  console.log('\n================================================================');
  console.log(`📊 TEST RESULTS SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests > 0) {
    console.error(`💥 ${failedTests} TESTS FAILED!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL QUALIFICATION ENGINE UNIT TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error running qualification test suite:', err);
  process.exit(1);
});
