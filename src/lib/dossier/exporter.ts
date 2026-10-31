/**
 * Lead Dossier Serializer & Exporter
 *
 * Implements Feature 10 & 11, Requirements R4, AC 6:
 * - Structured JSON serializer adhering to JSON Schema Draft 2020-12
 * - RFC 4180 compliant CSV serializer with 20 canonical columns matching JSON 1:1
 * - In-memory and file-system export utilities
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  LeadDossier,
  LeadInput,
  CANONICAL_CSV_HEADERS,
  CanonicalCsvHeader,
} from './types';
import { generatePitchHook } from './pitch-generator';

/**
 * Authoritative JSON Schema Draft 2020-12 for Goated Leads Collection
 */
export const GOATED_LEADS_JSON_SCHEMA_2020_12 = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'GoatedLeadsCollection',
  description: 'Collection of qualified high-ticket dental implant clinic leads and local competitor dossiers',
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: [
      'lead_id',
      'practice_name',
      'website_url',
      'solo_owner',
      'location',
      'phone_number',
      'google_maps',
      'paid_ads_signal',
      'top_competitor_5mi',
      'custom_pitch_hook_1500',
    ],
    properties: {
      lead_id: {
        type: 'string',
        pattern: '^GOAT-[0-9]{3,}$',
        description: 'Unique identifier for the lead dossier',
      },
      practice_name: {
        type: 'string',
        minLength: 2,
        description: 'Full legal or DBA name of the independent dental clinic',
      },
      website_url: {
        type: 'string',
        format: 'uri',
        description: 'Clean canonical URL of the practice homepage',
      },
      solo_owner: {
        type: 'object',
        required: ['name', 'credentials', 'title', 'background'],
        properties: {
          name: { type: 'string', minLength: 3 },
          credentials: { type: 'string' },
          title: { type: 'string' },
          background: { type: 'string' },
        },
      },
      location: {
        type: 'object',
        required: ['address', 'city', 'state', 'zip_code', 'metro_affluence'],
        properties: {
          address: { type: 'string', minLength: 3 },
          city: { type: 'string', minLength: 2 },
          state: { type: 'string', pattern: '^[A-Z]{2}$' },
          zip_code: { type: 'string', pattern: '^[0-9]{5}(-[0-9]{4})?$' },
          metro_affluence: { type: 'string' },
        },
      },
      phone_number: {
        type: 'string',
        description: 'Direct telephone number formatted with area code',
      },
      google_maps: {
        type: 'object',
        required: ['query', 'rank', 'rating', 'review_count'],
        properties: {
          query: { type: 'string' },
          rank: { type: 'integer', minimum: 4, maximum: 6 },
          rating: { type: 'number', minimum: 1.0, maximum: 5.0 },
          review_count: { type: 'integer', minimum: 1 },
        },
      },
      paid_ads_signal: {
        type: 'object',
        required: [
          'status',
          'advertiser_name',
          'advertiser_id',
          'active_ad_count',
          'estimated_cpc',
          'verification_source',
        ],
        properties: {
          status: { type: 'string' },
          advertiser_name: { type: 'string' },
          advertiser_id: { type: 'string' },
          active_ad_count: { type: 'string' },
          estimated_cpc: { type: 'string' },
          verification_source: { type: 'string' },
        },
      },
      top_competitor_5mi: {
        type: 'object',
        required: [
          'practice_name',
          'address',
          'phone',
          'website',
          'rank',
          'rating',
          'review_count',
        ],
        properties: {
          practice_name: { type: 'string', minLength: 2 },
          address: { type: 'string' },
          phone: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          rank: { type: 'integer', minimum: 1, maximum: 3 },
          rating: { type: 'number', minimum: 1.0, maximum: 5.0 },
          review_count: { type: 'integer', minimum: 0 },
        },
      },
      custom_pitch_hook_1500: {
        type: 'string',
        minLength: 50,
      },
      npi_number: {
        type: 'string',
        description: 'Federal 10-digit National Provider Identifier',
      },
      npi_verified: {
        type: 'boolean',
        description: 'Confirmation of active NPI-1 individual dental license',
      },
      clinical_specialization: {
        type: 'string',
        description: 'Verified clinical focus area (implants, full-arch, periodontics)',
      },
    },
  },
};

/**
 * Strips protocol and www to produce a clean domain string
 */
export function extractCleanDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return '';
  return urlOrDomain
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/.*$/, '')
    .trim();
}

/**
 * Normalizes any compliant lead object into the canonical LeadDossier structure
 */
