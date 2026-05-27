import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StorytellerSection from "@/components/StorytellerSection";
import CompareDashboard from "@/components/CompareDashboard";
import Footer from "@/components/Footer";
import { Compass, Database, Globe, BookOpen, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen grid-bg selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Page Content Sections */}
      <main className="flex-1">
        <HeroSection />

        {/* 3. Central Comparison Dashboard */}
        <section id="compare" className="scroll-mt-16 border-t border-slate-900/60 bg-slate-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" />
              The Sandbox Explorer
            </div>
          </div>
          <CompareDashboard />
        </section>

        {/* 4. Narrative Storytelling Section (The Reality Check) */}
        <section id="reality" className="scroll-mt-16">
          <StorytellerSection />
        </section>

        {/* 5. Sources & Methodology Section */}
        <section id="sources" className="scroll-mt-16 border-t border-slate-900/60 bg-slate-950/20 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Database className="w-3.5 h-3.5" />
              Data Sources & Methodology
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5 rounded-xl border-brand-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-200">Cost of Living & Rent</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rent indexes and monthly expenses are based on aggregated cost-of-living databases like <strong>Numbeo</strong> (using mid-2024 averages for major tech hubs, normalized relative to a New York City baseline of 100).
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border-brand-border">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-200">Tech Salaries</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compensation benchmarks for Junior, Mid, Senior, and Lead roles are aggregated from <strong>Levels.fyi</strong>, <strong>TechPays.eu</strong>, and local developer compensation surveys across regional tech hubs.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border-brand-border">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-slate-200">Progressive Taxes</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tax formulas calculate progressive brackets, standard deductions, and employee social security contributions for single filers based on 2024 tax codes from the <strong>IRS (US)</strong>, <strong>HMRC (UK)</strong>, <strong>CRA (Canada)</strong>, and respective regional authorities.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-xl border-brand-border">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-slate-200">Quality of Life Scores</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Qualitative ratings (Happiness, Safety, Healthcare, Infrastructure) utilize index data from the <strong>UN World Happiness Report</strong>, <strong>WHO</strong>, and international worker protection statistics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Sleek Footer Section */}
      <Footer />
    </div>
  );
}
