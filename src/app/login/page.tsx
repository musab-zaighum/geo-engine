'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (passcodeToSubmit?: string) => {
    const code = passcodeToSubmit || passcode;
    if (!code.trim()) {
      setError('Please enter your clinic access passcode or license key.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code }),
      });

      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        throw new Error(data.error || 'Invalid passcode. Access denied.');
      }

      router.push('/partner-console');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div className="nr-glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mx-auto shadow-md flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Clinic Command Center Login
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Enter your practice license key to access your local growth and AI defense dashboard.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Clinic License Passcode / Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. nexus2026 or CLINIC-KEY)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/80 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] touch-target cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating Practice...</span>
              </>
            ) : (
              <>
                <span>Unlock Clinic Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Whop direct access CTA */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2">
          <p className="text-xs text-slate-300">
            Don&apos;t have your clinic license yet?
          </p>
          <a
            href={CLINIC_OFFER_CONFIG.whopCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{CLINIC_OFFER_CONFIG.ctaLabel}</span>
          </a>
        </div>

        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Healthcare Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
