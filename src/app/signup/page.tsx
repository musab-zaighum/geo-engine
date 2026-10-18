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
  Zap,
} from 'lucide-react';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState<'agency' | 'direct'>('agency');
  const [agencyName, setAgencyName] = useState('Apex Health Digital');
  const [email, setEmail] = useState('alex@apexhealth.io');
  const [password, setPassword] = useState('••••••••••••');
  const [subdomain, setSubdomain] = useState('apexhealth');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'direct') {
      setAccountType('direct');
    }
  }, [searchParams]);

  const handleFillDemo = () => {
    setAccountType('agency');
    setAgencyName('Apex Health Digital');
    setEmail('growth@apexhealth.io');
    setPassword('GrowthLicense2026!');
    setSubdomain('apexhealth');
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
        agencyName: agencyName || 'Apex Health Digital',
        agencySlug: `audit.${subdomain || 'apexhealth'}.com`,
        agencyLogoUrl: '/logo.png',
        primaryColor: 'indigo',
        customHexColor: '#6366f1',
        supportUrl: `https://audit.${subdomain || 'apexhealth'}.com`,
        badgeTitle: 'Official Agency Partner',
        contactEmail: email,
        customReportFooter:
          'This confidential GEO audit report is prepared exclusively for practice evaluation. All Schema.org @graph specifications and practitioner credentials are independently verified.',
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-indigo-400/30 flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-black tracking-tight text-white">
              NexusRank<span className="text-indigo-400">1</span>
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
              AUTONOMOUS B2B MICRO-SAAS
            </span>
          </div>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Provision Agency Partner Portal
        </h1>
        <p className="text-xs text-slate-400">
          Set up your debranded partner console, CNAME domain, and client practice roster.
        </p>
      </div>

      {/* Demo Preset Button */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Quick Demo Agency Auto-Fill</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all touch-target"
        >
          Load Preset
        </button>
      </div>

      {/* Signup Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Agency Name
            </label>
            <input
              type="text"
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="Apex Health Digital"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Work Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@apexhealth.io"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Custom Subdomain CNAME</label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-xs font-mono text-slate-400 shrink-0">
                audit.
              </span>
              <input
                type="text"
                required
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="youragency"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-r-xl text-xs text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Account Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 touch-target cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Provisioning Console...</span>
              </>
            ) : (
              <>
                <span>Launch Partner Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Zero-Trace Agency Privacy</span>
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
        <div className="flex items-center gap-3 text-indigo-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Agency Provisioning Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Suspense fallback={
        <div className="flex items-center gap-3 text-indigo-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading Form...</span>
        </div>
      }>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