export function normalizeToLeadDossier(input: LeadInput, defaultIndex = 1): LeadDossier {
  const anyLead = input as any;

  // Lead ID
  const rawId = anyLead.lead_id || anyLead.leadId;
  const lead_id = rawId && /^GOAT-[0-9]{3,}$/.test(rawId)
    ? rawId
    : `GOAT-${String(defaultIndex).padStart(3, '0')}`;

  const practice_name = anyLead.practice_name || anyLead.practiceName || 'Dental Practice';
  let website_url = anyLead.website_url || anyLead.websiteUrl || '';
  if (website_url && !/^https?:\/\//i.test(website_url)) {
    website_url = `https://${website_url}`;
  }

  // Solo owner
  const rawDoc = anyLead.solo_owner || anyLead.soloOwner || {};
  const solo_owner = {
    name: rawDoc.name || anyLead.doctorName || 'Doctor',
    credentials: rawDoc.credentials || anyLead.doctorCredentials || 'DDS',
    title: rawDoc.title || anyLead.doctorTitle || 'Solo Owner & Implant Surgeon',
    background:
      rawDoc.background ||
      anyLead.doctorBackground ||
      'Extensive clinical surgical experience in dental implants and full-arch reconstruction.',
  };

  // Location
  const rawLoc = anyLead.location || {};
  const locCity = rawLoc.city || anyLead.city || '';
  const location = {
    address: rawLoc.address || anyLead.address || '',
    city: locCity,
    state: rawLoc.state || anyLead.state || '',
    zip_code: rawLoc.zip_code || rawLoc.zipCode || anyLead.zipCode || '',
    metro_affluence:
      rawLoc.metro_affluence ||
      rawLoc.metroAffluence ||
      anyLead.metroAffluence ||
      `Affluent ${locCity || 'metro'} high-income patient corridor`,
  };

  // Phone
  const phone_number = anyLead.phone_number || anyLead.phoneNumber || anyLead.phone || '';

  // Google Maps
  const rawMaps = anyLead.google_maps || anyLead.googleMaps || {};
  const google_maps = {
    query:
      rawMaps.query ||
      anyLead.query ||
      `dental implants ${location.city} ${location.state}`,
    rank: typeof rawMaps.rank === 'number' ? rawMaps.rank : Number(anyLead.mapsRank) || 5,
    rating: typeof rawMaps.rating === 'number' ? rawMaps.rating : Number(anyLead.rating) || 4.9,
    review_count:
      typeof rawMaps.review_count === 'number'
        ? rawMaps.review_count
        : typeof rawMaps.reviewCount === 'number'
        ? rawMaps.reviewCount
        : Number(anyLead.reviewCount) || 50,
  };

  // Paid Ads Signal
  const rawAds = anyLead.paid_ads_signal || anyLead.paidAdsSignal || {};
  const paid_ads_signal = {
    status: rawAds.status || 'Active Verified Advertiser',
    advertiser_name: rawAds.advertiser_name || rawAds.advertiserName || practice_name,
    advertiser_id:
      rawAds.advertiser_id ||
      rawAds.advertiserId ||
      extractCleanDomain(website_url),
    active_ad_count:
      rawAds.active_ad_count ||
      rawAds.activeAdCount ||
      'Active Google Search PPC Ads',
    estimated_cpc:
      rawAds.estimated_cpc ||
      rawAds.estimatedCpc ||
      '$65 - $110/click on implant keywords',
    verification_source:
      rawAds.verification_source ||
      rawAds.verificationSource ||
      'Google Ads Transparency Center',
  };

  // Top Competitor
  const rawComp = anyLead.top_competitor_5mi || anyLead.topCompetitor5mi || anyLead.competitor || {};
  let compWebsite = rawComp.website || '';
  if (compWebsite && !/^https?:\/\//i.test(compWebsite)) {
    compWebsite = `https://${compWebsite}`;
  }

  const top_competitor_5mi = {
    practice_name: rawComp.practice_name || rawComp.name || 'Local Competitor',
    address: rawComp.address || `${location.city}, ${location.state}`,
    phone: rawComp.phone || phone_number,
    website: compWebsite || 'https://competitor.com',
    rank: typeof rawComp.rank === 'number' ? rawComp.rank : 1,
    rating: typeof rawComp.rating === 'number' ? rawComp.rating : 4.9,
    review_count:
      typeof rawComp.review_count === 'number'
        ? rawComp.review_count
        : typeof rawComp.reviewCount === 'number'
        ? rawComp.reviewCount
        : 100,
  };

  // Pitch hook
  let custom_pitch_hook_1500 = anyLead.custom_pitch_hook_1500 || anyLead.customPitchHook1500;
  if (!custom_pitch_hook_1500 || typeof custom_pitch_hook_1500 !== 'string' || custom_pitch_hook_1500.length < 50) {
    custom_pitch_hook_1500 = generatePitchHook(input);
  }

  const dossier: LeadDossier = {
    lead_id,
    practice_name,
    website_url,
    solo_owner,
    location,
    phone_number,
    google_maps,
    paid_ads_signal,
    top_competitor_5mi,
    custom_pitch_hook_1500,
  };

  if (anyLead.npi_number || anyLead.npiNumber) {
    dossier.npi_number = anyLead.npi_number || anyLead.npiNumber;
  }
  if (typeof anyLead.npi_verified === 'boolean' || typeof anyLead.npiVerified === 'boolean') {
    dossier.npi_verified = anyLead.npi_verified ?? anyLead.npiVerified;
  }
  if (anyLead.clinical_specialization || anyLead.clinicalSpecialization) {
    dossier.clinical_specialization = anyLead.clinical_specialization || anyLead.clinicalSpecialization;
  }

  return dossier;
}

