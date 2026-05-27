"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ShieldAlert,
  Zap,
  Landmark,
  Award,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
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

  const [activeCode, setActiveCode] = useState<string>("");
  const pillBarRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ── Active country sync ── */
  useEffect(() => {
    if (activeCountries.length > 0) {
      if (!activeCode || !activeCountries.some((c) => c.code === activeCode)) {
        setActiveCode(activeCountries[0].code);
      }
    } else {
      setActiveCode("");
    }
  }, [activeCountries, activeCode]);

  /* ── Scroll-arrow visibility ── */
  const updateScrollState = () => {
    const el = pillBarRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = pillBarRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [activeCountries]);

  const scrollPills = (dir: "left" | "right") => {
    pillBarRef.current?.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  };

  /* ── Scroll selected pill into view ── */
  useEffect(() => {
    if (!activeCode || !pillBarRef.current) return;
    const btn = pillBarRef.current.querySelector<HTMLButtonElement>(
      `[data-code="${activeCode}"]`
    );
    btn?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeCode]);

  /* ── Empty state ── */
  if (activeCountries.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl border-brand-border text-center space-y-2">
        <Globe className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="text-slate-500 font-mono text-sm">Select countries to view editorial insights.</p>
      </div>
    );
  }

  const selectedCountry =
    activeCountries.find((c) => c.code === activeCode) || activeCountries[0];

  if (!selectedCountry) return null;

  /* ── Demand badge colour ── */
  let demandColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
  if (selectedCountry.engineerDemand === "Very High") {
    demandColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
  } else if (selectedCountry.engineerDemand === "High") {
    demandColor = "text-emerald-400 bg-emerald-500/10 border-emerald-400/20";
  }

  return (
    <div className="space-y-8">
      {/* ── Section heading ── */}
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">The Reality Hub</h3>
        <p className="text-sm text-slate-400">
          Beyond the math: visa complexity, notice periods, layoff safety nets, and
          healthcare access for each tech hub.
        </p>
      </div>

      {/* ── Pill Country Selector ── */}
      <div className="relative">
        {/* Left scroll arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollPills("left")}
            aria-label="Scroll countries left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 shadow-md transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right scroll arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollPills("right")}
            aria-label="Scroll countries right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 shadow-md transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-7 top-0 bottom-0 w-8 z-[5] bg-gradient-to-r from-slate-950 to-transparent" />
        )}
        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-7 top-0 bottom-0 w-8 z-[5] bg-gradient-to-l from-slate-950 to-transparent" />
        )}

        {/* Scrollable pill bar */}
        <div
          ref={pillBarRef}
          className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1.5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Country count badge */}
          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider self-center whitespace-nowrap">
            <Globe className="w-3 h-3" />
            {activeCountries.length} {activeCountries.length === 1 ? "hub" : "hubs"}
          </div>

          {activeCountries.map((c) => {
            const isActive = c.code === activeCode;
            return (
              <button
                key={c.code}
                data-code={c.code}
                onClick={() => setActiveCode(c.code)}
                style={{ scrollSnapAlign: "start" }}
                className={`
                  relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
                  text-xs font-bold transition-all duration-300 whitespace-nowrap
                  border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                  ${isActive
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_18px_rgba(99,102,241,0.35)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-800/80"
                  }
                `}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span>{c.name}</span>
                {isActive && (
                  <motion.span
                    layoutId="reality-active-dot"
                    className="w-1.5 h-1.5 rounded-full bg-indigo-200 inline-block"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Country Detail Card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCountry.code}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="glass-panel rounded-2xl p-6 md:p-8 border-brand-border relative overflow-hidden"
        >
          {/* Large faint background flag */}
          <span className="absolute right-6 top-4 text-9xl opacity-[0.04] pointer-events-none select-none">
            {selectedCountry.flag}
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* ── Left: Quick stats + Pros/Cons ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Country header */}
              <div className="flex items-center gap-3 border-b border-slate-900/60 pb-4">
                <span className="text-4xl">{selectedCountry.flag}</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-100">{selectedCountry.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
                    Currency: {selectedCountry.currency} ({selectedCountry.currencySymbol})
                  </span>
                </div>
              </div>

              {/* Quick metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60 flex flex-col justify-between min-h-[62px]">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wider text-[9px]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Engineer Demand
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border self-start mt-1 ${demandColor}`}>
                    {selectedCountry.engineerDemand}
                  </span>
                </div>

                <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60 flex flex-col justify-between min-h-[62px]">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wider text-[9px]">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Notice Period
                  </span>
                  <span className="text-slate-200 font-semibold font-mono mt-1">
                    {selectedCountry.noticePeriod}
                  </span>
                </div>

                <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60 flex flex-col justify-between min-h-[72px] sm:col-span-2">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wider text-[9px]">
                    <Landmark className="w-3.5 h-3.5 text-indigo-400" /> Visa Framework
                  </span>
                  <span className="text-slate-200 font-medium leading-relaxed mt-1">
                    {selectedCountry.visaInfo}
                  </span>
                </div>

                <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60 flex flex-col justify-between min-h-[72px] sm:col-span-2">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wider text-[9px]">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Pathway to PR / Citizenship
                  </span>
                  <span className="text-slate-200 font-medium leading-relaxed mt-1">
                    {selectedCountry.prPathway}
                  </span>
                </div>
              </div>

              {/* Pros */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">
                  Key Advantages
                </h5>
                <ul className="space-y-2.5">
                  {selectedCountry.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </span>
                      <span className="leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider">
                  Key Challenges
                </h5>
                <ul className="space-y-2.5">
                  {selectedCountry.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-rose-400" />
                      </span>
                      <span className="leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Right: Structural frameworks ── */}
            <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-900/50 pt-6 lg:pt-0 lg:pl-8 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Structural Frameworks
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    label: "Layoff Security & Severance",
                    color: "text-indigo-400",
                    border: "border-indigo-500/20",
                    bg: "bg-indigo-500/5",
                    text: selectedCountry.layoffBenefits,
                  },
                  {
                    label: "Healthcare Access & Wait Times",
                    color: "text-rose-400",
                    border: "border-rose-500/20",
                    bg: "bg-rose-500/5",
                    text: selectedCountry.healthcareFriction,
                  },
                  {
                    label: "Legal System & Contract Security",
                    color: "text-amber-400",
                    border: "border-amber-500/20",
                    bg: "bg-amber-500/5",
                    text: selectedCountry.legalEfficiency,
                  },
                  {
                    label: "Transit & Urban Mobility",
                    color: "text-emerald-400",
                    border: "border-emerald-500/20",
                    bg: "bg-emerald-500/5",
                    text: selectedCountry.transportDetails,
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`p-4 rounded-xl border ${card.border} ${card.bg} flex flex-col gap-2`}
                  >
                    <span className={`${card.color} font-bold uppercase tracking-wider text-[10px]`}>
                      {card.label}
                    </span>
                    <p className="text-slate-400 text-[12.5px] leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
