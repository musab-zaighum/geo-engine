/**
 * Clinical Specialization & Procedural Density Scorer
 *
 * Implements Gate 4 of the 7-Point Qualification Engine:
 * Verifies high-ticket surgical dental implants, All-on-4, and full-arch restorative focus,
 * while strictly auto-disqualifying:
 * - Medicaid / Denti-Cal / State-funded dental assistance
 * - Pediatric and children's dentistry
 * - Routine general family dentistry with zero surgical implant focus
 * - Orthodontics-only practices
 */

import { ClinicalSpecializationResult } from './types';

// Surgical Dental Implant Keywords
export const IMPLANT_KEYWORDS = [
  'dental implants',
  'dental implant',
  'implant dentistry',
  'implantologist',
  'implantology',
  'teeth in a day',
  'teeth-in-a-day',
  'immediate load implants',
  'immediate placement',
  'computer guided implants',
  'computer-guided implants',
  '3d guided implant',
  'guided surgery',
  'titanium implants',
  'zirconia implants',
  'ceramic implants',
  'mini dental implants',
  'zygomatic implants',
  'pterygoid implants',
  'sinus lift',
  'bone graft',
  'bone grafting',
  'ridge augmentation',
  'socket preservation',
  'prf bone grafting',
];

// All-on-4 / All-on-X / Full-Arch Keywords
export const ALL_ON_X_KEYWORDS = [
  'all-on-4',
  'all on 4',
  'all-on-four',
  'all on four',
  'all-on-6',
  'all on 6',
  'all-on-x',
  'all on x',
  'full arch',
  'full-arch',
  'full mouth reconstruction',
  'full-mouth reconstruction',
  'full mouth rehabilitation',
  'full-mouth rehabilitation',
  'full mouth restoration',
  'implant supported dentures',
  'implant-supported dentures',
  'hybrid dentures',
  'hybrid bridge',
  'zirconia bridge',
  'fixed bridge on implants',
  'permanent teeth replacement',
  'same day teeth',
  'new teeth in one day',
];

// Advanced Surgical & Specialty Keywords
export const SURGICAL_SPECIALTY_KEYWORDS = [
  'cbct',
  '3d cone beam',
  'cone beam computed tomography',
  'iv sedation',
  'oral conscious sedation',
  'sedation implant surgery',
  'periodontics',
  'periodontist',
  'prosthodontics',
  'prosthodontist',
  'oral and maxillofacial surgery',
  'oral surgeon',
  'guided surgical template',
];

// Medicaid / State Welfare Dental Keywords (Strict Disqualification)
export const MEDICAID_KEYWORDS = [
  'medicaid',
  'denti-cal',
  'dentical',
  'badgercare',
  'ahcccs',
  'florida medicaid',
  'state assistance',
  'state-funded dental',
  'state funded dental',
  'title xix',
  'masshealth',
  'medi-cal',
  'medicaid accepted',
  'apple health',
  'healthy smiles ontario',
  'public health dental',
  'sliding fee scale',
  'income based sliding scale',
];

// Pediatric Dentistry Keywords (Strict Disqualification)
export const PEDIATRIC_KEYWORDS = [
  'pediatric dentistry',
  'pediatric dentist',
  'pediatric dental',
  'kids dentist',
  'childrens dentist',
  "children's dentist",
  'childrens dentistry',
  "children's dentistry",
  'infant oral care',
  'pediatric board certified',
  'baby teeth',
  'pediatric sedation',
  'pediatric pulp therapy',
];

// Routine General Family Care Keywords
export const ROUTINE_FAMILY_KEYWORDS = [
  'routine cleanings',
  'cleanings and checkups',
  'dental hygiene',
  'cavity fillings',
  'teeth whitening',
  'preventative care',
  'fluoride treatments',
  'dental sealants',
  'general family dentistry',
];

/**
 * Normalizes and strips HTML tags, script, and style blocks for clean text extraction.
 */
/**
 * Normalizes and strips HTML tags, script, and style blocks for clean text extraction.
 */
