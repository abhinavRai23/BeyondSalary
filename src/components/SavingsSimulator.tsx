"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Wallet, ShieldAlert, Award } from "lucide-react";
import { CountryData } from "@/types";
import countriesData from "@/data/countries.json";
import {
  calculateBreakdown,
  formatCurrencyValue,
  convertCurrency,
} from "@/utils/helpers";
import { Card } from "@/components/ui/Card";

const countries = countriesData as CountryData[];

interface SimulatorProps {
  selectedCountryCodes: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead";
}

export default function SavingsSimulator({ selectedCountryCodes, experienceLevel }: SimulatorProps) {
  // Use first selected country, or default to India
  const initialCode = selectedCountryCodes.length > 0 ? selectedCountryCodes[0] : "IN";
  const [activeCode, setActiveCode] = useState<string>(initialCode);

  useEffect(() => {
    if (selectedCountryCodes.length > 0 && !selectedCountryCodes.includes(activeCode)) {
      setActiveCode(selectedCountryCodes[0]);
    }
  }, [selectedCountryCodes, activeCode]);

  const activeCountry = countries.find((c) => c.code === activeCode) || countries[0];

  // Simulator Inputs (Local Currency)
  const [salary, setSalary] = useState<number>(activeCountry.experienceSalaries[experienceLevel]);
  const [taxRate, setTaxRate] = useState<number>(activeCountry.taxPercentage);
  const [rent, setRent] = useState<number>(activeCountry.averageRentLocal);
  const [expenses, setExpenses] = useState<number>(activeCountry.monthlyExpensesLocal);

  // Reset inputs when active country or experience level changes
  useEffect(() => {
    setSalary(activeCountry.experienceSalaries[experienceLevel]);
    setTaxRate(activeCountry.taxPercentage);
    setRent(activeCountry.averageRentLocal);
    setExpenses(activeCountry.monthlyExpensesLocal);
  }, [activeCountry, experienceLevel]);

  // Calculations
  const taxPaid = salary * (taxRate / 100);
  const yearlyRent = rent * 12;
  const yearlyExpenses = expenses * 12;
  const savings = salary - taxPaid - yearlyRent - yearlyExpenses;
  const savingsPercent = salary > 0 ? (savings / salary) * 100 : 0;
  
  const exchangeRate = activeCountry.exchangeRateToUSD;
  const savingsUSD = savings * exchangeRate;
  const salaryUSD = salary * exchangeRate;
  const taxUSD = taxPaid * exchangeRate;
  const costOfLivingUSD = (yearlyRent + yearlyExpenses) * exchangeRate;

  // Format Helper
  const fmt = (val: number) => formatCurrencyValue(val, activeCountry.currency, false);
  const fmtUSD = (val: number) => formatCurrencyValue(val, "USD", false);

  // Compare against other selected countries
  const comparisonCountries = countries.filter(
    (c) => c.code !== activeCountry.code && selectedCountryCodes.includes(c.code)
  );

  return (
    <div className="space-y-8">
      {/* Country Selection Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-slate-300">Select active sandbox country:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => {
            const isSelect = selectedCountryCodes.includes(c.code);
            return (
              <button
                key={c.code}
                disabled={!isSelect}
                onClick={() => setActiveCode(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1 ${
                  !isSelect
                    ? "opacity-30 cursor-not-allowed bg-slate-950/20 text-slate-600"
                    : activeCode === c.code
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-2">
            <span>{activeCountry.flag}</span>
            <span>Customize {activeCountry.name} Budget</span>
          </h3>

          {/* Salary Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-slate-400 font-medium">Annual Gross Salary ({activeCountry.currency})</label>
              <span className="text-indigo-400 font-black font-mono">{fmt(salary)}</span>
            </div>
            <input
              type="range"
              min={Math.round(activeCountry.experienceSalaries[experienceLevel] * 0.4)}
              max={Math.round(activeCountry.experienceSalaries[experienceLevel] * 2.2)}
              step={Math.max(100, Math.round(activeCountry.experienceSalaries[experienceLevel] / 100))}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{fmt(Math.round(activeCountry.experienceSalaries[experienceLevel] * 0.4))}</span>
              <span>{fmt(Math.round(activeCountry.experienceSalaries[experienceLevel] * 2.2))}</span>
            </div>
          </div>

          {/* Tax Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-slate-400 font-medium">Effective Income Tax Rate</label>
              <span className="text-rose-400 font-black font-mono">{taxRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Tax Free)</span>
              <span>70% (Bureaucracy Max)</span>
            </div>
          </div>

          {/* Rent Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-slate-400 font-medium">Monthly Rent (City Center 1-Bed)</label>
              <span className="text-amber-400 font-black font-mono">{fmt(rent)}/mo</span>
            </div>
            <input
              type="range"
              min={activeCountry.averageRentLocal * 0.3}
              max={activeCountry.averageRentLocal * 2.5}
              step={activeCountry.currency === "INR" ? 1000 : 50}
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="w-full cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{fmt(activeCountry.averageRentLocal * 0.3)}</span>
              <span>{fmt(activeCountry.averageRentLocal * 2.5)}</span>
            </div>
          </div>

          {/* Expenses Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-slate-400 font-medium">Other Monthly Expenses (Food, Utilities, Fun)</label>
              <span className="text-sky-400 font-black font-mono">{fmt(expenses)}/mo</span>
            </div>
            <input
              type="range"
              min={activeCountry.monthlyExpensesLocal * 0.3}
              max={activeCountry.monthlyExpensesLocal * 2.5}
              step={activeCountry.currency === "INR" ? 1000 : 50}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{fmt(activeCountry.monthlyExpensesLocal * 0.3)}</span>
              <span>{fmt(activeCountry.monthlyExpensesLocal * 2.5)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Gauge / Results Screen */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Results Card */}
          <Card glow={savings > 0} glowColor={savings > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)"} className="flex-1 flex flex-col justify-between border-brand-border">
            <div className="text-center py-4">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-2">Simulated Net Savings</span>
              <h4 className={`text-3xl font-black font-mono ${savings > 0 ? "text-emerald-400 text-glow-emerald" : "text-rose-500"}`}>
                {fmtUSD(savingsUSD)} / year
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                ({fmt(savings)} local)
              </span>
            </div>

            {/* Savings Rate Indicator */}
            <div className="flex justify-center items-center py-4 relative">
              {/* Radial Bar Emulator */}
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-slate-900 bg-slate-950/40">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke={savingsPercent > 0 ? "#10b981" : "#ef4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="390"
                    strokeDashoffset={390}
                    initial={{ strokeDashoffset: 390 }}
                    animate={{
                      strokeDashoffset: 390 - (390 * Math.max(0, Math.min(savingsPercent, 100))) / 100,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="text-center z-10">
                  <span className="text-2xl font-black font-mono text-slate-100">
                    {savingsPercent > 0 ? Math.round(savingsPercent) : 0}%
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Savings Rate</span>
                </div>
              </div>
            </div>

            {/* Simulated Breakdown Breakdown */}
            <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Gross Salary
                </span>
                <span className="font-mono text-slate-200">{fmtUSD(salaryUSD)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Income Tax
                </span>
                <span className="font-mono text-rose-400">{fmtUSD(taxUSD)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Living Cost
                </span>
                <span className="font-mono text-amber-400">{fmtUSD(costOfLivingUSD)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sandboxed Country comparison table */}
      {comparisonCountries.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border-brand-border">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Comparing Your Budget Against Averages in Other Selected Tech Hubs
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 font-bold">Country</th>
                  <th className="py-2.5 font-bold">Avg. Gross (USD)</th>
                  <th className="py-2.5 font-bold">Taxes</th>
                  <th className="py-2.5 font-bold">Cost of Living (USD)</th>
                  <th className="py-2.5 font-bold">Avg. Net Savings (USD)</th>
                  <th className="py-2.5 font-bold">Comparison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-medium">
                {/* Active Country Simulated values */}
                <tr className="bg-indigo-950/20 text-indigo-300">
                  <td className="py-3 font-bold flex items-center gap-1.5">
                    <span>{activeCountry.flag}</span>
                    <span>{activeCountry.name} (Simulated)</span>
                  </td>
                  <td className="py-3 font-mono">{fmtUSD(salaryUSD)}</td>
                  <td className="py-3">{taxRate}%</td>
                  <td className="py-3 font-mono">{fmtUSD(costOfLivingUSD)}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{fmtUSD(savingsUSD)}</td>
                  <td className="py-3 text-[10px] uppercase font-bold tracking-wider text-indigo-400">Sandbox Target</td>
                </tr>

                {/* Compare countries average values */}
                {comparisonCountries.map((c) => {
                  const bd = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
                  const difference = savingsUSD - bd.savingsUSD;
                  return (
                    <tr key={c.code} className="text-slate-300">
                      <td className="py-3 flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.name} (Average)</span>
                      </td>
                      <td className="py-3 font-mono">{fmtUSD(bd.salaryUSD)}</td>
                      <td className="py-3">{c.taxPercentage}%</td>
                      <td className="py-3 font-mono">{fmtUSD(bd.rentUSD + bd.expensesUSD)}</td>
                      <td className="py-3 font-mono font-bold">{fmtUSD(bd.savingsUSD)}</td>
                      <td className="py-3 font-mono text-[10px]">
                        {difference > 0 ? (
                          <span className="text-emerald-400">+{fmtUSD(Math.abs(difference))} vs Avg</span>
                        ) : (
                          <span className="text-rose-500">-{fmtUSD(Math.abs(difference))} vs Avg</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
