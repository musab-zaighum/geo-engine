-- Migration: Multi-Clinic Doctor Schema & Optional Location / Website
-- Date: 2026-09-08

-- 1. Clinics table: location and website are optional / nullable
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT, -- Optional: Physical address or locality
  website TEXT,  -- Optional: Website URL
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure location and website can be NULL if columns already existed
ALTER TABLE clinics ALTER COLUMN location DROP NOT NULL;
ALTER TABLE clinics ALTER COLUMN website DROP NOT NULL;

-- 2. Doctors table: website is optional / nullable
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  specialty TEXT NOT NULL,
  primary_service TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT, -- Optional: Doctor personal website URL
  notes TEXT,
  threat_score INTEGER DEFAULT 96,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure website is nullable if column already existed
ALTER TABLE doctors ALTER COLUMN website DROP NOT NULL;

-- 3. One-to-many / Many-to-many relationship: Doctors practicing across Multiple Clinics
CREATE TABLE IF NOT EXISTS doctor_clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  custom_phone TEXT,
  schedule_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, clinic_id)
);

CREATE INDEX IF NOT EXISTS idx_doctor_clinics_doctor ON doctor_clinics(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_clinics_clinic ON doctor_clinics(clinic_id);