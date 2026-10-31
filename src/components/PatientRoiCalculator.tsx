'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight,
  Calculator,
  UserCheck,
  Stethoscope,
  Activity,
  Zap,
} from 'lucide-react';
import { PlanTier } from './MobileCheckoutDrawer';

interface PatientRoiCalculatorProps {
  onOpenCheckout?: (tier: PlanTier) => void;
}

interface SpecialtyPreset {
  id: string;
  name: string;
  icon: string;
  defaultTicket: number;
  sampleProcedures: string;
}

const SPECIALTIES: SpecialtyPreset[] = [
  {
    id: 'dental',
    name: 'Cosmetic & Restorative Dentistry',
    icon: '🦷',
    defaultTicket: 4500,
    sampleProcedures: 'Dental Implants ($4,500), Invisalign ($5,200), Porcelain Veneers ($9,000)',
  },
  {
    id: 'aesthetics',
    name: 'MedSpa & Facial Aesthetics',
    icon: '✨',
    defaultTicket: 2800,
    sampleProcedures: 'Full-Face Neuromodulators ($1,800), Laser Resurfacing ($3,200), Body Contouring ($4,500)',
  },
  {
    id: 'plastic',
    name: 'Plastic & Cosmetic Surgery',
    icon: '🩺',
    defaultTicket: 11500,
    sampleProcedures: 'Deep Plane Facelifts ($14,000), Rhinoplasty ($9,500), Mommy Makeovers ($16,000)',
  },
  {
    id: 'ortho',
    name: 'Orthopedics & Spine Medicine',
    icon: '🦴',
    defaultTicket: 8500,
    sampleProcedures: 'Total Joint Replacement ($18,000), Minimally Invasive Spine ($12,000), Sports Rehab ($3,500)',
  },
  {
    id: 'derma',
    name: 'Dermatology & Skin Surgery',
    icon: '🔬',
    defaultTicket: 3200,
    sampleProcedures: 'Mohs Micrographic Surgery ($3,500), Skin Remodeling ($2,400), Biologics ($4,000)',
  },
];

export function PatientRoiCalculator({ onOpenCheckout }: PatientRoiCalculatorProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('dental');
  const [avgTicket, setAvgTicket] = useState<number>(4500);
  const [newPatientsPerMonth, setNewPatientsPerMonth] = useState<number>(3);
  const [selectedTier, setSelectedTier] = useState<PlanTier>('growth');

  const handleSpecialtyChange = (specId: string) => {
    setSelectedSpecialty(specId);
    const spec = SPECIALTIES.find((s) => s.id === specId);
    if (spec) {
      setAvgTicket(spec.defaultTicket);
    }
  };

  // Pricing map for clinic tiers
  const tierCost = selectedTier === 'starter' ? 199 : selectedTier === 'growth' ? 349 : 699;

  // Financial Math
  const monthlyGrossRevenue = newPatientsPerMonth * avgTicket;
  const annualGrossRevenue = monthlyGrossRevenue * 12;
  const annualSoftwareInvestment = tierCost * 12;
  const netAnnualProfit = Math.max(0, annualGrossRevenue - annualSoftwareInvestment);
  const roiMultiplier = tierCost > 0 ? ((monthlyGrossRevenue - tierCost) / tierCost).toFixed(1) : '0';
  const roiPercentage = tierCost > 0 ? Math.round(((monthlyGrossRevenue - tierCost) / tierCost) * 100) : 0;

  // How many days of revenue to cover 1 full year of subscription
  const monthsOfSubscriptionCoveredByOnePatient = (avgTicket / tierCost).toFixed(1);

  return (
    <div id="patient-roi-calculator" className="space-y-10 sm:space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Patient Acquisition &amp; Practice Revenue Modeler</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Calculate Your Clinic&apos;s Return on{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
            AI Search Dominance
          </span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          When ChatGPT, Perplexity, and Google AI Overviews cite your practice for high-ticket procedures, even just 1 or 2 new monthly patients generates tens of thousands in practice revenue.
        </p>
      </div>

      {/* Specialty Preset Selector */}
      <div className="max-w-4xl mx-auto">
        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
          Step 1: Select Your Practice Medical Specialty
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => handleSpecialtyChange(spec.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{spec.icon}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold leading-tight">{spec.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">${spec.defaultTicket.toLocaleString()} avg</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Modeler Card */}
      <div className="max-w-5xl mx-auto rounded-3xl nr-glass-card p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-center">
          
          {/* Left Column: Sliders & Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Slider 1: Average Procedure Ticket */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Average Procedure / Case Value
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {SPECIALTIES.find((s) => s.id === selectedSpecialty)?.sampleProcedures}
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                  ${avgTicket.toLocaleString()}
                </span>
              </div>
              
              <input
                type="range"
                min="1000"
                max="15000"
                step="250"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>$1,000 (Routine)</span>
                <span>$7,500</span>
                <span>$15,000 (Surgical / Full Arch)</span>
              </div>
            </div>

            {/* Slider 2: New Monthly Patients from AI Citations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    New Monthly Patients from AI Search
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Patients citing ChatGPT, Perplexity, or Google AI Overviews recommendation
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
                  {newPatientsPerMonth} {newPatientsPerMonth === 1 ? 'patient' : 'patients'}/mo
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={newPatientsPerMonth}
                onChange={(e) => setNewPatientsPerMonth(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>1 patient/mo (Conservative)</span>
                <span>7 patients/mo</span>
                <span>15 patients/mo (Aggressive)</span>
              </div>
            </div>

            {/* Plan Tier Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Selected Clinic Subscription Tier
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { tier: 'starter' as PlanTier, label: 'Solo Practice', price: '$199/mo' },
                  { tier: 'growth' as PlanTier, label: 'Premier Clinic', price: '$349/mo', popular: true },
                  { tier: 'enterprise' as PlanTier, label: 'Surgical Group', price: '$699/mo' },
                ].map((item) => {
                  const isCur = selectedTier === item.tier;
                  return (
                    <button
                      key={item.tier}
                      type="button"
                      onClick={() => setSelectedTier(item.tier)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isCur
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] font-mono text-indigo-400">{item.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1 Patient Guarantee Highlight */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-300">
                <strong className="text-white">Just 1 New Patient</strong> pays for{' '}
                <strong className="text-emerald-400">{monthsOfSubscriptionCoveredByOnePatient} months</strong> of your NexusRank1 subscription. All additional procedure bookings are pure practice profit.
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Financial Impact Display (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Monthly Revenue Added
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  +${monthlyGrossRevenue.toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400">Annual Gross Practice Growth:</span>
                  <span className="text-white font-mono font-bold text-sm">+${annualGrossRevenue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400">Annual GEO Defense Investment:</span>
                  <span className="text-slate-400 font-mono">-${annualSoftwareInvestment.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Net Annual Practice Profit
                    </span>
                    <span className="text-[10px] text-slate-500">After software subscription</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ${netAnnualProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ROI Multiplier Dial / Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-violet-950/60 border border-indigo-500/30 text-center space-y-1">
                <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest font-bold">
                  Practice Return on Investment (ROI)
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300 font-mono">
                  {roiPercentage.toLocaleString()}% ROI
                </div>
                <div className="text-[11px] text-slate-400">
                  {roiMultiplier}x return on every dollar invested
                </div>
              </div>

            </div>

            {/* Direct CTA Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenCheckout?.(selectedTier)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Protect Practice for ${tierCost}/mo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-3">
                <span>✓ 14-Day Money-Back Guarantee</span>
                <span>•</span>
                <span>✓ Cancel Anytime</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
