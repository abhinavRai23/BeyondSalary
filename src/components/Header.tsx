"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import ShareButton from "@/components/ui/ShareButton";

// The theme is driven exclusively by the `.dark` class on <html>.
// We only ever touch documentElement — never document.body — because
// the Tailwind v4 dark variant (@custom-variant dark) matches on
// `html.dark` and all descendants already via the CSS cascade.
function applyTheme(theme: "light" | "dark") {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Sync component state with the class already set by the inline hydration
  // script in layout.tsx (runs synchronously before paint — no FOUC).
  useEffect(() => {
    const saved = (localStorage.getItem("theme-mode") as "light" | "dark") || "dark";
    applyTheme(saved);
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const next: "light" | "dark" = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme-mode", next);
    setTheme(next);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            BS
          </div>
          <span className="font-black text-base uppercase tracking-wider text-slate-100">
            Beyond<span className="text-indigo-400">Salary</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <a href="#" className="hover:text-indigo-400 transition-colors">Hero Calculator</a>
          <a href="#compare" className="hover:text-indigo-400 transition-colors">Compare Hubs</a>
          <a href="#reality" className="hover:text-indigo-400 transition-colors">The Reality Check</a>
          <a href="#sources" className="hover:text-indigo-400 transition-colors">Sources</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ShareButton />

          {/* GitHub */}
          <a
            href="https://github.com/abhinavRai23/BeyondSalary"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center justify-center"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center justify-center w-8 h-8"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              /* Invisible placeholder during SSR to prevent layout shift */
              <span className="w-4 h-4 block" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
