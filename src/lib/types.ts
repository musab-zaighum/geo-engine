export type PracticeType = 'clinic' | 'solo_practitioner';

export interface DoctorProfile {
  name: string;
  title: string; // e.g. "FRACS Plastic Surgeon" or "MD Orthopedic Specialist"
  registrationNumber: string; // Ahpra, NPI, or GMC registration ID
  specialties: string[];
}

export interface GenerateRequest {
  practiceType: PracticeType;
  entityName: string; // Clinic name OR Doctor full name
  hasWebsite: boolean;
  websiteOrProfileUrl: string; // Can be a website domain OR Google Maps / Healthshare link
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  services: string[]; // List of core procedures/treatments
  doctors: DoctorProfile[];
}

export interface GenerateResponse {
  schemaJsonLd: string;
  llmsTxt: string;
  rawMarkdownProfile: string; // Stand-alone markdown summary (crucial if they have no website)
}

export interface AuditResponse {
  url: string;
  query?: string;
  isDirectUrl?: boolean;
  isPlaywrightRendered?: boolean;
  discoveredTitle?: string;
  snippet?: string;
  hasLlmsTxt: boolean;
  llmsTxtStatus: number;
  hasMedicalSchema: boolean;
  detectedSchemas: string[];
  readinessScore: number;
  criticalIssues: string[];
  recommendations: string[];
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AuthStatus {
  authenticated: boolean;
  message?: string;
}

export interface WhiteLabelConfig {
  agencyName: string;
  agencySlug: string; // e.g. audit.apexhealthmarketing.com
  agencyLogoUrl: string;
  primaryColor: string; // e.g. 'teal' | 'blue' | 'indigo' | 'emerald'
  customHexColor: string; // e.g. '#0d9488'
  supportUrl: string; // e.g. cal.com/apex-health
  badgeTitle: 'Official Agency Partner' | 'Verified GEO Consultant' | 'Healthcare Growth Specialist';
  contactEmail: string;
  customReportFooter: string;
}

export interface CmsGuide {
  id: string;
  name: string;
  iconName: string;
  schemaInstructions: {
    method1Title: string;
    method1Steps: string[];
    method2Title?: string;
    method2Steps?: string[];
  };
  llmsTxtInstructions: {
    title: string;
    steps: string[];
  };
}
