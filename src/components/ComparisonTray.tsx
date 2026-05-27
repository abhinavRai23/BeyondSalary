"use client";

import React from "react";
import { X, Check, ShieldAlert, Award, Star, Compass } from "lucide-react";
import { CountryData } from "@/types";
import countriesData from "@/data/countries.json";
import { calculateBreakdown, formatCurrencyValue } from "@/utils/helpers";

const countries = countriesData as CountryData[];

interface ComparisonTrayProps {
  selectedCountryCodes: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead";
  onRemoveCountry: (code: string) => void;
}

export default function ComparisonTray({
  selectedCountryCodes,
  experienceLevel,
  onRemoveCountry,
}: ComparisonTrayProps) {
  const activeCountries = countries.filter((c) =>
    selectedCountryCodes.includes(c.code)
  );

  if (activeCountries.length === 0) {
    return null;
  }

  // Formatting helpers
  const fmt = (val: number, curr: string) => formatCurrencyValue(val, curr, false);
  const fmtUSD = (val: number) => formatCurrencyValue(val, "USD", false);

  // Score Indicator Badge
  const renderScore = (score: number) => {
    let color = "text-slate-400 bg-slate-500/10 border-slate-500/20";
    if (score >= 8) {
      color = "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
    } else if (score >= 6) {
      color = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    } else if (score >= 4) {
      color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    } else {
      color = "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${color}`}>
        {score.toFixed(1)}/10
      </span>
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-brand-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Comparison Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side granular breakdown of all quantitative and qualitative parameters.
          </p>
        </div>
        <div className="flex gap-2">
          {activeCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => onRemoveCountry(c.code)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-400 flex items-center gap-1.5 transition-all duration-300"
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
              <X className="w-3 h-3 text-rose-500" />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px] text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-bold text-[10px]">
              <th className="py-3.5 px-4 min-w-[200px]">Parameters</th>
              {activeCountries.map((c) => (
                <th key={c.code} className="py-3.5 px-4 min-w-[280px] text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-slate-100 font-bold text-sm">{c.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/50">
            {/* 1. FINANCIAL DETAILS */}
            <tr className="bg-slate-900/10 font-bold">
              <td className="py-2.5 px-4 text-indigo-400 font-bold uppercase tracking-wider text-[10px]" colSpan={activeCountries.length + 1}>
                Financial Comparison
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Average Gross (Local)</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center font-mono font-semibold text-slate-200">
                  {fmt(c.experienceSalaries[experienceLevel], c.currency)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Average Gross (USD)</td>
              {activeCountries.map((c) => {
                const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                return (
                  <td key={c.code} className="py-3 px-4 text-center font-mono font-semibold text-indigo-300">
                    {fmtUSD(bd.salaryUSD)}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Effective Tax Rate</td>
              {activeCountries.map((c) => {
                const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                return (
                  <td key={c.code} className="py-3 px-4 text-center font-semibold text-rose-400">
                    {Math.round(bd.effectiveTaxRate)}%
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Annual Rent (City Center)</td>
              {activeCountries.map((c) => {
                const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                return (
                  <td key={c.code} className="py-3 px-4 text-center font-mono text-amber-400">
                    {fmtUSD(bd.rentUSD)} <span className="text-xs text-slate-500">({fmt(bd.rentLocal, c.currency)})</span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Annual Living Expenses</td>
              {activeCountries.map((c) => {
                const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                return (
                  <td key={c.code} className="py-3 px-4 text-center font-mono text-sky-400">
                    {fmtUSD(bd.expensesUSD)} <span className="text-xs text-slate-500">({fmt(bd.expensesLocal, c.currency)})</span>
                  </td>
                );
              })}
            </tr>
            <tr className="bg-emerald-950/5">
              <td className="py-3.5 px-4 text-slate-200 font-bold">Liquid Savings Potential (USD)</td>
              {activeCountries.map((c) => {
                const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                return (
                  <td key={c.code} className="py-3.5 px-4 text-center font-mono font-black text-emerald-400 text-glow-emerald text-sm">
                    {fmtUSD(bd.savingsUSD)} <span className="text-xs text-emerald-500 font-medium">({Math.round(bd.savingsPercent)}%)</span>
                  </td>
                );
              })}
            </tr>

            {/* 2. QUALITY OF LIFE */}
            <tr className="bg-slate-900/10 font-bold">
              <td className="py-2.5 px-4 text-indigo-400 font-bold uppercase tracking-wider text-[10px]" colSpan={activeCountries.length + 1}>
                Quality of Life Indicators
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Happiness Score</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.happinessScore)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Universal Healthcare</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.healthcareScore)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 align-top font-semibold text-slate-400/90">Healthcare Access & Friction</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-left text-[13px] text-slate-300 font-normal leading-relaxed whitespace-normal align-top">
                  {c.healthcareFriction}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Safety Index</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.safetyScore)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 align-top font-semibold text-slate-400/90">Legal System & Rules</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-left text-[13px] text-slate-300 font-normal leading-relaxed whitespace-normal align-top">
                  {c.legalEfficiency}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Public Infrastructure & Transport</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.transportScore)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 align-top font-semibold text-slate-400/90">Local Transportation</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-left text-[13px] text-slate-300 font-normal leading-relaxed whitespace-normal align-top">
                  {c.transportDetails}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Air Quality & Environment</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.airQualityScore)}
                </td>
              ))}
            </tr>

            {/* 3. WORK CULTURE & SAFETY NET */}
            <tr className="bg-slate-900/10 font-bold">
              <td className="py-2.5 px-4 text-indigo-400 font-bold uppercase tracking-wider text-[10px]" colSpan={activeCountries.length + 1}>
                Work Culture & Security
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Avg. Work Hours / Week</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center font-mono font-semibold text-rose-400">
                  {c.avgWorkingHours} hrs
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Paid Vacation Days</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center font-mono font-semibold text-emerald-400">
                  {c.yearlyVacationDays} days
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Layoff Legal Protection</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.layoffProtectionScore)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400 align-top font-semibold text-slate-400/90">Severance & Unemployment</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-left text-[13px] text-slate-300 font-normal leading-relaxed whitespace-normal align-top">
                  {c.layoffBenefits}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Notice Period</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center text-slate-200 font-semibold font-mono">
                  {c.noticePeriod}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Burnout Risk Scale</td>
              {activeCountries.map((c) => {
                let badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
                if (c.burnoutRisk === "Very High") {
                  badgeColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
                } else if (c.burnoutRisk === "High") {
                  badgeColor = "text-rose-400 bg-rose-500/10 border-rose-400/20";
                } else if (c.burnoutRisk === "Medium") {
                  badgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                }
                return (
                  <td key={c.code} className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                      {c.burnoutRisk}
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-400">Remote Work Friendliness</td>
              {activeCountries.map((c) => (
                <td key={c.code} className="py-3 px-4 text-center">
                  {renderScore(c.remoteWorkScore)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
