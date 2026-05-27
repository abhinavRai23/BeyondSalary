"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CountryData } from "@/types";
import { calculateBreakdown, formatCurrencyValue } from "@/utils/helpers";
import countriesData from "@/data/countries.json";

const countries = countriesData as CountryData[];

interface VisualizerProps {
  selectedCountries: string[]; // Country codes, e.g., ["IN", "DE"]
  experienceLevel: "junior" | "mid" | "senior" | "lead";
}

export default function MetricsVisualizer({ selectedCountries, experienceLevel }: VisualizerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-slate-950/20 rounded-2xl border border-slate-800/50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500 font-mono">Loading Interactive Charts...</span>
        </div>
      </div>
    );
  }

  // Filter countries data based on selected
  const activeCountries = countries.filter((c) =>
    selectedCountries.includes(c.code)
  );

  // Prepare savings potential data
  const savingsData = countries.map((c) => {
    const breakdown = calculateBreakdown(c, c.experienceSalaries[experienceLevel]);
    return {
      name: c.name,
      flag: c.flag,
      savingsUSD: Math.round(breakdown.savingsUSD),
      salaryUSD: Math.round(breakdown.salaryUSD),
      taxUSD: Math.round(breakdown.taxUSD),
      rentUSD: Math.round(breakdown.rentUSD),
      expensesUSD: Math.round(breakdown.expensesUSD),
      isSelect: selectedCountries.includes(c.code),
    };
  }).sort((a, b) => b.savingsUSD - a.savingsUSD);

  // Prepare Culture comparison data
  const cultureData = activeCountries.map((c) => ({
    name: c.name,
    "Weekly Working Hours": c.avgWorkingHours,
    "Yearly Paid Vacation (Days)": c.yearlyVacationDays,
    "Burnout Risk Score": c.burnoutScore,
  }));

  // Prepare Radar Chart data
  // Dimensions: Happiness, Healthcare, Safety, Layoff Protection, Remote Work, Transport
  const radarDimensions = [
    { subject: "Happiness", fullMark: 10 },
    { subject: "Healthcare", fullMark: 10 },
    { subject: "Safety", fullMark: 10 },
    { subject: "Layoff Protection", fullMark: 10 },
    { subject: "Remote Friendly", fullMark: 10 },
    { subject: "Infrastructure", fullMark: 10 },
  ];

  const radarData = radarDimensions.map((dim) => {
    const row: Record<string, any> = { subject: dim.subject };
    activeCountries.forEach((c) => {
      let score = 5;
      if (dim.subject === "Happiness") score = c.happinessScore;
      else if (dim.subject === "Healthcare") score = c.healthcareScore;
      else if (dim.subject === "Safety") score = c.safetyScore;
      else if (dim.subject === "Layoff Protection") score = c.layoffProtectionScore;
      else if (dim.subject === "Remote Friendly") score = c.remoteWorkScore;
      else if (dim.subject === "Infrastructure") score = c.transportScore;
      
      row[c.name] = score;
    });
    return row;
  });

  // Custom tooltips
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-4 rounded-xl border-brand-border text-xs space-y-1">
          <p className="font-bold text-slate-200">
            {data.flag} {data.name}
          </p>
          <div className="h-px bg-slate-800 my-1" />
          <p className="text-emerald-400">
            Net Savings: <span className="font-mono font-bold">{formatCurrencyValue(data.savingsUSD, "USD", false)}</span>
          </p>
          <p className="text-indigo-400">
            Avg Salary: <span className="font-mono">{formatCurrencyValue(data.salaryUSD, "USD", false)}</span>
          </p>
          <p className="text-rose-400">
            Income Tax: <span className="font-mono">{formatCurrencyValue(data.taxUSD, "USD", false)}</span>
          </p>
          <p className="text-amber-400">
            Yearly Rent: <span className="font-mono">{formatCurrencyValue(data.rentUSD, "USD", false)}</span>
          </p>
          <p className="text-sky-400">
            Expenses: <span className="font-mono">{formatCurrencyValue(data.expensesUSD, "USD", false)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const colors = ["#6366f1", "#10b981", "#ec4899", "#f59e0b", "#3b82f6", "#ef4444"];

  return (
    <div className="space-y-12">
      {/* 1. Savings Potential Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border-brand-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            Global Liquid Savings Potential (USD Equivalent)
          </h3>
          <p className="text-sm text-slate-400">
            Estimated actual net savings left in your bank account per year after tax, rent, and necessities.
          </p>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart
              id="savings-bar-chart"
              data={savingsData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `$${v / 1000}k`}
                axisLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="savingsUSD"
                radius={[0, 6, 6, 0]}
                fill="#6366f1"
                maxBarSize={28}
              >
                {savingsData.map((entry, index) => (
                  <rect
                    key={`rect-${index}`}
                    fill={entry.isSelect ? "#10b981" : "rgba(99, 102, 241, 0.45)"}
                    stroke={entry.isSelect ? "#34d399" : "transparent"}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end gap-6 text-xs text-slate-500 mt-2 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500/40" />
            <span>Benchmark Countries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400" />
            <span>Your Selected Countries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Radar Chart - Quality of Life */}
        <div className="glass-panel p-6 rounded-2xl border-brand-border flex flex-col min-w-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              Quality of Life Dimensions
            </h3>
            <p className="text-sm text-slate-400">
              Comparing happiness, healthcare, safety, remote capability, and social safety nets.
            </p>
          </div>

          {activeCountries.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-mono py-12">
              Select countries from the dashboard to compare quality of life.
            </div>
          ) : (
            <div className="h-[320px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RadarChart id="qol-radar-chart" cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  {activeCountries.map((c, index) => (
                    <Radar
                      key={c.code}
                      name={`${c.flag} ${c.name}`}
                      dataKey={c.name}
                      stroke={colors[index % colors.length]}
                      fill={colors[index % colors.length]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11, color: "#cbd5e1", paddingTop: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(13, 13, 16, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      color: "#cbd5e1",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 3. Culture Comparison Chart */}
        <div className="glass-panel p-6 rounded-2xl border-brand-border flex flex-col min-w-0">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              Work Hours vs Paid Vacation
            </h3>
            <p className="text-sm text-slate-400">
              The time trade-off: average weekly hours worked by tech employees vs statutory annual holiday days.
            </p>
          </div>

          {activeCountries.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-mono py-12">
              Select countries from the dashboard to view culture comparison.
            </div>
          ) : (
            <div className="h-[320px] w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  id="culture-bar-chart"
                  data={cultureData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(13, 13, 16, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                  <Bar
                    dataKey="Weekly Working Hours"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="Yearly Paid Vacation (Days)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
