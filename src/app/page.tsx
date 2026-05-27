import React from "react";
import HeroSection from "@/components/HeroSection";
import StorytellerSection from "@/components/StorytellerSection";
import CompareDashboard from "@/components/CompareDashboard";
import { Compass, Sparkles, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8fafc] grid-bg selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Sticky Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030303]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              BS
            </div>
            <span className="font-black text-base uppercase tracking-wider text-slate-100">
              Beyond<span className="text-indigo-400">Salary</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <a href="#" className="hover:text-indigo-400 transition-colors">Hero Calculator</a>
            <a href="#compare" className="hover:text-indigo-400 transition-colors">Compare Hubs</a>
            <a href="#reality" className="hover:text-indigo-400 transition-colors">The Reality Check</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800 transition">
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>
      </header>
 
      {/* 2. Interactive Comparison Hero */}
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
      <footer className="border-t border-white/5 bg-[#030303] py-12 px-4 md:px-8 relative overflow-hidden">
        {/* Background glow shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-xs">
                BS
              </div>
              <span className="font-black text-sm uppercase tracking-wider text-slate-200">
                Beyond<span className="text-indigo-400">Salary</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              An open-source infographic data project tracking software engineering quality of life across major world tech hubs.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-xs">
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-slate-950 border border-slate-900 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/40 transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-950 border border-slate-900 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/40 transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </a>
            </div>
            <span className="text-slate-600 font-mono text-[10px]">&copy; 2026 BeyondSalary. All Rights Reserved. Built with Next.js, Framer Motion & Tailwind.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
