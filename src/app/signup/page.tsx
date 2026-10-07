'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  RefreshCw,
  Globe,
  Mail,
  Key,
} from 'lucide-react';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState<'agency' | 'direct'>('agency');

  // Form State
  const [agencyName, setAgencyName] = useState('Horizon Health Growth');
  const [email, setEmail] = useState('contact@horizonhealth.io');
  const [password, setPassword] = useState('••••••••••••');
  const [subdomain, setSubdomain] = useState('horizonhealth');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'direct') {
      setAccountType('direct');
    }
  }, [searchParams]);

  const handleFillVipDemo = () => {
    setAccountType('agency');
    setAgencyName('Horizon Health Growth');
    setEmail('admin@horizonhealth.io');
    setPassword('VipEnterprise2026!');
    setSubdomain('horizonhealth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'demo' }),
      });

      const agencyConfig = {
        agencyName: agencyName || 'Horizon Health Growth',
        agencySlug: `${subdomain || 'horizonhealth'}.ainexus.io`,
        agencyLogoUrl: '/logo.png',
        primaryColor: 'blue',
        customHexColor: '#0284C7',
        supportUrl: `https://${subdomain || 'horizonhealth'}.ainexus.io/support`,
        badgeTitle: 'Official Agency Partner',
        contactEmail: email,
        customReportFooter: 'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified.',
      };
      localStorage.setItem('agencyConfig', JSON.stringify(agencyConfig));
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
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src="/logo.png"
              alt="AI NEXUS"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.svg';
              }}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-tight text-slate-900">
              AI <span className="text-[#0284C7]">NEXUS</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase -mt-0.5">
              INTELLIGENCE SIMPLIFIED
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Provision Agency Partner Portal
        </h1>
        <p className="text-xs text-slate-500">
          Set up your debranded partner console, CNAME domain, and practice sub-accounts.
        </p>
      </div>

      {/* Demo VIP Preset Button */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#0284C7] font-semibold">
          <Sparkles className="w-4 h-4 text-[#0284C7]" />
          <span>VIP Enterprise Demo Mode ($2,500/mo)</span>
        </div>
        <button
          type="button"
          onClick={handleFillVipDemo}
          className="px-3 py-1 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-[11px] font-bold transition-all"
        >
          Load Preset
        </button>
      </div>

      {/* Signup Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setAccountType('agency')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'agency'
                ? 'bg-white text-[#0284C7] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Agency Partner</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('direct')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'direct'
                ? 'bg-white text-[#0284C7] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Practice Direct</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {accountType === 'agency' ? 'Agency / Practice Group Name' : 'Clinic Practice Name'}
            </label>
            <input
              type="text"
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="Horizon Health Growth"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Work Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@horizonhealth.io"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
            />
          </div>

          {accountType === 'agency' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">White-Label Subdomain Prefix</label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="horizonhealth"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-l-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                />
                <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-xs font-mono text-slate-500 shrink-0">
                  .ainexus.io
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Account Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Provisioning Console...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
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
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Agency Provisioning Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans selection:bg-[#0284C7]/20 selection:text-[#0284C7]">
      <Suspense fallback={
        <div className="flex items-center gap-3 text-[#0284C7]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Form...</span>
        </div>
      }>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
