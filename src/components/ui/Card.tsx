"use client";

import React from "react";
import { cn } from "@/utils/helpers"; // Let's define a tiny utility or just inline className mergers

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  glow = false,
  glowColor = "rgba(99, 102, 241, 0.15)",
  hoverable = true,
  ...props
}: CardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 ${
        hoverable ? "glass-panel-hover" : ""
      } relative overflow-hidden ${className}`}
      style={{
        ...(glow ? { boxShadow: `0 0 40px -5px ${glowColor}` } : {}),
      }}
      {...props}
    >
      {/* Decorative inner gradient edge */}
      <div className="absolute inset-px -z-10 rounded-[15px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
