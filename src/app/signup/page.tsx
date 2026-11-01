'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Zap,
  MapPin,
  Stethoscope,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

function SignupFormContent() {
  const router = useRouter();

  const [clinicName, setClinicName] = useState('Apex Dental & Aesthetics');
  const [email, setEmail] = useState('dr.smith@apexdental.com');
  const [phone, setPhone] = useState('(555) 234-5678');
  const [zipCode, setZipCode] = useState('75001');
  const [specialty, setSpecialty] = useState('Cosmetic Dentistry & Implants');
  const [role, setRole] = useState<'doctor' | 'manager'>('doctor');
  const [loading, setLoading] = useState(false);

  const handleFillDemo = () => {
    setClinicName('Apex Dental & Aesthetics');
    setEmail('dr.smith@apexdental.com');
    setPhone('(555) 234-5678');
    setZipCode('75001');
    setSpecialty('Cosmetic Dentistry & Implants');
    setRole('doctor');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'demo' }),
      });

      const practiceConfig = {
        practiceName: clinicName || 'Apex Dental & Aesthetics',
        practiceSlug: clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        practiceLogoUrl: '/logo.png',
        primaryColor: 'emerald',
        customHexColor: '#10b981',
        bookingUrl: `https://${clinicName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        badgeTitle: 'Verified Healthcare Provider',
        role: role === 'doctor' ? 'Solo Owner Doctor (DDS/DMD/MD)' : 'Practice Manager / Director',
        contactEmail: email,
        customReportFooter:
          'This clinical intelligence and GEO defense report is generated exclusively for practice optimization. All CMS NPPES records and clinical Doctor Authority Graphs are verified.',
      };
      localStorage.setItem('practiceConfig', JSON.stringify(practiceConfig));
      localStorage.setItem('authenticated', 'true');

      setTimeout(() => {
        router.push('/partner-console');
      }, 500);
    } catch {
      router.push('/partner-console');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 border border-emerald-400/30 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-tight text-white">
              NexusRank<span className="text-emerald-400">1</span>
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
              CLINIC LOCAL GROWTH &amp; AI DEFENSE
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Register Your Healthcare Practice
        </h1>
        <p className="text-xs text-slate-400">
          Set up your practice command center, geocoded zip code grid, and AI search monitoring.
        </p>
      </div>

      {/* Demo Preset Button */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Quick Demo Practice Auto-Fill</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all touch-target cursor-pointer"
        >
          Load Preset
        </button>
      </div>

      {/* Direct $1,500 Whop Access Banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>OFFICIAL FULL SYSTEM LICENSE</span>
        </div>
        <a
          href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
        </a>
      </div>

      {/* Signup Form Card */}
      <div className="nr-glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Your Practice Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  role === 'doctor'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Solo Owner Doctor (DDS/DMD)
              </button>
              <button
                type="button"
                onClick={() => setRole('manager')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                  role === 'manager'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Practice Manager
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Practice or Clinic Name
            </label>
            <input
              type="text"
              required
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="e.g. Dallas Center for Aesthetic Dentistry"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
              Primary Clinical Specialty
            </label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Orthopedic Surgery, Dental Implants, MedSpa"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Practice Zip Code
              </label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="75001"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Direct Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 234-5678"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Office Manager / Doctor Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@clinic.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/80 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 touch-target cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Initializing Practice Command Center...</span>
              </>
            ) : (
              <>
                <span>Launch Clinic Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation Link to Login */}
        <div className="text-center text-xs text-slate-400 pt-1">
          Already registered your practice?{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold">
            Log in to Command Center
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hosted Directly on NexusRank1.com — HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Clinic Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-emerald-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">Loading Form...</span>
          </div>
        }
      >
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
