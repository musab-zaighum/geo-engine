import { createClient } from "@supabase/supabase-js";
import { AuditAnalysisResult } from "./citemed-engine";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ClinicRecord {
  id: string;
  name: string;
  domain: string;
  phone?: string;
  locations: Array<{
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    hours: string;
  }>;
  specialty: string;
  created_at?: string;
}

export interface SpecialistRecord {
  id: string;
  clinic_id: string;
  full_name: string;
  title: string;
  qualifications: string;
  sub_specialties: string[];
  procedures: string[];
  snomed_codes: string[];
  created_at?: string;
}

export interface AuditRecord {
  id: string;
  clinic_domain: string;
  specialty: string;
  score: number;
  raw_results: AuditAnalysisResult;
  created_at?: string;
}

// In-memory fallback store for demo & offline capability
const memoryAudits = new Map<string, AuditRecord>();
const memoryClinics = new Map<string, ClinicRecord>();

export async function saveAuditRecord(audit: Omit<AuditRecord, "created_at">): Promise<AuditRecord> {
  const record: AuditRecord = {
    ...audit,
    created_at: new Date().toISOString(),
  };
  
  memoryAudits.set(record.id, record);

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from("audits").insert({
        id: record.id,
        clinic_domain: record.clinic_domain,
        specialty: record.specialty,
        score: record.score,
        raw_results: record.raw_results,
      });
    }
  } catch (err) {
    console.warn("Supabase insert fallback to memory store:", err);
  }

  return record;
}

export async function getAuditRecord(id: string): Promise<AuditRecord | null> {
  if (memoryAudits.has(id)) {
    return memoryAudits.get(id)!;
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase.from("audits").select("*").eq("id", id).single();
      if (data && !error) {
        return data as AuditRecord;
      }
    }
  } catch (err) {
    console.warn("Supabase fetch fallback:", err);
  }

  return null;
}
