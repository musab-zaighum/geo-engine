'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onAuthenticated: () => void;
}

export function LoginModal({ isOpen, onAuthenticated }: LoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the access passcode.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (!res.ok || !data.authenticated) {
        throw new Error(data.error || 'Invalid passcode. Access denied.');
      }

      onAuthenticated();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-4 text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl p-0.5 mx-auto shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              CiteMed Platform Gate
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Enter your access passcode to protect AI Gateway API credits and unlock the workspace.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs font-mono inline-block">
            Default Passcode: <span className="font-bold text-white">citemed2026</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Access Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying Access...
              </>
            ) : (
              <>
                Unlock Workspace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 pt-2 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Session Protection Active</span>
        </div>
      </div>
    </div>
  );
}
