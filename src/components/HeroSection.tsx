"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, TrendingUp, TrendingDown, DollarSign, Wind, Clock, Calendar, ShieldCheck, HeartPulse, Shield } from "lucide-react";
import countriesData from "@/data/countries.json";
import { CountryData } from "@/types";
import {
  calculateBreakdown,
  formatCurrencyValue,
  convertCurrency,
  CURRENCY_SYMBOLS,
} from "@/utils/helpers";

const countries = countriesData as CountryData[];

export default function HeroSection() {
  // Setup default state
  const [countryA, setCountryA] = useState<CountryData>(
    countries.find((c) => c.code === "IN") || countries[0]
  );
  const [countryB, setCountryB] = useState<CountryData>(
    countries.find((c) => c.code === "DE") || countries[1]
  );

  const [expLevel, setExpLevel] = useState<"junior" | "mid" | "senior" | "lead">("senior");
  const [salaryA, setSalaryA] = useState<number>(3500000); // 35L
  const [salaryB, setSalaryB] = useState<number>(85000);   // €85k
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");

  // Keep salaries in sync with selected experience level and country changes
  useEffect(() => {
    setSalaryA(countryA.experienceSalaries[expLevel]);
  }, [countryA, expLevel]);

  useEffect(() => {
    setSalaryB(countryB.experienceSalaries[expLevel]);
  }, [countryB, expLevel]);

  // Compute financial breakdowns
  const breakdownA = calculateBreakdown(countryA, salaryA);
  const breakdownB = calculateBreakdown(countryB, salaryB);

  // Normalize savings to selected display currency for comparison
  const savingsAInDisplay = convertCurrency(
    breakdownA.savingsLocal,
    countryA.currency,
    displayCurrency
  );
  const savingsBInDisplay = convertCurrency(
    breakdownB.savingsLocal,
    countryB.currency,
    displayCurrency
  );

  const savingsDifference = Math.abs(savingsAInDisplay - savingsBInDisplay);
  const winner = savingsAInDisplay > savingsBInDisplay ? countryA : countryB;
  const loser = savingsAInDisplay > savingsBInDisplay ? countryB : countryA;
  const winnerSavings = savingsAInDisplay > savingsBInDisplay ? savingsAInDisplay : savingsBInDisplay;
  const loserSavings = savingsAInDisplay > savingsBInDisplay ? savingsBInDisplay : savingsAInDisplay;
  const percentBetter = loserSavings > 0 
    ? ((winnerSavings - loserSavings) / loserSavings) * 100 
    : 100;

  // Formatting helpers
  const formatLocal = (val: number, c: CountryData) =>
    formatCurrencyValue(val, c.currency, false);

  const formatDisplay = (val: number) =>
    formatCurrencyValue(val, displayCurrency, false);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center py-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none -z-10 animate-pulse-slow" />

      <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide mb-6 uppercase"
        >
          <DollarSign className="w-3.5 h-3.5" />
          Rethinking tech compensation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent leading-tight mb-6"
        >
          Beyond Salary
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
        >
          A <span className="text-white font-semibold uppercase tracking-wider">{expLevel}</span> software engineer earning{" "}
          <span className="text-indigo-400 font-semibold">{formatLocal(countryA.experienceSalaries[expLevel], countryA)} in {countryA.name}</span>{" "}
          vs{" "}
          <span className="text-emerald-400 font-semibold">{formatLocal(countryB.experienceSalaries[expLevel], countryB)} in {countryB.name}</span>
          — who actually takes home more cash? Compare the real savings potential after taxes, rent, and cost of living.
        </motion.p>
      </div>

      {/* Selector and Currency Switcher Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 z-10">
        <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(["junior", "mid", "senior", "lead"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setExpLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                expLevel === level
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
            <button
              key={curr}
              onClick={() => setDisplayCurrency(curr)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                displayCurrency === curr
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-500"
                  : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800"
              }`}
            >
              {curr} ({CURRENCY_SYMBOLS[curr]})
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Calculator Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 mb-12">
        {/* Country A Input */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-brand-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Country A</h3>
            <select
              value={countryA.code}
              onChange={(e) => {
                const next = countries.find((c) => c.code === e.target.value);
                if (next) setCountryA(next);
              }}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Annual Local Salary</span>
                <span className="text-indigo-400 text-lg font-black font-mono">
                  {formatLocal(salaryA, countryA)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(countryA.experienceSalaries[expLevel] * 0.4)}
                max={Math.round(countryA.experienceSalaries[expLevel] * 2.2)}
                step={Math.max(100, Math.round(countryA.experienceSalaries[expLevel] / 100))}
                value={salaryA}
                onChange={(e) => setSalaryA(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>{formatLocal(Math.round(countryA.experienceSalaries[expLevel] * 0.4), countryA)}</span>
                <span>{formatLocal(Math.round(countryA.experienceSalaries[expLevel] * 2.2), countryA)}</span>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-4 space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Effective Tax Rate</span>
                <span className="text-rose-400 font-semibold">{countryA.taxPercentage}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Est. Tax Paid</span>
                <span className="text-rose-400 font-mono">{formatLocal(breakdownA.taxLocal, countryA)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Annual Rent (City Center)</span>
                <span className="text-amber-400 font-mono">{formatLocal(breakdownA.rentLocal, countryA)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Annual Expenses (Excl. Rent)</span>
                <span className="text-sky-400 font-mono">{formatLocal(breakdownA.expensesLocal, countryA)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Action Button */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center self-stretch py-4 lg:py-0">
          <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-pulse">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
        </div>

        {/* Country B Input */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-brand-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Country B</h3>
            <select
              value={countryB.code}
              onChange={(e) => {
                const next = countries.find((c) => c.code === e.target.value);
                if (next) setCountryB(next);
              }}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Annual Local Salary</span>
                <span className="text-emerald-400 text-lg font-black font-mono">
                  {formatLocal(salaryB, countryB)}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(countryB.experienceSalaries[expLevel] * 0.4)}
                max={Math.round(countryB.experienceSalaries[expLevel] * 2.2)}
                step={Math.max(100, Math.round(countryB.experienceSalaries[expLevel] / 100))}
                value={salaryB}
                onChange={(e) => setSalaryB(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>{formatLocal(Math.round(countryB.experienceSalaries[expLevel] * 0.4), countryB)}</span>
                <span>{formatLocal(Math.round(countryB.experienceSalaries[expLevel] * 2.2), countryB)}</span>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-4 space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Effective Tax Rate</span>
                <span className="text-rose-400 font-semibold">{countryB.taxPercentage}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Est. Tax Paid</span>
                <span className="text-rose-400 font-mono">{formatLocal(breakdownB.taxLocal, countryB)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Annual Rent (City Center)</span>
                <span className="text-amber-400 font-mono">{formatLocal(breakdownB.rentLocal, countryB)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Annual Expenses (Excl. Rent)</span>
                <span className="text-sky-400 font-mono">{formatLocal(breakdownB.expensesLocal, countryB)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Breakdown Bar Sections */}
      <div className="space-y-8 mb-12 relative z-10">
        {/* Country A Breakdown Bar */}
        <div className="glass-panel p-5 rounded-2xl border-brand-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{countryA.flag}</span>
              <span className="text-base font-bold text-slate-100">{countryA.name}</span>
              <span className="text-xs text-slate-500 font-mono">({formatLocal(salaryA, countryA)})</span>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="text-rose-400">Tax: {countryA.taxPercentage}%</span>
              <span className="text-amber-400">Rent: {Math.round((breakdownA.rentLocal / salaryA) * 100)}%</span>
              <span className="text-sky-400">Expenses: {Math.round((breakdownA.expensesLocal / salaryA) * 100)}%</span>
              <span className={`font-bold ${breakdownA.savingsLocal > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                Savings: {Math.round(breakdownA.savingsPercent)}%
              </span>
            </div>
          </div>

          {/* Bar Chart Stack */}
          <div className="h-6 w-full rounded-full bg-slate-900 overflow-hidden flex font-mono text-[9px] text-white font-bold">
            {/* Tax Portion */}
            <motion.div
              animate={{ width: `${countryA.taxPercentage}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-rose-500 flex items-center justify-center min-w-[5px]"
              title={`Tax: ${formatLocal(breakdownA.taxLocal, countryA)}`}
            >
              {countryA.taxPercentage > 10 && "TAX"}
            </motion.div>
            {/* Rent Portion */}
            <motion.div
              animate={{ width: `${(breakdownA.rentLocal / salaryA) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-amber-500 flex items-center justify-center min-w-[5px]"
              title={`Rent: ${formatLocal(breakdownA.rentLocal, countryA)}`}
            >
              {((breakdownA.rentLocal / salaryA) * 100) > 10 && "RENT"}
            </motion.div>
            {/* Expenses Portion */}
            <motion.div
              animate={{ width: `${(breakdownA.expensesLocal / salaryA) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-sky-500 flex items-center justify-center min-w-[5px]"
              title={`Expenses: ${formatLocal(breakdownA.expensesLocal, countryA)}`}
            >
              {((breakdownA.expensesLocal / salaryA) * 100) > 10 && "EXPENSES"}
            </motion.div>
            {/* Net Savings Portion */}
            <motion.div
              animate={{
                width: `${breakdownA.savingsPercent > 0 ? breakdownA.savingsPercent : 0}%`,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className={`flex items-center justify-center ${
                breakdownA.savingsLocal > 0 ? "bg-emerald-500" : "bg-transparent w-0"
              }`}
              title={`Savings: ${formatLocal(breakdownA.savingsLocal, countryA)}`}
            >
              {breakdownA.savingsPercent > 10 && "SAVINGS"}
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-3 text-xs">
            <span className="text-slate-500">Leftover Savings (Annual Local)</span>
            <span className={`font-black font-mono ${breakdownA.savingsLocal > 0 ? "text-emerald-400" : "text-rose-500"}`}>
              {formatLocal(breakdownA.savingsLocal, countryA)}
            </span>
          </div>
        </div>

        {/* Country B Breakdown Bar */}
        <div className="glass-panel p-5 rounded-2xl border-brand-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{countryB.flag}</span>
              <span className="text-base font-bold text-slate-100">{countryB.name}</span>
              <span className="text-xs text-slate-500 font-mono">({formatLocal(salaryB, countryB)})</span>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="text-rose-400">Tax: {countryB.taxPercentage}%</span>
              <span className="text-amber-400">Rent: {Math.round((breakdownB.rentLocal / salaryB) * 100)}%</span>
              <span className="text-sky-400">Expenses: {Math.round((breakdownB.expensesLocal / salaryB) * 100)}%</span>
              <span className={`font-bold ${breakdownB.savingsLocal > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                Savings: {Math.round(breakdownB.savingsPercent)}%
              </span>
            </div>
          </div>

          {/* Bar Chart Stack */}
          <div className="h-6 w-full rounded-full bg-slate-900 overflow-hidden flex font-mono text-[9px] text-white font-bold">
            {/* Tax Portion */}
            <motion.div
              animate={{ width: `${countryB.taxPercentage}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-rose-500 flex items-center justify-center min-w-[5px]"
              title={`Tax: ${formatLocal(breakdownB.taxLocal, countryB)}`}
            >
              {countryB.taxPercentage > 10 && "TAX"}
            </motion.div>
            {/* Rent Portion */}
            <motion.div
              animate={{ width: `${(breakdownB.rentLocal / salaryB) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-amber-500 flex items-center justify-center min-w-[5px]"
              title={`Rent: ${formatLocal(breakdownB.rentLocal, countryB)}`}
            >
              {((breakdownB.rentLocal / salaryB) * 100) > 10 && "RENT"}
            </motion.div>
            {/* Expenses Portion */}
            <motion.div
              animate={{ width: `${(breakdownB.expensesLocal / salaryB) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="bg-sky-500 flex items-center justify-center min-w-[5px]"
              title={`Expenses: ${formatLocal(breakdownB.expensesLocal, countryB)}`}
            >
              {((breakdownB.expensesLocal / salaryB) * 100) > 10 && "EXPENSES"}
            </motion.div>
            {/* Net Savings Portion */}
            <motion.div
              animate={{
                width: `${breakdownB.savingsPercent > 0 ? breakdownB.savingsPercent : 0}%`,
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className={`flex items-center justify-center ${
                breakdownB.savingsLocal > 0 ? "bg-emerald-500" : "bg-transparent w-0"
              }`}
              title={`Savings: ${formatLocal(breakdownB.savingsLocal, countryB)}`}
            >
              {breakdownB.savingsPercent > 10 && "SAVINGS"}
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-3 text-xs">
            <span className="text-slate-500">Leftover Savings (Annual Local)</span>
            <span className={`font-black font-mono ${breakdownB.savingsLocal > 0 ? "text-emerald-400" : "text-rose-500"}`}>
              {formatLocal(breakdownB.savingsLocal, countryB)}
            </span>
          </div>
        </div>
      </div>

      {/* Quality of Life Matchup */}
      <div className="glass-panel p-6 rounded-2xl border-brand-border relative z-10 space-y-5 mb-8">
        <div className="flex justify-between items-center pb-3 border-b border-slate-900">
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Quality of Life Matchup</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Comparing core social, cultural, and environmental parameters side-by-side.</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
            Beyond Salary Indices
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Air Quality */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Air Quality</span>
              <Wind className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.airQualityScore >= countryB.airQualityScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.airQualityScore.toFixed(1)}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.airQualityScore >= countryA.airQualityScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.airQualityScore.toFixed(1)}
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.airQualityScore > countryB.airQualityScore ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>

          {/* Work Hours (lower is better) */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Weekly Work</span>
              <Clock className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.avgWorkingHours <= countryB.avgWorkingHours ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.avgWorkingHours}h
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.avgWorkingHours <= countryA.avgWorkingHours ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.avgWorkingHours}h
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.avgWorkingHours < countryB.avgWorkingHours ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>

          {/* Paid Vacation */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Paid Vacation</span>
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.yearlyVacationDays >= countryB.yearlyVacationDays ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.yearlyVacationDays}d
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.yearlyVacationDays >= countryA.yearlyVacationDays ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.yearlyVacationDays}d
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.yearlyVacationDays > countryB.yearlyVacationDays ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>

          {/* Job Security */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Job Security</span>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.layoffProtectionScore >= countryB.layoffProtectionScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.layoffProtectionScore.toFixed(1)}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.layoffProtectionScore >= countryA.layoffProtectionScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.layoffProtectionScore.toFixed(1)}
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.layoffProtectionScore > countryB.layoffProtectionScore ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>

          {/* Healthcare */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Healthcare</span>
              <HeartPulse className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.healthcareScore >= countryB.healthcareScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.healthcareScore.toFixed(1)}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.healthcareScore >= countryA.healthcareScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.healthcareScore.toFixed(1)}
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.healthcareScore > countryB.healthcareScore ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900/60 flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-center text-slate-500">
              <span className="text-[9px] uppercase font-bold tracking-wider">Safety Index</span>
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono font-medium">
                <span className="flex items-center gap-1">
                  <span>{countryA.flag}</span>
                  <span className={countryA.safetyScore >= countryB.safetyScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryA.safetyScore.toFixed(1)}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{countryB.flag}</span>
                  <span className={countryB.safetyScore >= countryA.safetyScore ? "text-emerald-400 font-bold" : "text-slate-400"}>
                    {countryB.safetyScore.toFixed(1)}
                  </span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 text-center font-bold">
                {countryA.safetyScore > countryB.safetyScore ? countryA.name : countryB.name} wins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Callout Cards (Stripe/Linear style) */}
      <motion.div
        layout
        className="glass-panel p-6 rounded-2xl border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-emerald-950/10 text-center relative z-10 flex flex-col md:flex-row md:text-left justify-between items-center gap-6"
      >
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-2xl">{winner.flag}</span>
            <h4 className="text-lg font-bold text-slate-100">Savings Reality Check Verdict</h4>
          </div>
          <p className="text-sm text-slate-400 max-w-xl">
            Software engineers in <span className="text-white font-semibold">{winner.name}</span> save{" "}
            <span className="text-emerald-400 font-bold font-mono">{formatDisplay(savingsDifference)}</span> more per year than those in{" "}
            <span className="text-white font-semibold">{loser.name}</span>. That is an increase of{" "}
            <span className="text-emerald-400 font-bold font-mono">{percentBetter.toFixed(0)}%</span> in liquid savings potential.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel px-5 py-4 rounded-xl text-center bg-slate-950/60 border-brand-border">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
              {countryA.flag} {countryA.name} Savings
            </div>
            <div className={`text-base font-black font-mono ${savingsAInDisplay > 0 ? "text-emerald-400 text-glow-emerald" : "text-rose-500"}`}>
              {formatDisplay(savingsAInDisplay)}
            </div>
          </div>

          <div className="glass-panel px-5 py-4 rounded-xl text-center bg-slate-950/60 border-brand-border">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
              {countryB.flag} {countryB.name} Savings
            </div>
            <div className={`text-base font-black font-mono ${savingsBInDisplay > 0 ? "text-emerald-400 text-glow-emerald" : "text-rose-500"}`}>
              {formatDisplay(savingsBInDisplay)}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
