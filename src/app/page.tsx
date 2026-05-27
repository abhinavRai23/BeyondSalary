import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StorytellerSection from "@/components/StorytellerSection";
import CompareDashboard from "@/components/CompareDashboard";
import Footer from "@/components/Footer";
import { Compass } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8fafc] grid-bg selection:bg-indigo-500/30 selection:text-indigo-200">
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
      </main>

      {/* 5. Sleek Footer Section */}
      <Footer />
    </div>
  );
}