export function extractCleanText(htmlContent: string): string {
  if (!htmlContent) return '';
  return htmlContent
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Evaluates whether a Medicaid keyword mention is grammatically negated
 * (e.g., "does not accept Medicaid", "no Medicaid accepted", "100% cash fee-for-service").
 */
export function isNegatedMedicaidMention(text: string, matchIndex: number, matchLength: number): boolean {
  // Look back up to 80 characters before the match, stopping at sentence boundaries
  const start = Math.max(0, matchIndex - 80);
  const precedingText = text.slice(start, matchIndex);
  const sentenceBoundaryMatch = precedingText.match(/[.!?\n][^.!?\n]*$/);
  const clauseBefore = sentenceBoundaryMatch ? sentenceBoundaryMatch[0].slice(1) : precedingText;

  // Look ahead up to 50 characters after the match, stopping at sentence boundaries
  const end = Math.min(text.length, matchIndex + matchLength + 50);
  const followingText = text.slice(matchIndex + matchLength, end);
  const clauseAfter = followingText.split(/[.!?\n]/)[0];

  // Preceding negation patterns: "does not accept", "do not take", "no", "never", "cannot", "neither", "excludes", "non-medicaid"
  const precedingNegation =
    /\b(do(?:es)?\s+not|don'?t|doesn'?t|no|not|never|cannot|can'?t|we\s+do\s+not|without|excluding|excludes|exclude|except|unable\s+to|neither|non)\s*(?:accept|take|participate\s+in|bill|honor|facility)?\s*[^.!?\n]{0,60}$/i;

  // Following negation patterns: "is not accepted", "does not cover", "not taken"
  const followingNegation =
    /^\s*(?:(?:is|are|was|were|does|do)\s+)?(?:not|never|neither|no\s+longer|unaccepted)\s+(?:accepted|taken|participated|honored|covered|cover|pay|reimburse)/i;

  // Explicit unaccepted header: "Not accepted: Medicaid"
  const notAcceptedBefore = /\b(?:not\s+accepted|unaccepted)\s*[:\-]?\s*[^.!?\n]{0,30}$/i;

  // Cash-only / Fee-for-service context with negation
  const cashOnlyContext = /\b(cash\s+only|fee[- ]for[- ]service|out[- ]of[- ]network)\b/i;

  if (
    precedingNegation.test(clauseBefore) ||
    notAcceptedBefore.test(clauseBefore) ||
    followingNegation.test(clauseAfter) ||
    (cashOnlyContext.test(clauseBefore) && /\b(?:no|not|neither)\b/i.test(clauseBefore))
  ) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether a pediatric keyword mention is grammatically negated
 * (e.g., "we do not offer pediatric dentistry", "no pediatric dentistry", "adults only").
 */
export function isNegatedPediatricMention(text: string, matchIndex: number, matchLength: number): boolean {
  // Look back up to 80 characters before the match, stopping at sentence boundaries
  const start = Math.max(0, matchIndex - 80);
  const precedingText = text.slice(start, matchIndex);
  const sentenceBoundaryMatch = precedingText.match(/[.!?\n][^.!?\n]*$/);
  const clauseBefore = sentenceBoundaryMatch ? sentenceBoundaryMatch[0].slice(1) : precedingText;

  // Look ahead up to 60 characters after the match, stopping at sentence boundaries
  const end = Math.min(text.length, matchIndex + matchLength + 60);
  const followingText = text.slice(matchIndex + matchLength, end);
  const clauseAfter = followingText.split(/[.!?\n]/)[0];

  // Preceding negation patterns: "we do not offer", "no", "never", "without", "excluding", "excludes"
  const precedingNegation =
    /\b(do(?:es)?\s+not|don'?t|doesn'?t|no|not|never|cannot|can'?t|we\s+do\s+not|without|excluding|excludes|exclude|except|unable\s+to|neither|non)\s*(?:offer|provide|treat|see|specialize\s+in|accept|practice)?\s*[^.!?\n]{0,60}$/i;

  // Following negation / restriction: "is not offered", "not treated", "adults only", "adult patients only"
  const followingNegation =
    /^\s*(?:(?:is|are|was|were)\s+)?(?:not|never|neither|no\s+longer)\s+(?:offered|provided|treated|seen|accepted|practiced)/i;

  // Adult-only or dedicated adult context in sentence
  const fullSentence = `${clauseBefore} ${text.slice(matchIndex, matchIndex + matchLength)} ${clauseAfter}`;
  const adultOnlyContext = /\b(adults?\s+only|adult\s+patients?\s+only|strictly\s+adult|dedicated\s+to\s+adult)\b/i;

  if (
    precedingNegation.test(clauseBefore) ||
    followingNegation.test(clauseAfter) ||
    (adultOnlyContext.test(fullSentence) && /\b(no|not|neither|never|without)\b/i.test(clauseBefore))
  ) {
    return true;
  }

  return false;
}

/**
 * Scans text for Medicaid / state assistance keywords, ignoring negated mentions.
 */
export function detectMedicaidSignals(text: string): { detected: boolean; terms: string[] } {
  const lower = text.toLowerCase();
  const terms: string[] = [];

  for (const kw of MEDICAID_KEYWORDS) {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(lower)) !== null) {
      if (!isNegatedMedicaidMention(lower, match.index, kw.length)) {
        if (!terms.includes(kw)) {
          terms.push(kw);
        }
        break;
      }
    }
  }

  return {
    detected: terms.length > 0,
    terms,
  };
}

/**
 * Scans text for Pediatric dentistry keywords, with negation and clinical context analysis.
 */
export function detectPediatricSignals(text: string): { detected: boolean; terms: string[] } {
  const lower = text.toLowerCase();
  const terms: string[] = [];

  const adultImplantContext = /\b(congenitally|retained|failing|missing\s+permanent|permanent\s+teeth|adults?|full[- ]arch|implants?|restoration)\b/i;
  const hasAdultImplantMention = adultImplantContext.test(lower);
  const hasActivePediatricPractice = /\b(pediatric\s+dentist|pediatric\s+dentistry|kids\s+dentist|children'?s\s+dentist|children'?s\s+dentistry|infant\s+oral)\b/i.test(lower);

  for (const kw of PEDIATRIC_KEYWORDS) {
    // If "baby teeth", disregard when discussing adult congenital missing teeth / implants
    if (kw === 'baby teeth') {
      if (hasAdultImplantMention && !hasActivePediatricPractice) {
        continue;
      }
    }

    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(lower)) !== null) {
      if (!isNegatedPediatricMention(lower, match.index, kw.length)) {
        if (!terms.includes(kw)) {
          terms.push(kw);
        }
        break;
      }
    }
  }

  return {
    detected: terms.length > 0,
    terms,
  };
}

