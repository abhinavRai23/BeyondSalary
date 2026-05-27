"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, TrendingDown, Clock, Smile, Sparkles } from "lucide-react";

export default function StorytellerSection() {
  const stories = [
    {
      num: "01",
      title: "The Gross Salary Illusion",
      subtitle: "Why €90k in Berlin is not what you think.",
      icon: TrendingDown,
      color: "from-rose-500/20 to-orange-500/10",
      borderColor: "border-rose-500/30",
      iconColor: "text-rose-400",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>
            When recruiters quote high salaries in Europe, the first thing they don&apos;t mention is the progressive tax system. In Germany, a single engineer earning <span className="text-slate-100 font-bold">€85,000</span> takes home roughly <span className="text-rose-400 font-bold">€49,300</span> after mandatory pension, health insurance, and income tax.
          </p>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Germany €85k Gross</span>
              <span className="text-rose-400 font-mono font-black text-sm">~42% Deductions</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">India ₹35L Gross</span>
              <span className="text-emerald-400 font-mono font-black text-sm">~25% Deductions</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            *In addition to tax, European contributions buy you universal health care, free schools, and strong safety nets, but it drastically reduces your immediate monthly spending power.
          </p>
        </div>
      ),
    },
    {
      num: "02",
      title: "The Rent Black Hole",
      subtitle: "Where your liquid savings go to die.",
      icon: ShieldAlert,
      color: "from-amber-500/20 to-red-500/10",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>
            The tech centers of San Francisco, London, and Toronto offer premium salaries, but they also boast some of the highest real estate costs in the world. An average 1-bed in San Francisco center sits at <span className="text-slate-100 font-bold">$3,000/month</span>, eating up nearly <span className="text-amber-400 font-bold">$36,000/year</span> of post-tax cash.
          </p>
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 block font-semibold">SF Rent / Yr</span>
              <span className="text-rose-400 font-mono font-black text-xs">$36,000</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 block font-semibold">London Rent / Yr</span>
              <span className="text-rose-400 font-mono font-black text-xs">$32,000</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 block font-semibold">Stockholm Rent / Yr</span>
              <span className="text-emerald-400 font-mono font-black text-xs">$15,800</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            By shifting to remote-friendly regions or selecting cities with rent controls (like Stockholm) or lower baseline costs (like India), your cash retention rate can increase by over 2.5x.
          </p>
        </div>
      ),
    },
    {
      num: "03",
      title: "Work Culture Arbitrage",
      subtitle: "Calculating your true hourly worth.",
      icon: Clock,
      color: "from-indigo-500/20 to-purple-500/10",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      content: (
        <div className="space-y-4 text-slate-300">
          <p>
            Tech culture in India and the US frequently expects 45+ hour work weeks and yields only 15-20 vacation days. Contrast this with Sweden, Netherlands, or Germany, where a 36-38 hour week is mandated, overtime is strictly illegal or compensated, and engineers enjoy up to 40 days of paid vacation.
          </p>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">German Tech Culture</span>
              <span className="text-emerald-400 font-mono font-black text-sm">38h Week & 40 Vac Days</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">US Tech Culture</span>
              <span className="text-rose-400 font-mono font-black text-sm">43h Week & 25 Vac Days</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            If you calculate your salary *divided by your actual hours worked* minus the vacation hours, the hourly compensation gap between Europe and North America shrinks dramatically.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-slate-900/60 relative">
      {/* Visual connection line */}
      <div className="absolute left-[34px] md:left-1/2 top-32 bottom-32 w-px bg-gradient-to-b from-indigo-500/10 via-indigo-500/30 to-indigo-500/10 hidden md:block" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          The Cultural Shift
        </div>
        <h2 className="text-3xl font-black text-slate-100 uppercase tracking-wider">Uncovering the Truth</h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore three critical factors that define developer quality of life beyond the gross compensation figure.
        </p>
      </div>

      <div className="space-y-16">
        {stories.map((story, index) => {
          const Icon = story.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={story.num}
              className={`flex flex-col md:flex-row gap-8 items-start justify-between relative`}
            >
              {/* Timeline bubble */}
              <div className="absolute left-0 md:left-1/2 -translate-x-[9px] md:-translate-x-1/2 w-5.5 h-5.5 rounded-full border-4 border-slate-950 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] z-10" />

              {/* Text side */}
              <div
                className={`w-full md:w-[45%] pl-6 md:pl-0 ${
                  isEven ? "md:text-right md:order-1" : "md:order-2"
                }`}
              >
                <span className="text-[10px] text-indigo-400 font-mono font-black tracking-widest uppercase block mb-1">
                  Section {story.num}
                </span>
                <h3 className="text-xl font-black text-slate-100 uppercase tracking-wide">
                  {story.title}
                </h3>
                <h4 className="text-sm font-medium text-slate-400 mt-1">
                  {story.subtitle}
                </h4>
              </div>

              {/* Card side */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`w-full md:w-[45%] pl-6 md:pl-0 ${
                  isEven ? "md:order-2" : "md:order-1"
                }`}
              >
                <div
                  className={`glass-panel p-6 rounded-2xl border ${story.borderColor} bg-gradient-to-br ${story.color}`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg bg-slate-950/60 ${story.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">Narrative Case Study</span>
                  </div>
                  {story.content}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
