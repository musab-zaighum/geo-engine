/**
 * Milestone 2 Scrapers Domain Types & Interfaces
 *
 * Defines contracts for:
 * 1. Google Maps Local Pack Ranker (identifying organic ranks #4-#6 and #1 competitor)
 * 2. Google Ads Sponsored Signal Verifier (detecting active paid search campaigns)
 * 3. Proximity Competitor Finder (Haversine distance <= 5.0 miles, rank #1 displacement)
 */

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapsRankResult {
  rank: number;
  isQualifiedRank: boolean; // strictly true if rank is 4, 5, or 6
  name: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  phone?: string;
  website?: string;
  domain?: string;
  query?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  isAd?: boolean;
}

export interface GoogleAdsSignal {
  hasActiveAds: boolean;
  domain?: string;
  keyword?: string;
  advertiserName?: string;
  advertiserId?: string;
  activeAdCount?: string;
  estimatedCpc?: string;
  verificationSource?: string;
  keywordsMatched?: string[];
  adHeadlines?: string[];
  adSnippets?: string[];
  isSponsoredVerified?: boolean;
}

export interface CompetitorResult {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  domain?: string;
  rank: number; // strictly 1 for #1 local competitor
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  withinLimit: boolean; // strictly true if distanceMiles <= 5.0
  latitude?: number;
  longitude?: number;
}

export interface ScrapeOptions {
  useMock?: boolean;
  timeoutMs?: number;
  maxResults?: number;
  headless?: boolean;
  city?: string;
  state?: string;
}
