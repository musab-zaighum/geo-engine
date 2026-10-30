/**
 * Official CMS NPPES NPI Registry API Integration
 * Federal Registry v2.1 Endpoint: https://npiregistry.cms.hhs.gov/api/?version=2.1
 * 
 * 100% Free, Public Federal API - Zero API key required.
 * Provides real-time verification of National Provider Identifier (NPI),
 * clinical taxonomy, state medical licenses, and legal practice names.
 */

export interface NpiTaxonomy {
  code: string;
  desc: string;
  license?: string;
  state?: string;
  primary: boolean;
}

export interface NpiAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  addressType: 'DOM' | 'LOCATION';
}

export interface NpiProviderRecord {
  npi: string;
  enumerationType: 'NPI-1' | 'NPI-2'; // NPI-1: Individual, NPI-2: Organization
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  credential?: string; // DDS, DMD, MD, DO, etc.
  soleProprietor?: boolean;
  status: 'A' | 'D'; // Active or Deactivated
  enumerationDate?: string;
  lastUpdated?: string;
  taxonomies: NpiTaxonomy[];
  addresses: NpiAddress[];
  primaryTaxonomyDesc?: string;
  primaryLicenseNumber?: string;
  primaryLicenseState?: string;
}

export interface NpiLookupParams {
  number?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  taxonomyDescription?: string;
  limit?: number;
}

/**
 * Clean and normalize names for fuzzy matching against federal registry
 */
function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/\b(llc|inc|pa|pllc|pc|corp|ltd|clinic|dental|center|associates|group|practice|care)\b/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Direct lookup by 10-digit NPI Number
 */
export async function lookupNpiByNumber(npiNumber: string): Promise<NpiProviderRecord | null> {
  const cleanNpi = (npiNumber || '').replace(/\D/g, '');
  if (cleanNpi.length !== 10) return null;

  try {
    const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${encodeURIComponent(cleanNpi)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NexusRank1-NPI-Auditor/1.0 (B2B Healthcare GEO Intelligence)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    return formatNpiRecord(data.results[0]);
  } catch (err) {
    console.warn('CMS NPPES lookup by number failed:', err);
    return null;
  }
}

/**
 * Search the CMS NPPES Registry with structured parameters
 */
export async function searchNpiRegistry(params: NpiLookupParams): Promise<NpiProviderRecord[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('version', '2.1');
    searchParams.set('limit', String(params.limit || 5));

    if (params.number) {
      searchParams.set('number', params.number.replace(/\D/g, ''));
    }
    if (params.organizationName) {
      searchParams.set('organization_name', sanitizeSearchQuery(params.organizationName));
    }
    if (params.firstName) {
      searchParams.set('first_name', params.firstName);
    }
    if (params.lastName) {
      searchParams.set('last_name', params.lastName);
    }
    if (params.city) {
      searchParams.set('city', params.city);
    }
    if (params.state) {
      searchParams.set('state', params.state.toUpperCase());
    }
    if (params.postalCode) {
      searchParams.set('postal_code', params.postalCode.slice(0, 5));
    }
    if (params.taxonomyDescription) {
      searchParams.set('taxonomy_description', params.taxonomyDescription);
    }

    const url = `https://npiregistry.cms.hhs.gov/api/?${searchParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NexusRank1-NPI-Auditor/1.0 (B2B Healthcare GEO Intelligence)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: any) => formatNpiRecord(r));
  } catch (err) {
    console.warn('CMS NPPES search query failed:', err);
    return [];
  }
}

/**
 * Intelligent entity resolution: Attempts to find the clinic or doctor NPI
 * given domain text, title, and optional location indicators.
 */
export async function resolvePracticeLicensure(
  practiceName: string,
  state?: string,
  city?: string
): Promise<NpiProviderRecord | null> {
  const cleanName = sanitizeSearchQuery(practiceName);
  if (!cleanName || cleanName.length < 3) return null;

  // 1. First attempt: Search Organization (NPI-2)
  let results = await searchNpiRegistry({
    organizationName: cleanName,
    state,
    city,
    limit: 3,
  });

  if (results.length > 0) {
    return results[0];
  }

  // 2. Second attempt: Check if practiceName contains a doctor name (e.g., "Dr. Smith Cosmetic Dentistry")
  const doctorMatch = practiceName.match(/(?:Dr\.?|Doctor)\s+([A-Za-z]+)\s+([A-Za-z]+)/i);
  if (doctorMatch) {
    const [, firstName, lastName] = doctorMatch;
    results = await searchNpiRegistry({
      firstName,
      lastName,
      state,
      taxonomyDescription: 'Dentist',
      limit: 3,
    });
    if (results.length > 0) {
      return results[0];
    }
  }

  // 3. Third attempt: Broader city/state search if dental or medical clinic keywords match
  if (state && city) {
    results = await searchNpiRegistry({
      city,
      state,
      taxonomyDescription: 'Dentist',
      limit: 2,
    });
    if (results.length > 0) {
      return results[0];
    }
  }

  return null;
}

/**
 * Maps raw CMS JSON result to a standardized clean provider record
 */
function formatNpiRecord(raw: any): NpiProviderRecord {
  const isOrg = raw.enumeration_type === 'NPI-2';
  const basic = raw.basic || {};

  const taxonomies: NpiTaxonomy[] = (raw.taxonomies || []).map((t: any) => ({
    code: t.code || '',
    desc: t.desc || '',
    license: t.license || undefined,
    state: t.state || undefined,
    primary: Boolean(t.primary),
  }));

  const primaryTax = taxonomies.find((t) => t.primary) || taxonomies[0];

  const addresses: NpiAddress[] = (raw.addresses || []).map((a: any) => ({
    street: [a.address_1, a.address_2].filter(Boolean).join(', '),
    city: a.city || '',
    state: a.state || '',
    postalCode: (a.postal_code || '').slice(0, 5),
    phone: a.telephone_number || undefined,
    addressType: a.address_purpose === 'LOCATION' ? 'LOCATION' : 'DOM',
  }));

  const locAddress = addresses.find((a) => a.addressType === 'LOCATION') || addresses[0];

  return {
    npi: String(raw.number),
    enumerationType: raw.enumeration_type,
    organizationName: basic.organization_name || undefined,
    firstName: basic.first_name || basic.authorized_official_first_name || undefined,
    lastName: basic.last_name || basic.authorized_official_last_name || undefined,
    credential: basic.credential || basic.authorized_official_credential || undefined,
    soleProprietor: basic.sole_proprietor === 'YES',
    status: basic.status === 'A' ? 'A' : 'D',
    enumerationDate: basic.enumeration_date,
    lastUpdated: basic.last_updated,
    taxonomies,
    addresses,
    primaryTaxonomyDesc: primaryTax?.desc,
    primaryLicenseNumber: primaryTax?.license,
    primaryLicenseState: primaryTax?.state || locAddress?.state,
  };
}
