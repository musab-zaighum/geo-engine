'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (passcodeToSubmit?: string) => {
    const code = passcodeToSubmit || passcode;
    if (!code.trim()) {
      setError('Please enter your agency access passcode.');
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mx-auto shadow-md flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              NexusRank1 Partner Login
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Enter your authorized agency passcode or license key to access your command center.
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
              Agency Access Passcode / Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. nexus2026 or NR1-GROWTH)"
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
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-950/80 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] touch-target cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating Agency...</span>
              </>
            ) : (
              <>
                <span>Unlock Partner Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Edge Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
