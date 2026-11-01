/**
 * Authoritative Requirement & Specification Test Oracle
 * Derived strictly from ORIGINAL_REQUEST.md, PROJECT.md, and explorer survey findings.
 */

export interface AffluentZipInfo {
  zip: string;
  city: string;
  state: string;
  metro: string;
  medianHhi: number;
}

export const AFFLUENT_ZIPS: Record<string, AffluentZipInfo> = {
  // Scottsdale AZ
  "85260": { zip: "85260", city: "Scottsdale", state: "AZ", metro: "Scottsdale", medianHhi: 135000 },
  "85255": { zip: "85255", city: "Scottsdale", state: "AZ", metro: "Scottsdale", medianHhi: 155000 },
  "85254": { zip: "85254", city: "Scottsdale", state: "AZ", metro: "Scottsdale", medianHhi: 125000 },
  "85258": { zip: "85258", city: "Scottsdale", state: "AZ", metro: "Scottsdale", medianHhi: 130000 },
  "85259": { zip: "85259", city: "Scottsdale", state: "AZ", metro: "Scottsdale", medianHhi: 140000 },

  // Newport Beach CA
  "92660": { zip: "92660", city: "Newport Beach", state: "CA", metro: "Newport Beach", medianHhi: 165000 },
  "92661": { zip: "92661", city: "Newport Beach", state: "CA", metro: "Newport Beach", medianHhi: 175000 },
  "92662": { zip: "92662", city: "Newport Beach", state: "CA", metro: "Newport Beach", medianHhi: 180000 },
  "92663": { zip: "92663", city: "Newport Beach", state: "CA", metro: "Newport Beach", medianHhi: 145000 },
  "92625": { zip: "92625", city: "Corona del Mar", state: "CA", metro: "Newport Beach", medianHhi: 195000 },

  // Beverly Hills CA
  "90210": { zip: "90210", city: "Beverly Hills", state: "CA", metro: "Beverly Hills", medianHhi: 170000 },
  "90211": { zip: "90211", city: "Beverly Hills", state: "CA", metro: "Beverly Hills", medianHhi: 130000 },
  "90212": { zip: "90212", city: "Beverly Hills", state: "CA", metro: "Beverly Hills", medianHhi: 140000 },

  // Dallas / Plano / Frisco TX
  "75024": { zip: "75024", city: "Plano", state: "TX", metro: "Dallas/Plano", medianHhi: 135000 },
  "75034": { zip: "75034", city: "Frisco", state: "TX", metro: "Dallas/Plano", medianHhi: 145000 },
  "75093": { zip: "75093", city: "Plano", state: "TX", metro: "Dallas/Plano", medianHhi: 130000 },
  "75201": { zip: "75201", city: "Dallas", state: "TX", metro: "Dallas/Plano", medianHhi: 125000 },
  "75205": { zip: "75205", city: "Dallas", state: "TX", metro: "Dallas/Plano", medianHhi: 215000 },
  "75225": { zip: "75225", city: "Dallas", state: "TX", metro: "Dallas/Plano", medianHhi: 220000 },

  // Boca Raton / Delray Beach / Naples FL
  "33496": { zip: "33496", city: "Boca Raton", state: "FL", metro: "Boca Raton/Naples", medianHhi: 140000 },
  "33483": { zip: "33483", city: "Delray Beach", state: "FL", metro: "Boca Raton/Naples", medianHhi: 130000 },
  "33486": { zip: "33486", city: "Boca Raton", state: "FL", metro: "Boca Raton/Naples", medianHhi: 125000 },
  "33432": { zip: "33432", city: "Boca Raton", state: "FL", metro: "Boca Raton/Naples", medianHhi: 135000 },
  "34102": { zip: "34102", city: "Naples", state: "FL", metro: "Boca Raton/Naples", medianHhi: 150000 },
  "34108": { zip: "34108", city: "Naples", state: "FL", metro: "Boca Raton/Naples", medianHhi: 145000 },

  // Bellevue WA
  "98004": { zip: "98004", city: "Bellevue", state: "WA", metro: "Bellevue", medianHhi: 155000 },
  "98005": { zip: "98005", city: "Bellevue", state: "WA", metro: "Bellevue", medianHhi: 145000 },
  "98006": { zip: "98006", city: "Bellevue", state: "WA", metro: "Bellevue", medianHhi: 160000 },
  "98039": { zip: "98039", city: "Medina", state: "WA", metro: "Bellevue", medianHhi: 250000 },

  // Greenwich CT
  "06830": { zip: "06830", city: "Greenwich", state: "CT", metro: "Greenwich", medianHhi: 185000 },
  "06831": { zip: "06831", city: "Greenwich", state: "CT", metro: "Greenwich", medianHhi: 195000 },
  "06870": { zip: "06870", city: "Old Greenwich", state: "CT", metro: "Greenwich", medianHhi: 220000 },
  "06820": { zip: "06820", city: "Darien", state: "CT", metro: "Fairfield County / Greenwich, CT", medianHhi: 245000 },
  "06840": { zip: "06840", city: "New Canaan", state: "CT", metro: "Fairfield County / Greenwich, CT", medianHhi: 220000 },
  "06880": { zip: "06880", city: "Westport", state: "CT", metro: "Fairfield County / Greenwich, CT", medianHhi: 215000 },

  // Manhattan / New York, NY (R1 Corridor 1)
  "10019": { zip: "10019", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 168000 },
  "10021": { zip: "10021", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 185000 },
  "10022": { zip: "10022", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 175000 },
  "10028": { zip: "10028", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 185000 },
  "10065": { zip: "10065", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 190000 },
  "10075": { zip: "10075", city: "New York", state: "NY", metro: "Manhattan / New York, NY", medianHhi: 195000 },

  // Silicon Valley / Atherton & Palo Alto, CA (R1 Corridor 2)
  "94022": { zip: "94022", city: "Los Altos", state: "CA", metro: "Silicon Valley / Atherton & Palo Alto, CA", medianHhi: 245000 },
  "94024": { zip: "94024", city: "Los Altos", state: "CA", metro: "Silicon Valley / Atherton & Palo Alto, CA", medianHhi: 235000 },
  "94027": { zip: "94027", city: "Atherton", state: "CA", metro: "Silicon Valley / Atherton & Palo Alto, CA", medianHhi: 250000 },
  "94301": { zip: "94301", city: "Palo Alto", state: "CA", metro: "Silicon Valley / Atherton & Palo Alto, CA", medianHhi: 215000 },

  // Palm Beach & Jupiter, FL (R1 Corridor 3)
  "33431": { zip: "33431", city: "Boca Raton", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 130000 },
  "33458": { zip: "33458", city: "Jupiter", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 145000 },
  "33477": { zip: "33477", city: "Jupiter", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 165000 },
  "33480": { zip: "33480", city: "Palm Beach", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 250000 },
  "34103": { zip: "34103", city: "Naples", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 175000 },
  "34110": { zip: "34110", city: "Naples", state: "FL", metro: "South Florida / Boca Raton & Naples, FL", medianHhi: 152000 },

  // Scottsdale North & Paradise Valley, AZ (R1 Corridor 4 additions)
  "85018": { zip: "85018", city: "Phoenix / Paradise Valley", state: "AZ", metro: "Phoenix / Scottsdale, AZ", medianHhi: 155000 },
  "85253": { zip: "85253", city: "Paradise Valley", state: "AZ", metro: "Phoenix / Scottsdale, AZ", medianHhi: 215000 },
  "85262": { zip: "85262", city: "Scottsdale", state: "AZ", metro: "Phoenix / Scottsdale, AZ", medianHhi: 180000 },
  "85266": { zip: "85266", city: "Scottsdale", state: "AZ", metro: "Phoenix / Scottsdale, AZ", medianHhi: 165000 },

  // Newport Beach & Corona del Mar, CA (R1 Corridor 5 additions)
  "92603": { zip: "92603", city: "Irvine", state: "CA", metro: "Orange County / Newport Beach, CA", medianHhi: 160000 },
  "92657": { zip: "92657", city: "Newport Coast", state: "CA", metro: "Orange County / Newport Beach, CA", medianHhi: 245000 },
  "92677": { zip: "92677", city: "Laguna Niguel", state: "CA", metro: "Orange County / Newport Beach, CA", medianHhi: 145000 },

  // Dallas Park Cities & Preston Hollow, TX (R1 Corridor 6 additions)
  "75025": { zip: "75025", city: "Plano", state: "TX", metro: "Dallas–Fort Worth / North Plano, TX", medianHhi: 135000 },
  "75035": { zip: "75035", city: "Frisco", state: "TX", metro: "Dallas–Fort Worth / North Plano, TX", medianHhi: 140000 },
  "75056": { zip: "75056", city: "The Colony", state: "TX", metro: "Dallas–Fort Worth / North Plano, TX", medianHhi: 130000 },
  "75209": { zip: "75209", city: "Dallas", state: "TX", metro: "Dallas–Fort Worth / North Plano, TX", medianHhi: 148000 },

  // Colorado Luxury / Aspen & Vail, CO (R1 Corridor 7)
  "81611": { zip: "81611", city: "Aspen", state: "CO", metro: "Colorado Luxury / Aspen & Vail, CO", medianHhi: 210000 },
  "81657": { zip: "81657", city: "Vail", state: "CO", metro: "Colorado Luxury / Aspen & Vail, CO", medianHhi: 175000 },

  // Beverly Hills / Westside additions
  "90049": { zip: "90049", city: "Los Angeles", state: "CA", metro: "Los Angeles Westside / Beverly Hills, CA", medianHhi: 175000 },
  "90077": { zip: "90077", city: "Los Angeles", state: "CA", metro: "Los Angeles Westside / Beverly Hills, CA", medianHhi: 210000 },
  "90266": { zip: "90266", city: "Manhattan Beach", state: "CA", metro: "Los Angeles Westside / Beverly Hills, CA", medianHhi: 190000 },
  "90272": { zip: "90272", city: "Pacific Palisades", state: "CA", metro: "Los Angeles Westside / Beverly Hills, CA", medianHhi: 215000 },
  "90402": { zip: "90402", city: "Santa Monica", state: "CA", metro: "Los Angeles Westside / Beverly Hills, CA", medianHhi: 225000 },

  // Bellevue / Seattle Eastside additions
  "98033": { zip: "98033", city: "Kirkland", state: "WA", metro: "Seattle Eastside / Bellevue, WA", medianHhi: 165000 },
  "98040": { zip: "98040", city: "Mercer Island", state: "WA", metro: "Seattle Eastside / Bellevue, WA", medianHhi: 210000 },
  "98052": { zip: "98052", city: "Redmond", state: "WA", metro: "Seattle Eastside / Bellevue, WA", medianHhi: 155000 }
};

export const DSO_BLACKLIST = [
  "clearchoice",
  "aspen dental",
  "heartland dental",
  "pacific dental services",
  "pacific dental",
  "smile brands",
  "western dental",
  "sonrava health",
  "gentle dental",
  "42 north dental",
  "dental care alliance",
  "affordable dentures",
  "affordable care",
  "mb2 dental",
  "north american dental group",
  "great expressions",
  "mortenson dental",
  "dental365",
  "benevis",
  "kool smiles",
  "decadental",
  "interdent",
  "marquee dental",
  "mid-atlantic dental",
  "guardian dental"
];

export function isAffluentZip(zip: string): boolean {
  if (!zip) return false;
  const clean = zip.trim().substring(0, 5);
  const entry = AFFLUENT_ZIPS[clean];
  return Boolean(entry && entry.medianHhi >= 120000);
}

export function validateDoctor(doc: {
  name?: string;
  credentials?: string;
  title?: string;
  background?: string;
}): { valid: boolean; reason?: string } {
  if (!doc || !doc.name || typeof doc.name !== "string" || doc.name.trim().length < 3) {
    return { valid: false, reason: "Doctor name missing or too short" };
  }
  if (!doc.credentials || typeof doc.credentials !== "string") {
    return { valid: false, reason: "Doctor credentials missing" };
  }
  // Must possess doctorate: DDS, DMD, or MD
  if (!/\b(DDS|D\.D\.S\.|DMD|D\.M\.D\.|MD|M\.D\.)\b/i.test(doc.credentials)) {
    return { valid: false, reason: `Credentials "${doc.credentials}" lack DDS, DMD, or MD doctorate` };
  }
  if (!doc.title || typeof doc.title !== "string") {
    return { valid: false, reason: "Doctor title missing" };
  }
  // Disqualify associate dentists, hygienists, managers
  if (/\b(associate|hygienist|assistant|manager|coordinator|administrator)\b/i.test(doc.title)) {
    return { valid: false, reason: `Title "${doc.title}" indicates non-solo/associate role` };
  }
  // Must verify solo/founder/owner/principal/director status
  if (!/\b(solo|owner|founder|principal|director|surgeon|specialist|head)\b/i.test(doc.title)) {
    return { valid: false, reason: `Title "${doc.title}" does not indicate solo ownership/leadership` };
  }

  return { valid: true };
}

export function checkDsoDisqualification(text: string): { isDso: boolean; matchedDso?: string } {
  if (!text) return { isDso: false };
  const lower = text.toLowerCase();
  for (const dso of DSO_BLACKLIST) {
    if (lower.includes(dso)) {
      return { isDso: true, matchedDso: dso };
    }
  }
  return { isDso: false };
}

export function checkClinicalSpecialization(text: string): { qualified: boolean; reason?: string } {
  if (!text) return { qualified: false, reason: "Empty text for clinical evaluation" };
  const lower = text.toLowerCase();

  // Negative checks: Medicaid / Denti-Cal, routine hygiene, or pediatric only
  if (/\b(medicaid|denti-cal|state insurance|chip)\b/i.test(lower)) {
    return { qualified: false, reason: "Clinic participates in Medicaid or state welfare dental program" };
  }
  if (/\b(pediatric dentistry only|pediatric only|children'?s dentistry only)\b/i.test(lower)) {
    return { qualified: false, reason: "Clinic is exclusively pediatric" };
  }

  // Positive surgical implant keywords
  const positiveTerms = [
    "implant",
    "all-on-4",
    "all-on-four",
    "full-arch",
    "full arch",
    "periodont",
    "prosthodont",
    "zygomatic",
    "surgical restoration",
    "bone graft",
    "sinus lift"
  ];

  const matched = positiveTerms.filter(t => lower.includes(t));
  if (matched.length === 0) {
    return { qualified: false, reason: "Lacks surgical dental implant or full-arch specialization terms" };
  }

  return { qualified: true };
}

export function validateMapPackRank(rank: any): { valid: boolean; reason?: string } {
  if (typeof rank !== "number" || !Number.isInteger(rank)) {
    return { valid: false, reason: `Rank must be an integer, got ${rank}` };
  }
  if (rank >= 1 && rank <= 3) {
    return { valid: false, reason: `Rank #${rank} is already in the Local 3-Pack (already dominating)` };
  }
  if (rank < 4 || rank > 6) {
    return { valid: false, reason: `Rank #${rank} is outside the required #4-#6 Local Overflow fold` };
  }
  return { valid: true };
}

export function validatePaidAdsSignal(ads: any): { valid: boolean; reason?: string } {
  if (!ads || typeof ads !== "object") {
    return { valid: false, reason: "Missing paid_ads_signal object" };
  }
  if (!ads.status || typeof ads.status !== "string") {
    return { valid: false, reason: "Missing ads.status" };
  }
  if (/\b(no active|inactive|disabled|expired|unverified|none)\b/i.test(ads.status)) {
    return { valid: false, reason: `Status indicates inactive advertising: "${ads.status}"` };
  }
  if (!/\b(active|verified|running|sponsored)\b/i.test(ads.status)) {
    return { valid: false, reason: `Invalid ads status: "${ads.status}" (must indicate active paid advertising)` };
  }
  if (!ads.active_ad_count || typeof ads.active_ad_count !== "string" || ads.active_ad_count.trim().length === 0) {
    return { valid: false, reason: "Missing active_ad_count field" };
  }
  if (!ads.estimated_cpc || typeof ads.estimated_cpc !== "string" || !/\$[0-9]+/i.test(ads.estimated_cpc)) {
    return { valid: false, reason: `Invalid estimated_cpc: "${ads.estimated_cpc}" (must specify dollar CPC estimate)` };
  }
  return { valid: true };
}

export function haversineDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export function validateCompetitor(
  comp: any,
  candidatePracticeName?: string,
  distanceMiles?: number
): { valid: boolean; reason?: string } {
  if (!comp || typeof comp !== "object") {
    return { valid: false, reason: "Missing competitor object" };
  }
  if (!comp.practice_name || typeof comp.practice_name !== "string" || comp.practice_name.length < 2) {
    return { valid: false, reason: "Missing competitor practice_name" };
  }
  if (candidatePracticeName && comp.practice_name.toLowerCase().trim() === candidatePracticeName.toLowerCase().trim()) {
    return { valid: false, reason: "Competitor cannot be the same practice as the candidate" };
  }
  if (!comp.address || typeof comp.address !== "string" || comp.address.length < 5) {
    return { valid: false, reason: "Missing competitor address" };
  }
  if (!comp.phone || typeof comp.phone !== "string") {
    return { valid: false, reason: "Missing competitor phone" };
  }
  if (!comp.website || typeof comp.website !== "string") {
    return { valid: false, reason: "Missing competitor website" };
  }
  // Must be rank 1 (or 3 for local 3-pack gatekeeper competitor)
  if (typeof comp.rank !== "number" || (comp.rank !== 1 && comp.rank !== 3)) {
    return { valid: false, reason: `Competitor rank must be 1 (or 3 for gatekeeper rival), got ${comp.rank}` };
  }
  if (distanceMiles !== undefined && distanceMiles > 5.0) {
    return { valid: false, reason: `Competitor is ${distanceMiles} miles away (> 5.0-mile maximum radius)` };
  }
  return { valid: true };
}

export function validateLeadSchema(lead: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!lead || typeof lead !== "object") {
    return { valid: false, errors: ["Lead is not an object"] };
  }

  // Required root fields
  const requiredFields = [
    "lead_id",
    "practice_name",
    "website_url",
    "solo_owner",
    "location",
    "phone_number",
    "google_maps",
    "paid_ads_signal",
    "top_competitor_5mi",
    "custom_pitch_hook_1500"
  ];

  for (const f of requiredFields) {
    if (lead[f] === undefined || lead[f] === null) {
      errors.push(`Missing required field: ${f}`);
    }
  }

  // lead_id pattern
  if (lead.lead_id && !/^GOAT-[0-9]{3,}$/.test(lead.lead_id)) {
    errors.push(`lead_id "${lead.lead_id}" does not match pattern ^GOAT-[0-9]{3,}$`);
  }

  // practice_name
  if (typeof lead.practice_name !== "string" || lead.practice_name.length < 2) {
    errors.push(`Invalid practice_name: "${lead.practice_name}"`);
  }

  // website_url format
  if (typeof lead.website_url !== "string" || !/^https?:\/\//i.test(lead.website_url)) {
    errors.push(`Invalid website_url: "${lead.website_url}" (must start with http:// or https://)`);
  }

  // solo_owner validation
  const docVal = validateDoctor(lead.solo_owner);
  if (!docVal.valid) {
    errors.push(`solo_owner error: ${docVal.reason}`);
  }

  // location validation
  if (!lead.location || typeof lead.location !== "object") {
    errors.push("Invalid location object");
  } else {
    if (!lead.location.address || typeof lead.location.address !== "string") {
      errors.push("Missing location.address");
    }
    if (!lead.location.city || typeof lead.location.city !== "string") {
      errors.push("Missing location.city");
    }
    if (!lead.location.state || !/^[A-Z]{2}$/.test(lead.location.state)) {
      errors.push(`Invalid location.state: "${lead.location.state}" (must be 2-letter uppercase)`);
    }
    if (!lead.location.zip_code || !/^[0-9]{5}(-[0-9]{4})?$/.test(lead.location.zip_code)) {
      errors.push(`Invalid location.zip_code: "${lead.location.zip_code}"`);
    }
    if (!lead.location.metro_affluence || typeof lead.location.metro_affluence !== "string") {
      errors.push("Missing location.metro_affluence");
    }
  }

  // google_maps validation
  if (!lead.google_maps || typeof lead.google_maps !== "object") {
    errors.push("Invalid google_maps object");
  } else {
    const rankVal = validateMapPackRank(lead.google_maps.rank);
    if (!rankVal.valid) {
      errors.push(`google_maps.rank error: ${rankVal.reason}`);
    }
    if (typeof lead.google_maps.rating !== "number" || lead.google_maps.rating < 1.0 || lead.google_maps.rating > 5.0) {
      errors.push(`Invalid google_maps.rating: ${lead.google_maps.rating}`);
    }
    if (typeof lead.google_maps.review_count !== "number" || lead.google_maps.review_count < 1) {
      errors.push(`Invalid google_maps.review_count: ${lead.google_maps.review_count}`);
    }
  }

  // paid_ads_signal validation
  const adsVal = validatePaidAdsSignal(lead.paid_ads_signal);
  if (!adsVal.valid) {
    errors.push(`paid_ads_signal error: ${adsVal.reason}`);
  }

  // top_competitor_5mi validation
  const compVal = validateCompetitor(lead.top_competitor_5mi, lead.practice_name);
  if (!compVal.valid) {
    errors.push(`top_competitor_5mi error: ${compVal.reason}`);
  }

  // custom_pitch_hook_1500 validation
  if (typeof lead.custom_pitch_hook_1500 !== "string" || lead.custom_pitch_hook_1500.length < 50) {
    errors.push(`custom_pitch_hook_1500 must be a string of at least 50 chars`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function parseRFC4180Csv(csvContent: string): { headers: string[]; rows: string[][] } {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '""';
        i++; // Skip escaped quote in line stream
      } else {
        inQuotes = !inQuotes;
        currentLine += '"';
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (currentLine.trim().length > 0) {
        lines.push(currentLine);
      }
      currentLine = "";
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim().length > 0) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cell = "";
    let inside = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inside && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inside = !inside;
        }
      } else if (c === ',' && !inside) {
        cells.push(cell);
        cell = "";
      } else {
        cell += c;
      }
    }
    cells.push(cell);
    return cells;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);

  return { headers, rows };
}

export const CANONICAL_CSV_HEADERS = [
  "Lead ID",
  "Practice Name",
  "Domain",
  "Doctor Name",
  "Credentials",
  "Title",
  "Phone",
  "Address",
  "City",
  "State",
  "Zip Code",
  "Google Maps Rank",
  "Reviews",
  "Rating",
  "Ads Status",
  "Google Ads CPC",
  "#1 Competitor Name",
  "#1 Competitor Maps Rank",
  "#1 Competitor Phone",
  "Pitch Hook"
];
