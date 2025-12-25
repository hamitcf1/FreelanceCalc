import React, { useMemo } from 'react';
import { CalculatorInputs, CalculationResults, HistoryEntry } from './types';
import { calculatePayout, calculateTargetHours } from './utils/calculator';
import InputField from './components/InputField';
import SummaryCard from './components/SummaryCard';
import HistoryList from './components/HistoryList';
import useLocalStorageState from './hooks/useLocalStorageState';
import { Calculator, Settings2, Moon, Sun, Target, DollarSign } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'TRY', 'INR', 'JPY', 'CNY', 'CHF'];
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', TRY: '₺', INR: '₹', JPY: '¥', CNY: '¥', CHF: 'Fr'
};

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

  // --- Handlers ---
  const handleInputChange = (field: keyof CalculatorInputs) => (value: string) => {
    // Allow empty string to clear input, otherwise parse float
    if (field === 'currency' || field === 'localCurrency') {
       setInputs(prev => ({ ...prev, [field]: value }));
       return;
    }

    const numValue = value === '' ? 0 : parseFloat(value);
    
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSave = () => {
    const newEntry: HistoryEntry = {
      ...results,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      inputs: { ...inputs }, // Snapshot of inputs
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if(window.confirm('Are you sure you want to clear all history?')) {
        setHistory([]);
    }
  };

  const currentSymbol = CURRENCY_SYMBOLS[inputs.currency] || '$';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Freelance Payout Calculator</h1>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight sm:hidden">Payout Calc</h1>
          </div>

          <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
               aria-label="Toggle Dark Mode"
             >
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('payout')}
                    className={`${
                        activeTab === 'payout'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <DollarSign className="w-4 h-4" />
                    Net Payout
                </button>
                <button
                    onClick={() => setActiveTab('target')}
                    className={`${
                        activeTab === 'target'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <Target className="w-4 h-4" />
                    Target Income
                </button>
            </nav>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs & History */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="flex items-center space-x-2">
                    <Settings2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {activeTab === 'payout' ? 'Job Details & Fees' : 'Target & Fees'}
                    </h2>
                </div>
                
                {/* Currency Selectors */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency:</label>
                      <select id="currency" value={inputs.currency} onChange={(e) => handleInputChange('currency')(e.target.value)}
                          className="block rounded-md border-gray-300 dark:border-gray-600 py-1.5 pl-3 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                       <label htmlFor="localCurrency" className="text-sm font-medium text-gray-700 dark:text-gray-300">Local:</label>
                       <select id="localCurrency" value={inputs.localCurrency} onChange={(e) => handleInputChange('localCurrency')(e.target.value)}
                           className="block rounded-md border-gray-300 dark:border-gray-600 py-1.5 pl-3 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                           {CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                       </select>
                    </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {activeTab === 'payout' ? (
                     <InputField
                        label="Hours Worked" name="hoursWorked" value={inputs.hoursWorked}
                        onChange={handleInputChange('hoursWorked')} suffix="hrs" placeholder="0"
                    />
                ) : (
                    <InputField
                        label="Target Net Pay" name="targetNet" value={inputs.targetNet || 0}
                        onChange={handleInputChange('targetNet')} prefix={currentSymbol} placeholder="1000.00"
                    />
                )}

                <InputField
                  label="Hourly Rate" name="hourlyRate" value={inputs.hourlyRate}
                  onChange={handleInputChange('hourlyRate')} prefix={currentSymbol} placeholder="0.00"
                />

                <InputField
                  label="Platform Service Fee" name="serviceFeeRate" value={inputs.serviceFeeRate}
                  onChange={handleInputChange('serviceFeeRate')} suffix="%" placeholder="10"
                />
                <InputField
                  label="VAT on Fee" name="vatRate" value={inputs.vatRate}
                  onChange={handleInputChange('vatRate')} suffix="%" placeholder="20"
                />
                <InputField
                  label="Withdrawal Fee (Fixed)" name="withdrawalFee" value={inputs.withdrawalFee}
                  onChange={handleInputChange('withdrawalFee')} prefix={currentSymbol} placeholder="30.00"
                />

                {activeTab === 'payout' ? (
                   <InputField
                      label="Exchange Rate (Base to Local)" name="exchangeRate" value={inputs.exchangeRate}
                      onChange={handleInputChange('exchangeRate')} step={0.0001} placeholder="1.00" suffix={inputs.localCurrency}
                    />
                ) : (
                    <InputField
                        label="Working Days per Week" name="workingDaysPerWeek" value={inputs.workingDaysPerWeek}
                        onChange={handleInputChange('workingDaysPerWeek')} step={1} min={1} placeholder="5"
                    />
                )}
              </div>
            </div>

            {/* History Section */}
            <HistoryList 
                history={history} 
                onDelete={handleDelete} 
                onClear={handleClearHistory}
            />
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-1">
             <SummaryCard 
                results={results} 
                onSave={handleSave} 
                canSave={results.gross > 0}
                currency={inputs.currency}
                localCurrency={inputs.localCurrency}
                mode={activeTab}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
