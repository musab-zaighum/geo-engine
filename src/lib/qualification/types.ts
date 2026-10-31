/**
 * Qualification Engine Domain Types & Interface Contracts
 *
 * Implements strict type safety for the 7-Point Qualification & Disqualification DAG:
 * 1. Affluent Zip Code Validation
 * 2. Google Maps Rank Overflow (#4-#6)
 * 3. Paid Google Ads Sponsored Signal
 * 4. Clinical Specialization (Implants & All-on-4 vs Medicaid/Peds/Routine)
 * 5. DSO / Corporate Chain Blacklist & Heuristic Detection
 * 6. Solo Owner / Founder Licensure (CMS NPPES NPI-1)
 * 7. Proximity Competitor (#1 within 5.0 miles)
 */

export type TargetMetro =
  | 'Phoenix / Scottsdale, AZ'
  | 'Orange County / Newport Beach, CA'
  | 'Los Angeles Westside / Beverly Hills, CA'
  | 'Dallas–Fort Worth / North Plano, TX'
  | 'South Florida / Boca Raton & Naples, FL'
  | 'Seattle Eastside / Bellevue, WA'
  | 'Fairfield County / Greenwich, CT';

export interface AffluentZipInfo {
  zipCode: string;
  metro: TargetMetro;
  city: string;
  state: string;
  neighborhoods: string[];
  medianHhi: number; // Median Household Income (ACS/IRS)
  dominantCaseType: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type DsoMatchTier =
  | 'TIER_1_MEGA_CHAIN'
  | 'TIER_2_SURGICAL_SPECIALTY_MSO'
  | 'TIER_3_DOMAIN_BLACKLIST'
  | 'TIER_4_LEGAL_DISCLAIMER_REGEX'
  | 'TIER_5_CORPORATE_FOOTER_CAREERS';

export interface DsoCheckResult {
  isDso: boolean;
  matchedDsoName?: string;
  matchTier?: DsoMatchTier;
  matchedPattern?: string;
  confidence: number; // 0.0 to 1.0
  reason?: string;
}

export interface ClinicalSpecializationResult {
  qualified: boolean;
  implantScore: number; // 0 to 100 procedural density score
  implantKeywordMatches: string[];
  allOnXMatches: string[];
  surgicalMatches: string[];
  disqualified: boolean;
  disqualificationReason?: string;
  detectedCategories: {
    implants: boolean;
    allOnFour: boolean;
    fullArch: boolean;
    boneGrafting: boolean;
    medicaid: boolean;
    pediatrics: boolean;
    routineOnly: boolean;
    orthodonticsOnly: boolean;
  };
  medicaidTermsFound: string[];
  pediatricTermsFound: string[];
}

export interface DoctorVerification {
  verified: boolean;
  doctorName: string;
  npiNumber?: string;
  enumerationType?: 'NPI-1' | 'NPI-2';
  credentials?: string; // "DDS", "DMD", "MD", etc.
  isDentalDoctor: boolean;
  soleProprietor: boolean;
  primaryTaxonomy?: string;
  taxonomyCode?: string;
  isApprovedTaxonomy: boolean;
  licenseNumber?: string;
  licenseState?: string;
  address?: string;
  disqualificationReason?: string;
  rawRecord?: any;
}

export interface CandidatePractice {
  id?: string;
  name: string;
  domain: string;
  websiteUrl?: string;
  doctorName?: string;
  doctorTitle?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode: string;
  mapsRank?: number;
  reviewCount?: number;
  rating?: number;
  htmlContent?: string;
  hasSponsoredAd?: boolean;
  adKeywords?: string[];
  adCreativeCount?: number;
  latitude?: number;
  longitude?: number;
  competitor?: {
    name: string;
    address?: string;
    phone?: string;
    website?: string;
    rank: number;
    rating?: number;
    reviewCount?: number;
    latitude?: number;
    longitude?: number;
    distanceMiles?: number;
  };
}

export type QualificationGate =
  | 'AFFLUENT_ZIP'
  | 'MAPS_RANK'
  | 'PAID_ADS'
  | 'CLINICAL_SPECIALIZATION'
  | 'DSO_FILTER'
  | 'SOLO_DOCTOR'
  | 'PROXIMITY_COMPETITOR';

export interface GateEvaluationResult {
  gate: QualificationGate;
  passed: boolean;
  failureReason?: string;
  details?: Record<string, any>;
}

export interface QualificationPipelineResult {
  qualified: boolean;
  candidateName: string;
  candidateDomain: string;
  candidateZip: string;
  failedGate?: QualificationGate;
  disqualificationReason?: string;
  gateResults: Record<QualificationGate, GateEvaluationResult>;
  evaluationDurationMs: number;
  verifiedDoctor?: DoctorVerification;
  dsoEvaluation?: DsoCheckResult;
  clinicalEvaluation?: ClinicalSpecializationResult;
  affluentZipInfo?: AffluentZipInfo;
}

export interface CompetitorResult {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rank: number;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  withinLimit: boolean;
}

export interface GoogleAdsSignal {
  hasActiveAds: boolean;
  advertiserName?: string;
  advertiserId?: string;
  activeAdCount?: string;
  estimatedCpc?: string;
  verificationSource?: string;
  keywordsMatched?: string[];
}

export interface MapsRankResult {
  rank: number;
  isQualifiedRank: boolean; // true if rank in [4, 5, 6]
  rating?: number;
  reviewCount?: number;
  query?: string;
}

export interface SoloOwnerInfo {
  name: string;
  credentials: string;
  title: string;
  background?: string;
  npiNumber?: string;
  soleProprietorVerified: boolean;
}

export interface QualifiedLead {
  leadId: string;
  practiceName: string;
  domain: string;
  websiteUrl: string;
  soloOwner: SoloOwnerInfo;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    metro: TargetMetro;
    latitude?: number;
    longitude?: number;
  };
  phone: string;
  googleMaps: {
    rank: number;
    rating: number;
    reviewCount: number;
  };
  paidAdsSignal: GoogleAdsSignal;
  topCompetitor5mi: {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rank: number; // strictly 1
    rating: number;
    reviewCount: number;
    distanceMiles: number;
  };
  customPitchHook1500: string;
}
