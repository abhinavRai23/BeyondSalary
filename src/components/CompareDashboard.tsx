"use client";

import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  Compass,
  DollarSign,
  Briefcase,
  Sliders,
  FileText,
  CheckCircle,
} from "lucide-react";
import { CountryData } from "@/types";
import countriesData from "@/data/countries.json";
import { calculateBreakdown, formatCurrencyValue } from "@/utils/helpers";
import MetricsVisualizer from "@/components/MetricsVisualizer";
import SavingsSimulator from "@/components/SavingsSimulator";
import RealityCheck from "@/components/RealityCheck";
import ComparisonMatrix from "@/components/ComparisonTray";

const countries = countriesData as CountryData[];

type TabType = "charts" | "simulator" | "reality" | "matrix";

export default function CompareDashboard() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(["IN", "DE", "US"]);
  const [expLevel, setExpLevel] = useState<"junior" | "mid" | "senior" | "lead">("senior");
  const [activeTab, setActiveTab] = useState<TabType>("matrix");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleCountry = (code: string) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter((c) => c !== code));
      }
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const applyPreset = (type: "all" | "savings" | "worklife" | "europe") => {
    if (type === "all") {
      setSelectedCodes(countries.map((c) => c.code));
    } else if (type === "savings") {
      const sorted = [...countries]
        .map((c) => ({
          code: c.code,
          savings: calculateBreakdown(c, c.experienceSalaries[expLevel]).savingsUSD,
        }))
        .sort((a, b) => b.savings - a.savings)
        .slice(0, 3)
        .map((c) => c.code);
      setSelectedCodes(sorted);
    } else if (type === "worklife") {
      setSelectedCodes(["DE", "NL", "SE"]);
    } else if (type === "europe") {
      setSelectedCodes(["DE", "NL", "SE", "GB", "CH", "IE", "PL", "FR"]);
    }
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "matrix", label: "Comparison Matrix", icon: Briefcase },
    { id: "reality", label: "Reality Check Details", icon: FileText },
    { id: "simulator", label: "Savings Sandbox", icon: Sliders },
    { id: "charts", label: "Interactive Charts", icon: Compass },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* 1. Country Selection Panel */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wider">Select Countries to Compare</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select one or more countries to plot comparisons, analyze metrics, and compare quality of life indices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs w-full lg:w-auto lg:justify-end">
            {/* Experience Selector */}
            <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2">Exp:</span>
              {(["junior", "mid", "senior", "lead"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setExpLevel(level)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    expLevel === level
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Quick Selection Presets */}
            <div className="flex gap-2">
              <button
                onClick={() => applyPreset("all")}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-300 font-bold transition"
              >
                Select All
              </button>
              <button
                onClick={() => applyPreset("savings")}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-300 font-bold transition flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> High Savings
              </button>
              <button
                onClick={() => applyPreset("worklife")}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-300 font-bold transition flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Balance First
              </button>
              <button
                onClick={() => applyPreset("europe")}
                className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-300 font-bold transition"
              >
                European Hubs
              </button>
            </div>
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
          {filteredCountries.map((c) => {
            const isSelected = selectedCodes.includes(c.code);
            const breakdown = calculateBreakdown(c, c.experienceSalaries[expLevel]);
            
            return (
              <motion.div
                key={c.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCountry(c.code)}
                className={`glass-panel p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[120px] ${
                  isSelected
                    ? "border-indigo-500/60 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    : "border-brand-border bg-slate-950/20 hover:border-slate-800 hover:bg-slate-900/40"
                }`}
              >
                {/* Active Indicator Pin */}
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                )}

                {/* Country Header */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="text-xs font-bold text-slate-200 truncate">{c.name}</span>
                </div>

                {/* Micro metrics */}
                <div className="space-y-1 text-[10px] font-mono text-slate-400 border-t border-slate-900/60 pt-2">
                  <div className="flex justify-between">
                    <span>Salary:</span>
                    <span className="text-slate-200 font-semibold">
                      {formatCurrencyValue(breakdown.salaryUSD, "USD", true)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savings:</span>
                    <span className={`font-bold ${breakdown.savingsUSD > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                      {breakdown.savingsUSD > 0 ? `${Math.round(breakdown.savingsPercent)}%` : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Work:</span>
                    <span className="text-rose-400 font-semibold">{c.avgWorkingHours}h/wk</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Responsive Glassmorphic Tab Container */}
      <LayoutGroup>
        <div className="flex border-b border-slate-900 overflow-x-auto no-scrollbar gap-2 scroll-smooth">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabType)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 relative shrink-0 transition-all duration-300 ${
                  isActive
                    ? "text-indigo-400 border-indigo-500 font-black"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* 3. Rendered Content Body with Smooth Fade-in */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="min-h-[400px]"
      >
        {activeTab === "charts" && (
          <MetricsVisualizer selectedCountries={selectedCodes} experienceLevel={expLevel} />
        )}
        {activeTab === "simulator" && (
          <SavingsSimulator selectedCountryCodes={selectedCodes} experienceLevel={expLevel} />
        )}
        {activeTab === "reality" && (
          <RealityCheck selectedCountryCodes={selectedCodes} />
        )}
        {activeTab === "matrix" && (
          <ComparisonMatrix
            selectedCountryCodes={selectedCodes}
            experienceLevel={expLevel}
            onRemoveCountry={(code) => {
              if (selectedCodes.length > 1) {
                setSelectedCodes(selectedCodes.filter((c) => c !== code));
              }
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
