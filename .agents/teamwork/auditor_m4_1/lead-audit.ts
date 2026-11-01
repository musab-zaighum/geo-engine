import * as fs from 'fs';
import * as path from 'path';
import { LeadDossier } from '../../../src/lib/dossier/types';
import { calculateHaversineMiles } from '../../../src/lib/scrapers/competitor-finder';
import { getAffluentZipInfo, isAffluentZip } from '../../../src/lib/qualification/affluent-zips';

const jsonPath = '/home/pwn/geo-engine/leads/goated_leads.json';
const csvPath = '/home/pwn/geo-engine/leads/goated_leads.csv';

const rawJson = fs.readFileSync(jsonPath, 'utf8');
const leads: LeadDossier[] = JSON.parse(rawJson);

console.log(`========================================================================`);
console.log(`FORENSIC AUDIT OF 52 LEADS IN leads/goated_leads.json & csv`);
console.log(`========================================================================`);
console.log(`Total Leads Loaded: ${leads.length}`);

// 1. Structure & ID sequentiality
const ids = leads.map(l => l.lead_id);
console.log(`Lead ID range: ${ids[0]} to ${ids[ids.length - 1]}`);
let sequential = true;
for (let i = 0; i < ids.length; i++) {
  const expectedId = `GOAT-${String(i + 1).padStart(3, '0')}`;
  if (ids[i] !== expectedId) {
    sequential = false;
    console.log(`Sequence mismatch at index ${i}: expected ${expectedId}, got ${ids[i]}`);
  }
}
console.log(`Sequential IDs (GOAT-001..GOAT-052): ${sequential ? 'PASS' : 'FAIL'}`);

// 2. Doctor Names, Practice Names, Websites, Phone, Address
const missingFields: string[] = [];
leads.forEach(l => {
  if (!l.practice_name || l.practice_name.length < 3) missingFields.push(`${l.lead_id}: practice_name invalid`);
  if (!l.website_url || !l.website_url.startsWith('http')) missingFields.push(`${l.lead_id}: website_url invalid`);
  if (!l.solo_owner?.name || l.solo_owner.name.length < 3) missingFields.push(`${l.lead_id}: doctor name invalid`);
  if (!l.phone_number || l.phone_number.length < 7) missingFields.push(`${l.lead_id}: phone_number invalid`);
  if (!l.location?.address || l.location.address.length < 5) missingFields.push(`${l.lead_id}: address invalid`);
  if (!l.location?.zip_code || l.location.zip_code.length !== 5) missingFields.push(`${l.lead_id}: zip invalid`);
});
console.log(`Basic contact fields valid: ${missingFields.length === 0 ? 'PASS (100% 52/52)' : 'FAIL: ' + missingFields.join('; ')}`);

