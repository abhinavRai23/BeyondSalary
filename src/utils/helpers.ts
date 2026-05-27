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
  AUD: 0.66,
  AED: 0.272,
  JPY: 0.0064,
  PLN: 0.25,
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
  AUD: "A$",
  AED: "dh",
  JPY: "¥",
  PLN: "zł",
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
 * Calculates progressive income tax + social security contributions for a country
 * based on realistic local single filer tax brackets and deductions.
 */
export function calculateProgressiveTax(countryCode: string, salary: number): number {
  if (salary <= 0) return 0;

  switch (countryCode) {
    case "IN": { // India
      // FY 2024-25 / FY 2025-26 New Tax Regime
      // Standard Deduction: ₹75,000
      const taxableSalary = Math.max(0, salary - 75000);
      let tax = 0;
      if (taxableSalary <= 700000) {
        // Tax rebate under Section 87A: Nil tax up to 7L taxable income
        return 0;
      }
      
      const brackets = [
        { limit: 300000, rate: 0.00 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ];
      
      let prevLimit = 0;
      for (const bracket of brackets) {
        if (taxableSalary > prevLimit) {
          const range = Math.min(taxableSalary, bracket.limit) - prevLimit;
          tax += range * bracket.rate;
          prevLimit = bracket.limit;
        } else {
          break;
        }
      }
      
      // Surcharge
      let surcharge = 0;
      if (taxableSalary > 10000000) {
        surcharge = tax * 0.15;
      } else if (taxableSalary > 5000000) {
        surcharge = tax * 0.10;
      }
      
      // Health and Education Cess: 4% on (tax + surcharge)
      const totalTax = (tax + surcharge) * 1.04;
      return totalTax;
    }
    
    case "DE": { // Germany (Single, Tax Class I)
      // Standard deduction (Grundfreibetrag): €11,784 + €1000 work expenses
      // Pension/Unemployment (employee portion): ~10.5% capped at €90k gross
      // Health/Care (employee portion): ~9.5% capped at €62.1k gross
      const grossForPension = Math.min(salary, 90000);
      const grossForHealth = Math.min(salary, 62100);
      const socialSecurity = (grossForPension * 0.105) + (grossForHealth * 0.095);
      
      const taxableIncome = Math.max(0, salary - 11784 - 1000);
      let incomeTax = 0;
      
      if (taxableIncome > 0) {
        if (taxableIncome <= 16000) {
          incomeTax = taxableIncome * 0.14;
        } else if (taxableIncome <= 66760) {
          // linear progression from 14% to 42%
          incomeTax = 16000 * 0.14 + (taxableIncome - 16000) * 0.32;
        } else if (taxableIncome <= 277825) {
          incomeTax = 16000 * 0.14 + (66760 - 16000) * 0.32 + (taxableIncome - 66760) * 0.42;
        } else {
          incomeTax = 16000 * 0.14 + (66760 - 16000) * 0.32 + (277825 - 66760) * 0.42 + (taxableIncome - 277825) * 0.45;
        }
      }
      
      let solid = 0;
      if (incomeTax > 18130) {
        solid = incomeTax * 0.055;
      }
      
      return incomeTax + solid + socialSecurity;
    }
    
    case "NL": { // Netherlands
      // Box 1 work income (2024):
      // Up to €75,518: 36.97%
      // Above €75,518: 49.50%
      let rawTax = 0;
      if (salary <= 75518) {
        rawTax = salary * 0.3697;
      } else {
        rawTax = (75518 * 0.3697) + ((salary - 75518) * 0.4950);
      }
      
      // Calculate credits
      let generalCredit = 3362;
      if (salary > 24812) {
        generalCredit = Math.max(0, 3362 - (salary - 24812) * 0.0663);
      }
      
      let laborCredit = 0;
      if (salary <= 11447) {
        laborCredit = salary * 0.08425;
      } else if (salary <= 24812) {
        laborCredit = 964 + (salary - 11447) * 0.31408;
      } else if (salary <= 42472) {
        laborCredit = 5158 + (salary - 24812) * 0.02471;
      } else {
        laborCredit = Math.max(0, 5532 - (salary - 42472) * 0.0651);
      }
      
      return Math.max(0, rawTax - generalCredit - laborCredit);
    }
    
    case "SE": { // Sweden (Single)
      // Municipal tax (average ~32%) state tax 20% on > 615,300 SEK
      const taxableIncome = Math.max(0, salary - 25000);
      let tax = taxableIncome * 0.32;
      if (taxableIncome > 615300) {
        tax += (taxableIncome - 615300) * 0.20;
      }
      return tax;
    }
    
    case "GB": { // United Kingdom
      // Personal allowance: £12,570 (reduced by £1 for every £2 of income above £100,000)
      let personalAllowance = 12570;
      if (salary > 100000) {
        personalAllowance = Math.max(0, 12570 - (salary - 100000) / 2);
      }
      
      const taxableIncome = Math.max(0, salary - personalAllowance);
      let incomeTax = 0;
      
      if (taxableIncome <= 37700) {
        incomeTax = taxableIncome * 0.20;
      } else if (taxableIncome <= 125140) {
        incomeTax = (37700 * 0.20) + ((taxableIncome - 37700) * 0.40);
      } else {
        incomeTax = (37700 * 0.20) + ((125140 - 37700) * 0.40) + ((taxableIncome - 125140) * 0.45);
      }
      
      // National Insurance (NI) Class 1
      let ni = 0;
      if (salary > 12570) {
        const niBasic = Math.min(salary, 50270) - 12570;
        ni += niBasic * 0.08;
        if (salary > 50270) {
          ni += (salary - 50270) * 0.02;
        }
      }
      
      return incomeTax + ni;
    }
    
    case "CA": { // Canada (Ontario)
      // Federal tax 2024:
      const fedTaxable = Math.max(0, salary - 15705);
      let fedTax = 0;
      const fedBrackets = [
        { limit: 55867, rate: 0.15 },
        { limit: 111733, rate: 0.205 },
        { limit: 173205, rate: 0.26 },
        { limit: 246752, rate: 0.29 },
        { limit: Infinity, rate: 0.33 }
      ];
      let prevLimit = 0;
      for (const b of fedBrackets) {
        if (fedTaxable > prevLimit) {
          const range = Math.min(fedTaxable, b.limit) - prevLimit;
          fedTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      // Ontario Tax 2024:
      const provTaxable = Math.max(0, salary - 12399);
      let provTax = 0;
      const provBrackets = [
        { limit: 51446, rate: 0.0505 },
        { limit: 102894, rate: 0.0915 },
        { limit: 150000, rate: 0.1116 },
        { limit: 220000, rate: 0.1216 },
        { limit: Infinity, rate: 0.1316 }
      ];
      prevLimit = 0;
      for (const b of provBrackets) {
        if (provTaxable > prevLimit) {
          const range = Math.min(provTaxable, b.limit) - prevLimit;
          provTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      // CPP + EI
      const cpp = Math.min(3867, Math.max(0, salary - 3500) * 0.0595);
      const ei = Math.min(1049, salary * 0.0166);
      
      return fedTax + provTax + cpp + ei;
    }
    
    case "US": { // United States (California)
      const fedTaxable = Math.max(0, salary - 14600);
      let fedTax = 0;
      const fedBrackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];
      let prevLimit = 0;
      for (const b of fedBrackets) {
        if (fedTaxable > prevLimit) {
          const range = Math.min(fedTaxable, b.limit) - prevLimit;
          fedTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      const caTaxable = Math.max(0, salary - 5363);
      let caTax = 0;
      const caBrackets = [
        { limit: 10412, rate: 0.01 },
        { limit: 24684, rate: 0.02 },
        { limit: 38959, rate: 0.04 },
        { limit: 54081, rate: 0.06 },
        { limit: 68350, rate: 0.08 },
        { limit: 349137, rate: 0.093 },
        { limit: 418961, rate: 0.103 },
        { limit: 698271, rate: 0.113 },
        { limit: Infinity, rate: 0.123 }
      ];
      prevLimit = 0;
      for (const b of caBrackets) {
        if (caTaxable > prevLimit) {
          const range = Math.min(caTaxable, b.limit) - prevLimit;
          caTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      const socSec = Math.min(salary, 168600) * 0.062;
      const medicare = salary * 0.0145 + (salary > 200000 ? (salary - 200000) * 0.009 : 0);
      
      return fedTax + caTax + socSec + medicare;
    }
    
    case "CH": { // Switzerland (Zurich)
      const socSec = salary * 0.064;
      const taxable = Math.max(0, salary - 15000);
      
      let taxRate = 0.05;
      if (taxable > 250000) taxRate = 0.20;
      else if (taxable > 150000) taxRate = 0.16;
      else if (taxable > 100000) taxRate = 0.12;
      else if (taxable > 50000) taxRate = 0.08;
      
      return (taxable * taxRate) + socSec;
    }
    
    case "SG": { // Singapore
      let tax = 0;
      const brackets = [
        { limit: 20000, rate: 0.00 },
        { limit: 30000, rate: 0.02 },
        { limit: 40000, rate: 0.035 },
        { limit: 80000, rate: 0.07 },
        { limit: 120000, rate: 0.115 },
        { limit: 160000, rate: 0.15 },
        { limit: 200000, rate: 0.18 },
        { limit: 240000, rate: 0.19 },
        { limit: 280000, rate: 0.195 },
        { limit: 320000, rate: 0.20 },
        { limit: Infinity, rate: 0.22 }
      ];
      let prevLimit = 0;
      for (const b of brackets) {
        if (salary > prevLimit) {
          const range = Math.min(salary, b.limit) - prevLimit;
          tax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      return tax;
    }
    
    case "AU": { // Australia
      let tax = 0;
      const brackets = [
        { limit: 18200, rate: 0.00 },
        { limit: 45000, rate: 0.16 },
        { limit: 135000, rate: 0.30 },
        { limit: 190000, rate: 0.37 },
        { limit: Infinity, rate: 0.45 }
      ];
      let prevLimit = 0;
      for (const b of brackets) {
        if (salary > prevLimit) {
          const range = Math.min(salary, b.limit) - prevLimit;
          tax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      const medicare = salary * 0.02;
      return tax + medicare;
    }
    
    case "IE": { // Ireland
      let incomeTax = 0;
      if (salary <= 42000) {
        incomeTax = salary * 0.20;
      } else {
        incomeTax = (42000 * 0.20) + ((salary - 42000) * 0.40);
      }
      
      let usc = 0;
      const uscBrackets = [
        { limit: 12012, rate: 0.005 },
        { limit: 25760, rate: 0.02 },
        { limit: 70044, rate: 0.04 },
        { limit: Infinity, rate: 0.08 }
      ];
      let prevLimit = 0;
      for (const b of uscBrackets) {
        if (salary > prevLimit) {
          const range = Math.min(salary, b.limit) - prevLimit;
          usc += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      const prsi = salary * 0.04;
      return incomeTax + usc + prsi;
    }
    
    case "AE": { // UAE
      return 0;
    }
    
    case "JP": { // Japan
      let deduction = 0;
      if (salary <= 1800000) deduction = salary * 0.40 - 100000;
      else if (salary <= 3600000) deduction = salary * 0.30 + 80000;
      else if (salary <= 6600000) deduction = salary * 0.20 + 440000;
      else if (salary <= 8500000) deduction = salary * 0.10 + 1100000;
      else deduction = 1950000;
      
      const taxable = Math.max(0, salary - deduction - 480000);
      
      let natTax = 0;
      const brackets = [
        { limit: 1950000, rate: 0.05 },
        { limit: 3300000, rate: 0.10 },
        { limit: 6950000, rate: 0.20 },
        { limit: 9000000, rate: 0.23 },
        { limit: 18000000, rate: 0.33 },
        { limit: 40000000, rate: 0.40 },
        { limit: Infinity, rate: 0.45 }
      ];
      let prevLimit = 0;
      for (const b of brackets) {
        if (taxable > prevLimit) {
          const range = Math.min(taxable, b.limit) - prevLimit;
          natTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      const resTax = taxable * 0.10;
      const socIns = Math.min(salary * 0.15, 1600000);
      return natTax + resTax + socIns;
    }
    
    case "PL": { // Poland
      const zus = Math.min(salary, 263000) * 0.1371;
      const nfz = (salary - zus) * 0.09;
      
      const taxable = Math.max(0, salary - zus - 3000);
      let incomeTax = 0;
      if (taxable > 120000) {
        incomeTax = (120000 * 0.12 - 3600) + (taxable - 120000) * 0.32;
      } else if (taxable > 30000) {
        incomeTax = taxable * 0.12 - 3600;
      }
      
      return Math.max(0, incomeTax) + zus + nfz;
    }
    
    case "FR": { // France
      const socialContr = salary * 0.22;
      const taxable = Math.max(0, salary - socialContr - 1000);
      
      let incomeTax = 0;
      const brackets = [
        { limit: 11294, rate: 0.00 },
        { limit: 28797, rate: 0.11 },
        { limit: 82341, rate: 0.30 },
        { limit: 177106, rate: 0.41 },
        { limit: Infinity, rate: 0.45 }
      ];
      let prevLimit = 0;
      for (const b of brackets) {
        if (taxable > prevLimit) {
          const range = Math.min(taxable, b.limit) - prevLimit;
          incomeTax += range * b.rate;
          prevLimit = b.limit;
        } else break;
      }
      
      return incomeTax + socialContr;
    }
    
    default:
      return salary * 0.25;
  }
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
  effectiveTaxRate: number;
}

export function calculateBreakdown(
  country: CountryData,
  customSalaryLocal?: number
): FinancialBreakdown {
  const salary = customSalaryLocal ?? country.averageSalary;
  const tax = calculateProgressiveTax(country.code, salary);
  const rent = country.averageRentLocal * 12;
  const expenses = country.monthlyExpensesLocal * 12;
  const savings = salary - tax - rent - expenses;
  const savingsPercent = salary > 0 ? (savings / salary) * 100 : 0;
  const effectiveTaxRate = salary > 0 ? (tax / salary) * 100 : 0;

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
    effectiveTaxRate,
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