/**
 * Deduplicates keywords to prevent substring double-counting (e.g. "dental implants" vs "dental implant").
 */
export function deduplicateSubstrings(keywords: string[]): string[] {
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const result: string[] = [];

  for (const kw of sorted) {
    const kwNorm = kw.replace(/[-]/g, ' ');
    const isSubstringOfExisting = result.some((existing) => {
      const existingNorm = existing.replace(/[-]/g, ' ');
      return existing.includes(kw) || existingNorm.includes(kwNorm);
    });

    if (!isSubstringOfExisting) {
      result.push(kw);
    }
  }

  return result;
}

/**
 * Helper to match keywords with word boundaries and deduplicate substrings.
 */
function matchKeywordsWithBoundaries(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  const matched = keywords.filter((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return regex.test(lower);
  });
  return deduplicateSubstrings(matched);
}

/**
 * Evaluates whether practice is routine family dentistry only with zero implant focus.
 */
export function detectRoutineOnlySignals(text: string): {
  isRoutineOnly: boolean;
  routineCount: number;
  implantCount: number;
} {
  const matchedRoutine = matchKeywordsWithBoundaries(text, ROUTINE_FAMILY_KEYWORDS);
  const matchedImplants = matchKeywordsWithBoundaries(text, IMPLANT_KEYWORDS);
  const matchedAllOnX = matchKeywordsWithBoundaries(text, ALL_ON_X_KEYWORDS);

  const routineCount = matchedRoutine.length;
  const implantCount = matchedImplants.length + matchedAllOnX.length;

  // Routine-only if it mentions routine terms but ZERO surgical implant or full-arch terms
  const isRoutineOnly = routineCount > 0 && implantCount === 0;

  return {
    isRoutineOnly,
    routineCount,
    implantCount,
  };
}

/**
 * Calculates surgical implant procedural density score with substring deduplication.
 */
export function calculateImplantDensity(text: string): {
  score: number;
  implantMatches: string[];
  allOnXMatches: string[];
  surgicalMatches: string[];
} {
  const rawImplantMatches = matchKeywordsWithBoundaries(text, IMPLANT_KEYWORDS);
  const rawAllOnXMatches = matchKeywordsWithBoundaries(text, ALL_ON_X_KEYWORDS);
  const rawSurgicalMatches = matchKeywordsWithBoundaries(text, SURGICAL_SPECIALTY_KEYWORDS);

  const implantMatches = deduplicateSubstrings(rawImplantMatches);
  const allOnXMatches = deduplicateSubstrings(rawAllOnXMatches);
  const surgicalMatches = deduplicateSubstrings(rawSurgicalMatches);

  // Compute a weighted score 0 - 100
  // All-on-4 / Full-Arch: 15 points each (max 45)
  // Implants: 8 points each (max 40)
  // Surgical: 5 points each (max 15)
  const allOnXScore = Math.min(allOnXMatches.length * 15, 45);
  const implantScore = Math.min(implantMatches.length * 8, 40);
  const surgicalScore = Math.min(surgicalMatches.length * 5, 15);

  const rawScore = allOnXScore + implantScore + surgicalScore;
  const score = Math.min(rawScore, 100);

  return {
    score,
    implantMatches,
    allOnXMatches,
    surgicalMatches,
  };
}

/**
 * Primary Clinical Specialization Scoring function orchestrating Gate 4.
 *
 * @param htmlContent Raw HTML or text of candidate practice website
 */
