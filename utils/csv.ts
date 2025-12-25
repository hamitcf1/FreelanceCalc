import { HistoryEntry } from '../types';

export const exportHistoryToCSV = (history: HistoryEntry[]) => {
  if (!history.length) return;

  const headers = [
    'Date',
    'Currency',
    'Local Currency',
    'Hourly Rate',
    'Hours',
    'Gross',
    'Service Fee %',
    'Service Fee Amt',
    'VAT %',
    'VAT Amt',
    'Withdrawal Fee',
    'Net (Original)',
    'Exchange Rate',
    'Net (Local)',
    'Target Net',
    'Hours Required',
  ];

  const rows = history.map((entry) => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    const currency = entry.inputs.currency || 'USD';
    const localCurrency = entry.inputs.localCurrency || 'N/A';

    return [
      date,
      currency,
      localCurrency,
      entry.inputs.hourlyRate.toFixed(2),
      entry.inputs.hoursWorked.toFixed(2),
      entry.gross.toFixed(2),
      entry.inputs.serviceFeeRate.toFixed(2),
      entry.serviceFeeAmount.toFixed(2),
      entry.inputs.vatRate.toFixed(2),
      entry.vatAmount.toFixed(2),
      entry.withdrawalFee.toFixed(2),
      entry.net.toFixed(2),
      entry.inputs.exchangeRate.toFixed(4),
      entry.netInLocalCurrency.toFixed(2),
      entry.inputs.targetNet?.toFixed(2) || '',
      entry.hoursRequired?.toFixed(2) || '',
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `payout_history_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};