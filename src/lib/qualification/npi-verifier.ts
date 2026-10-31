/**
 * CMS NPPES Federal NPI Registry Integration & Solo Doctor Verifier
 *
 * Official Federal Registry API v2.1:
 * https://npiregistry.cms.hhs.gov/api/?version=2.1
 *
 * Implements Gate 6 of the 7-Point Qualification Engine:
 * - Validates Individual NPI-1 status (rejects NPI-2 organizational entities)
 * - Validates medical/dental credentials (DDS, DMD, MD)
 * - Verifies approved surgical dental taxonomies (Periodontics, Prosthodontics, OMFS, General Dentist)
 * - Disqualifies pediatric dentistry (1223P0106X) and public health (1223D0001X)
 * - Verifies sole proprietorship / principal owner status
 * - Provides timeout resilience, query retries, and offline cache fallback
 */

import { DoctorVerification } from './types';

export const APPROVED_DENTAL_TAXONOMY_CODES: Record<string, string> = {
  '122300000X': 'Dentist',
  '1223G0001X': 'General Practice Dentist',
  '1223P0300X': 'Periodontics',
  '1223P0700X': 'Prosthodontics',
  '1223S0112X': 'Oral and Maxillofacial Surgery',
  '1223X0008X': 'Oral and Maxillofacial Radiology',
  '1223X0400X': 'Orthodontics and Dentofacial Orthopedics',
  '1223E0200X': 'Endodontics',
  '204E00000X': 'Oral & Maxillofacial Surgery (MD/DO)',
};

export const DISQUALIFIED_TAXONOMY_CODES: Record<string, string> = {
  '1223P0221X': 'Pediatric Dentistry',
  '1223P0106X': 'Oral and Maxillofacial Pathology',
  '1223D0001X': 'Dental Public Health',
};

const DENTAL_SURGERY_CREDENTIAL_REGEX = /\b(DDS|DMD|D\.D\.S|D\.M\.D)\b/i;
const MD_CREDENTIAL_REGEX = /\b(MD|M\.D|DO|D\.O)\b/i;
const DENTAL_CREDENTIAL_REGEX = /\b(DDS|DMD|MD|DO|D\.D\.S|D\.M\.D|M\.D|D\.O)\b/i;

// In-memory cache for fast lookups & test resilience
const NPI_CACHE = new Map<string, DoctorVerification>();

/**
 * Parses raw doctor name string to isolate first and last names.
 * Removes honorifics ("Dr.", "Doctor") and professional suffixes ("DDS", "PC", etc.),
 * and sanitizes associate titles ("Associate Dentist", etc.).
 */
export function parseDoctorName(rawName: string): { firstName: string; lastName: string; cleanName: string } {
  if (!rawName) return { firstName: '', lastName: '', cleanName: '' };

  // If multiple doctors separated by & or and, take first doctor
  const singleDoctor = rawName.split(/\s+(?:&|and)\s+/i)[0];

  let cleaned = singleDoctor
    .replace(/(?:^|\s)(?:dr\.?|doctor|prof\.?)(?:\s|$)/gi, ' ')
    .replace(/\b(associate\s+dentist|junior\s+associate|senior\s+associate|associate|hygienist|dental\s+assistant|assistant|clinic\s+manager|office\s+manager|practice\s+manager|junior|senior|dentist)\b/gi, ' ')
    .replace(/\b(dds|dmd|md|do|pc|pllc|pa|fagd|magd|faid|ficoi|jr|sr|ii|iii|iv)\b/gi, ' ')
    .replace(/[.,;:()]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const parts = cleaned.split(' ').filter(Boolean);

  if (parts.length === 0) {
    return { firstName: '', lastName: '', cleanName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0], cleanName: parts[0] };
  }

  // Filter out single-letter middle initials if there are multiple parts
  const nonInitials = parts.filter((p) => p.length > 1);
  const firstName = nonInitials[0] || parts[0];
  const lastName = nonInitials[nonInitials.length - 1] || parts[parts.length - 1];

  return {
    firstName,
    lastName,
    cleanName: `${firstName} ${lastName}`,
  };
}

/**
 * Checks if a credential string matches legitimate dental surgeon credentials.
 */
export function isDentalCredential(credential?: string): boolean {
  if (!credential) return false;
  return DENTAL_CREDENTIAL_REGEX.test(credential);
}

/**
 * Validates whether a healthcare taxonomy code is an approved surgical dental code.
 */
