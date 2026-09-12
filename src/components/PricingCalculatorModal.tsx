'use client';

import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, Sparkles, CheckCircle2, UserCheck, Building2, Plus, Minus } from 'lucide-react';

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingCalculatorModal({ isOpen, onClose }: PricingCalculatorModalProps) {
  const [soloCount, setSoloCount] = useState(3);
  const [clinicCount, setClinicCount] = useState(2);

  if (!isOpen) return null;

  const soloRetail = 1497;
  const soloWholesale = 497;
  const soloProfit = soloRetail - soloWholesale; // $1,000
  const soloRetainer = 197;

  const clinicRetail = 2497;
  const clinicWholesale = 897;
  const clinicProfit = clinicRetail - clinicWholesale; // $1,600
  const clinicRetainer = 349;

  const totalRevenue = soloCount * soloRetail + clinicCount * clinicRetail;
  const totalWholesale = soloCount * soloWholesale + clinicCount * clinicWholesale;
  const totalNetProfit = soloCount * soloProfit + clinicCount * clinicProfit;
  const totalMonthlyMrr = soloCount * soloRetainer + clinicCount * clinicRetainer;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Agency Profit Ledger & Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Calculate client revenue, wholesale costs, net profit, and retainer MRR.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Counters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solo Doctors Counter */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-600" /> Solo Doctors ($1,497 Retail)
              </span>
            </div>

            <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl">
              <button
                type="button"
                onClick={() => setSoloCount(Math.max(0, soloCount - 1))}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black text-slate-900 px-4">{soloCount}</span>
              <button
                type="button"
                onClick={() => setSoloCount(soloCount + 1)}
                className="p-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-white font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-emerald-700 font-bold flex justify-between">
              <span>${soloProfit.toLocaleString()} profit / doc</span>
              <span>${soloRetainer}/mo retainer</span>
            </div>
          </div>

          {/* Clinics Counter */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" /> Multi-Doctor Clinics ($2,497 Retail)
              </span>
            </div>

            <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl">
              <button
                type="button"
                onClick={() => setClinicCount(Math.max(0, clinicCount - 1))}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black text-slate-900 px-4">{clinicCount}</span>
              <button
                type="button"
                onClick={() => setClinicCount(clinicCount + 1)}
                className="p-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-emerald-700 font-bold flex justify-between">
              <span>${clinicProfit.toLocaleString()} profit / clinic</span>
              <span>${clinicRetainer}/mo retainer</span>
            </div>
          </div>
        </div>

        {/* Agency Profit Ledger Card */}
        <div className="p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              Official Agency Profit Ledger
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold rounded-full">
              100% Margin Protected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Gross Client Revenue</span>
              <span className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">CiteMed Wholesale Cost</span>
              <span className="text-xl font-bold text-slate-300">${totalWholesale.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl">
              <span className="text-[11px] text-emerald-300 block font-bold uppercase">Net Take-Home Agency Profit</span>
              <span className="text-2xl font-black text-emerald-400">${totalNetProfit.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-sky-300 font-bold flex items-center justify-between border-t border-slate-800">
            <span>Recurring Monthly MRR Retainers:</span>
            <span className="text-sm font-black text-sky-400">${totalMonthlyMrr.toLocaleString()}/mo</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Targeting Plastic Surgeons, Orthopedics, & Multi-Specialty Clinics</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
