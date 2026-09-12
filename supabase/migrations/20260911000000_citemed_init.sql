-- CiteMed Database Schema Initialization Migration

-- 1. Clinics Table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    phone TEXT,
    locations JSONB DEFAULT '[]'::jsonb,
    specialty TEXT DEFAULT 'Multi-Specialty',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Specialists Table
CREATE TABLE IF NOT EXISTS public.specialists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    title TEXT NOT NULL,
    qualifications TEXT,
    sub_specialties TEXT[] DEFAULT '{}',
    procedures TEXT[] DEFAULT '{}',
    snomed_codes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Audits Table
CREATE TABLE IF NOT EXISTS public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_domain TEXT NOT NULL,
    specialty TEXT DEFAULT 'Multi-Specialty',
    score INT NOT NULL DEFAULT 0,
    raw_results JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Deployments Table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    generated_jsonld TEXT NOT NULL,
    generated_llmstxt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deployed', 'active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_clinics_domain ON public.clinics(domain);
CREATE INDEX IF NOT EXISTS idx_specialists_clinic ON public.specialists(clinic_id);
CREATE INDEX IF NOT EXISTS idx_audits_domain ON public.audits(clinic_domain);
CREATE INDEX IF NOT EXISTS idx_audits_created ON public.audits(created_at DESC);

-- RLS Policies (Read public, insert authenticated/service role or public audit)
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on clinics" ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Allow public read access on specialists" ON public.specialists FOR SELECT USING (true);
CREATE POLICY "Allow public select and insert on audits" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Allow public insert on audits" ON public.audits FOR INSERT WITH CHECK (true);
