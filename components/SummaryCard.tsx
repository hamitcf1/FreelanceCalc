import React, { useState } from 'react';
import { CalculationResults } from '../types';
import { formatCurrency } from '../utils/calculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Save, Clock, Sunrise, Copy, Check } from 'lucide-react';
import Button from './Button';
import { ToastType } from './Toast';

interface SummaryCardProps {
  results: CalculationResults;
  onSave: () => void;
  canSave: boolean;
  currency: string;
  localCurrency: string;
  mode: 'payout' | 'target';
  addToast: (message: string, type: ToastType) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ results, onSave, canSave, currency, localCurrency, mode, addToast }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
--- Freelance Payout Pro Summary ---
Mode: ${mode === 'payout' ? 'Payout Analysis' : 'Target Path'}
Gross: ${formatCurrency(results.gross, currency)}
Deductions: ${formatCurrency(results.totalDeductions, currency)}
Net Payout: ${formatCurrency(results.net, currency)}
${mode === 'target' ? `Hours Req: ${results.hoursRequired?.toFixed(1)} hrs\nDaily: ${results.hoursPerDay?.toFixed(1)} hrs/day` : ''}
------------------------------------
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const data = [
    { name: 'Net Income', value: results.net, color: '#10b981' },
    { name: 'Service Fee', value: results.serviceFeeAmount, color: '#6366f1' },
    { name: 'VAT', value: results.vatAmount, color: '#f43f5e' },
    { name: 'Withdrawal', value: results.withdrawalFee, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const isTargetMode = mode === 'target';
  const showLocalCurrency = results.netInLocalCurrency !== results.net && !!localCurrency;

  return (
    <div className="glass rounded-3xl overflow-hidden sticky top-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="p-6 bg-white/40 dark:bg-gray-900/40 border-b border-white/20 dark:border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full animate-pulse" />
          {isTargetMode ? 'Analysis' : 'Summary'}
        </h2>
        <button
          onClick={handleCopy}
          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-500 transition-all active:scale-90 shadow-sm border border-transparent hover:border-indigo-500/20"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-6">
          {isTargetMode ? (
            <div className="grid grid-cols-1 gap-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Total Hours</p>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-indigo-500" />
                  <p className="text-5xl font-black text-gray-900 dark:text-white tabular-nums">
                    {results.hoursRequired?.toFixed(1) || '0.0'}
                    <span className="text-sm font-bold text-indigo-400 ml-1 uppercase">hrs</span>
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Daily Cap</p>
                <div className="flex items-center space-x-3">
                  <Sunrise className="w-6 h-6 text-amber-500" />
                  <p className="text-5xl font-black text-gray-900 dark:text-white tabular-nums">
                    {results.hoursPerDay?.toFixed(1) || '0.0'}
                    <span className="text-sm font-bold text-amber-400 ml-1 uppercase">h/d</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative p-7 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 group">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Net Result</p>
              <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(results.net, currency)}
              </p>
              {showLocalCurrency && (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                  <p className="text-base font-bold text-emerald-500 dark:text-emerald-400 tabular-nums lowercase px-2 py-0.5 bg-emerald-500/10 rounded-full">
                    ≈ {formatCurrency(results.netInLocalCurrency, localCurrency)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{isTargetMode ? 'Gross Target' : 'Gross Total'}</span>
            <span className="text-lg font-black text-gray-800 dark:text-white">{formatCurrency(results.gross, currency)}</span>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-gray-50/30 dark:bg-gray-800/30 border border-white/10">
            <div className="flex justify-between items-center text-xs font-black text-rose-500 uppercase tracking-widest">
              <span>Total Fees</span>
              <span>- {formatCurrency(results.totalDeductions, currency)}</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 pl-3 border-l-2 border-rose-500/20">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Platform</span>
                <span>{formatCurrency(results.serviceFeeAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Tax / VAT</span>
                <span>{formatCurrency(results.vatAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Withdrawal</span>
                <span>{formatCurrency(results.withdrawalFee, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64 w-full -mx-4 group relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={85}
                paddingAngle={5} dataKey="value"
                stroke="none"
                animationDuration={1500}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-all cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => formatCurrency(val, currency)}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'rgba(31, 41, 55, 0.95)',
                  backdropFilter: 'blur(12px)',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Net</span>
            <span className="text-xl font-black text-emerald-500">{((results.net / results.gross) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <Button
          onClick={onSave}
          disabled={!canSave}
          className="w-full text-base py-4 py-4 uppercase tracking-[0.2em]"
          icon={Save}
        >
          Secure Entry
        </Button>
      </div>
    </div>
  );
};

export default SummaryCard;