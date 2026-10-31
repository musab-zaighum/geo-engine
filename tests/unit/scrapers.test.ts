/**
 * Comprehensive Unit Test Suite: Milestone 2 Scrapers and Signal Pipeline
 *
 * Verifies:
 * - Google Maps Local Pack Ranker (#4-#6 overflow prospects & #1 competitor)
 * - Paid Google Ads "Sponsored" Signal Verification Engine
 * - Proximity Competitor Finder & Haversine Distance Calculator (<= 5.0 miles)
 * - HTML parsers, domain matching, and edge case resilience
 *
 * Execution:
 * npx tsx tests/unit/scrapers.test.ts
 */

import {
  getMapsRankings,
  isMapsRankQualified,
  filterOverflowRanks,
  findRank1Listing,
  parseGoogleMapsHtml,
  getChromeExecutablePath,
} from '../../src/lib/scrapers/maps-scraper';

import {
  checkSponsoredAd,
  verifyGoogleAdsSignal,
  parseGoogleAdsHtml,
  HIGH_INTENT_IMPLANT_KEYWORDS,
} from '../../src/lib/scrapers/ads-verifier';

import {
  calculateHaversineMiles,
  isWithinCompetitorDistance,
  validateCompetitorResult,
  findTopCompetitor5Mi,
  METRO_RANK1_COMPETITORS,
  MAX_COMPETITOR_DISTANCE_MILES,
} from '../../src/lib/scrapers/competitor-finder';

import {
  MapsRankResult,
  GoogleAdsSignal,
  CompetitorResult,
} from '../../src/lib/scrapers/types';

