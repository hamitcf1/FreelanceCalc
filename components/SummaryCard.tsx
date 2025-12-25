import React from 'react';
import { CalculationResults } from '../types';
import { formatCurrency } from '../utils/calculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Save, Clock, Sunrise } from 'lucide-react';

interface SummaryCardProps {
  results: CalculationResults;
  onSave: () => void;
  canSave: boolean;
  currency: string;
  localCurrency: string;
  mode: 'payout' | 'target';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ results, onSave, canSave, currency, localCurrency, mode }) => {
  const data = [
    { name: 'Net Income', value: results.net, color: '#10b981' }, // emerald-500
    { name: 'Service Fee', value: results.serviceFeeAmount, color: '#6366f1' }, // indigo-500
    { name: 'VAT', value: results.vatAmount, color: '#f43f5e' }, // rose-500
    { name: 'Withdrawal', value: results.withdrawalFee, color: '#f59e0b' }, // amber-500
  ].filter(item => item.value > 0);

  const isTargetMode = mode === 'target';
  const showLocalCurrency = results.netInLocalCurrency !== results.net && !!localCurrency;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6 transition-colors">
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {isTargetMode ? 'Target Analysis' : 'Payout Summary'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Big Numbers */}
        <div className="grid grid-cols-2 gap-6">
          {isTargetMode ? (
            <>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total Hours</p>
                <div className="flex items-baseline space-x-2 text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-7 h-7" />
                    <p className="text-4xl font-extrabold truncate">
                        {results.hoursRequired?.toFixed(2) || '0.00'}
                    </p>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Hours / Day</p>
                <div className="flex items-baseline space-x-2 text-amber-600 dark:text-amber-400">
                    <Sunrise className="w-7 h-7" />
                    <p className="text-4xl font-extrabold truncate">
                        {results.hoursPerDay?.toFixed(2) || '0.00'}
                    </p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 sm:col-span-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Estimated Net</p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 truncate">
                {formatCurrency(results.net, currency)}
                </p>
            </div>
          )}

          {(!isTargetMode && showLocalCurrency) && (
            <div className="col-span-2 sm:col-span-1">
               <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Net ({localCurrency})</p>
               <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 truncate">
                 {formatCurrency(results.netInLocalCurrency, localCurrency)}
               </p>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-700 my-4" />

        {/* Breakdown List */}
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>{isTargetMode ? 'Required Gross' : 'Gross Income'}</span>
                <span className="font-semibold">{formatCurrency(results.gross, currency)}</span>
            </div>
            {isTargetMode && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                    <span>Target Net</span>
                    <span className="font-semibold">{formatCurrency(results.net, currency)}</span>
                </div>
            )}
            <div className="flex justify-between items-center text-red-500 dark:text-red-400">
                <span>Service Fee</span>
                <span>- {formatCurrency(results.serviceFeeAmount, currency)}</span>
            </div>
            <div className="flex justify-between items-center text-red-500 dark:text-red-400">
                <span>VAT on Fee</span>
                <span>- {formatCurrency(results.vatAmount, currency)}</span>
            </div>
             <div className="flex justify-between items-center text-red-500 dark:text-red-400">
                <span>Withdrawal Fee</span>
                <span>- {formatCurrency(results.withdrawalFee, currency)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between items-center font-bold text-gray-800 dark:text-gray-200 text-base">
                <span>Subtotal (Before Withdraw)</span>
                <span>{formatCurrency(results.subtotal, currency)}</span>
            </div>
        </div>

        {/* Visual Chart */}
        <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#1f2937',
                            color: '#f3f4f6'
                        }}
                        itemStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ color: '#9ca3af' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Action Button */}
        <button
            onClick={onSave}
            disabled={!canSave}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Save className="w-5 h-5" />
            <span>Save Entry to History</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryCard;