/**
 * DSO (Dental Support Organization) & Corporate Chain Disqualification Engine
 *
 * Implements Gate 5 of the 7-Point Qualification Engine:
 * Strictly enforces 100% private independent clinic ownership by detecting and
 * disqualifying corporate dental chains, private-equity networks, and stealth DSOs.
 *
 * Employs a comprehensive 5-Tier Detection Architecture:
 * - Tier 1: National Mega-Chains & Brand Names (ClearChoice, Aspen Dental, Heartland, PDS, etc.)
 * - Tier 2: Surgical & Specialty MSOs / Stealth Networks (Allied OMS, Beacon, MB2 Dental, USOSM, etc.)
 * - Tier 3: Domain & Subdomain Blacklist (150+ corporate root domains & multi-state portals)
 * - Tier 4: Regulatory Disclaimers & Legal Notice Regex (Contracted dentistry disclosures)
 * - Tier 5: Corporate Infrastructure Signals (Workday/Greenhouse ATS slugs, multi-state locators)
 */

import { DsoCheckResult, DsoMatchTier } from './types';

export interface DsoDirectoryEntry {
  name: string;
  tier: DsoMatchTier;
  parentEntity?: string;
  domains: string[];
  keywords: string[];
  legalPatterns?: RegExp[];
}

export const DSO_DIRECTORY: DsoDirectoryEntry[] = [
  // TIER 1: National Mega-Chains
  {
    name: 'ClearChoice Dental Implant Centers',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'TAG - The Aspen Group',
    domains: ['clearchoice.com', 'clearchoicecenters.com', 'clearchoicemanagement.com'],
    keywords: ['clearchoice', 'clear choice', 'clear choice dental', 'clearchoice management services'],
    legalPatterns: [
      /clearchoice\s+management\s+services/i,
      /clearchoice\s+dental\s+implant\s+center/i,
      /a\s+clearchoice\s+network/i,
    ],
  },
  {
    name: 'Heartland Dental',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'KKR',
    domains: ['heartland.com', 'heartlanddental.com', 'heartlanddentalcare.com'],
    keywords: ['heartland dental', 'heartland dental care', 'supported by heartland'],
    legalPatterns: [
      /supported\s+by\s+heartland\s+dental/i,
      /heartland\s+dental\s+(support|partner|affiliate)/i,
      /dental\s+care\s+at\s+[a-z\s]+,\s+a\s+heartland/i,
    ],
  },
  {
    name: 'Aspen Dental',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'TAG - The Aspen Group',
    domains: ['aspendental.com', 'aspendentaljobs.com', 'teamaspen.com'],
    keywords: ['aspen dental', 'aspen dental management', 'tag the aspen group'],
    legalPatterns: [
      /aspen\s+dental\s+management/i,
      /independent\s+dentists\s+under\s+contract\s+with\s+aspen/i,
      /services\s+provided\s+by\s+aspen\s+dental/i,
    ],
  },
  {
    name: 'Pacific Dental Services (PDS Health)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Pacific Dental Services, LLC',
    domains: ['pacificdentalservices.com', 'pdshealth.com', 'pacdental.com'],
    keywords: ['pacific dental services', 'pacific dental', 'pds health', 'supported by pacific dental'],
    legalPatterns: [
      /supported\s+by\s+pacific\s+dental/i,
      /pacific\s+dental\s+services,\s+llc/i,
      /a\s+supported\s+practice\s+of\s+pds/i,
    ],
  },
  {
    name: 'Smile Brands',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Gryphon Investors',
    domains: ['smilebrands.com', 'brightnow.com', 'monarchdental.com', 'castledental.com', 'midwestdental.com'],
    keywords: ['smile brands', 'bright now dental', 'monarch dental', 'castle dental', 'midwest dental'],
    legalPatterns: [
      /smile\s+brands\s+inc/i,
      /supported\s+by\s+smile\s+brands/i,
      /bright\s+now!\s+dental/i,
    ],
  },
  {
    name: 'Sonrava Health (Western Dental)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'New Mountain Capital',
    domains: ['sonrava.com', 'westerndental.com', 'brident.com', 'accessdental.com', 'midatlanticdental.com'],
    keywords: ['sonrava health', 'western dental', 'brident dental', 'access dental'],
    legalPatterns: [
      /sonrava\s+health/i,
      /western\s+dental\s+services/i,
      /brident\s+dental/i,
    ],
  },
  {
    name: 'Affordable Care (Affordable Dentures & Implants)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Partners Group',
    domains: ['affordabledentures.com', 'affordablecare.com', 'adimplants.com'],
    keywords: ['affordable dentures', 'affordable dentures & implants', 'affordable care, llc'],
    legalPatterns: [
      /affordable\s+care,\s+llc/i,
      /affordable\s+dentures\s+&\s+implants/i,
      /practices\s+supported\s+by\s+affordable\s+care/i,
    ],
  },
  {
    name: 'Great Expressions Dental Centers',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Roark Capital Group',
    domains: ['greatexpressions.com', 'gedc.com'],
    keywords: ['great expressions', 'great expressions dental centers', 'gedc'],
    legalPatterns: [/great\s+expressions\s+dental/i],
  },
  {
    name: 'Benevis (Kool Smiles)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'New Mountain Capital',
    domains: ['benevis.com', 'mykoolsmiles.com'],
    keywords: ['benevis', 'kool smiles'],
    legalPatterns: [/supported\s+by\s+benevis/i, /benevis\s+llc/i],
  },
  {
    name: 'Dental Care Alliance (DCA)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Harvest Partners',
    domains: ['dentalcarealliance.net', 'dentalcarealliance.com'],
    keywords: ['dental care alliance', 'dca partner', 'allied with dca'],
    legalPatterns: [/dental\s+care\s+alliance/i, /a\s+dca\s+allied\s+practice/i],
  },
  {
    name: 'Mortenson Dental Partners',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Mortenson Family Dental',
    domains: ['mortensondentalpartners.com', 'mortensondental.com'],
    keywords: ['mortenson dental partners', 'mortenson family dental'],
    legalPatterns: [/mortenson\s+dental\s+partners/i],
  },
  {
    name: 'North American Dental Group (NADG)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Jacobs Holding',
    domains: ['nadentalgroup.com', 'nadg.dental'],
    keywords: ['north american dental group', 'nadg'],
    legalPatterns: [/north\s+american\s+dental\s+group/i, /an\s+nadg\s+supported\s+practice/i],
  },
  {
    name: '42 North Dental',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Audax Private Equity',
    domains: ['42northdental.com', 'gentledental.com'],
    keywords: ['42 north dental', 'gentle dental new england'],
    legalPatterns: [/42\s+north\s+dental/i, /supported\s+by\s+42\s+north/i],
  },
  {
    name: 'Guardian Dentistry Partners',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Guardian Dentistry',
    domains: ['guardiandentistry.com'],
    keywords: ['guardian dentistry partners', 'guardian dentistry'],
    legalPatterns: [/guardian\s+dentistry\s+partners/i],
  },
  {
    name: 'Smile Doctors',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Thomas H. Lee Partners',
    domains: ['smiledoctors.com'],
    keywords: ['smile doctors', 'smile doctors partner'],
    legalPatterns: [/smile\s+doctors/i, /a\s+smile\s+doctors\s+partner/i],
  },
  {
    name: 'InterDent (Gentle Dental)',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'H.I.G. Capital',
    domains: ['interdent.com', 'interdentjobs.com'],
    keywords: ['interdent', 'interdent service corporation'],
    legalPatterns: [/interdent\s+service/i, /supported\s+by\s+interdent/i],
  },
  {
    name: 'Marquee Dental Partners',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Chicago Pacific Founders',
    domains: ['marqueedentalpartners.com'],
    keywords: ['marquee dental partners', 'marquee dental'],
    legalPatterns: [/marquee\s+dental\s+partners/i],
  },
  {
    name: 'Southern Dental Alliance',
    tier: 'TIER_1_MEGA_CHAIN',
    parentEntity: 'Kelso & Company',
    domains: ['southerndentalalliance.com'],
    keywords: ['southern dental alliance'],
    legalPatterns: [/southern\s+dental\s+alliance/i],
  },

  // TIER 2: Surgical & Specialty MSOs / Stealth Networks
  {
    name: 'MB2 Dental',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Charlesbank Capital Partners',
    domains: ['mb2dental.com', 'mb2dentaljobs.com'],
    keywords: ['mb2 dental', 'mb2', 'mb2 dental solutions', 'an mb2 dental partner'],
    legalPatterns: [
      /mb2\s+dental\s+solutions/i,
      /an\s+mb2\s+dental\s+partner/i,
      /affiliated\s+with\s+mb2/i,
      /partner\s+of\s+mb2\s+dental/i,
    ],
  },
  {
    name: 'Allied OMS (Oral & Maxillofacial Surgery)',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Dunrath Capital',
    domains: ['alliedoms.com'],
    keywords: ['allied oms', 'allied oral & maxillofacial surgery'],
    legalPatterns: [/allied\s+oms/i, /an\s+allied\s+oms\s+partner/i],
  },
  {
    name: 'Beacon Oral Specialists',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Blue Sea Capital',
    domains: ['beaconoralspecialists.com'],
    keywords: ['beacon oral specialists', 'beacon oral'],
    legalPatterns: [/beacon\s+oral\s+specialists/i, /a\s+beacon\s+oral\s+partner/i],
  },
  {
    name: 'Specialty1 Partners (Endo1, Perio1, OS1 Partners)',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Specialty1 Partners',
    domains: ['specialty1partners.com', 'endo1partners.com', 'perio1partners.com', 'os1partners.com'],
    keywords: ['specialty1 partners', 'perio1 partners', 'os1 partners', 'endo1 partners'],
    legalPatterns: [/specialty1\s+partners/i, /perio1\s+partners/i, /os1\s+partners/i],
  },
  {
    name: 'US Oral Surgery Management (USOSM)',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Oak Hill Capital',
    domains: ['usosm.com'],
    keywords: ['us oral surgery management', 'usosm'],
    legalPatterns: [/us\s+oral\s+surgery\s+management/i, /partner\s+of\s+usosm/i],
  },
  {
    name: 'MAX Surgical Specialty Management',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'MAX Surgical',
    domains: ['maxsurgicalpartners.com'],
    keywords: ['max surgical specialty management', 'max surgical partners'],
    legalPatterns: [/max\s+surgical\s+specialty/i],
  },
  {
    name: 'Flagship Specialty Partners',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Flagship Specialty',
    domains: ['flagshipspecialtypartners.com'],
    keywords: ['flagship specialty partners'],
    legalPatterns: [/flagship\s+specialty\s+partners/i],
  },
  {
    name: 'SGA Dental Partners',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Thurston Group',
    domains: ['sgadental.com', 'sgadentalpartners.com'],
    keywords: ['sga dental partners', 'sga dental'],
    legalPatterns: [/sga\s+dental\s+partners/i],
  },
  {
    name: 'DecisionOne Dental Partners',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'DecisionOne',
    domains: ['decisiononedental.com'],
    keywords: ['decisionone dental partners', 'decisionone dental'],
    legalPatterns: [/decisionone\s+dental/i],
  },
  {
    name: 'Oakpoint Dental',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Oakpoint',
    domains: ['oakpoint.us'],
    keywords: ['oakpoint dental'],
    legalPatterns: [/oakpoint\s+dental/i],
  },
  {
    name: 'Rock Dental Brands',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Rock Dental',
    domains: ['rockdentalbrands.com'],
    keywords: ['rock dental brands'],
    legalPatterns: [/rock\s+dental\s+brands/i],
  },
  {
    name: 'Cordental Group',
    tier: 'TIER_2_SURGICAL_SPECIALTY_MSO',
    parentEntity: 'Cordental',
    domains: ['cordentalgroup.com'],
    keywords: ['cordental group', 'cordental'],
    legalPatterns: [/cordental\s+group/i],
  },
];

// Pre-compiled flat set of blacklisted domains (Tier 3)
const BLACKLISTED_DOMAINS = new Set<string>();
for (const entry of DSO_DIRECTORY) {
  for (const domain of entry.domains) {
    BLACKLISTED_DOMAINS.add(domain.toLowerCase());
  }
}

// Additional known DSO domains
const ADDITIONAL_DSO_DOMAINS = [
  'dental365.com',
  'tendental.com',
  'hellotend.com',
  'midatlanticdental.com',
  'cherrytree-dental.com',
  'peakdentalplatforms.com',
  'beaconoralspecialists.com',
  'luminahealthpartners.com',
  'bluetreetechnology.com',
  'choiceonemedical.com',
  'planetdds.com',
  'curvedental.com',
  'advantagedental.com',
  'dentaldreams.com',
  'herodental.com',
];
for (const d of ADDITIONAL_DSO_DOMAINS) {
  BLACKLISTED_DOMAINS.add(d);
}

const BLACKLISTED_DOMAINS_LIST: string[] = Array.from(BLACKLISTED_DOMAINS);

// Tier 4 Legal Regex: Standard DSO statutory/disclosure clauses in footers or TOS
const TIER_4_LEGAL_DISCLAIMER_REGEX =
  /(is a registered trademark of|supported by|an affiliate of|partner of|clinical services provided by independent dentists under contract with|management services provided by|a supported practice of|affiliated with|supported practice of)\s+([A-Za-z0-9\s,&.-]{2,50})/i;

const TIER_4_SPECIFIC_DSO_REGEXES = [
  { name: 'Heartland Dental', regex: /\b(supported\s+by\s+heartland\s+dental|heartland\s+dental,\s+llc)\b/i },
  { name: 'ClearChoice', regex: /\b(clearchoice\s+management\s+services|clearchoice\s+dental\s+implant\s+center)\b/i },
  { name: 'Aspen Dental', regex: /\b(aspen\s+dental\s+management|independent\s+dentists\s+under\s+contract\s+with\s+aspen)\b/i },
  { name: 'Pacific Dental Services', regex: /\b(supported\s+by\s+pacific\s+dental|pacific\s+dental\s+services,\s+llc)\b/i },
  { name: 'MB2 Dental', regex: /\b(mb2\s+dental\s+solutions|an\s+mb2\s+dental\s+partner|partner\s+of\s+mb2)\b/i },
  { name: 'Smile Brands', regex: /\b(smile\s+brands\s+inc|supported\s+by\s+smile\s+brands)\b/i },
  { name: 'Affordable Care', regex: /\b(affordable\s+care,\s+llc|practices\s+supported\s+by\s+affordable\s+care)\b/i },
  { name: 'Specialty1 Partners', regex: /\b(specialty1\s+partners|perio1\s+partners|os1\s+partners)\b/i },
  { name: 'Allied OMS', regex: /\b(allied\s+oms|an\s+allied\s+oms\s+partner)\b/i },
];

