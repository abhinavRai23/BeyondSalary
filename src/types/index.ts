export interface SalaryRange {
  min: number;
  max: number;
}

export interface ExperienceSalaries {
  junior: number;
  mid: number;
  senior: number;
  lead: number;
}

export interface CountryData {
  name: string;
  code: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 currency unit = X USD
  averageSalary: number; // in local currency (senior default)
  experienceSalaries: ExperienceSalaries; // salaries by experience level
  salaryRange: SalaryRange; // in local currency (overall range)
  taxPercentage: number; // average effective tax rate for engineer salary
  rentIndex: number; // 0 to 100 score representing rent cost relative to NY
  averageRentLocal: number; // average 1-bed apartment rent in city center (local currency)
  monthlyExpensesLocal: number; // other local living costs (excluding rent) in local currency
  yearlyVacationDays: number; // mandatory paid leave + public holidays
  avgWorkingHours: number; // average weekly hours worked by tech professionals
  layoffProtectionScore: number; // 1 (lowest) to 10 (highest)
  healthcareScore: number; // 1 to 10
  happinessScore: number; // 1 to 10
  safetyScore: number; // 1 to 10
  transportScore: number; // 1 to 10
  remoteWorkScore: number; // 1 to 10
  airQualityScore: number; // 1 to 10 (1 = poor/polluted, 10 = pristine)
  engineerDemand: "Low" | "Moderate" | "High" | "Very High";
  noticePeriod: string; // e.g., "3 Months", "2 Weeks"
  burnoutRisk: "Low" | "Medium" | "High" | "Very High";
  burnoutScore: number; // 1 to 10 representing risk
  visaInfo: string;
  prPathway: string;
  pros: string[];
  cons: string[];
  layoffBenefits: string;
  healthcareFriction: string;
  legalEfficiency: string;
  transportDetails: string;
  socialSecurityPercent: number; // employer+employee social tax
}