// Zero-dependency assertion harness
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  totalTests++;
  if (actual === expected) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message} (Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)})`);
  }
}

async function runScrapersTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING MILESTONE 2 SCRAPERS & SIGNAL PIPELINE UNIT TESTS');
  console.log('================================================================\n');

  // ============================================================================
  // SUITE 1: GOOGLE MAPS RANK QUALIFICATION LOGIC
  // ============================================================================
  console.log('--- Suite 1: Google Maps Rank Qualification Logic ---');

  // Ranks 4, 5, 6 strictly qualified
  assert(isMapsRankQualified(4), 'Rank #4 is qualified');
  assert(isMapsRankQualified(5), 'Rank #5 is qualified');
  assert(isMapsRankQualified(6), 'Rank #6 is qualified');

  // Ranks 1, 2, 3 (Local 3-Pack) strictly disqualified
  assert(!isMapsRankQualified(1), 'Rank #1 is disqualified (in Local 3-Pack)');
  assert(!isMapsRankQualified(2), 'Rank #2 is disqualified (in Local 3-Pack)');
  assert(!isMapsRankQualified(3), 'Rank #3 is disqualified (in Local 3-Pack)');

  // Ranks beyond #6 disqualified
  assert(!isMapsRankQualified(7), 'Rank #7 is disqualified (outside #4-#6 fold)');
  assert(!isMapsRankQualified(10), 'Rank #10 is disqualified');
  assert(!isMapsRankQualified(16), 'Rank #16 is disqualified (buried past page 1)');

  // Boundary and edge cases
  assert(!isMapsRankQualified(0), 'Rank 0 is disqualified');
  assert(!isMapsRankQualified(-1), 'Negative rank is disqualified');
  assert(!isMapsRankQualified(4.5), 'Float rank 4.5 is disqualified');
  assert(!isMapsRankQualified(NaN), 'NaN rank is disqualified');
  assert(!isMapsRankQualified(undefined as any), 'Undefined rank is disqualified');

  // Test filterOverflowRanks
  const testList: MapsRankResult[] = [
    { rank: 1, isQualifiedRank: false, name: 'Rank 1 Clinic' },
    { rank: 2, isQualifiedRank: false, name: 'Rank 2 Clinic' },
    { rank: 4, isQualifiedRank: true, name: 'Rank 4 Clinic' },
    { rank: 5, isQualifiedRank: true, name: 'Rank 5 Clinic' },
    { rank: 6, isQualifiedRank: true, name: 'Rank 6 Clinic' },
    { rank: 7, isQualifiedRank: false, name: 'Rank 7 Clinic' },
  ];
  const filtered = filterOverflowRanks(testList);
  assertEqual(filtered.length, 3, 'filterOverflowRanks returns exactly 3 results');
  assertEqual(filtered[0].rank, 4, 'First overflow rank is #4');
  assertEqual(filtered[1].rank, 5, 'Second overflow rank is #5');
  assertEqual(filtered[2].rank, 6, 'Third overflow rank is #6');

  // Test findRank1Listing
  const rank1Item = findRank1Listing(testList);
  assert(Boolean(rank1Item), 'findRank1Listing finds rank 1 listing');
  assertEqual(rank1Item?.name, 'Rank 1 Clinic', 'Found correct rank 1 listing name');

  // Ignore ad listings when finding organic rank 1
  const testListWithAd: MapsRankResult[] = [
    { rank: 0, isQualifiedRank: false, name: 'Sponsored Ad Clinic', isAd: true },
    { rank: 1, isQualifiedRank: false, name: 'Organic Rank 1 Clinic', isAd: false },
  ];
  const organicRank1 = findRank1Listing(testListWithAd);
  assertEqual(organicRank1?.name, 'Organic Rank 1 Clinic', 'findRank1Listing ignores paid ad and returns organic #1');
  console.log();

  // ============================================================================
  // SUITE 2: GOOGLE MAPS HTML PARSER
  // ============================================================================
  console.log('--- Suite 2: Google Maps HTML Parser ---');

  const sampleMapsHtml = `
    <div role="feed">
      <div class="Nv2PK" data-result-index="1">
        <a class="hfpxzc" aria-label="ClearChoice Dental Implant Center Scottsdale" href="/maps/place/ClearChoice"></a>
        <div class="qBF1Pd fontHeadlineSmall">ClearChoice Dental Implant Center Scottsdale</div>
        <span class="MW4etd">4.8</span>
        <span class="UY7F9">(412)</span>
        <div class="W4Efsd">7373 N Scottsdale Rd · (480) 555-0101</div>
        <a data-value="Website" href="https://www.clearchoice.com/scottsdale">Website</a>
      </div>
      <div class="Nv2PK" data-result-index="2">
        <div class="qBF1Pd fontHeadlineSmall">Total Freedom Dental Implant Center</div>
        <span class="MW4etd">4.9</span>
        <span class="UY7F9">(185)</span>
        <div class="W4Efsd">8415 N Pima Rd Ste 100 · (480) 418-2000</div>
        <a data-value="Website" href="https://totalfreedomdental.com">Website</a>
      </div>
      <div class="Nv2PK" data-result-index="3">
        <span class="k87ddb">Sponsored</span>
        <div class="qBF1Pd fontHeadlineSmall">Aspen Dental Sponsored Ad</div>
        <span class="MW4etd">4.2</span>
        <span class="UY7F9">(80)</span>
      </div>
    </div>
  `;

  const parsedMaps = parseGoogleMapsHtml(sampleMapsHtml, 'dental implants Scottsdale AZ', 'Scottsdale', 'AZ');
  assertEqual(parsedMaps.length, 3, 'Parsed 3 cards from Google Maps HTML');
  assertEqual(parsedMaps[0].name, 'ClearChoice Dental Implant Center Scottsdale', 'Parsed Card 1 name correctly');
  assertEqual(parsedMaps[0].rank, 1, 'Card 1 is organic rank #1');
  assertEqual(parsedMaps[0].rating, 4.8, 'Parsed Card 1 rating 4.8');
  assertEqual(parsedMaps[0].reviewCount, 412, 'Parsed Card 1 reviews 412');
  assertEqual(parsedMaps[0].phone, '(480) 555-0101', 'Parsed Card 1 phone number');
  assertEqual(parsedMaps[0].domain, 'clearchoice.com', 'Parsed Card 1 clean domain');

  assertEqual(parsedMaps[1].name, 'Total Freedom Dental Implant Center', 'Parsed Card 2 name correctly');
  assertEqual(parsedMaps[1].rank, 2, 'Card 2 is organic rank #2');
  assertEqual(parsedMaps[1].rating, 4.9, 'Parsed Card 2 rating 4.9');
  assertEqual(parsedMaps[1].domain, 'totalfreedomdental.com', 'Parsed Card 2 domain');

  // Ad card detection
  assertEqual(parsedMaps[2].isAd, true, 'Card 3 is identified as Sponsored ad');
  assertEqual(parsedMaps[2].rank, 0, 'Card 3 ad has rank 0');
  console.log();

  // ============================================================================
  // SUITE 3: GOOGLE MAPS RANKINGS PIPELINE
  // ============================================================================
  console.log('--- Suite 3: Google Maps Rankings Pipeline ---');

  const scottsdaleRanks = await getMapsRankings('dental implants', 'Scottsdale', 'AZ', { useMock: true });
  assert(scottsdaleRanks.length >= 6, 'Scottsdale rankings returned >= 6 listings');

  const scottsdaleRank1 = findRank1Listing(scottsdaleRanks);
  assert(Boolean(scottsdaleRank1), 'Found Rank #1 in Scottsdale');
  assertEqual(scottsdaleRank1?.rank, 1, 'Rank 1 has rank number 1');

  const scottsdaleOverflow = filterOverflowRanks(scottsdaleRanks);
  assertEqual(scottsdaleOverflow.length, 3, 'Found exactly 3 prospects in overflow fold #4-#6');
  assert(scottsdaleOverflow.some((r) => r.rank === 4), 'Includes rank #4');
  assert(scottsdaleOverflow.some((r) => r.rank === 5), 'Includes rank #5');
  assert(scottsdaleOverflow.some((r) => r.rank === 6), 'Includes rank #6');

  // Boca Raton rankings
  const bocaRanks = await getMapsRankings('all on 4', 'Boca Raton', 'FL', { useMock: true });
  const bocaOverflow = filterOverflowRanks(bocaRanks);
  assertEqual(bocaOverflow.length, 3, 'Boca Raton has 3 overflow prospects');
  console.log();

  // ============================================================================
  // SUITE 4: GOOGLE ADS "SPONSORED" SIGNAL VERIFIER
  // ============================================================================
  console.log('--- Suite 4: Google Ads "Sponsored" Signal Verifier ---');

  const sampleSerpHtml = `
    <div id="search">
      <div class="uE20Vc" data-text-ad="1">
        <div><span>Sponsored</span></div>
        <div role="heading">Total Freedom Dental Implant Center | Full Arch Implants</div>
        <div class="B6fmyf">totalfreedomdental.com</div>
        <a href="https://totalfreedomdental.com/implants">Visit Site</a>
        <div class="MUxGbd">Specializing in full arch All-on-4 dental implants. Permanent teeth in 24 hours.</div>
      </div>
      <div class="uE20Vc" data-text-ad="1">
        <div><span>Sponsored</span></div>
        <div role="heading">ClearChoice Dental Implants</div>
        <div class="B6fmyf">clearchoice.com</div>
        <a href="https://www.clearchoice.com">Visit Site</a>
      </div>
    </div>
  `;

  // Parse Google Ads HTML for target domain
  const adsSignal = parseGoogleAdsHtml(sampleSerpHtml, 'totalfreedomdental.com');
  assert(adsSignal.hasActiveAds, 'parseGoogleAdsHtml detects active sponsored ad for target domain');
  assert(Boolean(adsSignal.isSponsoredVerified), 'isSponsoredVerified is true');
  assertEqual(adsSignal.domain, 'totalfreedomdental.com', 'Matches target domain');
  assert(Boolean(adsSignal.adHeadlines && adsSignal.adHeadlines.length > 0), 'Extracted ad headlines');
  assert(Boolean(adsSignal.estimatedCpc?.includes('$')), 'Estimated CPC contains dollar values ($50-$100/click)');

  // Parse Google Ads HTML for non-advertising domain
  const noAdsSignal = parseGoogleAdsHtml(sampleSerpHtml, 'unrelatedpractice.com');
  assert(!noAdsSignal.hasActiveAds, 'Non-advertising domain has hasActiveAds: false');
  assert(!noAdsSignal.isSponsoredVerified, 'isSponsoredVerified is false for non-advertiser');

  // Check checkSponsoredAd with mock data
  const checkSignal = await checkSponsoredAd('totalfreedomdental.com', 'dental implants near me', { useMock: true });
  assert(checkSignal.hasActiveAds, 'checkSponsoredAd returns active ads for verified domain');
  assertEqual(checkSignal.advertiserName, 'Total Freedom Dental Implant Center', 'Resolves verified advertiser name');
  assertEqual(checkSignal.keyword, 'dental implants near me', 'Captures verified keyword signal');

  // Check verifyGoogleAdsSignal with multiple keywords
  const multiSignal = await verifyGoogleAdsSignal('bocaislesdental.com', 'Boca Isles Dental', undefined, { useMock: true });
  assert(multiSignal.hasActiveAds, 'verifyGoogleAdsSignal confirms active ads for Boca Isles Dental');
  assert(Boolean(multiSignal.activeAdCount), 'activeAdCount is populated');

  // Verify unknown domain returns inactive
  const unknownSignal = await checkSponsoredAd('unknownrandompractice12345.com', 'dental implants', { useMock: true });
  assert(!unknownSignal.hasActiveAds, 'Unknown domain returns hasActiveAds: false');
  console.log();

  // ============================================================================
  // SUITE 5: PROXIMITY COMPETITOR & HAVERSINE ENGINE
  // ============================================================================
  console.log('--- Suite 5: Proximity Competitor & Haversine Engine ---');

  // Test Haversine distance formula with known coordinates:
  // Scottsdale Total Freedom (33.5595, -111.8905) to ClearChoice Scottsdale (33.5435, -111.9255)
  const distScottsdale = calculateHaversineMiles(33.5595, -111.8905, 33.5435, -111.9255);
  assert(distScottsdale > 2.0 && distScottsdale < 4.5, `Haversine distance calculated accurately (${distScottsdale} mi, expected ~2.3 mi)`);

  // Same coordinates distance should be 0
  const distZero = calculateHaversineMiles(33.5595, -111.8905, 33.5595, -111.8905);
  assertEqual(distZero, 0, 'Distance between identical points is 0 miles');

  // Boundary check: isWithinCompetitorDistance (strictly <= 5.0 miles)
  assert(isWithinCompetitorDistance(0.1), '0.1 miles is within limit');
  assert(isWithinCompetitorDistance(3.5), '3.5 miles is within limit');
  assert(isWithinCompetitorDistance(5.0), '5.0 miles is strictly within limit (exact boundary)');
  assert(!isWithinCompetitorDistance(5.01), '5.01 miles is outside limit');
  assert(!isWithinCompetitorDistance(5.1), '5.1 miles is outside limit');
  assert(!isWithinCompetitorDistance(10.0), '10.0 miles is outside limit');
  assert(!isWithinCompetitorDistance(-1), 'Negative distance is rejected');
  assert(!isWithinCompetitorDistance(NaN), 'NaN distance is rejected');

  // Test validateCompetitorResult
  const validComp: CompetitorResult = {
    name: 'ClearChoice Dental Implant Center',
    address: '7373 N Scottsdale Rd, Scottsdale, AZ 85253',
    phone: '(480) 555-0101',
    rank: 1,
    rating: 4.8,
    reviewCount: 412,
    distanceMiles: 3.61,
    withinLimit: true,
  };
  const valRes = validateCompetitorResult(validComp, 'Total Freedom Dental');
  assert(valRes.valid, 'Valid competitor passes validation');

  // Reject rank !== 1
  const rank2Comp: CompetitorResult = {
    ...validComp,
    rank: 2,
  };
  const valRank2 = validateCompetitorResult(rank2Comp, 'Total Freedom Dental');
  assert(!valRank2.valid, 'Competitor with rank #2 is rejected (strictly requires rank #1)');

  // Reject distance > 5.0 miles
  const farComp: CompetitorResult = {
    ...validComp,
    distanceMiles: 5.2,
    withinLimit: false,
  };
  const valFar = validateCompetitorResult(farComp, 'Total Freedom Dental');
  assert(!valFar.valid, 'Competitor at 5.2 miles is rejected (> 5.0 miles)');

  // Reject self-referential competitor
  const selfComp: CompetitorResult = {
    ...validComp,
    name: 'Total Freedom Dental',
  };
  const valSelf = validateCompetitorResult(selfComp, 'Total Freedom Dental');
  assert(!valSelf.valid, 'Self-referential competitor is rejected');

  // Reject missing address
  const badAddrComp: CompetitorResult = {
    ...validComp,
    address: '',
  };
  const valBadAddr = validateCompetitorResult(badAddrComp, 'Total Freedom Dental');
  assert(!valBadAddr.valid, 'Competitor with missing address is rejected');

  // Test findTopCompetitor5Mi
  const topComp = await findTopCompetitor5Mi(
    { latitude: 33.5595, longitude: -111.8905 },
    'Total Freedom Dental Implant Center'
  );
  assert(Boolean(topComp), 'findTopCompetitor5Mi returns competitor');
  assertEqual(topComp.rank, 1, 'Top competitor has rank #1');
  assert(topComp.distanceMiles <= MAX_COMPETITOR_DISTANCE_MILES, 'Top competitor is within 5.0 miles');
  assert(topComp.withinLimit, 'withinLimit is true');
  assert(topComp.name !== 'Total Freedom Dental Implant Center', 'Top competitor is not the candidate practice');
  console.log();

  // ============================================================================
  // SUITE 6: SYSTEM CHROMIUM DISCOVERY & PLAYWRIGHT COMPATIBILITY
  // ============================================================================
  console.log('--- Suite 6: System Chromium Discovery & Playwright Compatibility ---');

  const chromePath = getChromeExecutablePath();
  assert(Boolean(chromePath), `System Google Chrome executable discovered at: ${chromePath}`);

  // Test High-Intent Keywords list
  assert(HIGH_INTENT_IMPLANT_KEYWORDS.length >= 4, 'HIGH_INTENT_IMPLANT_KEYWORDS has at least 4 keywords');
  assert(HIGH_INTENT_IMPLANT_KEYWORDS.includes('dental implants near me'), 'Contains "dental implants near me"');
  assert(HIGH_INTENT_IMPLANT_KEYWORDS.includes('all on 4 dentist'), 'Contains "all on 4 dentist"');
  console.log();

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('================================================================');
  console.log(`📊 TEST RESULTS SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests > 0) {
    console.error(`💥 ${failedTests} TESTS FAILED!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL MILESTONE 2 SCRAPERS UNIT TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');
  }
}

runScrapersTestSuite().catch((err) => {
  console.error('Fatal error running scrapers unit tests:', err);
  process.exit(1);
});
