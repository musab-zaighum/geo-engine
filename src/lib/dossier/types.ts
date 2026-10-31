/**
 * Lead Dossier & Pitch Generator Domain Types
 *
 * Implements authoritative types for Milestone 3:
 * - Lead Dossier schema (JSON Schema Draft 2020-12)
 * - Canonical 20-column RFC 4180 CSV representations
 * - Pitch Generator input & component models
 */

import { QualifiedLead, CandidatePractice } from '../qualification/types';

export interface DossierSoloOwner {
  name: string;
  credentials: string;
  title: string;
  background: string;
}

export interface DossierLocation {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  metro_affluence: string;
}

export interface DossierGoogleMaps {
  query: string;
  rank: number;
  rating: number;
  review_count: number;
}

export interface DossierPaidAdsSignal {
  status: string;
  advertiser_name: string;
  advertiser_id: string;
  active_ad_count: string;
  estimated_cpc: string;
  verification_source: string;
}

export interface DossierTopCompetitor {
  practice_name: string;
  address: string;
  phone: string;
  website: string;
  rank: number;
  rating: number;
  review_count: number;
}

/**
 * Authoritative JSON schema record structure for leads/goated_leads.json
 */
export interface LeadDossier {
  lead_id: string;
  practice_name: string;
  website_url: string;
  solo_owner: DossierSoloOwner;
  location: DossierLocation;
  phone_number: string;
  google_maps: DossierGoogleMaps;
  paid_ads_signal: DossierPaidAdsSignal;
  top_competitor_5mi: DossierTopCompetitor;
  custom_pitch_hook_1500: string;
  npi_number?: string;
  npi_verified?: boolean;
  clinical_specialization?: string;
}

/**
 * Flexible input type accepted by pitch generator and exporters
 */
export type LeadInput = LeadDossier | QualifiedLead | (Partial<LeadDossier> & {
  leadId?: string;
  practiceName?: string;
  websiteUrl?: string;
  soloOwner?: any;
  location?: any;
  phoneNumber?: string;
  googleMaps?: any;
  paidAdsSignal?: any;
  topCompetitor5mi?: any;
  customPitchHook1500?: string;
});

export interface PitchHookContext {
  doctorName: string;
  doctorCredentials?: string;
  practiceName: string;
  streetName?: string;
  city: string;
  state: string;
  zipCode: string;
  mapsRank: number;
  reviewCount: number;
  rating?: number;
  activeAdCount: string;
  estimatedCpc: string;
  competitorName: string;
  competitorRank: number;
  competitorAddress?: string;
  competitorReviews?: number;
  competitorDistanceMiles?: number;
  procedureFocus?: string;
}

export const CANONICAL_CSV_HEADERS: readonly string[] = [
  'Lead ID',
  'Practice Name',
  'Domain',
  'Doctor Name',
  'Credentials',
  'Title',
  'Phone',
  'Address',
  'City',
  'State',
  'Zip Code',
  'Google Maps Rank',
  'Reviews',
  'Rating',
  'Ads Status',
  'Google Ads CPC',
  '#1 Competitor Name',
  '#1 Competitor Maps Rank',
  '#1 Competitor Phone',
  'Pitch Hook',
] as const;

export type CanonicalCsvHeader = (typeof CANONICAL_CSV_HEADERS)[number];
