import React, { useMemo, useState } from 'react';
import { CalculatorInputs, CalculationResults, HistoryEntry, PlatformPreset } from './types';
import { calculatePayout, calculateTargetHours } from './utils/calculator';
import InputField from './components/InputField';
import SummaryCard from './components/SummaryCard';
import HistoryList from './components/HistoryList';
import Button from './components/Button';
import Modal from './components/Modal';
import Select from './components/Select';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import useLocalStorageState from './hooks/useLocalStorageState';
import { decimalToTime, timeToDecimal, formatTimeInput } from './utils/time';
import {
  Calculator,
  Settings2,
  Moon,
  Sun,
  Target,
  DollarSign,
  Zap,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'TRY', 'INR', 'JPY', 'CNY', 'CHF'];
const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ label: c, value: c }));

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', TRY: '₺', INR: '₹', JPY: '¥', CNY: '¥', CHF: 'Fr'
};

const PLATFORM_PRESETS: PlatformPreset[] = [
  { name: 'Upwork', serviceFeeRate: 10, withdrawalFee: 2 },
  { name: 'Fiverr', serviceFeeRate: 20, withdrawalFee: 0 },
  { name: 'Toptal', serviceFeeRate: 0, withdrawalFee: 0 },
  { name: 'Freelancer', serviceFeeRate: 10, withdrawalFee: 1 },
];

