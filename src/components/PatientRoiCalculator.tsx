'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Zap,
} from 'lucide-react';
import { CLINIC_OFFER_CONFIG } from '@/lib/config';

interface SpecialtyPreset {
  id: string;
  name: string;
  icon: string;
  defaultTicket: number;
  sampleProcedures: string;
  sliderMilestones: [string, string, string];
}

const SPECIALTIES: SpecialtyPreset[] = [
  {
    id: 'all-on-4',
    name: 'All-on-4 Implants',
    icon: '🦷',
    defaultTicket: 25000,
    sampleProcedures: 'Full Arch Fixed Hybrid ($25,000), Zygomatic Implants ($35,000), Dual-Arch All-on-4 ($50,000)',
    sliderMilestones: ['$10,000 (Single Implant)', '$25,000 (Full-Arch Case)', '$50,000 (Dual-Arch Reconstruction)'],
  },
  {
    id: 'plastic',
    name: 'Facial Plastic Surgery',
    icon: '🩺',
    defaultTicket: 18000,
    sampleProcedures: 'Deep Plane Facelift ($18,000), Rhinoplasty ($12,000), Neck Lift ($15,000)',
    sliderMilestones: ['$5,000 (Minor Revision)', '$18,000 (Deep Plane Facelift)', '$50,000 (Full Facial Rejuvenation)'],
  },
  {
    id: 'ortho',
    name: 'Orthopedics',
    icon: '🦴',
    defaultTicket: 16000,
    sampleProcedures: 'Total Joint Replacement ($18,000), Minimally Invasive Spine ($16,000), Complex Reconstruction ($28,000)',
    sliderMilestones: ['$5,000 (Arthroscopy)', '$16,000 (Spine Surgery)', '$50,000 (Total Joint Reconstruction)'],
  },
  {
    id: 'medspa',
    name: 'MedSpa',
    icon: '✨',
    defaultTicket: 4500,
    sampleProcedures: 'Full-Face Liquid Lift ($3,500), Body Contouring Package ($6,500), Annual Injectable Protocol ($8,500)',
    sliderMilestones: ['$1,000 (Injectables)', '$4,500 (Liquid Lift)', '$15,000 (Annual Wellness Package)'],
  },
];

export function PatientRoiCalculator() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all-on-4');
  const [avgTicket, setAvgTicket] = useState(25000);
  const [newPatientsPerMonth, setNewPatientsPerMonth] = useState(3);

  const handleSpecialtyChange = (specId: string) => {
    setSelectedSpecialty(specId);
    const spec = SPECIALTIES.find((s) => s.id === specId);
    if (spec) {
      setAvgTicket(spec.defaultTicket);
    }
  };

  const systemCost = CLINIC_OFFER_CONFIG.price; // $1,500

  // Financial Math
  const monthlyGrossRevenue = newPatientsPerMonth * avgTicket;
  const annualGrossRevenue = monthlyGrossRevenue * 12;
  const netAnnualProfit = Math.max(0, annualGrossRevenue - systemCost);
  const roiMultiplier = ((annualGrossRevenue - systemCost) / systemCost).toFixed(1);
  const roiPercentage = Math.round(((annualGrossRevenue - systemCost) / systemCost) * 100);

  // How many times 1 single patient covers the entire $1,500 system
  const timesCoveredByOnePatient = (avgTicket / systemCost).toFixed(1);

  const handleScrollToIntake = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('audit-intake');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const firstInput = el.querySelector('input') as HTMLInputElement | null;
      firstInput?.focus();
    }
  };

  return (
    <div id="patient-roi-calculator" className="space-y-10 sm:space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xl">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>High-Ticket Procedure Economics • Full-Arch Case Modeling</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Calculate Your Clinic&apos;s Return on{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
            Local Growth Dominance
          </span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          With elective full-arch case values producing <strong className="text-emerald-400">$20,000 to $50,000 per case</strong>, securing just a single patient consultation covers the system deployment multiple times over.
        </p>
      </div>

      {/* Specialty Preset Selector */}
      <div className="max-w-4xl mx-auto">
        <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
          Step 1: Select Your Practice Medical Specialty
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => handleSpecialtyChange(spec.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{spec.icon}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
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
                max="50000"
                step="500"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{SPECIALTIES.find((s) => s.id === selectedSpecialty)?.sliderMilestones[0] || '$1,000 (Routine)'}</span>
                <span>{SPECIALTIES.find((s) => s.id === selectedSpecialty)?.sliderMilestones[1] || '$25,000 (Full Arch)'}</span>
                <span>{SPECIALTIES.find((s) => s.id === selectedSpecialty)?.sliderMilestones[2] || '$50,000 (Dual-Arch Reconstruction)'}</span>
              </div>
            </div>

            {/* Slider 2: New Monthly Patients from AI Citations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Expected New AI Search Patients / Month
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Patients scheduling consultations via ChatGPT, Perplexity, or Google AI Overviews
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
                  +{newPatientsPerMonth} / mo
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
                <span>+1 Patient</span>
                <span>+5 Patients</span>
                <span>+15 Patients / mo</span>
              </div>
            </div>

            {/* The 1-Patient Consultation Callout */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>The 1-Consultation ROI Reality:</span>
                  <span className="text-[11px] font-mono font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {timesCoveredByOnePatient}x System Cost in 1 Patient
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Securing just a single patient consultation covers the system deployment multiple times over. A single full-arch or surgical case valued at <strong className="text-white">${avgTicket.toLocaleString()}</strong> completely pays for the <strong className="text-emerald-400">${systemCost.toLocaleString()}</strong> deployment <strong className="text-white">{timesCoveredByOnePatient} times over</strong>.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Financial Output Display (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-5">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Practice Revenue Projections
                </span>
                <div className="text-xs text-slate-400">
                  Estimated financial return from local AI search citations:
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Monthly Revenue Lift</span>
                  <span className="text-white font-mono font-bold">+${monthlyGrossRevenue.toLocaleString()} / mo</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Annual Gross Production</span>
                  <span className="text-white font-mono font-bold">+${annualGrossRevenue.toLocaleString()} / yr</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">One-Time System Investment</span>
                  <span className="text-slate-400 font-mono">-${systemCost.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Net Practice Profit
                    </span>
                    <span className="text-[10px] text-slate-500">After one-time deployment</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ${netAnnualProfit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ROI Multiplier Dial / Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/40 to-violet-950/40 border border-emerald-500/30 text-center space-y-1">
                <div className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
                  Practice Return on Investment (ROI)
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                  {roiPercentage.toLocaleString()}% ROI
                </div>
                <div className="text-[11px] text-slate-400">
                  {roiMultiplier}x return on every dollar invested
                </div>
              </div>

            </div>

            {/* Direct Audit Intake Trigger */}
            <div className="pt-2">
              <a
                href="#audit-intake"
                onClick={handleScrollToIntake}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all duration-200 active:scale-[0.98] cursor-pointer text-center group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Request Your Zip Code Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-3">
                <span>✓ 1-Patient ROI Reality</span>
                <span>•</span>
                <span>✓ One-Time Deployment</span>
                <span>•</span>
                <span>✓ Strict Zip Exclusivity</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
