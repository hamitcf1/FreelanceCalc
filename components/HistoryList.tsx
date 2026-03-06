import React from 'react';
import { HistoryEntry } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Trash2, Download, Table, RotateCcw } from 'lucide-react';
import { exportHistoryToCSV } from '../utils/csv';
import Button from './Button';

interface HistoryListProps {
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onDelete, onClear, onRestore }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 glass rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 transition-all">
        <div className="bg-gray-100 dark:bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Table className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Empty Vault</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm font-medium">Your calculation history is waiting. Save your first entry to see it here.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="p-6 border-b border-white/20 dark:border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/40 dark:bg-gray-900/40">
        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
          <span className="bg-indigo-500/10 text-indigo-500 p-2 rounded-xl">
            <Table className="w-5 h-5" />
          </span>
          History
          <span className="ml-1 px-2.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full text-[10px] font-black opacity-50">
            {history.length}
          </span>
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => exportHistoryToCSV(history)} icon={Download}>
            CSV
          </Button>
          <Button size="sm" variant="danger" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
          <thead className="bg-gray-50/20 dark:bg-gray-900/10">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Added</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Net</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {history.map((entry) => {
              const currency = entry.inputs.currency || 'USD';
              return (
                <tr key={entry.id} className="group hover:bg-white/40 dark:hover:bg-gray-800/20 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {formatCurrency(entry.gross, currency)}
                    </div>
                    <div className="text-[10px] font-black text-rose-500 opacity-60 uppercase">
                      -{formatCurrency(entry.totalDeductions, currency)}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(entry.net, currency)}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 rounded-xl hover:bg-indigo-500/10 text-indigo-500"
                        onClick={() => onRestore(entry)}
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-10 h-10 p-0 rounded-xl hover:bg-rose-500/10 text-rose-500"
                        onClick={() => onDelete(entry.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;