export function isValidDentalTaxonomy(code: string): boolean {
  if (!code) return false;
  if (DISQUALIFIED_TAXONOMY_CODES[code]) return false;
  return Boolean(APPROVED_DENTAL_TAXONOMY_CODES[code]);
}

/**
 * Direct lookup of NPI provider by 10-digit NPI Number via CMS NPPES Registry API v2.1.
 */
export async function lookupNpi(npiNumber: string, timeoutMs: number = 6000): Promise<DoctorVerification> {
  const cleanNpi = (npiNumber || '').replace(/\D/g, '');
  if (cleanNpi.length !== 10) {
    return {
      verified: false,
      doctorName: '',
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: `Invalid NPI length: ${cleanNpi.length} (must be 10 digits)`,
    };
  }

  if (NPI_CACHE.has(cleanNpi)) {
    return NPI_CACHE.get(cleanNpi)!;
  }

  try {
    const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${encodeURIComponent(cleanNpi)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NexusRank1-NPI-Verifier/2.1 (Healthcare B2B Qualification Engine)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      return {
        verified: false,
        doctorName: '',
        npiNumber: cleanNpi,
        isDentalDoctor: false,
        soleProprietor: false,
        isApprovedTaxonomy: false,
        disqualificationReason: `NPPES API HTTP error: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return {
        verified: false,
        doctorName: '',
        npiNumber: cleanNpi,
        isDentalDoctor: false,
        soleProprietor: false,
        isApprovedTaxonomy: false,
        disqualificationReason: `No provider found in CMS NPPES for NPI: ${cleanNpi}`,
      };
    }

    const verification = evaluateNpiRecord(data.results[0]);
    NPI_CACHE.set(cleanNpi, verification);
    return verification;
  } catch (err: any) {
    return {
      verified: false,
      doctorName: '',
      npiNumber: cleanNpi,
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: `CMS NPPES lookup failed: ${err.message || String(err)}`,
    };
  }
}

/**
 * Searches and verifies a doctor by name and state in the CMS NPPES Registry.
 */
export async function verifySoloDoctor(
  doctorName: string,
  state: string,
  address?: string,
  npiNumber?: string,
  timeoutMs: number = 7000
): Promise<DoctorVerification> {
  // If an exact NPI number was already supplied, verify it directly first
  if (npiNumber) {
    const directResult = await lookupNpi(npiNumber, timeoutMs);
    if (directResult.verified) return directResult;
  }

  const { firstName, lastName, cleanName } = parseDoctorName(doctorName);
  if (!lastName || lastName.length < 2) {
    return {
      verified: false,
      doctorName,
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: 'Doctor name missing or unparseable',
    };
  }

  const cacheKey = `${firstName}_${lastName}_${state}`.toUpperCase();
  if (NPI_CACHE.has(cacheKey)) {
    return NPI_CACHE.get(cacheKey)!;
  }

  try {
    const params = new URLSearchParams();
    params.set('version', '2.1');
    params.set('first_name', firstName);
    params.set('last_name', lastName);
    if (state && state.length === 2) {
      params.set('state', state.toUpperCase());
    }
    params.set('limit', '5');

    const url = `https://npiregistry.cms.hhs.gov/api/?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NexusRank1-NPI-Verifier/2.1 (Healthcare B2B Qualification Engine)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      return {
        verified: false,
        doctorName: cleanName,
        isDentalDoctor: false,
        soleProprietor: false,
        isApprovedTaxonomy: false,
        disqualificationReason: `NPPES API returned status ${res.status}`,
      };
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      // Retry without state restriction in case provider relocated or registered in adjacent state
      if (state) {
        return await verifySoloDoctor(doctorName, '', address, undefined, timeoutMs);
      }

      return {
        verified: false,
        doctorName: cleanName,
        isDentalDoctor: false,
        soleProprietor: false,
        isApprovedTaxonomy: false,
        disqualificationReason: `No active NPI record found in CMS NPPES for ${cleanName}`,
      };
    }

    // Find the best match among results
    for (const record of data.results) {
      const evalResult = evaluateNpiRecord(record);
      if (evalResult.verified) {
        NPI_CACHE.set(cacheKey, evalResult);
        return evalResult;
      }
    }

    // If none passed full verification, return evaluation of the first result
    const fallbackResult = evaluateNpiRecord(data.results[0]);
    NPI_CACHE.set(cacheKey, fallbackResult);
    return fallbackResult;
  } catch (err: any) {
    return {
      verified: false,
      doctorName: cleanName,
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: `CMS NPPES query exception: ${err.message || String(err)}`,
    };
  }
}

/**
 * Evaluates an individual CMS NPPES record against Gate 6 criteria.
 */
export function evaluateNpiRecord(raw: any): DoctorVerification {
  // Input sanitization guard against null/undefined
  if (!raw || typeof raw !== 'object') {
    return {
      verified: false,
      doctorName: '',
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: 'Invalid or missing NPI record object',
    };
  }

  const enumerationType = raw.enumeration_type as 'NPI-1' | 'NPI-2';
  const basic = raw.basic || {};
  const npiNumber = String(raw.number || '');

  const docFirst = basic.first_name || '';
  const docLast = basic.last_name || '';
  const docName = `${docFirst} ${docLast}`.trim() || basic.organization_name || 'Unknown Doctor';
  const credential = (basic.credential || '').trim();

  // 1. Must be NPI-1 (Individual), NOT NPI-2 (Corporate Organization)
  if (enumerationType !== 'NPI-1') {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential,
      isDentalDoctor: false,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      disqualificationReason: `Corporate Entity NPI-2 detected (${docName}). Must be individual practitioner NPI-1.`,
      rawRecord: raw,
    };
  }

  // 2. Doctor credentials check: DDS, DMD, MD, DO
  const hasDentalDegree = DENTAL_SURGERY_CREDENTIAL_REGEX.test(credential);
  const hasMdDegree = MD_CREDENTIAL_REGEX.test(credential);

  // 3. Taxonomy validation: reject empty taxonomy arrays instead of fabricating fallback
  const taxonomies: any[] = Array.isArray(raw.taxonomies) ? raw.taxonomies : [];
  if (taxonomies.length === 0) {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential,
      isDentalDoctor: hasDentalDegree,
      soleProprietor: false,
      isApprovedTaxonomy: false,
      primaryTaxonomy: '',
      taxonomyCode: '',
      disqualificationReason: 'CMS NPPES record contains no taxonomy entries (cannot verify dental specialty)',
      rawRecord: raw,
    };
  }

  let primaryTaxonomy = '';
  let taxonomyCode = '';
  let isApprovedTaxonomy = false;
  let isDisqualifiedTaxonomy = false;
  let licenseNumber = '';
  let licenseState = '';

  for (const tax of taxonomies) {
    if (!tax) continue;
    if (tax.primary || !taxonomyCode) {
      primaryTaxonomy = tax.desc || '';
      taxonomyCode = tax.code || '';
      licenseNumber = tax.license || '';
      licenseState = tax.state || '';
    }

    // Defensive check: catch pediatric, oral pathology, or public health keywords in text or NUCC code
    if (
      (tax.code && DISQUALIFIED_TAXONOMY_CODES[tax.code]) ||
      /pediatric|child|public\s+health|oral.*pathology/i.test(tax.desc || '')
    ) {
      isDisqualifiedTaxonomy = true;
      primaryTaxonomy = tax.desc || (tax.code ? DISQUALIFIED_TAXONOMY_CODES[tax.code] : '') || 'Oral and Maxillofacial Pathology';
      taxonomyCode = tax.code || '1223P0106X';
      break;
    }

    if (
      (tax.code && APPROVED_DENTAL_TAXONOMY_CODES[tax.code]) ||
      /(dentist|periodont|prosthodont|oral.*maxillofacial.*surgery|oral\s+surgery)/i.test(tax.desc || '')
    ) {
      isApprovedTaxonomy = true;
      if (tax.primary) {
        primaryTaxonomy = tax.desc || APPROVED_DENTAL_TAXONOMY_CODES[tax.code] || 'Dentist';
        taxonomyCode = tax.code;
      }
    }
  }

  if (isDisqualifiedTaxonomy) {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential,
      isDentalDoctor: hasDentalDegree,
      soleProprietor: basic.sole_proprietor === 'YES',
      primaryTaxonomy,
      taxonomyCode,
      isApprovedTaxonomy: false,
      licenseNumber,
      licenseState,
      disqualificationReason: `Disqualified taxonomy detected: ${primaryTaxonomy} (${taxonomyCode}). Pediatric, oral pathology, and public health practices are excluded.`,
      rawRecord: raw,
    };
  }

  // If provider has dental degree (DDS/DMD) and taxonomy is not disqualified, treat as approved dental provider
  if (hasDentalDegree && !isDisqualifiedTaxonomy && (isApprovedTaxonomy || (taxonomyCode && isValidDentalTaxonomy(taxonomyCode)))) {
    isApprovedTaxonomy = true;
  }

  if (!isApprovedTaxonomy) {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential,
      isDentalDoctor: false,
      soleProprietor: basic.sole_proprietor === 'YES',
      primaryTaxonomy,
      taxonomyCode,
      isApprovedTaxonomy: false,
      licenseNumber,
      licenseState,
      disqualificationReason: `Provider lacks approved dental/oral surgery taxonomy (found: "${primaryTaxonomy}" [${taxonomyCode}]). Non-dental medical specialties are excluded.`,
      rawRecord: raw,
    };
  }

  // 4. Strict MD/DO Specialty Enforcement:
  // Medical Doctor (MD/DO) must possess Oral & Maxillofacial Surgery taxonomy (204E00000X or 1223S0112X)
  if (hasMdDegree && !hasDentalDegree) {
    const isOmfs =
      taxonomyCode === '204E00000X' ||
      taxonomyCode === '1223S0112X' ||
      /oral.*maxillofacial.*surgery|oral\s+surgery/i.test(primaryTaxonomy);

    if (!isOmfs) {
      return {
        verified: false,
        doctorName: docName,
        npiNumber,
        enumerationType,
        credentials: credential,
        isDentalDoctor: false,
        soleProprietor: basic.sole_proprietor === 'YES',
        primaryTaxonomy,
        taxonomyCode,
        isApprovedTaxonomy: false,
        disqualificationReason: `Medical Doctor (MD/DO) lacks Oral & Maxillofacial Surgery taxonomy (found: "${primaryTaxonomy}" [${taxonomyCode}]). Non-dental medical practitioners are disqualified.`,
        rawRecord: raw,
      };
    }
  }

  // 5. Must have doctorate credential (DDS, DMD, or OMFS MD/DO)
  const isDentalDoctor = hasDentalDegree || hasMdDegree;
  if (!isDentalDoctor) {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential,
      isDentalDoctor: false,
      soleProprietor: false,
      primaryTaxonomy,
      taxonomyCode,
      isApprovedTaxonomy: false,
      disqualificationReason: `Provider lacks doctorate credentials (DDS, DMD, or surgical MD). Found: "${credential}"`,
      rawRecord: raw,
    };
  }

  // 6. Sole Proprietorship / Principal Owner Enforcement
  const isSoleProprietor =
    basic.sole_proprietor === 'YES' ||
    /\b(PC|PLLC|PA|P\.C\.|P\.L\.L\.C\.)\b/i.test(credential) ||
    /pc|pllc/i.test(basic.last_name || '');

  // Extract address if present
  const locAddress =
    (raw.addresses || []).find((a: any) => a.address_purpose === 'LOCATION') || (raw.addresses || [])[0];
  const formattedAddress = locAddress
    ? `${locAddress.address_1}, ${locAddress.city}, ${locAddress.state} ${locAddress.postal_code?.slice(0, 5)}`
    : undefined;

  if (!isSoleProprietor) {
    return {
      verified: false,
      doctorName: docName,
      npiNumber,
      enumerationType,
      credentials: credential || 'DDS',
      isDentalDoctor: true,
      soleProprietor: false,
      primaryTaxonomy,
      taxonomyCode,
      isApprovedTaxonomy: true,
      licenseNumber,
      licenseState,
      address: formattedAddress,
      disqualificationReason:
        'Provider is not a verified sole proprietor or principal PC/PLLC owner (associate dentist/employee detected: sole_proprietor = NO)',
      rawRecord: raw,
    };
  }

  return {
    verified: true,
    doctorName: docName,
    npiNumber,
    enumerationType,
    credentials: credential || 'DDS',
    isDentalDoctor: true,
    soleProprietor: true,
    primaryTaxonomy: primaryTaxonomy || 'Dentist',
    taxonomyCode: taxonomyCode || '122300000X',
    isApprovedTaxonomy: true,
    licenseNumber,
    licenseState,
    address: formattedAddress,
    rawRecord: raw,
  };
}

/**
 * Clears or seeds the internal NPI verification cache (useful for deterministic tests).
 */
export function seedNpiCache(key: string, record: DoctorVerification): void {
  NPI_CACHE.set(key, record);
}

export function clearNpiCache(): void {
  NPI_CACHE.clear();
}
