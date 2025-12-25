export interface CalculatorInputs {
  hourlyRate: number;
  hoursWorked: number;
  serviceFeeRate: number; // Percentage
  vatRate: number; // Percentage
  withdrawalFee: number; // Fixed amount
  exchangeRate: number; // 1 Unit = X Local Currency
  currency: string;
  targetNet?: number; // For reverse calculation
  workingDaysPerWeek: number; // For daily hour calculation
  localCurrency: string; // The currency for exchange rate conversion
}

export interface CalculationResults {
  gross: number;
  serviceFeeAmount: number;
  vatAmount: number;
  subtotal: number;
  withdrawalFee: number;
  totalDeductions: number;
  net: number;
  netInLocalCurrency: number;
  // Optional fields for target mode results
  hoursRequired?: number;
  hoursPerDay?: number;
}

export interface HistoryEntry extends CalculationResults {
  id: string;
  timestamp: number;
  inputs: CalculatorInputs;
}