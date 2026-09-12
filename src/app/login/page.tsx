'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (passcodeToSubmit?: string) => {
    const code = passcodeToSubmit || passcode;
    if (!code.trim()) {
      setError('Please enter the access passcode.');
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

      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4 text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-600 to-sky-600 rounded-2xl p-0.5 mx-auto shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-teal-600" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              CiteMed Platform Access
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Enter your passcode or click 1-Click Demo Access to unlock the workspace.
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleLogin('citemed2026')}
              disabled={loading}
              className="w-full py-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              1-Click Demo / Test Access (Free)
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 my-4">
          <hr className="flex-1 border-slate-200" />
          <span className="text-[11px] text-slate-400 font-bold uppercase">or enter passcode</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="relative z-10 space-y-4"
        >
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Access Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Default: citemed2026"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Unlock Workspace <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session Protection Active</span>
        </div>
      </div>
    </div>
  );
}