export function scoreClinicalSpecialization(htmlContent: string): ClinicalSpecializationResult {
  const text = extractCleanText(htmlContent);

  // 1. Strict Negative Check: Medicaid / State Assistance
  const medicaidCheck = detectMedicaidSignals(text);
  if (medicaidCheck.detected) {
    return {
      qualified: false,
      implantScore: 0,
      implantKeywordMatches: [],
      allOnXMatches: [],
      surgicalMatches: [],
      disqualified: true,
      disqualificationReason: `Medicaid / state welfare acceptance detected: [${medicaidCheck.terms.join(', ')}]`,
      detectedCategories: {
        implants: false,
        allOnFour: false,
        fullArch: false,
        boneGrafting: false,
        medicaid: true,
        pediatrics: false,
        routineOnly: false,
        orthodonticsOnly: false,
      },
      medicaidTermsFound: medicaidCheck.terms,
      pediatricTermsFound: [],
    };
  }

  // 2. Strict Negative Check: Pediatric Dentistry
  const pediatricCheck = detectPediatricSignals(text);
  if (pediatricCheck.detected) {
    return {
      qualified: false,
      implantScore: 0,
      implantKeywordMatches: [],
      allOnXMatches: [],
      surgicalMatches: [],
      disqualified: true,
      disqualificationReason: `Pediatric / children's dentistry specialization detected: [${pediatricCheck.terms.join(', ')}]`,
      detectedCategories: {
        implants: false,
        allOnFour: false,
        fullArch: false,
        boneGrafting: false,
        medicaid: false,
        pediatrics: true,
        routineOnly: false,
        orthodonticsOnly: false,
      },
      medicaidTermsFound: [],
      pediatricTermsFound: pediatricCheck.terms,
    };
  }

  // 3. Positive Procedural Density & Matching
  const density = calculateImplantDensity(text);
  const routineCheck = detectRoutineOnlySignals(text);

  const hasAllOnX = density.allOnXMatches.length > 0;
  const hasImplants = density.implantMatches.length > 0;
  const hasBoneGrafting = density.implantMatches.some((kw) => kw.includes('bone graft') || kw.includes('sinus'));

  // 4. Routine Only Check
  if (routineCheck.isRoutineOnly) {
    return {
      qualified: false,
      implantScore: density.score,
      implantKeywordMatches: density.implantMatches,
      allOnXMatches: density.allOnXMatches,
      surgicalMatches: density.surgicalMatches,
      disqualified: true,
      disqualificationReason: 'Routine family dentistry only (no surgical implant or full-arch restorative procedures)',
      detectedCategories: {
        implants: false,
        allOnFour: false,
        fullArch: false,
        boneGrafting: false,
        medicaid: false,
        pediatrics: false,
        routineOnly: true,
        orthodonticsOnly: false,
      },
      medicaidTermsFound: [],
      pediatricTermsFound: [],
    };
  }

  // 5. Check Minimum Specialization Threshold:
  // Must have score >= 15 AND at least one direct implant or All-on-4 term
  const passesThreshold = density.score >= 15 && (hasImplants || hasAllOnX);

  if (!passesThreshold) {
    return {
      qualified: false,
      implantScore: density.score,
      implantKeywordMatches: density.implantMatches,
      allOnXMatches: density.allOnXMatches,
      surgicalMatches: density.surgicalMatches,
      disqualified: true,
      disqualificationReason: `Insufficient surgical implant density (score: ${density.score}/100, requires >= 15 with dedicated implant/full-arch procedures)`,
      detectedCategories: {
        implants: hasImplants,
        allOnFour: density.allOnXMatches.some((kw) => kw.includes('all-on-4') || kw.includes('all on 4')),
        fullArch: density.allOnXMatches.some((kw) => kw.includes('full arch') || kw.includes('full-arch')),
        boneGrafting: hasBoneGrafting,
        medicaid: false,
        pediatrics: false,
        routineOnly: false,
        orthodonticsOnly: false,
      },
      medicaidTermsFound: [],
      pediatricTermsFound: [],
    };
  }

  return {
    qualified: true,
    implantScore: density.score,
    implantKeywordMatches: density.implantMatches,
    allOnXMatches: density.allOnXMatches,
    surgicalMatches: density.surgicalMatches,
    disqualified: false,
    detectedCategories: {
      implants: hasImplants,
      allOnFour: density.allOnXMatches.some((kw) => kw.includes('all-on-4') || kw.includes('all on 4')),
      fullArch: density.allOnXMatches.some((kw) => kw.includes('full arch') || kw.includes('full-arch')),
      boneGrafting: hasBoneGrafting,
      medicaid: false,
      pediatrics: false,
      routineOnly: false,
      orthodonticsOnly: false,
    },
    medicaidTermsFound: [],
    pediatricTermsFound: [],
  };
}