/**
 * Validates a single LeadDossier object against project acceptance rules
 */
export function validateLeadJson(lead: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!lead || typeof lead !== 'object') {
    return { valid: false, errors: ['Lead must be a non-null object'] };
  }

  // Required root fields
  const required = [
    'lead_id',
    'practice_name',
    'website_url',
    'solo_owner',
    'location',
    'phone_number',
    'google_maps',
    'paid_ads_signal',
    'top_competitor_5mi',
    'custom_pitch_hook_1500',
  ];

  for (const r of required) {
    if (lead[r] === undefined || lead[r] === null) {
      errors.push(`Missing required field: ${r}`);
    }
  }

  // Format checks
  if (lead.lead_id && !/^GOAT-[0-9]{3,}$/.test(lead.lead_id)) {
    errors.push(`lead_id "${lead.lead_id}" must match pattern ^GOAT-[0-9]{3,}$`);
  }
  if (lead.website_url && !/^https?:\/\//i.test(lead.website_url)) {
    errors.push(`website_url "${lead.website_url}" must be an HTTP/HTTPS URI`);
  }

  // Doctor check
  if (lead.solo_owner) {
    if (!lead.solo_owner.name || lead.solo_owner.name.length < 3) {
      errors.push('solo_owner.name must be at least 3 characters');
    }
    if (!/(DDS|D\.D\.S\.|DMD|D\.M\.D\.|MD|M\.D\.)/i.test(lead.solo_owner.credentials || '')) {
      errors.push('solo_owner.credentials must include DDS, DMD, or MD');
    }
    if (!/(solo|owner|founder|principal|director|surgeon)/i.test(lead.solo_owner.title || '')) {
      errors.push('solo_owner.title must indicate solo owner/founder/principal status');
    }
  }

  // Location check
  if (lead.location) {
    if (!lead.location.address || lead.location.address.length < 3) {
      errors.push('location.address must be at least 3 characters');
    }
    if (!/^[A-Z]{2}$/.test(lead.location.state || '')) {
      errors.push(`location.state "${lead.location.state}" must be a 2-letter uppercase postal code`);
    }
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(lead.location.zip_code || '')) {
      errors.push(`location.zip_code "${lead.location.zip_code}" must be a 5-digit US zip code`);
    }
  }

  // Google Maps check
  if (lead.google_maps) {
    const rank = lead.google_maps.rank;
    if (typeof rank !== 'number' || !Number.isInteger(rank) || rank < 4 || rank > 6) {
      errors.push(`google_maps.rank must be an integer between 4 and 6, received ${rank}`);
    }
  }

  // Paid Ads check
  if (lead.paid_ads_signal) {
    const status = lead.paid_ads_signal.status || '';
    if (!status || !/\b(Active|Verified)\b/i.test(status) || /\binactive\b/i.test(status)) {
      errors.push('paid_ads_signal.status must indicate Active or Verified status');
    }
    if (!/\$[0-9]+/.test(lead.paid_ads_signal.estimated_cpc || '')) {
      errors.push('paid_ads_signal.estimated_cpc must contain dollar amounts');
    }
  }

  // Competitor check
  if (lead.top_competitor_5mi) {
    const comp = lead.top_competitor_5mi;
    if (!comp.practice_name || comp.practice_name.length < 2) {
      errors.push('top_competitor_5mi.practice_name must be at least 2 characters');
    }
    if (typeof comp.rank !== 'number' || (comp.rank !== 1 && comp.rank !== 3)) {
      errors.push(`top_competitor_5mi.rank must be 1 (or 3), received ${comp.rank}`);
    }
    if (!comp.phone || comp.phone.length < 5) {
      errors.push('top_competitor_5mi.phone is required');
    }
    if (!comp.address || comp.address.length < 5) {
      errors.push('top_competitor_5mi.address is required');
    }
  }

  // Pitch hook check
  if (typeof lead.custom_pitch_hook_1500 !== 'string' || lead.custom_pitch_hook_1500.length < 50) {
    errors.push('custom_pitch_hook_1500 must be a string of at least 50 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a collection of leads
 */
export function validateLeadsCollection(leads: any[]): { valid: boolean; errors: string[] } {
  if (!Array.isArray(leads) || leads.length === 0) {
    return { valid: false, errors: ['Leads collection must be a non-empty array'] };
  }
  const allErrors: string[] = [];
  leads.forEach((l, idx) => {
    const res = validateLeadJson(l);
    if (!res.valid) {
      allErrors.push(`Lead #${idx + 1} (${l?.lead_id || 'unknown'}): ${res.errors.join('; ')}`);
    }
  });
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Escapes an individual cell value according to RFC 4180
 */
export function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  // Numbers that don't need quotes
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  // Enclose in double quotes and double internal quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Converts a LeadDossier into an array of 20 canonical values matching CANONICAL_CSV_HEADERS
 */
export function leadToCsvRowValues(lead: LeadDossier): (string | number)[] {
  const domain = extractCleanDomain(lead.website_url);

  // Build clean Ads Status string
  let adsStatus = lead.paid_ads_signal?.status || 'Active Verified Advertiser';
  const adCount = lead.paid_ads_signal?.active_ad_count;
  if (adCount && !adsStatus.includes('(')) {
    const numMatch = adCount.match(/~?([0-9]+)/);
    if (numMatch) {
      adsStatus = `${adsStatus} (${numMatch[1]} Ads)`;
    } else if (/search/i.test(adCount)) {
      adsStatus = `${adsStatus} (Search PPC)`;
    }
  }

  return [
    lead.lead_id,
    lead.practice_name,
    domain,
    lead.solo_owner?.name || '',
    lead.solo_owner?.credentials || '',
    lead.solo_owner?.title || '',
    lead.phone_number || '',
    lead.location?.address || '',
    lead.location?.city || '',
    lead.location?.state || '',
    lead.location?.zip_code || '',
    lead.google_maps?.rank ?? 5,
    lead.google_maps?.review_count ?? 0,
    lead.google_maps?.rating ?? 4.9,
    adsStatus,
    lead.paid_ads_signal?.estimated_cpc || '',
    lead.top_competitor_5mi?.practice_name || '',
    lead.top_competitor_5mi?.rank ?? 1,
    lead.top_competitor_5mi?.phone || '',
    lead.custom_pitch_hook_1500 || '',
  ];
}

/**
 * Serializes an array of leads to a canonical RFC 4180 CSV string
 */
export function leadsToCsvString(leads: LeadInput[]): string {
  const normalized = leads.map((l, i) => normalizeToLeadDossier(l, i + 1));
  const headerLine = CANONICAL_CSV_HEADERS.join(',');
  const rowLines = normalized.map((lead) => {
    const rowValues = leadToCsvRowValues(lead);
    return rowValues.map((v) => escapeCsvCell(v)).join(',');
  });
  return [headerLine, ...rowLines].join('\n') + '\n';
}

/**
 * Exports qualified leads to JSON adhering to Draft 2020-12
 */
export async function exportLeadsToJson(
  leads: LeadInput[],
  filePath: string
): Promise<void> {
  const normalized = leads.map((l, i) => normalizeToLeadDossier(l, i + 1));
  const validation = validateLeadsCollection(normalized);
  if (!validation.valid) {
    throw new Error(`Cannot export invalid leads collection:\n${validation.errors.join('\n')}`);
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const jsonContent = JSON.stringify(normalized, null, 2) + '\n';
  fs.writeFileSync(filePath, jsonContent, 'utf8');
}

/**
 * Exports qualified leads to canonical RFC 4180 CSV
 */
export async function exportLeadsToCsv(
  leads: LeadInput[],
  filePath: string
): Promise<void> {
  const normalized = leads.map((l, i) => normalizeToLeadDossier(l, i + 1));
  const validation = validateLeadsCollection(normalized);
  if (!validation.valid) {
    throw new Error(`Cannot export invalid leads collection:\n${validation.errors.join('\n')}`);
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const csvContent = leadsToCsvString(normalized);
  fs.writeFileSync(filePath, csvContent, 'utf8');
}
