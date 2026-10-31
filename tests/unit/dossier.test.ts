/**
 * Comprehensive Unit Test Suite: Milestone 3 Lead Dossier & Exporter Pipeline
 *
 * Verifies:
 * - Custom $1,500 Pitch Hook Generator (competitor displacement, ad spend bleed, 90-day ROI guarantee)
 * - JSON Schema Draft 2020-12 validation and serialization
 * - Canonical RFC 4180 CSV serializer (exact 20 columns, escaping, 1:1 parity)
 * - Lead normalizer and export file utilities
 *
 * Execution:
 * npx tsx tests/unit/dossier.test.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  generatePitchHook,
  extractPitchContext,
  formatDoctorSalutation,
} from '../../src/lib/dossier/pitch-generator';
import {
  exportLeadsToJson,
  exportLeadsToCsv,
  validateLeadJson,
  validateLeadsCollection,
  leadsToCsvString,
  leadToCsvRowValues,
  escapeCsvCell,
  extractCleanDomain,
  normalizeToLeadDossier,
  GOATED_LEADS_JSON_SCHEMA_2020_12,
} from '../../src/lib/dossier/exporter';
import {
  LeadDossier,
  CANONICAL_CSV_HEADERS,
} from '../../src/lib/dossier/types';
import { parseRFC4180Csv } from '../../scripts/verify-leads';

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
  assert(
    actual === expected,
    `${message} (expected: ${expected}, got: ${actual})`
  );
}

// Mock standard lead for tests
const SAMPLE_LEAD: LeadDossier = {
  lead_id: 'GOAT-001',
  practice_name: 'Scottsdale Advanced Dental Implant Center',
  website_url: 'https://scottsdaleimplantcenter.com/',
  solo_owner: {
    name: 'Dr. Arthur Pendelton',
    credentials: 'DDS, MS',
    title: 'Solo Founder & Chief Implant Surgeon',
    background: 'Over 25 years of surgical implant experience, board-certified periodontist with zero complaints.',
  },
  location: {
    address: '8400 E Greenway Rd Ste 100',
    city: 'Scottsdale',
    state: 'AZ',
    zip_code: '85260',
    metro_affluence: 'Affluent North Scottsdale airpark corridor',
  },
  phone_number: '(480) 555-1234',
  google_maps: {
    query: 'dental implants scottsdale az',
    rank: 5,
    rating: 4.9,
    review_count: 215,
  },
  paid_ads_signal: {
    status: 'Active Verified Advertiser',
    advertiser_name: 'Scottsdale Advanced Dental Implant Center',
    advertiser_id: 'scottsdaleimplantcenter.com',
    active_ad_count: '6 active Google PPC Ads',
    estimated_cpc: '$75 - $115/click on high-intent terms',
    verification_source: 'Google Ads Transparency Center',
  },
  top_competitor_5mi: {
    practice_name: 'Scottsdale Premier Dental Institute',
    address: '8900 E Pinnacle Peak Rd, Scottsdale, AZ 85255',
    phone: '(480) 555-9876',
    website: 'https://premierdentalscottsdale.com/',
    rank: 1,
    rating: 5.0,
    review_count: 512,
  },
  custom_pitch_hook_1500:
    "Dr. Pendelton, you have 25+ years of surgical experience and 215 reviews, yet you are paying $75+ per click on Google Ads while Scottsdale Premier Dental Institute dominates the #1 spot on Google Maps for free. NexusRank1's $1,500 system propels your clinic into the top 3 with a 90-day ROI guarantee.",
  npi_number: '1487796843',
  npi_verified: true,
  clinical_specialization: 'Surgical Dental Implants & Full-Arch Reconstruction',
};

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING MILESTONE 3 LEAD DOSSIER & EXPORTER UNIT TESTS');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // Suite 1: Pitch Generator
  // ---------------------------------------------------------------------------
  console.log('--- Suite 1: Custom $1,500 Pitch Hook Generator ---');
  {
    // Salutation extraction
    assertEqual(formatDoctorSalutation('Dr. Gerald L. Kaiser'), 'Dr. Kaiser', 'Extracts last name from full doctor name');
    assertEqual(formatDoctorSalutation('Gerald L. Kaiser, DDS'), 'Dr. Kaiser', 'Handles trailing credential suffix');
    assertEqual(formatDoctorSalutation('Dr. Marissa Matthews, DDS, MS'), 'Dr. Matthews', 'Handles multi-degree suffix');
    assertEqual(formatDoctorSalutation('Dr. Alice Hsieh, DDS, FACP'), 'Dr. Hsieh', 'Handles fellowship suffix');
    assertEqual(formatDoctorSalutation(''), 'Doctor', 'Falls back gracefully on empty doctor name');

    // Context extraction
    const ctx = extractPitchContext(SAMPLE_LEAD);
    assertEqual(ctx.doctorName, 'Dr. Arthur Pendelton', 'Extracts doctor name');
    assertEqual(ctx.mapsRank, 5, 'Extracts maps rank');
    assertEqual(ctx.competitorName, 'Scottsdale Premier Dental Institute', 'Extracts competitor name');
    assertEqual(ctx.competitorRank, 1, 'Extracts competitor rank strictly 1');

    // Pitch generation core tests
    const hook = generatePitchHook(SAMPLE_LEAD);
    assert(typeof hook === 'string', 'Returns string hook');
    assert(hook.length >= 50, `Hook length (${hook.length}) must be at least 50 characters`);
    assert(hook.includes('Dr. Pendelton'), 'Includes personalized doctor salutation');
    assert(hook.includes('Scottsdale Premier Dental Institute'), 'Highlights exact #1 competitor name');
    assert(hook.includes('#1'), 'Highlights competitor #1 position');
    assert(hook.includes('#5'), 'Highlights candidate practice #5 overflow ranking');
    assert(hook.includes('$1,500'), 'Highlights $1,500 system deployment');
    assert(hook.includes('90-day ROI guarantee'), 'Highlights NexusRank1 90-day ROI guarantee');
    assert(hook.includes('per click'), 'Highlights PPC cost-per-click ad bleed');
    assert(hook.includes('full-arch'), 'Highlights high-ticket full-arch case value');

    // Pitch generation with camelCase QualifiedLead input
    const camelLead = {
      leadId: 'GOAT-099',
      practiceName: 'Bellevue Full Arch Center',
      doctorName: 'Dr. Marcus Vance',
      doctorCredentials: 'DMD',
      city: 'Bellevue',
      state: 'WA',
      zipCode: '98004',
      mapsRank: 4,
      reviewCount: 120,
      rating: 4.8,
      activeAdCount: '5 active ads',
      estimatedCpc: '$85/click',
      competitor: {
        name: 'Bellevue Oral Surgery',
        rank: 1,
        address: '100 Main St, Bellevue, WA',
        reviewCount: 300,
        distanceMiles: 1.5,
      },
    };
    const camelHook = generatePitchHook(camelLead as any);
    assert(camelHook.includes('Dr. Vance'), 'CamelCase input correctly salutes Dr. Vance');
    assert(camelHook.includes('Bellevue Oral Surgery'), 'CamelCase input includes competitor name');
    assert(camelHook.includes('#4'), 'CamelCase input includes rank #4');
    assert(camelHook.length >= 50, 'CamelCase hook meets length constraint');
  }

  // ---------------------------------------------------------------------------
  // Suite 2: Draft 2020-12 JSON Schema & Validation
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 2: JSON Schema Validation & Compliance ---');
  {
    // Schema structure
    assertEqual(GOATED_LEADS_JSON_SCHEMA_2020_12.$schema, 'https://json-schema.org/draft/2020-12/schema', 'Adheres to Draft 2020-12');
    assertEqual(GOATED_LEADS_JSON_SCHEMA_2020_12.type, 'array', 'Root type is array');

    // Valid lead
    const validRes = validateLeadJson(SAMPLE_LEAD);
    assert(validRes.valid, 'Complete sample lead validates cleanly');
    assertEqual(validRes.errors.length, 0, 'Zero validation errors on valid lead');

    // Test all 10 leads in repository
    const jsonPath = path.resolve(process.cwd(), 'leads/goated_leads.json');
    if (fs.existsSync(jsonPath)) {
      const realLeads: LeadDossier[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const collRes = validateLeadsCollection(realLeads);
      assert(collRes.valid, `Repository leads validate against schema (${realLeads.length} leads)`);
      assertEqual(collRes.errors.length, 0, 'Zero errors in production repository leads');
    }

    // Negative tests: Missing lead_id
    const missingId = { ...SAMPLE_LEAD, lead_id: undefined };
    assert(!validateLeadJson(missingId).valid, 'Rejects lead missing lead_id');

    // Negative tests: Invalid lead_id pattern
    const invalidId = { ...SAMPLE_LEAD, lead_id: 'LEAD-001' };
    assert(!validateLeadJson(invalidId).valid, 'Rejects lead with invalid ID pattern LEAD-001');

    // Negative tests: Invalid Maps rank (rank 1, rank 3, rank 7)
    const rank1Lead = { ...SAMPLE_LEAD, google_maps: { ...SAMPLE_LEAD.google_maps, rank: 1 } };
    assert(!validateLeadJson(rank1Lead).valid, 'Rejects lead with rank #1 (already dominating)');

    const rank3Lead = { ...SAMPLE_LEAD, google_maps: { ...SAMPLE_LEAD.google_maps, rank: 3 } };
    assert(!validateLeadJson(rank3Lead).valid, 'Rejects lead with rank #3 (Local 3-Pack gatekeeper)');

    const rank7Lead = { ...SAMPLE_LEAD, google_maps: { ...SAMPLE_LEAD.google_maps, rank: 7 } };
    assert(!validateLeadJson(rank7Lead).valid, 'Rejects lead with rank #7 (outside #4-#6 fold)');

    // Negative tests: Inactive ads
    const inactiveAds = {
      ...SAMPLE_LEAD,
      paid_ads_signal: { ...SAMPLE_LEAD.paid_ads_signal, status: 'Inactive' },
    };
    assert(!validateLeadJson(inactiveAds).valid, 'Rejects lead with inactive ads status');

    // Negative tests: Short pitch hook
    const shortHook = { ...SAMPLE_LEAD, custom_pitch_hook_1500: 'Too short hook.' };
    assert(!validateLeadJson(shortHook).valid, 'Rejects pitch hook shorter than 50 characters');

    // Negative tests: Non-doctor credentials
    const hygienistLead = {
      ...SAMPLE_LEAD,
      solo_owner: { ...SAMPLE_LEAD.solo_owner, credentials: 'RDH' },
    };
    assert(!validateLeadJson(hygienistLead).valid, 'Rejects non-doctor hygienist credential');

    // Negative tests: Associate title
    const associateLead = {
      ...SAMPLE_LEAD,
      solo_owner: { ...SAMPLE_LEAD.solo_owner, title: 'Junior Associate Dentist' },
    };
    assert(!validateLeadJson(associateLead).valid, 'Rejects associate dentist title');

    // Negative tests: Malformed zip code
    const badZip = {
      ...SAMPLE_LEAD,
      location: { ...SAMPLE_LEAD.location, zip_code: '8526' },
    };
    assert(!validateLeadJson(badZip).valid, 'Rejects 4-digit malformed zip code');
  }

  // ---------------------------------------------------------------------------
  // Suite 3: Canonical RFC 4180 CSV Serializer
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 3: Canonical RFC 4180 CSV Serializer ---');
  {
    assertEqual(CANONICAL_CSV_HEADERS.length, 20, 'Has exactly 20 canonical headers');

    // Domain cleaning
    assertEqual(extractCleanDomain('https://www.example.com/'), 'example.com', 'Strips https, www, and trailing slash');
    assertEqual(extractCleanDomain('http://clinic.org/about'), 'clinic.org', 'Strips http and path');

    // CSV cell escaping
    assertEqual(escapeCsvCell(5), '5', 'Leaves numbers unquoted');
    assertEqual(escapeCsvCell('Simple'), '"Simple"', 'Encloses simple string in quotes');
    assertEqual(escapeCsvCell('With, Comma'), '"With, Comma"', 'Quotes string with comma');
    assertEqual(escapeCsvCell('With "Quotes"'), '"With ""Quotes"""', 'Doubles interior quotes');
    assertEqual(escapeCsvCell(null), '""', 'Escapes null to empty string in quotes');

    // Row values extraction
    const rowValues = leadToCsvRowValues(SAMPLE_LEAD);
    assertEqual(rowValues.length, 20, 'Produces exactly 20 row values');
    assertEqual(rowValues[0], 'GOAT-001', 'Col 0: Lead ID');
    assertEqual(rowValues[1], 'Scottsdale Advanced Dental Implant Center', 'Col 1: Practice Name');
    assertEqual(rowValues[2], 'scottsdaleimplantcenter.com', 'Col 2: Clean Domain');
    assertEqual(rowValues[3], 'Dr. Arthur Pendelton', 'Col 3: Doctor Name');
    assertEqual(rowValues[4], 'DDS, MS', 'Col 4: Credentials');
    assertEqual(rowValues[10], '85260', 'Col 10: Zip Code');
    assertEqual(rowValues[11], 5, 'Col 11: Maps Rank #5');
    assertEqual(rowValues[16], 'Scottsdale Premier Dental Institute', 'Col 16: #1 Competitor Name');
    assertEqual(rowValues[17], 1, 'Col 17: #1 Competitor Maps Rank (1)');

    // CSV serialization string
    const csvStr = leadsToCsvString([SAMPLE_LEAD]);
    const parsed = parseRFC4180Csv(csvStr);
    assertEqual(parsed.headers.length, 20, 'Parsed CSV has 20 headers');
    assertEqual(parsed.rows.length, 1, 'Parsed CSV has 1 data row');
    assertEqual(parsed.rows[0][0], 'GOAT-001', 'Parsed row preserves Lead ID');
    assertEqual(parsed.rows[0][17], '1', 'Parsed row preserves Competitor Rank 1');
  }

  // ---------------------------------------------------------------------------
  // Suite 4: File Exporters & Roundtrip I/O
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 4: File Exporters & Roundtrip I/O ---');
  {
    const tmpDir = path.join(os.tmpdir(), `dossier-test-${Date.now()}`);
    const tmpJson = path.join(tmpDir, 'test_leads.json');
    const tmpCsv = path.join(tmpDir, 'test_leads.csv');

    // Lead with pitch hook
    const leadToExport = {
      ...SAMPLE_LEAD,
      custom_pitch_hook_1500: generatePitchHook(SAMPLE_LEAD),
    };

    // Test JSON export
    await exportLeadsToJson([leadToExport], tmpJson);
    assert(fs.existsSync(tmpJson), 'Created JSON file on disk');
    const readJson = JSON.parse(fs.readFileSync(tmpJson, 'utf8'));
    assertEqual(readJson.length, 1, 'Read back 1 lead from JSON file');
    assertEqual(readJson[0].lead_id, 'GOAT-001', 'Roundtrip JSON preserves lead_id');
    assertEqual(readJson[0].top_competitor_5mi.rank, 1, 'Roundtrip JSON preserves competitor rank 1');

    // Test CSV export
    await exportLeadsToCsv([leadToExport], tmpCsv);
    assert(fs.existsSync(tmpCsv), 'Created CSV file on disk');
    const readCsv = fs.readFileSync(tmpCsv, 'utf8');
    const parsedCsv = parseRFC4180Csv(readCsv);
    assertEqual(parsedCsv.headers.length, 20, 'Roundtrip CSV has 20 columns');
    assertEqual(parsedCsv.rows.length, 1, 'Roundtrip CSV has 1 row');
    assertEqual(parsedCsv.rows[0][0], 'GOAT-001', 'Roundtrip CSV matches Lead ID');
    assertEqual(parsedCsv.rows[0][17], '1', 'Roundtrip CSV matches competitor rank 1');

    // Clean up
    fs.rmSync(tmpDir, { recursive: true, force: true });
    assert(!fs.existsSync(tmpDir), 'Cleaned up temporary test directory');
  }

  // ---------------------------------------------------------------------------
  // Suite 5: Normalization & Field Mapping
  // ---------------------------------------------------------------------------
  console.log('\n--- Suite 5: Normalization & Field Mapping ---');
  {
    const rawInput = {
      practiceName: 'Newport Beach Dental Center',
      websiteUrl: 'newportdental.com',
      doctorName: 'Dr. Jason Reed',
      doctorCredentials: 'DMD',
      doctorTitle: 'Solo Founder & Chief Surgeon',
      address: '100 Newport Center Dr',
      city: 'Newport Beach',
      state: 'CA',
      zipCode: '92660',
      mapsRank: 6,
      rating: 4.9,
      reviewCount: 150,
      competitor: {
        name: '4M Dental Center',
        address: '200 Birch St, Newport Beach, CA',
        phone: '(949) 555-4444',
        website: 'https://4m.com',
        rank: 1,
      },
    };

    const normalized = normalizeToLeadDossier(rawInput as any, 12);
    assertEqual(normalized.lead_id, 'GOAT-012', 'Generates padded GOAT ID');
    assertEqual(normalized.practice_name, 'Newport Beach Dental Center', 'Maps practice_name');
    assertEqual(normalized.website_url, 'https://newportdental.com', 'Prepends https protocol');
    assertEqual(normalized.solo_owner.name, 'Dr. Jason Reed', 'Maps solo_owner.name');
    assertEqual(normalized.location.zip_code, '92660', 'Maps location.zip_code');
    assertEqual(normalized.google_maps.rank, 6, 'Maps google_maps.rank');
    assertEqual(normalized.top_competitor_5mi.rank, 1, 'Maps top_competitor_5mi.rank strictly 1');
    assert(normalized.custom_pitch_hook_1500.length >= 50, 'Automatically synthesizes pitch hook');
  }

  console.log('\n================================================================');
  console.log(`📊 DOSSIER UNIT TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests > 0) {
    console.error(`❌ ${failedTests} TESTS FAILED!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL DOSSIER & EXPORTER UNIT TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
