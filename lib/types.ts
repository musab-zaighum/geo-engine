export interface ClinicEntity {
  id: string;
  name: string;
  slug: string;
  location?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  openingHours?: string[];
}

export interface DoctorEntity {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  primaryService: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  notes?: string | null;
  clinics: ClinicEntity[];
}

export interface MultiClinicPassportRecord {
  doctorSlug: string;
  doctorName: string;
  specialty: string;
  primaryService: string;
  activeClinic: ClinicEntity;
  otherClinics: ClinicEntity[];
  threatScore: number;
  isVerified: boolean;
  qrUrl: string;
  schemaGraph: Record<string, any>;
  llmsTxt: string;
  robotsTxt: string;
  updatedAt: string;
}

export interface FieldValidationError {
  field: string;
  message: string;
}