"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "BeyondSalary — Developer Quality of Life Explorer",
      text: "Compare tech salaries, taxes, savings, work-life balance, and local infrastructure side-by-side.",
      url: typeof window !== "undefined" ? window.location.href : "https://github.com/abhinavRai23/BeyondSalary",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy if user cancels or it fails
        copyFallback();
      }
    } else {
      copyFallback();
    }
  };

  const copyFallback = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
        copied
          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied Link!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Report</span>
        </>
      )}
    </button>
  );
}
