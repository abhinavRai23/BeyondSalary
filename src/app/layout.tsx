import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeyondSalary | Software Engineer Quality of Life & Savings Comparison",
  description:
    "An interactive, premium data-journalism dashboard comparing software engineer salaries, effective tax rates, rent, vacation days, and work culture across 15 global tech hubs: India, Germany, Netherlands, Sweden, UK, Canada, USA, Switzerland, Singapore, Australia, Ireland, UAE, Japan, Poland, and France.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Inline theme-hydration script — runs synchronously before first paint to
          prevent Flash Of Unstyled Content (FOUC).

          KEY RULE: Only ever touch document.documentElement (the <html> element).
          The Tailwind v4 dark variant uses `@custom-variant dark (&:where(.dark, .dark *))`,
          which cascades the `.dark` class from <html> to every descendant automatically.
          Adding `.dark` to <body> is unnecessary and can cause a desync with
          documentElement during React hydration.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-mode') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
