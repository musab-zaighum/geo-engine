"use client";

import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Zap, CheckCircle2, Bot, Database, Activity, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function AgencyOS() {
  const [clients, setClients] = useState([50]);

  // Pricing Logic
  const wholesaleCost = 19;
  const retailPrice = 199;
  
  const totalCost = clients[0] * wholesaleCost;
  const totalRevenue = clients[0] * retailPrice;
  const netMargin = totalRevenue - totalCost;

  return (
    <div className="w-full relative z-10 pb-32">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
          <Zap className="w-3 h-3 text-blue-600" />
          <span>⚡ AetherGEO Agency Operating System</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Resell Autonomous AI Search Optimization Under Your Own Brand.
        </h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
          Deploy white-label hosted AI passports, run automated competitor threat audits, and retain clients with recurring 24/7 generative engine optimization.
        </p>

        <button onClick={() => toast.success("Redirecting to Agency Portal...")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition shadow-md shadow-blue-500/20 text-base flex items-center justify-center mx-auto">
          Launch Agency Portal <Zap className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Feature Architecture */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition"><Briefcase className="w-24 h-24 text-blue-600" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">1. 100% White-Label Client Dashboards</h3>
            <p className="text-slate-600 leading-relaxed relative z-10 text-sm sm:text-base">
              Serve clients on your custom domains with your logo. Automatically generate beautifully branded monthly PDF audit reports proving ROI.
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition"><Database className="w-24 h-24 text-emerald-600" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">2. Bulk Client Importer</h3>
            <p className="text-slate-600 leading-relaxed relative z-10 text-sm sm:text-base">
              Onboard your entire roster instantly. Upload a single CSV to generate 100+ hosted Schema and llms.txt profiles in under 60 seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition"><Bot className="w-24 h-24 text-rose-600" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">3. Multi-Tenant AI Bot Webhooks</h3>
            <p className="text-slate-600 leading-relaxed relative z-10 text-sm sm:text-base">
              Get instant slack or email alerts when an AI crawler (GPTBot, ClaudeBot, Perplexity) alters your clients' citation rankings.
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition"><Activity className="w-24 h-24 text-amber-600" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">4. Agency Billing & Margin Engine</h3>
            <p className="text-slate-600 leading-relaxed relative z-10 text-sm sm:text-base">
              Wholesaler seat tiers built specifically for agencies. Capture massive margins with built-in automated client billing.
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Agency Calculator */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 shadow-sm relative">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Agency Margin Calculator</h2>
            <p className="text-slate-600">Drag to estimate your monthly recurring revenue (MRR).</p>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <span className="text-slate-700 font-bold">Number of Retained Clients</span>
              <span className="text-3xl font-black text-blue-600">{clients[0]}</span>
            </div>
            
            <Slider.Root 
              className="relative flex items-center select-none touch-none w-full h-6" 
              value={clients} 
              max={200} 
              min={10}
              step={5} 
              onValueChange={setClients}
            >
              <Slider.Track className="bg-slate-200 relative grow rounded-full h-3">
                <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-7 h-7 bg-white shadow-md rounded-full border-4 border-blue-600 focus:outline-none cursor-grab active:cursor-grabbing transition" />
            </Slider.Root>
            
            <div className="flex justify-between mt-3 text-xs font-semibold text-slate-500">
              <span>10 Clients</span>
              <span>200 Clients</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">@ ${retailPrice}/client</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Wholesale Cost</p>
              <p className="text-2xl font-bold text-rose-600">${totalCost.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">@ ${wholesaleCost}/client</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center shadow-xs">
              <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">Net Agency Margin</p>
              <p className="text-3xl font-black text-emerald-600">${netMargin.toLocaleString()}</p>
              <p className="text-emerald-700 text-xs mt-1">/mo recurring</p>
            </div>
          </div>

          <button onClick={() => toast.success("Onboarding started!")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-base flex items-center justify-center shadow-md shadow-blue-500/20">
            Start Free Agency Trial
          </button>
        </div>
      </div>

    </div>
  );
}