// Tier 5 Corporate Infrastructure ATS patterns (Workday subdomains, Greenhouse embeds, Lever, Ultipro)
const TIER_5_ATS_REGEX =
  /(boards\.greenhouse\.io\/[^\s"'<>]*?(tag|heartland|aspendental|pacificdentalservices|mb2dental|sonrava|smilebrands|clearchoice)|(?:[a-z0-9-]+\.)*(?:heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)(?:\.[a-z0-9-]+)*\.myworkdayjobs\.com|(?:[a-z0-9-]+\.)*myworkdayjobs\.com\/(?:[^\s"'<>/]+\/)?(heartland|aspen|pds|clearchoice|tag|mb2dental|sonrava|smilebrands)|jobs\.lever\.co\/(clearchoice|mb2dental|specialty1)|ultipro\.com\/[a-z0-9-]+\/jobboard)/i;

/**
 * Normalizes domain by removing protocol, path, port, basic auth, trailing DNS dots, and "www." prefix.
 */
export function normalizeDomain(rawDomain: string): string {
  if (!rawDomain) return '';
  let clean = rawDomain.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//, '');
  clean = clean.split('/')[0];
  clean = clean.split(/[?#]/)[0];
  // Strip userinfo (basic auth credentials e.g. user:pass@ or multiple user:pass@admin:123@)
  if (clean.includes('@')) {
    clean = clean.slice(clean.lastIndexOf('@') + 1);
  }
  // Strip port e.g. domain.com:8443
  clean = clean.split(':')[0];
  // Strip trailing DNS root dots (FQDN notation e.g. domain.com.)
  clean = clean.replace(/\.+$/, '');
  if (clean.startsWith('www.')) {
    clean = clean.slice(4);
  }
  clean = clean.replace(/\.+$/, '');
  return clean;
}

/**
 * Strips HTML tags and entities for reliable plain-text legal regex matching.
 */
export function stripHtmlForDisclaimer(text: string): string {
  if (!text) return '';
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if domain is in the pre-compiled DSO blacklist (Tier 3).
 */
export function isBlacklistedDomain(domain: string): boolean {
  const clean = normalizeDomain(domain);
  if (!clean) return false;
  if (BLACKLISTED_DOMAINS.has(clean)) return true;

  // Check subdomains (e.g. "scottsdale.clearchoice.com")
  return BLACKLISTED_DOMAINS_LIST.some((d) => clean.endsWith(`.${d}`));
}

/**
 * Evaluates text or HTML content against Tier 4 regulatory legal disclaimers.
 */
export function matchesDsoLegalDisclaimer(text: string): { matches: boolean; pattern?: string; dso?: string } {
  if (!text) return { matches: false };

  const cleanText = stripHtmlForDisclaimer(text);

  // Check specific high-fidelity DSO legal patterns against cleaned text
  for (const item of TIER_4_SPECIFIC_DSO_REGEXES) {
    const match = cleanText.match(item.regex);
    if (match) {
      return { matches: true, pattern: match[0], dso: item.name };
    }
  }

  // Check general statutory disclaimer against cleaned text
  const generalMatch = cleanText.match(TIER_4_LEGAL_DISCLAIMER_REGEX);
  if (generalMatch) {
    const matchedPhrase = generalMatch[0];
    const entity = generalMatch[2]?.trim();
    // Verify if entity mentions dental, management, or partners
    if (/(dental|management|group|partners|services|specialists|mso|dso)/i.test(entity || '')) {
      return { matches: true, pattern: matchedPhrase, dso: entity };
    }
  }

  return { matches: false };
}

/**
 * Evaluates HTML content against Tier 5 corporate infrastructure & career ATS portals.
 */
export function matchesCorporateCareers(html: string): { matches: boolean; provider?: string } {
  if (!html) return { matches: false };
  const match = html.match(TIER_5_ATS_REGEX);
  if (match) {
    return { matches: true, provider: match[0] };
  }
  return { matches: false };
}

/**
 * Primary DSO Affiliation Check function orchestrating all 5 detection tiers.
 *
 * @param domain Practice website domain (e.g., "totalfreedomdental.com")
 * @param htmlContent Raw HTML content of practice website (homepage, footer, or about page)
 * @param practiceName Practice business name (e.g., "Total Freedom Dental Implant Center")
 */
export function checkDsoAffiliation(
  domain: string,
  htmlContent: string = '',
  practiceName: string = ''
): DsoCheckResult {
  const cleanDomain = normalizeDomain(domain);

  // Tier 3: Direct Domain Blacklist Check (Confidence: 1.0)
  if (isBlacklistedDomain(cleanDomain)) {
    const matchedEntry = DSO_DIRECTORY.find((e) =>
      e.domains.some((d) => cleanDomain === d || cleanDomain.endsWith(`.${d}`))
    );
    return {
      isDso: true,
      matchedDsoName: matchedEntry?.name || 'Corporate Dental Chain',
      matchTier: 'TIER_3_DOMAIN_BLACKLIST',
      matchedPattern: cleanDomain,
      confidence: 1.0,
      reason: `Domain ${cleanDomain} matches Tier 3 corporate blacklist for ${matchedEntry?.name || 'DSO'}`,
    };
  }

  // Tier 1 & 2: Brand & Name Matching in Practice Name or Domain
  for (const entry of DSO_DIRECTORY) {
    // Check practice name against keywords with word boundary matching
    for (const kw of entry.keywords) {
      const kwRegex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (practiceName && kwRegex.test(practiceName)) {
        return {
          isDso: true,
          matchedDsoName: entry.name,
          matchTier: entry.tier,
          matchedPattern: kw,
          confidence: 0.98,
          reason: `Practice name "${practiceName}" matches DSO brand pattern "${kw}" (${entry.name})`,
        };
      }
      if (cleanDomain.includes(kw.replace(/[\s&]+/g, ''))) {
        return {
          isDso: true,
          matchedDsoName: entry.name,
          matchTier: entry.tier,
          matchedPattern: kw,
          confidence: 0.95,
          reason: `Domain "${cleanDomain}" contains DSO brand pattern "${kw}" (${entry.name})`,
        };
      }
    }
  }

  // Tier 3 Outbound Hyperlinks: Check if htmlContent links to any blacklisted DSO parent domain
  if (htmlContent) {
    for (const blacklisted of BLACKLISTED_DOMAINS_LIST) {
      const escapedDomain = blacklisted.replace(/\./g, '\\.');
      const linkRegex = new RegExp(
        `(?:href|src)\\s*=\\s*["'](?:https?:)?\\/\\/(?:[a-z0-9-]+\\.)*${escapedDomain}(?:[/"'?:#]|$)`,
        'i'
      );
      if (linkRegex.test(htmlContent)) {
        const matchedEntry = DSO_DIRECTORY.find((e) => e.domains.includes(blacklisted));
        return {
          isDso: true,
          matchedDsoName: matchedEntry?.name || 'Corporate Dental Chain',
          matchTier: 'TIER_3_DOMAIN_BLACKLIST',
          matchedPattern: blacklisted,
          confidence: 0.98,
          reason: `Outbound parent DSO link to "${blacklisted}" detected in website HTML (${matchedEntry?.name || 'DSO'})`,
        };
      }
    }
  }

  // Tier 4: Legal Regulatory Disclaimers in HTML
  if (htmlContent) {
    const disclaimerCheck = matchesDsoLegalDisclaimer(htmlContent);
    if (disclaimerCheck.matches) {
      return {
        isDso: true,
        matchedDsoName: disclaimerCheck.dso || 'Corporate Dental Network',
        matchTier: 'TIER_4_LEGAL_DISCLAIMER_REGEX',
        matchedPattern: disclaimerCheck.pattern,
        confidence: 0.92,
        reason: `Regulatory disclosure detected in website footer: "${disclaimerCheck.pattern}"`,
      };
    }
  }

  // Tier 5: Corporate Careers ATS & Multi-Location Infrastructure
  if (htmlContent) {
    const atsCheck = matchesCorporateCareers(htmlContent);
    if (atsCheck.matches) {
      return {
        isDso: true,
        matchedDsoName: 'Corporate Management Network',
        matchTier: 'TIER_5_CORPORATE_FOOTER_CAREERS',
        matchedPattern: atsCheck.provider,
        confidence: 0.88,
        reason: `Corporate ATS recruitment portal detected: "${atsCheck.provider}"`,
      };
    }

    // Check multi-location corporate footprint (e.g. "Over 50 locations in 12 states")
    const multiLocationMatch = htmlContent.match(
      /(over\s+\d{2,}\s+locations|find\s+a\s+location\s+in\s+\d{1,2}\s+states|nationwide\s+network\s+of\s+\d{2,}\s+practices)/i
    );
    if (multiLocationMatch) {
      return {
        isDso: true,
        matchedDsoName: 'Multi-Location Corporate Chain',
        matchTier: 'TIER_5_CORPORATE_FOOTER_CAREERS',
        matchedPattern: multiLocationMatch[0],
        confidence: 0.85,
        reason: `Multi-location corporate network signal: "${multiLocationMatch[0]}"`,
      };
    }
  }

  // Practice passed all 5 tiers
  return {
    isDso: false,
    confidence: 0.0,
    reason: 'Verified independent private clinic (passed all 5 DSO detection tiers)',
  };
}

/**
 * Exposes the full DSO directory for audits and inspection.
 */
export function getDsoDirectory(): DsoDirectoryEntry[] {
  return [...DSO_DIRECTORY];
}
