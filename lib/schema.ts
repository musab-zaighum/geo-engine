import { z } from "zod";

export function sanitizeUrl(input: string): string {
  if (!input || typeof input !== "string") return "";
  let clean = input.trim().replace(/<[^>]*>?/gm, "").replace(/javascript:/gi, "").replace(/data:/gi, "");
  clean = clean.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  return clean.slice(0, 253);
}

export const auditInputSchema = z.object({
  url: z.string().transform(sanitizeUrl).pipe(z.string().min(3, "Please enter a valid clinic website URL or domain")),
  specialty: z.enum([
    "Ophthalmology",
    "Cardiology",
    "Bariatric/Surgical",
    "Orthopedics",
    "Multi-Specialty",
  ]).default("Multi-Specialty"),
});

export type AuditInput = z.infer<typeof auditInputSchema>;

export const branchLocationSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State or Territory is required"),
  phone: z.string().min(6, "Contact phone number is required"),
  hours: z.string().default("Mon-Fri 08:30 - 17:00"),
});

export const specialistSchema = z.object({
  fullName: z.string().min(2, "Specialist full name is required"),
  title: z.string().min(2, "Title & Degrees (e.g. FRANZCO, FRACS, MBBS) is required"),
  qualifications: z.string().min(2, "Qualifications / Licensing (e.g., Ahpra MED0001823)"),
  subSpecialties: z.array(z.string()).min(1, "At least one sub-specialty is required"),
  procedures: z.array(z.string()).min(1, "At least one procedure is required"),
  snomedCodes: z.array(z.string()).optional().default([]),
});

export const clinicGeneratorSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required"),
  domain: z.string().min(3, "Domain name is required"),
  mainPhone: z.string().min(6, "Main contact phone is required"),
  specialty: z.string().min(2, "Primary clinical field is required"),
  locations: z.array(branchLocationSchema).min(1, "At least one branch location is required"),
  specialists: z.array(specialistSchema).min(1, "At least one accredited specialist is required"),
});

export const clinicAffiliationSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  clinicSlug: z.string().optional(),
  location: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
});

export const doctorProfileSchema = z.object({
  name: z.string().min(2, "Doctor or business name is required"),
  specialty: z.string().min(2, "Medical specialty or category is required"),
  clinicName: z.string().min(2, "Primary clinic name is required"),
  primaryService: z.string().min(5, "Primary service or procedure description is required"),
  location: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email address format").nullable().optional().or(z.literal("")),
  notes: z.string().nullable().optional(),
  additionalClinics: z.array(clinicAffiliationSchema).optional().default([]),
});

export type BranchLocationInput = z.infer<typeof branchLocationSchema>;
export type SpecialistInput = z.infer<typeof specialistSchema>;
export type ClinicGeneratorInput = z.infer<typeof clinicGeneratorSchema>;
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