type Tab = 'payout' | 'target';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  // --- State ---
  const [theme, setTheme] = useLocalStorageState<Theme>('app_theme', 'light');
  const [activeTab, setActiveTab] = useLocalStorageState<Tab>('app_activeTab', 'payout');

  const [inputs, setInputs] = useLocalStorageState<CalculatorInputs>('app_inputs', {
    hourlyRate: 50,
    hoursWorked: 40,
    serviceFeeRate: 10,
    vatRate: 20,
    withdrawalFee: 30,
    exchangeRate: 1,
    currency: 'USD',
    localCurrency: 'TRY',
    targetNet: 1000,
    workingDaysPerWeek: 5,
  });

  const [history, setHistory] = useLocalStorageState<HistoryEntry[]>('app_history', []);

  // Custom UI State
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hourFormat, setHourFormat] = useLocalStorageState<'decimal' | 'time'>('app_hourFormat', 'decimal');

  // --- Derived State (Calculation) ---
  const results: CalculationResults = useMemo(() => {
    if (activeTab === 'target') {
      return calculateTargetHours(inputs);
    }
    return calculatePayout(inputs);
  }, [inputs, activeTab]);

  // --- Effects ---
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // --- Helper Functions ---
  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Handlers ---
  const handleInputChange = (field: keyof CalculatorInputs) => (value: string | number) => {
    if (field === 'currency' || field === 'localCurrency') {
      setInputs(prev => ({ ...prev, [field]: String(value) }));
      return;
    }

    if (field === 'hoursWorked' && hourFormat === 'time') {
      const formatted = formatTimeInput(String(value));
      const decimal = timeToDecimal(formatted);
      setInputs(prev => ({ ...prev, hoursWorked: decimal }));
      return;
    }

    const numValue = typeof value === 'string' ? (value === '' ? 0 : parseFloat(value)) : value;

    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const applyPreset = (preset: PlatformPreset) => {
    setInputs(prev => ({
      ...prev,
      serviceFeeRate: preset.serviceFeeRate,
      withdrawalFee: preset.withdrawalFee
    }));
    addToast(`${preset.name} preset applied!`, 'info');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSave = () => {
    const newEntry: HistoryEntry = {
      ...results,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      inputs: { ...inputs },
    };
    setHistory((prev) => [newEntry, ...prev]);
    addToast('Calculation saved to history!');
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addToast('Entry removed.', 'info');
  };

  const handleRestore = (entry: HistoryEntry) => {
    setInputs(entry.inputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Historical data restored.');
  };

  const handleClearHistory = () => {
    setHistory([]);
    addToast('All history cleared.', 'error');
  };

  const currentSymbol = CURRENCY_SYMBOLS[inputs.currency] || '$';

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-500">
      <div className="mesh-gradient" />

      {/* Custom UI Elements */}
      <Toast toasts={toasts} removeToast={removeToast} />
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Wipe Local Data?"
        message="This will permanently delete all your saved historical calculations from your local storage. This action cannot be undone."
        onConfirm={handleClearHistory}
        confirmLabel="Erase Everything"
        type="danger"
      />

      <header className="max-w-7xl mx-auto px-4 pt-6">
        <div className="glass rounded-[2rem] px-8 h-20 flex items-center justify-between border-white/20">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-white dark:bg-gray-900 p-2.5 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <Calculator className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter shimmer-text hidden sm:block">PAYOUT PRO</h1>
              <h1 className="text-xl font-black tracking-tighter shimmer-text sm:hidden">P.PRO</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-1 opacity-60">Financial Engine v2.0</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 hover:text-indigo-500 hover:bg-white dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-indigo-500/20 shadow-sm active:scale-90"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-500 px-4">
              Support <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-12">
          <div className="bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-md p-1.5 rounded-[1.5rem] flex gap-1 border border-white/10">
            <button
              onClick={() => setActiveTab('payout')}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.2rem] text-sm font-bold transition-all duration-300 ${activeTab === 'payout' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xl shadow-indigo-500/10' : 'text-gray-500'
                }`}
            >
              <DollarSign className="w-4 h-4" />
              Net Analysis
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.2rem] text-sm font-bold transition-all duration-300 ${activeTab === 'target' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xl shadow-indigo-500/10' : 'text-gray-500'
                }`}
            >
              <Target className="w-4 h-4" />
              Target Path
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-10">
            <div className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-10 border-b border-gray-100 dark:border-white/5 pb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500/10 p-2 rounded-xl"><Settings2 className="w-5 h-5 text-indigo-500" /></div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{activeTab === 'payout' ? 'Revenue Parameters' : 'Target Objective'}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Configure your baseline</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Select
                    options={CURRENCY_OPTIONS}
                    value={inputs.currency}
                    onChange={handleInputChange('currency')}
                    className="w-28"
                  />
                  <Select
                    options={CURRENCY_OPTIONS}
                    value={inputs.localCurrency}
                    onChange={handleInputChange('localCurrency')}
                    className="w-28"
                  />
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /><span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Quick Presets</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {PLATFORM_PRESETS.map((p) => (
                    <button key={p.name} onClick={() => applyPreset(p)} className="bg-white/50 dark:bg-gray-800/30 border border-white/20 dark:border-white/5 hover:border-indigo-500/50 hover:bg-white dark:hover:bg-gray-800 px-5 py-3 rounded-2xl flex items-center gap-3 transition-all">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.name}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {activeTab === 'payout' ? (
                  <InputField
                    label="Billable Hours"
                    name="hoursWorked"
                    value={hourFormat === 'time' ? decimalToTime(inputs.hoursWorked) : inputs.hoursWorked}
                    onChange={handleInputChange('hoursWorked')}
                    suffix={hourFormat === 'time' ? 'H:M:S' : 'HRS'}
                    type={hourFormat === 'time' ? 'text' : 'number'}
                    placeholder={hourFormat === 'time' ? '00:00:00' : '0'}
                    topExtra={
                      <button
                        onClick={() => setHourFormat(prev => prev === 'decimal' ? 'time' : 'decimal')}
                        className="text-[9px] font-black text-indigo-500 hover:text-indigo-600 bg-indigo-500/5 hover:bg-indigo-500/10 px-2 py-0.5 rounded-full transition-all uppercase tracking-tighter"
                      >
                        {hourFormat === 'decimal' ? 'Scale to Time' : 'Scale to Decimal'}
                      </button>
                    }
                  />
                ) : (
                  <InputField label="Monthly Net Goal" name="targetNet" value={inputs.targetNet || 0} onChange={handleInputChange('targetNet')} prefix={currentSymbol} />
                )}
                <InputField label="Hourly Rate" name="hourlyRate" value={inputs.hourlyRate} onChange={handleInputChange('hourlyRate')} prefix={currentSymbol} />
                <InputField label="Platform Fee" name="serviceFeeRate" value={inputs.serviceFeeRate} onChange={handleInputChange('serviceFeeRate')} suffix="%" />
                <InputField label="Tax / VAT" name="vatRate" value={inputs.vatRate} onChange={handleInputChange('vatRate')} suffix="%" />
                <InputField label="Withdrawal Fee" name="withdrawalFee" value={inputs.withdrawalFee} onChange={handleInputChange('withdrawalFee')} prefix={currentSymbol} />
                {activeTab === 'payout' ? (
                  <InputField label="Exchange Rate" name="exchangeRate" value={inputs.exchangeRate} onChange={handleInputChange('exchangeRate')} suffix={inputs.localCurrency} />
                ) : (
                  <InputField label="Weekly Days" name="workingDaysPerWeek" value={inputs.workingDaysPerWeek} onChange={handleInputChange('workingDaysPerWeek')} step={1} min={1} />
                )}
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-6 ml-2"><Sparkles className="w-5 h-5 text-indigo-400" /><h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Financial History</h2></div>
              <HistoryList history={history} onDelete={handleDelete} onClear={() => setIsClearModalOpen(true)} onRestore={handleRestore} />
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <SummaryCard
              results={results}
              onSave={handleSave}
              canSave={results.gross > 0}
              currency={inputs.currency}
              localCurrency={inputs.localCurrency}
              mode={activeTab}
              addToast={addToast}
            />
            <div className="mt-8 p-6 glass rounded-3xl border-dashed border-2 border-white/20">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">* Estimates based on sequential deductions.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
