import { CountryData } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Exchange rate mapping relative to USD (1 unit of currency = X USD)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.73,
  SEK: 0.094,
  INR: 0.012,
  CHF: 1.09,
  SGD: 0.74,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "$",
  SEK: "kr",
  INR: "₹",
  CHF: "Fr.",
  SGD: "S$",
};

/**
 * Converts a value from a source currency to a target currency via USD.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1.0;
  const toRate = EXCHANGE_RATES[toCurrency] || 1.0;
  
  // Convert from source to USD
  const amountInUSD = amount * fromRate;
  
  // Convert from USD to target
  return amountInUSD / toRate;
}

/**
 * Calculates financial breakdown for a country based on custom salary.
 */
export interface FinancialBreakdown {
  salaryLocal: number;
  salaryUSD: number;
  taxLocal: number;
  taxUSD: number;
  rentLocal: number;
  rentUSD: number;
  expensesLocal: number;
  expensesUSD: number;
  savingsLocal: number;
  savingsUSD: number;
  savingsPercent: number;
}

export function calculateBreakdown(
  country: CountryData,
  customSalaryLocal?: number
): FinancialBreakdown {
  const salary = customSalaryLocal ?? country.averageSalary;
  const tax = salary * (country.taxPercentage / 100);
  const rent = country.averageRentLocal * 12;
  const expenses = country.monthlyExpensesLocal * 12;
  const savings = salary - tax - rent - expenses;
  const savingsPercent = salary > 0 ? (savings / salary) * 100 : 0;

  const rate = country.exchangeRateToUSD;
  
  return {
    salaryLocal: salary,
    salaryUSD: salary * rate,
    taxLocal: tax,
    taxUSD: tax * rate,
    rentLocal: rent,
    rentUSD: rent * rate,
    expensesLocal: expenses,
    expensesUSD: expenses * rate,
    savingsLocal: savings,
    savingsUSD: savings * rate,
    savingsPercent,
  };
}

/**
 * Formats a currency amount to a clean string with suffixes like K or L.
 */
export function formatCurrencyValue(
  value: number,
  currencyCode: string,
  compact: boolean = true
): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  
  if (compact) {
    if (currencyCode === "INR") {
      // Format in Lakhs (L) for Indian rupees if value is >= 100,000
      if (Math.abs(value) >= 100000) {
        const lakhs = value / 100000;
        return `${symbol}${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
      }
      if (Math.abs(value) >= 1000) {
        return `${symbol}${(value / 1000).toFixed(0)}k`;
      }
      return `${symbol}${value.toFixed(0)}`;
    } else {
      // Format in Thousands (k) or Millions (M) for western currencies
      if (Math.abs(value) >= 1000000) {
        const millions = value / 1000000;
        return `${symbol}${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
      }
      if (Math.abs(value) >= 1000) {
        const thousands = value / 1000;
        return `${symbol}${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}k`;
      }
      return `${symbol}${value.toFixed(0)}`;
    }
  }

  // Non-compact standard formatting
  return `${symbol}${Math.round(value).toLocaleString(
    currencyCode === "INR" ? "en-IN" : "en-US"
  )}`;
}
