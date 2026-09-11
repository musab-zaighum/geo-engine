import { z } from "zod";

export const clinicAffiliationSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  clinicSlug: z.string().optional(),
  location: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
});

export const doctorProfileSchema = z.object({
  // Required fields: Doctor Name / Business Name, Specialty, Clinic Name, Primary Service
  name: z.string().min(2, "Doctor or business name is required (min 2 characters)"),
  specialty: z.string().min(2, "Medical specialty or category is required (min 2 characters)"),
  clinicName: z.string().min(2, "Primary clinic name is required (min 2 characters)"),
  primaryService: z.string().min(5, "Primary service or procedure description is required (min 5 characters)"),

  // Optional / Nullable fields
  location: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email address format").nullable().optional().or(z.literal("")),
  notes: z.string().nullable().optional(),

  // One-to-many relationship: Multiple clinic practice locations
  additionalClinics: z.array(clinicAffiliationSchema).optional().default([]),
});

export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type ClinicAffiliation = z.infer<typeof clinicAffiliationSchema>;

export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== "string") {
    const randomHex = Math.random().toString(16).substring(2, 8);
    return `entity-${randomHex}`;
  }
  const clean = input
    .replace(/<[^>]*>?/gm, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!clean) {
    const randomHex = Math.random().toString(16).substring(2, 8);
    return `entity-${randomHex}`;
  }
  return clean;
}