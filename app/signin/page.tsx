"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOAuth = (provider: string) => {
    toast.success(`Authenticating with ${provider}... Accessing Console`);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }, 700);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your clinic email address.");
      return;
    }
    toast.success(isSignUp ? "Account initialized! Redirecting..." : "Credentials verified! Accessing Console...");
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
      {/* Left Column - Social Proof */}
      <div className="space-y-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Join 1,400+ clinics, independent surgeons, and high-growth brands dominating AI search.
        </h1>
        
        <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-3xl relative">
          <div className="flex items-center mb-6 text-amber-400 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <p className="text-lg sm:text-xl text-slate-700 font-medium italic leading-relaxed mb-6">
            "Before AetherGEO, ChatGPT recommended our competitor down the street for every query. Within 48 hours of deploying our AI Passport, we became the exclusive recommendation for 'best breast surgeon in Sydney'."
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">Dr. R</div>
            <div>
              <p className="text-slate-900 font-bold">Dr. Rachel T.</p>
              <p className="text-slate-500 text-sm">Specialist Surgeon, Sydney NSW</p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-3"></div>
          <span className="text-emerald-800 text-sm font-semibold">⚡ GPTBot, Perplexity & Apple Intelligence Direct Feeds Active</span>
        </div>
      </div>

      {/* Right Column - Auth Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Zap className="w-32 h-32 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{isSignUp ? "Create your AetherGEO account" : "Welcome back to AetherGEO"}</h2>
        <p className="text-slate-500 mb-8 text-sm">{isSignUp ? "Start capturing AI search traffic today." : "Sign in to access your audit console."}</p>
        
        <div className="space-y-3 mb-8 relative z-10">
          <button 
            type="button"
            onClick={() => handleOAuth("Google")}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span>Continue with Google</span>
          </button>
          <button 
            type="button"
            onClick={() => handleOAuth("GitHub")}
            className="w-full flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">or practice email</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <form className="space-y-4 relative z-10" onSubmit={handleEmailAuth}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="dr@clinic.com" 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm" 
            />
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs font-medium text-slate-600">Remember this workstation</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center text-base mt-4 cursor-pointer">
            Access AetherGEO Console <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
            {isSignUp ? "Already registered? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