// 3. NPI Verification
// Validate 10-digit number & Luhn algorithm (NPI Luhn check prefix is 80840)
function isValidNpiLuhn(npi: string): boolean {
  if (!/^\d{10}$/.test(npi)) return false;
  const full = '80840' + npi;
  let sum = 0;
  for (let i = 0; i < full.length; i++) {
    let digit = parseInt(full[full.length - 1 - i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

const npi10DigitIssues: string[] = [];
const npiLuhnIssues: string[] = [];
let valid10DigitCount = 0;
let luhnPassCount = 0;

leads.forEach(l => {
  const npi = l.npi_number;
  if (!npi) {
    npi10DigitIssues.push(`${l.lead_id}: missing npi_number`);
    return;
  }
  if (!/^\d{10}$/.test(npi)) {
    npi10DigitIssues.push(`${l.lead_id}: NPI "${npi}" is not a 10-digit number`);
  } else {
    valid10DigitCount++;
    if (isValidNpiLuhn(npi)) {
      luhnPassCount++;
    } else {
      npiLuhnIssues.push(`${l.lead_id}: NPI "${npi}" (${l.solo_owner.name}) failed Luhn`);
    }
  }
});
console.log(`10-digit NPIs: ${valid10DigitCount}/${leads.length} (${valid10DigitCount === 52 ? 'PASS' : 'FAIL'})`);
console.log(`Luhn checksum PASS: ${luhnPassCount}/${leads.length}`);
if (npiLuhnIssues.length > 0) {
  console.log(`Non-Luhn NPIs (${npiLuhnIssues.length}):`, npiLuhnIssues.slice(0, 10));
}

// 4. DSO Contamination Check
const dsoList = [
  'clearchoice', 'aspen dental', 'heartland dental', 'pacific dental', 'smile brands',
  'western dental', 'sonrava', 'affordable dentures', 'affordable care', 'mb2 dental',
  'great expressions', 'dental care alliance', 'north american dental', 'mortenson',
  'benevis', 'kool smiles', '42 north', 'gentle dental', 'dental365', 'decadental'
];
const dsoViolations: string[] = [];
leads.forEach(l => {
  const str = `${l.practice_name} ${l.website_url} ${l.solo_owner?.title || ''}`.toLowerCase();
  for (const dso of dsoList) {
    if (str.includes(dso)) {
      dsoViolations.push(`${l.lead_id}: matched DSO keyword "${dso}" in "${l.practice_name}"`);
    }
  }
});
console.log(`DSO Contamination: ${dsoViolations.length === 0 ? 'PASS (0 DSOs detected in 52 leads)' : 'FAIL: ' + dsoViolations.join('; ')}`);

// 5. Surgical Implant Focus & Anti-Medicaid / Anti-Peds / Anti-Routine
const nonImplantLeads: string[] = [];
const disqualifyingTerms: string[] = [];
leads.forEach(l => {
  const allText = `${l.practice_name} ${l.solo_owner?.title || ''} ${l.solo_owner?.background || ''} ${l.clinical_specialization || ''} ${l.custom_pitch_hook_1500 || ''}`.toLowerCase();
  const hasImplant = /implant|all-on-4|all-on-x|full-arch|full arch|periodont|prosthodont|teeth-in-a-day|surgical/i.test(allText);
  if (!hasImplant) {
    nonImplantLeads.push(l.lead_id);
  }
  if (/medicaid|denti-cal|badgercare|ahcccs|sliding fee/i.test(allText)) {
    disqualifyingTerms.push(`${l.lead_id}: contains Medicaid keywords`);
  }
  if (/\b(pediatric|children's|kids)\s+dent/i.test(allText)) {
    disqualifyingTerms.push(`${l.lead_id}: contains pediatric keywords`);
  }
});
console.log(`Surgical implant focus: ${nonImplantLeads.length === 0 ? 'PASS (100% 52/52)' : 'FAIL: ' + nonImplantLeads.join(', ')}`);
console.log(`Disqualifying services (Medicaid/Peds): ${disqualifyingTerms.length === 0 ? 'PASS (0 detected)' : 'FAIL: ' + disqualifyingTerms.join('; ')}`);

// 6. Google Maps Rank Check (Strictly #4 to #6)
const invalidMapsRanks: string[] = [];
leads.forEach(l => {
  const rank = l.google_maps?.rank;
  if (typeof rank !== 'number' || rank < 4 || rank > 6 || !Number.isInteger(rank)) {
    invalidMapsRanks.push(`${l.lead_id}: rank #${rank}`);
  }
});
console.log(`Google Maps Rank (#4-#6): ${invalidMapsRanks.length === 0 ? 'PASS (100% 52/52 rank #4-#6)' : 'FAIL: ' + invalidMapsRanks.join(', ')}`);

// 7. Google Ads Signal Check (Active, Sponsored, CPC $50-$140)
const invalidAds: string[] = [];
leads.forEach(l => {
  const ads = l.paid_ads_signal;
  if (!ads || !/Active/i.test(ads.status)) {
    invalidAds.push(`${l.lead_id}: not active status ("${ads?.status}")`);
    return;
  }
  const cpcMatch = ads.estimated_cpc?.match(/\$([0-9.]+)/);
  if (!cpcMatch) {
    invalidAds.push(`${l.lead_id}: invalid cpc "${ads.estimated_cpc}"`);
    return;
  }
  const cpcVal = parseFloat(cpcMatch[1]);
  if (cpcVal < 50 || cpcVal > 140) {
    invalidAds.push(`${l.lead_id}: cpc $${cpcVal} out of [$50, $140]`);
  }
});
console.log(`Google Ads Signal ($50-$140 CPC): ${invalidAds.length === 0 ? 'PASS (100% 52/52 active with valid CPC)' : 'FAIL: ' + invalidAds.join(', ')}`);

// 8. Proximity Competitors (<= 5.0 mi, rank #1)
const invalidCompetitors: string[] = [];
leads.forEach(l => {
  const comp = l.top_competitor_5mi;
  if (!comp) {
    invalidCompetitors.push(`${l.lead_id}: missing competitor`);
    return;
  }
  if (comp.rank !== 1) {
    invalidCompetitors.push(`${l.lead_id}: competitor rank #${comp.rank}`);
  }
  if (!comp.practice_name || comp.practice_name.toLowerCase().trim() === l.practice_name.toLowerCase().trim()) {
    invalidCompetitors.push(`${l.lead_id}: competitor name invalid or identical to candidate`);
  }
  if (!comp.address || comp.address.length < 5) {
    invalidCompetitors.push(`${l.lead_id}: competitor address missing`);
  }
  if (!comp.phone || comp.phone.length < 5) {
    invalidCompetitors.push(`${l.lead_id}: competitor phone missing`);
  }
});
console.log(`Competitor schema & Rank #1: ${invalidCompetitors.length === 0 ? 'PASS (100% 52/52 have distinct Rank #1 competitor)' : 'FAIL: ' + invalidCompetitors.join('; ')}`);

// Geodesic distance calculation: compare lead zip coords with competitor zip coords
const compZipRegex = /\b([0-9]{5})\b/;
let distanceOver5Count = 0;
const distanceDetails: string[] = [];

leads.forEach(l => {
  const leadZip = l.location.zip_code;
  const leadZipInfo = getAffluentZipInfo(leadZip);
  const compZipMatch = l.top_competitor_5mi.address.match(compZipRegex);
  const compZip = compZipMatch ? compZipMatch[1] : undefined;
  const compZipInfo = compZip ? getAffluentZipInfo(compZip) : undefined;

  if (leadZipInfo?.coordinates && compZipInfo?.coordinates) {
    const dist = calculateHaversineMiles(
      leadZipInfo.coordinates.latitude,
      leadZipInfo.coordinates.longitude,
      compZipInfo.coordinates.latitude,
      compZipInfo.coordinates.longitude
    );
    if (dist > 5.0) {
      distanceOver5Count++;
      distanceDetails.push(`${l.lead_id} (${leadZip} -> comp ${compZip}): ${dist} mi > 5.0 mi`);
    }
  }
});
console.log(`Inter-Zip Geodesic Distances evaluated: ${distanceOver5Count === 0 ? 'PASS (All tested zip pairs within 5.0 mi)' : 'Warning: ' + distanceOver5Count + ' exceed 5.0 mi by centroid: ' + distanceDetails.join(', ')}`);

// 9. Corridor Coverage (All 7 required corridors)
const requiredCorridors = [
  { name: '1. Manhattan Upper East Side & Midtown, NY', zips: ['10021', '10065', '10075', '10022'] },
  { name: '2. Silicon Valley / Atherton / Palo Alto / Los Altos, CA', zips: ['94027', '94301', '94022', '94024'] },
  { name: '3. Palm Beach & Jupiter, FL', zips: ['33480', '33458', '33477'] },
  { name: '4. Scottsdale North & Paradise Valley, AZ', zips: ['85255', '85262', '85253', '85266'] },
  { name: '5. Newport Beach & Corona del Mar, CA', zips: ['92660', '92625', '92657'] },
  { name: '6. Dallas Park Cities & Preston Hollow, TX', zips: ['75205', '75225', '75209'] },
  { name: '7. Aspen & Vail, CO', zips: ['81611', '81657'] },
];

console.log('\n--- Corridor Representation ---');
const zipMap = new Map<string, string[]>();
leads.forEach(l => {
  const zip = l.location.zip_code;
  if (!zipMap.has(zip)) zipMap.set(zip, []);
  zipMap.get(zip)!.push(l.lead_id);
});

let all7Covered = true;
requiredCorridors.forEach(c => {
  const foundLeads: string[] = [];
  const foundZips: string[] = [];
  c.zips.forEach(z => {
    if (zipMap.has(z)) {
      foundZips.push(z);
      foundLeads.push(...zipMap.get(z)!);
    }
  });
  const covered = foundLeads.length > 0;
  if (!covered) all7Covered = false;
  console.log(`Corridor: ${c.name.padEnd(55)} | Status: ${covered ? '✅ COVERED' : '❌ MISSING'} | Zips: [${foundZips.join(', ')}] | Leads (${foundLeads.length}): ${foundLeads.join(', ')}`);
});
console.log(`All 7 Corridors covered: ${all7Covered ? 'PASS' : 'FAIL'}`);

// Also check Vail specifically (GOAT-050 and GOAT-051)
const vailLeads = leads.filter(l => l.location.zip_code === '81657');
console.log(`\nVail, CO (81657) Leads (${vailLeads.length}): ${vailLeads.map(l => `${l.lead_id}: ${l.practice_name} (${l.solo_owner.name})`).join(', ')}`);
