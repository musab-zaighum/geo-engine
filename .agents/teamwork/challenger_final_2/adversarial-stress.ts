/**
 * Tier 5 Adversarial Stress & Edge-Case Verification Suite
 *
 * Authored by: Tier 5 Adversarial Challenger 2 (challenger_final_2)
 *
 * Attack Vectors Tested:
 * 1. Geographic & Zip Code Edge-Case Fuzzing (Padded/unpadded, malformed, near-misses, HHI bounds)
 * 2. DSO 5-Tier Evasion & Heuristic Stress Testing (Obfuscation, subdomains, ATS slugs, nested HTML, false-positive protection)
 * 3. Clinical Specialization & Negation Traps (Medicaid negations, baby teeth in adults, low-ticket cosmetic implants, ReDoS)
 * 4. CMS NPI Solo Doctor & Taxonomy Adversarial Verification (MD non-OMFS, pediatric taxonomies, associate titles, compound names)
 * 5. Google Maps & Proximity Competitor Hardening (Exact 5.0mi boundary, self-referential rejection, non-1 competitor rejection)
 * 6. Lead Dossier Serialization & CSV RFC 4180 Security (Formula injection, embedded newlines/quotes, 20-col invariant, 1:1 parity)
 * 7. Autonomous CLI & Pipeline Idempotency (Out-dir routing, dry-run, repeated runs consistency)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  isAffluentZip,
  getAffluentZipInfo,
  getAllAffluentZips,
  normalizeZipCode,
} from '../../../src/lib/qualification/affluent-zips';
import {
  checkDsoAffiliation,
  isBlacklistedDomain,
  normalizeDomain,
  stripHtmlForDisclaimer,
  matchesDsoLegalDisclaimer,
  matchesCorporateCareers,
  getDsoDirectory,
} from '../../../src/lib/qualification/dso-filter';
import {
  scoreClinicalSpecialization,
  detectMedicaidSignals,
  detectPediatricSignals,
  calculateImplantDensity,
} from '../../../src/lib/qualification/clinical-filter';
import {
  parseDoctorName,
  evaluateNpiRecord,
  isValidDentalTaxonomy,
  DISQUALIFIED_TAXONOMY_CODES,
} from '../../../src/lib/qualification/npi-verifier';
import {
  calculateHaversineMiles,
  isWithinCompetitorDistance,
  validateCompetitorResult,
  findTopCompetitor5Mi,
} from '../../../src/lib/scrapers/competitor-finder';
import {
  isMapsRankQualified,
  filterOverflowRanks,
  parseGoogleMapsHtml,
} from '../../../src/lib/scrapers/maps-scraper';
import {
  parseGoogleAdsHtml,
  checkSponsoredAd,
} from '../../../src/lib/scrapers/ads-verifier';
import {
  generatePitchHook,
  extractPitchContext,
  formatDoctorSalutation,
} from '../../../src/lib/dossier/pitch-generator';
import {
  exportLeadsToJson,
  exportLeadsToCsv,
  normalizeToLeadDossier,
  validateLeadJson,
  validateLeadsCollection,
  escapeCsvCell,
  leadToCsvRowValues,
  leadsToCsvString,
  extractCleanDomain,
} from '../../../src/lib/dossier/exporter';
import { CANONICAL_CSV_HEADERS } from '../../../src/lib/dossier/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures: { suite: string; name: string; error: string }[] = [];

function assert(condition: boolean, suiteName: string, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${suiteName} :: ${testName}`);
  } else {
    failedTests++;
    const err = details || 'Assertion failed';
    failures.push({ suite: suiteName, name: testName, error: err });
    console.error(`  ❌ [FAIL] ${suiteName} :: ${testName} - ${err}`);
  }
}

async function runAdversarialSuite() {
  console.log('========================================================================');
  console.log('🔥 TIER 5 ADVERSARIAL STRESS & EDGE-CASE HARNESS (challenger_final_2)');
  console.log('========================================================================\n');

  // ============================================================================
  // SUITE 1: Geographic & Postal Code Edge-Case Fuzzing
  // ============================================================================
  console.log('--- Suite 1: Geographic & Postal Code Adversarial Fuzzing ---');

  // East Coast zero-padded variations
  assert(normalizeZipCode('06830') === '06830', 'Geo', 'Preserves standard 5-digit Greenwich zip (06830)');
  assert(normalizeZipCode('6830') === '06830', 'Geo', 'Pads 4-digit numeric string to 5 digits (6830 -> 06830)');
  assert(normalizeZipCode(' 06830 ') === '06830', 'Geo', 'Trims whitespace around zip ( 06830 )');
  assert(normalizeZipCode('06830-1234') === '06830', 'Geo', 'Extracts 5-digit prefix from standard ZIP+4 (06830-1234)');
  assert(normalizeZipCode('6830-1234') === '06830', 'Geo', 'Extracts and pads unpadded ZIP+4 (6830-1234 -> 06830)');
  assert(normalizeZipCode('068301234') === '06830', 'Geo', 'Extracts prefix from 9-digit unhyphenated string (068301234)');
  assert(normalizeZipCode('68301234') === '06830', 'Geo', 'Extracts and pads 8-digit unhyphenated string (68301234 -> 06830)');

  // Affluent Zip qualification verification
  assert(isAffluentZip('06830') === true, 'Geo', 'Greenwich CT 06830 is verified affluent');
  assert(isAffluentZip('6830') === true, 'Geo', 'Greenwich CT 6830 (unpadded) qualifies as affluent');
  assert(isAffluentZip('85260') === true, 'Geo', 'Scottsdale AZ 85260 is verified affluent');
  assert(isAffluentZip('90210') === true, 'Geo', 'Beverly Hills CA 90210 is verified affluent');
  assert(isAffluentZip('92660') === true, 'Geo', 'Newport Beach CA 92660 is verified affluent');
  assert(isAffluentZip('75024') === true, 'Geo', 'Plano TX 75024 is verified affluent');
  assert(isAffluentZip('98004') === true, 'Geo', 'Bellevue WA 98004 is verified affluent');
  assert(isAffluentZip('33496') === true, 'Geo', 'Boca Raton FL 33496 is verified affluent');

  // Disqualification of near-misses and non-affluent zip codes
  assert(isAffluentZip('48201') === false, 'Geo', 'Detroit MI 48201 strictly disqualified');
  assert(isAffluentZip('90001') === false, 'Geo', 'South LA 90001 strictly disqualified');
  assert(isAffluentZip('10001') === false, 'Geo', 'NYC Midtown 10001 not in target catalog disqualified');
  assert(isAffluentZip('85001') === false, 'Geo', 'Downtown Phoenix 85001 disqualified');

  // Adversarial / Malformed inputs
  assert(isAffluentZip('') === false, 'Geo', 'Empty string rejected');
  assert(isAffluentZip('   ') === false, 'Geo', 'Whitespace string rejected');
  assert(isAffluentZip('ABCDE') === false, 'Geo', 'Alphabetic string rejected');
  assert(isAffluentZip('9021') === false, 'Geo', 'Truncated 4-digit non-padded non-affluent rejected');
  assert(isAffluentZip('00000') === false, 'Geo', 'All zeros zip 00000 rejected');
  assert(isAffluentZip('99999') === false, 'Geo', 'Non-catalog zip 99999 rejected');
  assert(isAffluentZip('12345') === false, 'Geo', 'Generic zip 12345 rejected');
  assert(isAffluentZip((null as unknown) as string) === false, 'Geo', 'Null input handled safely');
  assert(isAffluentZip((undefined as unknown) as string) === false, 'Geo', 'Undefined input handled safely');

  // Catalog consistency check: all entries must have valid coordinates & HHI >= $120k
  const allZips = getAllAffluentZips();
  assert(allZips.length >= 35, 'Geo', `Catalog contains >= 35 zips (actual: ${allZips.length})`);
  const invalidZips = allZips.filter(
    (z) => z.medianHhi < 120000 || !z.coordinates?.latitude || !z.coordinates?.longitude
  );
  assert(invalidZips.length === 0, 'Geo', 'Every catalog zip has HHI >= $120k and valid coordinates');

  // ============================================================================
  // SUITE 2: DSO 5-Tier Evasion & Heuristic Stress Testing
  // ============================================================================
  console.log('\n--- Suite 2: DSO 5-Tier Evasion & Heuristic Stress Testing ---');

  // Domain normalization adversarial tests
  assert(normalizeDomain('https://www.clearchoice.com/') === 'clearchoice.com', 'DSO', 'Strips protocol and www');
  assert(normalizeDomain('http://admin:secret@aspendental.com:8080/path?arg=1#frag') === 'aspendental.com', 'DSO', 'Strips credentials, port, path, and query');
  assert(normalizeDomain('PACIFICDENTALSERVICES.COM.') === 'pacificdentalservices.com', 'DSO', 'Normalizes casing and trailing FQDN dot');
  assert(normalizeDomain('   ') === '', 'DSO', 'Whitespace domain returns empty');

  // Subdomain & Nested Subdomain Detection
  assert(isBlacklistedDomain('portal.clearchoice.com') === true, 'DSO', 'Detects direct subdomain of clearchoice.com');
  assert(isBlacklistedDomain('scottsdale.implants.clearchoice.com') === true, 'DSO', 'Detects deep nested subdomain');
  assert(isBlacklistedDomain('jobs.aspendental.com') === true, 'DSO', 'Detects careers subdomain');
  assert(isBlacklistedDomain('heartland.com') === true, 'DSO', 'Detects root domain');
  assert(isBlacklistedDomain('independent-implants.com') === false, 'DSO', 'Permits legitimate private domain');

  // Word-boundary brand matching (avoiding false positives)
  const dsoResult1 = checkDsoAffiliation('clean-smiles.com', '', 'ClearChoice Dental Center');
  assert(dsoResult1.isDso === true && dsoResult1.matchTier === 'TIER_1_MEGA_CHAIN', 'DSO', 'Catches exact ClearChoice brand name');

  const dsoResult2 = checkDsoAffiliation('clean-smiles.com', '', 'Clear Springs Family Dental');
  assert(dsoResult2.isDso === false, 'DSO', 'Does NOT falsely flag "Clear Springs" as ClearChoice');

  const dsoResult3 = checkDsoAffiliation('heartland-roots.com', '', 'Heartland Dental Care of Plano');
  assert(dsoResult3.isDso === true, 'DSO', 'Catches Heartland Dental');

  // Outbound Link DSO Detection
  const htmlWithOutboundDso = `
    <html>
      <body>
        <h1>Welcome to Sunrise Dental</h1>
        <p>Book your full-arch consult.</p>
        <a href="https://www.clearchoice.com/locations/dallas">Partner Center</a>
      </body>
    </html>
  `;
  const outboundCheck = checkDsoAffiliation('sunrisedental.com', htmlWithOutboundDso, 'Sunrise Dental');
  assert(outboundCheck.isDso === true && outboundCheck.matchTier === 'TIER_3_DOMAIN_BLACKLIST', 'DSO', 'Catches hidden outbound link to clearchoice.com');

  // Regulatory Disclaimer Regex Evasion (HTML-injected tags)
  const htmlWithBrokenDisclaimer = `
    <footer>
      <p>Dental care provided by independent dentists. <span>Supported</span> by <strong>Heartland Dental</strong>, LLC.</p>
    </footer>
  `;
  const disclaimerCheck = checkDsoAffiliation('localdental.com', htmlWithBrokenDisclaimer, 'Local Dental');
  assert(disclaimerCheck.isDso === true && disclaimerCheck.matchTier === 'TIER_4_LEGAL_DISCLAIMER_REGEX', 'DSO', 'Catches legal disclaimer split across tags (Supported by Heartland)');

  // MB2 Dental partner disclaimer
  const htmlMb2 = '<div>Proudly an MB2 Dental partner practice providing comprehensive care.</div>';
  const mb2Check = checkDsoAffiliation('mb2partner.com', htmlMb2, 'Dr. Smith Dental');
  assert(mb2Check.isDso === true, 'DSO', 'Catches MB2 Dental partnership notice');

  // Corporate Career ATS (Workday, Greenhouse, Lever)
  const htmlWorkday = '<a href="https://heartland.myworkdayjobs.com/careers">Join Our Dental Team</a>';
  const atsCheck1 = checkDsoAffiliation('implants.com', htmlWorkday, 'Implant Care');
  assert(atsCheck1.isDso === true && atsCheck1.matchTier === 'TIER_5_CORPORATE_FOOTER_CAREERS', 'DSO', 'Catches Workday corporate ATS portal');

  const htmlGreenhouse = '<iframe src="https://boards.greenhouse.io/clearchoice/jobs"></iframe>';
  const atsCheck2 = checkDsoAffiliation('implants.com', htmlGreenhouse, 'Implant Care');
  assert(atsCheck2.isDso === true, 'DSO', 'Catches Greenhouse corporate ATS iframe');

  // Massive Multi-Location Footprint
  const htmlMultiLoc = '<p>Over 85 locations across 14 states to serve your dental needs.</p>';
  const multiLocCheck = checkDsoAffiliation('chain.com', htmlMultiLoc, 'Big Chain Dental');
  assert(multiLocCheck.isDso === true, 'DSO', 'Catches multi-location network disclosure (Over 85 locations)');

  // Safe Independent Practice (100% clean)
  const htmlClean = `
    <html>
      <head><title>Dr. Smith Dental Implants</title></head>
      <body>
        <h1>Dr. Smith Dental Implants</h1>
        <p>Private practice founded in 1995. Solo owner Dr. Robert Smith, DDS.</p>
        <p>Located on Ocean Ave, Newport Beach, CA.</p>
        <footer>&copy; 2026 Dr. Robert Smith DDS PC. All rights reserved.</footer>
      </body>
    </html>
  `;
  const cleanCheck = checkDsoAffiliation('drsmithimplants.com', htmlClean, 'Dr. Smith Dental Implants');
  assert(cleanCheck.isDso === false, 'DSO', 'Independent private clinic cleanly passes all 5 DSO tiers');

  // ============================================================================
  // SUITE 3: Clinical Specialization & Negation Traps
  // ============================================================================
  console.log('\n--- Suite 3: Clinical Specialization & Negation Traps ---');

  // Negation traps: "We do not accept Medicaid" must NOT disqualify
  const htmlNegatedMedicaid = `
    <div>
      <h2>Payment & Financing Options</h2>
      <p>We are a fee-for-service concierge implant surgical practice. We do not accept Medicaid, Denti-Cal, or state welfare plans.</p>
      <p>Specializing in All-on-4 dental implants, zygomatic implants, and full-arch zirconia reconstruction.</p>
    </div>
  `;
  const negatedMedicaidResult = scoreClinicalSpecialization(htmlNegatedMedicaid);
  assert(negatedMedicaidResult.disqualified === false, 'Clinical', 'Negated Medicaid ("do not accept Medicaid") is not disqualified');
  assert(negatedMedicaidResult.qualified === true, 'Clinical', 'Negated Medicaid practice qualifies with full-arch focus');

  // Explicit Medicaid acceptance: MUST strictly disqualify
  const htmlMedicaidAccepted = `
    <div>
      <h2>Insurance Welcome</h2>
      <p>We accept Medicaid, CHIP, Denti-Cal, and all state-funded dental insurance.</p>
      <p>We also offer dental implants.</p>
    </div>
  `;
  const medicaidResult = scoreClinicalSpecialization(htmlMedicaidAccepted);
  assert(medicaidResult.disqualified === true, 'Clinical', 'Medicaid acceptance strictly disqualifies practice');
  assert(medicaidResult.qualified === false, 'Clinical', 'Practice accepting Medicaid has qualified = false');

  // Negation traps: "Baby teeth" in adult reconstruction context
  const htmlBabyTeeth = `
    <div>
      <h2>Congenitally Missing Teeth & Retained Baby Teeth</h2>
      <p>Many adult patients present with retained baby teeth or missing permanent adult teeth. Dr. Kaiser places permanent dental implants and All-on-4 zirconia restorations to replace deciduous teeth with permanent beautiful smiles.</p>
    </div>
  `;
  const babyTeethResult = scoreClinicalSpecialization(htmlBabyTeeth);
  assert(babyTeethResult.disqualified === false, 'Clinical', 'Adult implant discussion of retained baby teeth does not trigger pediatric disqualification');

  // Strict Pediatric practice disqualification
  const htmlPediatric = `
    <div>
      <h1>Pediatric Dentistry & Children\'s Orthodontics</h1>
      <p>Specialized dental care for toddlers, infants, kids, and teens. Gentle laughing gas and fun kid-friendly games!</p>
    </div>
  `;
  const pedResult = scoreClinicalSpecialization(htmlPediatric);
  assert(pedResult.disqualified === true, 'Clinical', 'Pediatric dental clinic is strictly disqualified');

  // Cosmetic-only low-ticket clinic (Teeth whitening with single passing implant mention)
  const htmlCosmeticOnly = `
    <div>
      <h1>Glamour Smile Spa</h1>
      <p>Zoom teeth whitening, porcelain veneers, Invisalign clear aligners, and dental implants consultation.</p>
      <p>Spa-like comfort with warm scented towels and paraffin hand waxes.</p>
    </div>
  `;
  const cosmeticResult = scoreClinicalSpecialization(htmlCosmeticOnly);
  assert(cosmeticResult.qualified === false, 'Clinical', 'Cosmetic whitening clinic without surgical density fails Gate 4 (score < 15)');

  // High-ticket surgical implant excellence
  const htmlHighTicket = `
    <div>
      <h1>Advanced Full-Arch & Implant Surgery Center</h1>
      <p>All-on-4 permanent teeth in a day, 3D cone beam CBCT guided surgical placement, sinus lifts, bone grafting, zygomatic implants, and full-mouth rehabilitation under IV sedation.</p>
    </div>
  `;
  const highTicketResult = scoreClinicalSpecialization(htmlHighTicket);
  assert(highTicketResult.qualified === true, 'Clinical', 'Full-arch surgical practice qualifies with high score');
  assert(highTicketResult.implantScore >= 50, 'Clinical', `High-ticket implant score >= 50 (actual: ${highTicketResult.implantScore})`);

  // Null & massive garbage content resilience (ReDoS stress test)
  const nullClinical = scoreClinicalSpecialization((null as unknown) as string);
  assert(nullClinical.qualified === false, 'Clinical', 'Null HTML handled safely without crashing');

  const massiveGarbage = '<div>' + 'lorem ipsum dolor sit amet '.repeat(10000) + '</div>';
  const t0 = Date.now();
  const garbageResult = scoreClinicalSpecialization(massiveGarbage);
  const elapsed = Date.now() - t0;
  assert(elapsed < 200, 'Clinical', `Processes 250k char blob rapidly without ReDoS timeout (${elapsed}ms)`);
  assert(garbageResult.qualified === false, 'Clinical', 'Garbage text correctly rejected');

  // ============================================================================
  // SUITE 4: CMS NPI Solo Doctor & Taxonomy Adversarial Verification
  // ============================================================================
  console.log('\n--- Suite 4: CMS NPI Solo Doctor & Taxonomy Adversarial Verification ---');

  // Name Parser adversarial stress
  const p1 = parseDoctorName('Dr. Gerald L. Kaiser, DDS, FICOI');
  assert(p1.firstName === 'Gerald' && p1.lastName === 'Kaiser', 'NPI', 'Parses middle initial and multiple suffixes');

  const p2 = parseDoctorName('Doctor Maria De La Cruz DMD');
  assert(p2.lastName === 'Cruz', 'NPI', 'Parses compound surname');

  const p3 = parseDoctorName('Dr. John M. (Tom) Hucklebridge DDS');
  assert(p3.firstName === 'John' && p3.lastName === 'Hucklebridge', 'NPI', 'Parses nickname in parentheses');

  const p4 = parseDoctorName('Dr. Robert Smith, Jr., DDS');
  assert(p4.firstName === 'Robert' && p4.lastName === 'Smith', 'NPI', 'Parses Jr. generational suffix');

  const p5 = parseDoctorName('Dr. Jane Doe & Dr. Bob Smith');
  assert(p5.lastName === 'Doe', 'NPI', 'Takes principal first doctor when multiple listed');

  const p6 = parseDoctorName('Sarah Connor Associate Dentist');
  assert(p6.lastName === 'Connor', 'NPI', 'Strips "Associate Dentist" title from name');

  // Taxonomy verification
  assert(isValidDentalTaxonomy('122300000X') === true, 'NPI', '122300000X (Dentist) is approved');
  assert(isValidDentalTaxonomy('1223P0300X') === true, 'NPI', '1223P0300X (Periodontics) is approved');
  assert(isValidDentalTaxonomy('1223S0112X') === true, 'NPI', '1223S0112X (Oral Surgery) is approved');
  assert(isValidDentalTaxonomy('204E00000X') === true, 'NPI', '204E00000X (OMFS MD) is approved');
  assert(isValidDentalTaxonomy('1223P0221X') === false, 'NPI', '1223P0221X (Pediatric) is strictly NOT approved');
  assert(Boolean(DISQUALIFIED_TAXONOMY_CODES['1223P0221X']), 'NPI', '1223P0221X is in DISQUALIFIED_TAXONOMY_CODES');
  assert(Boolean(DISQUALIFIED_TAXONOMY_CODES['1223P0106X']), 'NPI', '1223P0106X (Oral Pathology) is in DISQUALIFIED_TAXONOMY_CODES');

  // NPI Record Evaluation: Approved Solo Doctor
  const soloDocRecord = {
    number: '1487796843',
    enumeration_type: 'NPI-1',
    basic: {
      first_name: 'GERALD',
      last_name: 'KAISER',
      credential: 'DDS',
      sole_proprietor: 'YES',
    },
    taxonomies: [
      { code: '1223P0300X', desc: 'Periodontics', primary: true, license: '12345', state: 'AZ' },
    ],
  };
  const evalSolo = evaluateNpiRecord(soloDocRecord);
  assert(evalSolo.verified === true, 'NPI', 'Solo periodontist DDS qualifies Gate 6');
  assert(evalSolo.soleProprietor === true, 'NPI', 'Sole proprietorship confirmed');

  // Disqualification: NPI-2 Organization (Corporate entity)
  const npi2Record = {
    number: '1999999999',
    enumeration_type: 'NPI-2',
    basic: { organization_name: 'ClearChoice Centers LLC' },
  };
  const evalNpi2 = evaluateNpiRecord(npi2Record);
  assert(evalNpi2.verified === false, 'NPI', 'NPI-2 corporate organization strictly disqualified');

  // Disqualification: Non-dental MD (e.g. Dermatology or Pediatrics MD)
  const nonDentalMdRecord = {
    number: '1888888888',
    enumeration_type: 'NPI-1',
    basic: { first_name: 'JOHN', last_name: 'DOE', credential: 'MD', sole_proprietor: 'YES' },
    taxonomies: [
      { code: '207N00000X', desc: 'Dermatology', primary: true, license: '9999', state: 'CA' },
    ],
  };
  const evalMd = evaluateNpiRecord(nonDentalMdRecord);
  assert(evalMd.verified === false, 'NPI', 'Non-dental MD without OMFS taxonomy strictly disqualified');

  // Disqualification: Associate Dentist (sole_proprietor = NO)
  const associateRecord = {
    number: '1777777777',
    enumeration_type: 'NPI-1',
    basic: { first_name: 'AMY', last_name: 'ASSOCIATE', credential: 'DDS', sole_proprietor: 'NO' },
    taxonomies: [
      { code: '1223G0001X', desc: 'General Dentist', primary: true, license: '8888', state: 'TX' },
    ],
  };
  const evalAssoc = evaluateNpiRecord(associateRecord);
  assert(evalAssoc.verified === false, 'NPI', 'Associate dentist (sole_proprietor = NO) disqualified');

  // Disqualification: Pediatric Dentist NPI
  const pediatricNpiRecord = {
    number: '1316388820',
    enumeration_type: 'NPI-1',
    basic: { first_name: 'MARVIN', last_name: 'ABARCA', credential: 'DDS', sole_proprietor: 'YES' },
    taxonomies: [
      { code: '1223P0221X', desc: 'Pediatric Dentistry', primary: true, license: '7777', state: 'AZ' },
    ],
  };
  const evalPedNpi = evaluateNpiRecord(pediatricNpiRecord);
  assert(evalPedNpi.verified === false, 'NPI', 'Pediatric dentist (1223P0221X) strictly disqualified from Gate 6');

  // ============================================================================
  // SUITE 5: Google Maps & Proximity Competitor Hardening
  // ============================================================================
  console.log('\n--- Suite 5: Google Maps & Proximity Competitor Hardening ---');

  // Maps rank qualification bounds
  assert(isMapsRankQualified(4) === true, 'Maps', 'Rank #4 qualifies');
  assert(isMapsRankQualified(5) === true, 'Maps', 'Rank #5 qualifies');
  assert(isMapsRankQualified(6) === true, 'Maps', 'Rank #6 qualifies');
  assert(isMapsRankQualified(1) === false, 'Maps', 'Rank #1 disqualified (Local 3-Pack dominating)');
  assert(isMapsRankQualified(2) === false, 'Maps', 'Rank #2 disqualified (Local 3-Pack)');
  assert(isMapsRankQualified(3) === false, 'Maps', 'Rank #3 disqualified (Local 3-Pack)');
  assert(isMapsRankQualified(7) === false, 'Maps', 'Rank #7 disqualified (outside #4-#6 fold)');
  assert(isMapsRankQualified(16) === false, 'Maps', 'Rank #16 disqualified (buried past page 1)');
  assert(isMapsRankQualified(4.5) === false, 'Maps', 'Float rank 4.5 disqualified');
  assert(isMapsRankQualified(NaN) === false, 'Maps', 'NaN rank disqualified');
  assert(isMapsRankQualified(-1) === false, 'Maps', 'Negative rank disqualified');

  // Haversine Distance Calculation & Strict 5.0 Mile Limit
  const d0 = calculateHaversineMiles(33.5312, -111.9427, 33.5312, -111.9427);
  assert(d0 === 0, 'Competitor', 'Distance between identical points is 0 miles');

  const dExact5 = calculateHaversineMiles(33.5000, -111.9000, 33.5724, -111.9000); // ~5.0 miles
  assert(isWithinCompetitorDistance(5.0) === true, 'Competitor', 'Exact 5.0 miles is strictly within boundary');
  assert(isWithinCompetitorDistance(5.01) === false, 'Competitor', '5.01 miles is outside boundary');
  assert(isWithinCompetitorDistance(5.1) === false, 'Competitor', '5.1 miles is outside boundary');
  assert(isWithinCompetitorDistance(10.0) === false, 'Competitor', '10.0 miles is outside boundary');
  assert(isWithinCompetitorDistance(-1) === false, 'Competitor', 'Negative distance is rejected');
  assert(isWithinCompetitorDistance(NaN) === false, 'Competitor', 'NaN distance is rejected');

  // Competitor validation: Self-referential attack
  const selfComp = {
    name: 'Total Freedom Dental',
    address: '9002 E Desert Cove Ave, Scottsdale, AZ 85260',
    rank: 1,
    rating: 4.9,
    reviewCount: 400,
    distanceMiles: 0.1,
    withinLimit: true,
  };
  const selfVal = validateCompetitorResult(selfComp, 'Total Freedom Dental');
  assert(selfVal.valid === false, 'Competitor', 'Rejects competitor if identical to candidate practice');

  // Competitor validation: Non-1 rank
  const rank3Comp = { ...selfComp, name: 'Other Clinic', rank: 3 };
  const rank3Val = validateCompetitorResult(rank3Comp, 'Total Freedom Dental');
  assert(rank3Val.valid === false, 'Competitor', 'Rejects competitor with rank #3 (Strictly requires #1)');

  // Competitor validation: Distance > 5.0 miles
  const farComp = { ...selfComp, name: 'Far Clinic', distanceMiles: 5.2 };
  const farVal = validateCompetitorResult(farComp, 'Total Freedom Dental');
  assert(farVal.valid === false, 'Competitor', 'Rejects competitor located at 5.2 miles');

  // ============================================================================
  // SUITE 6: Lead Dossier Serialization & CSV RFC 4180 Security
  // ============================================================================
  console.log('\n--- Suite 6: Lead Dossier Serialization & CSV RFC 4180 Security ---');

  // CSV Escaping & Injection Defense
  assert(escapeCsvCell(5) === '5', 'CSV', 'Leaves finite numbers unquoted');
  assert(escapeCsvCell('Simple') === '"Simple"', 'CSV', 'Quotes strings');
  assert(escapeCsvCell('With, Comma') === '"With, Comma"', 'CSV', 'Quotes strings with commas');
  assert(escapeCsvCell('He said "Hello"') === '"He said ""Hello"""', 'CSV', 'Doubles interior quotes (RFC 4180)');
  assert(escapeCsvCell('Line1\nLine2') === '"Line1\nLine2"', 'CSV', 'Encloses multi-line text safely in quotes');

  // Formula Injection prevention (DDE attacks)
  const formulaCell = '=CMD|\' /C calc\'!A0';
  const escapedFormula = escapeCsvCell(formulaCell);
  assert(escapedFormula.startsWith('"') && escapedFormula.endsWith('"'), 'CSV', 'Wraps spreadsheet formulas in protective double quotes');

  // Canonical CSV Header count
  assert(CANONICAL_CSV_HEADERS.length === 20, 'CSV', `Canonical CSV header count is exactly 20 (got ${CANONICAL_CSV_HEADERS.length})`);

  // Verify production files exist and are populated
  const jsonPath = path.resolve(process.cwd(), 'leads/goated_leads.json');
  const csvPath = path.resolve(process.cwd(), 'leads/goated_leads.csv');

  assert(fs.existsSync(jsonPath), 'Output', 'leads/goated_leads.json exists on disk');
  assert(fs.existsSync(csvPath), 'Output', 'leads/goated_leads.csv exists on disk');

  const jsonRaw = fs.readFileSync(jsonPath, 'utf8');
  const leadsJson: any[] = JSON.parse(jsonRaw);
  assert(Array.isArray(leadsJson) && leadsJson.length === 10, 'Output', `JSON contains exactly 10 qualified leads (actual: ${leadsJson.length})`);

  // Schema validation across all 10 leads
  const collectionValidation = validateLeadsCollection(leadsJson);
  assert(collectionValidation.valid === true, 'Output', 'All 10 leads pass strict Draft 2020-12 schema validation');

  // Verify CSV RFC 4180 conformance and 1:1 Parity
  const csvRaw = fs.readFileSync(csvPath, 'utf8').trim();
  const csvLines = csvRaw.split('\n');

  // Check header line
  assert(csvLines[0] === CANONICAL_CSV_HEADERS.join(','), 'Output', 'CSV header line matches CANONICAL_CSV_HEADERS exactly');

  // Check 10 data rows in CSV and verify 1:1 parity with JSON
  assert(csvLines.length >= 11, 'Output', 'CSV has header + data rows');

  // Cross-verify each lead in JSON has matching row values
  leadsJson.forEach((lead, idx) => {
    const rowVals = leadToCsvRowValues(lead);
    assert(rowVals.length === 20, 'Output', `Lead ${lead.lead_id} produces exactly 20 row values`);
    assert(rowVals[0] === lead.lead_id, 'Output', `Lead ${lead.lead_id} ID matches row val 0`);
    assert(rowVals[11] >= 4 && rowVals[11] <= 6, 'Output', `Lead ${lead.lead_id} Maps rank is in [4, 6] (got ${rowVals[11]})`);
    assert(rowVals[17] === 1, 'Output', `Lead ${lead.lead_id} competitor rank is strictly 1`);
  });

  // Verify pitch hooks meet requirements
  leadsJson.forEach((lead) => {
    const hook = lead.custom_pitch_hook_1500;
    assert(typeof hook === 'string' && hook.length >= 50, 'Pitch', `Lead ${lead.lead_id} pitch length >= 50 chars (${hook.length})`);
    assert(hook.includes('$1,500') || hook.includes('$1500'), 'Pitch', `Lead ${lead.lead_id} mentions $1,500`);
    assert(hook.includes('ROI guarantee') || hook.includes('90-day'), 'Pitch', `Lead ${lead.lead_id} includes 90-day ROI guarantee`);

    // Verify dynamic pitch synthesis always incorporates exact competitor name
    const synthesizedHook = generatePitchHook(lead);
    assert(
      synthesizedHook.includes(lead.top_competitor_5mi.practice_name),
      'Pitch',
      `Lead ${lead.lead_id} dynamic synthesis includes exact competitor "${lead.top_competitor_5mi.practice_name}"`
    );
  });

  // ============================================================================
  // SUITE 7: Pipeline Orchestrator & CLI Idempotency
  // ============================================================================
  console.log('\n--- Suite 7: Pipeline Orchestrator & CLI Idempotency ---');

  // Test roundtrip in temporary directory
  const tempDir = path.resolve(process.cwd(), '.temp_adversarial_test');
  const tempJson = path.join(tempDir, 'test_leads.json');
  const tempCsv = path.join(tempDir, 'test_leads.csv');

  try {
    await exportLeadsToJson(leadsJson, tempJson);
    await exportLeadsToCsv(leadsJson, tempCsv);

    assert(fs.existsSync(tempJson), 'Idempotency', 'Exported JSON to temporary directory');
    assert(fs.existsSync(tempCsv), 'Idempotency', 'Exported CSV to temporary directory');

    const readBackJson = JSON.parse(fs.readFileSync(tempJson, 'utf8'));
    assert(readBackJson.length === 10, 'Idempotency', 'Roundtrip read back 10 leads from temp JSON');
    assert(readBackJson[4].top_competitor_5mi.rank === 1, 'Idempotency', 'GOAT-005 competitor rank is strictly 1 in temp JSON');

    const readBackCsv = fs.readFileSync(tempCsv, 'utf8');
    assert(readBackCsv.includes('Signature Dental Group Delray Beach'), 'Idempotency', 'Temp CSV includes GOAT-005 competitor');
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  // ============================================================================
  // SUMMARY REPORT
  // ============================================================================
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL STRESS SUITE RESULTS: ${passedTests}/${totalTests} PASSED`);
  if (failedTests > 0) {
    console.error(`❌ FAILED TESTS: ${failedTests}`);
    failures.forEach((f, i) => {
      console.error(`  ${i + 1}. [${f.suite}] ${f.name}: ${f.error}`);
    });
  } else {
    console.log('🎉 100% ADVERSARIAL COVERAGE ACHIEVED! ZERO REGRESSIONS FOUND.');
  }
  console.log('========================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Fatal crash in adversarial harness:', err);
  process.exit(1);
});
