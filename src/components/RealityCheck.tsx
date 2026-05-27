"use client";

import React from "react";
import { Check, X, ShieldAlert, Zap, Landmark, Award } from "lucide-react";
import { CountryData } from "@/types";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountryData[];

interface RealityCheckProps {
  selectedCountryCodes: string[];
}

export default function RealityCheck({ selectedCountryCodes }: RealityCheckProps) {
  const activeCountries = countries.filter((c) =>
    selectedCountryCodes.includes(c.code)
  );

  if (activeCountries.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl border-brand-border text-center text-slate-500 font-mono">
        Select countries to view editorial insights.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">The Reality Check</h3>
        <p className="text-sm text-slate-400">
          Beyond the math: what is the actual engineering demand, visa friction, and cultural trade-off for each tech hub?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCountries.map((c) => {
          // Demand Badge color
          let demandColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
          if (c.engineerDemand === "Very High") {
            demandColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
          } else if (c.engineerDemand === "High") {
            demandColor = "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
          }

          return (
            <div
              key={c.code}
              className="glass-panel rounded-2xl p-6 border-brand-border relative flex flex-col justify-between overflow-hidden"
            >
              {/* Flag backdrop indicator */}
              <span className="absolute right-4 top-2 text-7xl opacity-5 pointer-events-none select-none">
                {c.flag}
              </span>

              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h4 className="text-lg font-bold text-slate-100">{c.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
                      Currency: {c.currency} ({c.currencySymbol})
                    </span>
                  </div>
                </div>

                {/* Editorial Meta Metrics */}
                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="flex justify-between items-center bg-slate-950/30 p-2 rounded-lg border border-slate-900/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Engineer Demand
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${demandColor}`}>
                      {c.engineerDemand}
                    </span>
                  </div>

                  <div className="flex justify-between items-start bg-slate-950/30 p-2 rounded-lg border border-slate-900/60">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0 pt-0.5">
                      <Landmark className="w-3.5 h-3.5 text-indigo-400" /> Visa Framework
                    </span>
                    <span className="text-slate-200 font-medium text-right text-xs max-w-[180px] whitespace-normal" title={c.visaInfo}>
                      {c.visaInfo}
                    </span>
                  </div>

                  <div className="flex justify-between items-start bg-slate-950/30 p-2 rounded-lg border border-slate-900/60">
                    <span className="text-slate-400 flex items-center gap-1.5 shrink-0 pt-0.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Pathway to PR
                    </span>
                    <span className="text-slate-200 font-medium text-right text-xs max-w-[180px] whitespace-normal" title={c.prPathway}>
                      {c.prPathway}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/30 p-2 rounded-lg border border-slate-900/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Notice Period
                    </span>
                    <span className="text-slate-200 font-semibold font-mono">
                      {c.noticePeriod}
                    </span>
                  </div>
                </div>

                {/* Pros Section */}
                <div className="space-y-2 mb-4">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pros</h5>
                  <ul className="space-y-1.5">
                    {c.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons Section */}
                <div className="space-y-2 mb-4">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cons</h5>
                  <ul className="space-y-1.5">
                    {c.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* System & Infrastructure Details */}
                <div className="border-t border-slate-900/80 pt-4 mt-4 space-y-3.5 text-[13px] leading-relaxed text-slate-300">
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-wider block text-[10.5px] mb-0.5">Layoff Benefits & Severance</span>
                    <p className="text-slate-400">{c.layoffBenefits}</p>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-wider block text-[10.5px] mb-0.5">Healthcare Access & Friction</span>
                    <p className="text-slate-400">{c.healthcareFriction}</p>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-wider block text-[10.5px] mb-0.5">Legal System & Rules</span>
                    <p className="text-slate-400">{c.legalEfficiency}</p>
                  </div>
                  <div>
                    <span className="text-indigo-400 font-bold uppercase tracking-wider block text-[10.5px] mb-0.5">Local Transportation</span>
                    <p className="text-slate-400">{c.transportDetails}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
