import React, { useState } from 'react';
import { CalculationResults, CalculatorInputs } from '../types';
import { formatCurrency } from '../utils/calculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Save, Clock, Sunrise, Copy, Check, TrendingUp, Zap, Calendar } from 'lucide-react';
import Button from './Button';
import { ToastType } from './Toast';

interface SummaryCardProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
  onSave: () => void;
  canSave: boolean;
  currency: string;
  localCurrency: string;
  mode: 'payout' | 'target';
  addToast: (message: string, type: ToastType) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ results, inputs, onSave, canSave, currency, localCurrency, mode, addToast }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
--- Freelance Payout Pro Summary ---
Mode: ${mode === 'payout' ? 'Payout Analysis' : 'Target Path'}
Gross: ${formatCurrency(results.gross, currency)}
Deductions: ${formatCurrency(results.totalDeductions, currency)}
Net Payout: ${formatCurrency(results.net, currency)}
Effective Rate: ${formatCurrency(results.effectiveHourlyRate, currency)}/hr
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

  // Projections (based on current payout per-session)
  const WEEKS_PER_MONTH = 4.33;
  const weeklyNet = results.net; // assumes hoursWorked is weekly
  const monthlyNet = weeklyNet * WEEKS_PER_MONTH;
  const yearlyNet = monthlyNet * 12;

  return (
    <div className="glass rounded-3xl overflow-hidden sticky top-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="p-5 bg-white/40 dark:bg-gray-900/40 border-b border-white/20 dark:border-white/5 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full animate-pulse" />
          {isTargetMode ? 'Analysis' : 'Summary'}
        </h2>
        <button
          onClick={handleCopy}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-500 transition-all active:scale-90 shadow-sm border border-transparent hover:border-indigo-500/20"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {isTargetMode ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Total Hours</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                    {results.hoursRequired?.toFixed(1) || '0.0'}
                    <span className="text-[10px] font-bold text-indigo-400 ml-0.5 uppercase">hrs</span>
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Daily Cap</p>
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                    {results.hoursPerDay?.toFixed(1) || '0.0'}
                    <span className="text-[10px] font-bold text-amber-400 ml-0.5 uppercase">h/d</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Net Result</p>
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(results.net, currency)}
              </p>
              {showLocalCurrency && (
                <p className="text-sm font-bold text-emerald-500/60 dark:text-emerald-400/60 tabular-nums mt-1">
                  ≈ {formatCurrency(results.netInLocalCurrency, localCurrency)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Effective Hourly Rate */}
        {results.effectiveHourlyRate > 0 && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-violet-50/50 dark:bg-violet-900/15 border border-violet-200/50 dark:border-violet-800/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-500" />
              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">Effective Rate</span>
            </div>
            <span className="text-lg font-black text-violet-600 dark:text-violet-400 tabular-nums">
              {formatCurrency(results.effectiveHourlyRate, currency)}<span className="text-[10px] font-bold opacity-60">/hr</span>
            </span>
          </div>
        )}

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{isTargetMode ? 'Gross Target' : 'Gross Total'}</span>
            <span className="text-base font-black text-gray-800 dark:text-white">{formatCurrency(results.gross, currency)}</span>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50/30 dark:bg-gray-800/30 border border-white/10">
            <div className="flex justify-between items-center text-[10px] font-black text-rose-500 uppercase tracking-widest">
              <span>Total Fees</span>
              <span>- {formatCurrency(results.totalDeductions, currency)}</span>
            </div>
            <div className="grid grid-cols-1 gap-1 pl-3 border-l-2 border-rose-500/20">
              <div className="flex justify-between text-[11px] font-bold text-gray-500">
                <span>Platform</span>
                <span>{formatCurrency(results.serviceFeeAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500">
                <span>Tax / VAT</span>
                <span>{formatCurrency(results.vatAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-gray-500">
                <span>Withdrawal</span>
                <span>{formatCurrency(results.withdrawalFee, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-44 w-full group relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={70}
                paddingAngle={5} dataKey="value"
                stroke="none"
                animationDuration={1500}
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
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Net</span>
            <span className="text-lg font-black text-emerald-500">{results.gross > 0 ? ((results.net / results.gross) * 100).toFixed(1) : '0.0'}%</span>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="grid grid-cols-2 gap-1.5 px-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Earnings Projections */}
        {!isTargetMode && results.net > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Projections</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-900/15 border border-cyan-100/50 dark:border-cyan-800/30 text-center">
                <p className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-0.5">Weekly</p>
                <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{formatCurrency(weeklyNet, currency)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-900/15 border border-cyan-100/50 dark:border-cyan-800/30 text-center">
                <p className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-0.5">Monthly</p>
                <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{formatCurrency(monthlyNet, currency)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-900/15 border border-cyan-100/50 dark:border-cyan-800/30 text-center">
                <p className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-0.5">Yearly</p>
                <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">{formatCurrency(yearlyNet, currency)}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={onSave}
          disabled={!canSave}
          className="w-full text-base py-4 uppercase tracking-[0.2em]"
          icon={Save}
        >
          Secure Entry
        </Button>
      </div>
    </div>
  );
};

export default SummaryCard;