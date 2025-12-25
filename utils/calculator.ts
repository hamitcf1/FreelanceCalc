import { CalculatorInputs, CalculationResults } from '../types';

export const calculatePayout = (inputs: CalculatorInputs): CalculationResults => {
  const {
    hourlyRate,
    hoursWorked,
    serviceFeeRate,
    vatRate,
    withdrawalFee,
    exchangeRate,
  } = inputs;

  const gross = hourlyRate * hoursWorked;
  const serviceFeeAmount = gross * (serviceFeeRate / 100);
  const vatAmount = serviceFeeAmount * (vatRate / 100);
  const subtotal = gross - serviceFeeAmount - vatAmount;
  
  // Ensure we don't go below zero for net if fees are high
  const net = Math.max(0, subtotal - withdrawalFee);
  const totalDeductions = serviceFeeAmount + vatAmount + withdrawalFee;
  
  const netInLocalCurrency = net * (exchangeRate || 1);

  return {
    gross,
    serviceFeeAmount,
    vatAmount,
    subtotal,
    withdrawalFee,
    totalDeductions,
    net,
    netInLocalCurrency,
  };
};

export const calculateTargetHours = (inputs: CalculatorInputs): CalculationResults => {
    const {
        targetNet = 0,
        hourlyRate,
        serviceFeeRate,
        vatRate,
        withdrawalFee,
        workingDaysPerWeek,
    } = inputs;

    // Formula derivation:
    // Net = Gross - ServiceFee - VatOnFee - WithdrawalFee
    // ServiceFee = Gross * S
    // VatOnFee = ServiceFee * V = Gross * S * V
    // Net = Gross - (Gross * S) - (Gross * S * V) - WithdrawalFee
    // Net + WithdrawalFee = Gross * (1 - S - S*V)
    // Gross = (Net + WithdrawalFee) / (1 - S * (1 + V))
    
    const s = serviceFeeRate / 100;
    const v = vatRate / 100;
    const divisor = 1 - (s * (1 + v));
    
    // Guard against division by zero or negative divisor (if fees > 100%)
    if (divisor <= 0 || hourlyRate <= 0) {
         return {
            gross: 0,
            serviceFeeAmount: 0,
            vatAmount: 0,
            subtotal: 0,
            withdrawalFee,
            totalDeductions: 0,
            net: 0,
            netInLocalCurrency: 0,
            hoursRequired: 0,
            hoursPerDay: 0,
        };
    }

    const grossRequired = (targetNet + withdrawalFee) / divisor;
    const hoursRequired = grossRequired / hourlyRate;
    
    // Calculate daily hours, ensuring no division by zero
    const hoursPerDay = (workingDaysPerWeek > 0) ? (hoursRequired / workingDaysPerWeek) : 0;

    // reuse calculatePayout to get the exact breakdown for this gross amount
    const breakdown = calculatePayout({
        ...inputs,
        hoursWorked: hoursRequired
    });

    return {
        ...breakdown,
        hoursRequired,
        hoursPerDay,
    };
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};