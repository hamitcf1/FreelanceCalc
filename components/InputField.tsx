import React, { useRef, useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string | number) => void;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  type?: 'number' | 'text';
  topExtra?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  name,
  min = 0,
  max,
  step = 0.01,
  prefix,
  suffix,
  placeholder,
  type = 'number',
  topExtra
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setHasContent(value !== '' && value !== null && value !== undefined);
  }, [value]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const adjustValue = (delta: number) => {
    const currentValue = typeof value === 'number' ? value : parseFloat(value || '0');
    let newValue = (isNaN(currentValue) ? 0 : currentValue) + delta;

    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(parseFloat(newValue.toFixed(precision)));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showClear = value !== '' && value !== 0 && value !== '0';
  const isLabelFloating = isFocused || hasContent;

  return (
    <div className={`flex flex-col relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
      {/* Radiant Focus Glow wrapper */}
      <div className={`absolute -inset-1.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-[1.4rem] blur-lg transition-opacity duration-500 z-0 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`relative flex items-center h-[4.5rem] rounded-2xl transition-all duration-300 border-2 z-10 overflow-hidden ${isFocused
        ? 'border-indigo-500 bg-white dark:bg-gray-800 shadow-lg shadow-indigo-500/10'
        : 'border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20 backdrop-blur-xl'
        }`}>

        {/* Floating Label */}
        <label
          htmlFor={name}
          className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold tracking-tight z-20 ${isLabelFloating
            ? 'top-2.5 text-[10px] text-indigo-500 dark:text-indigo-400 opacity-100 uppercase'
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 opacity-60'
            }`}
        >
          {label}
        </label>

        {/* Input Prefix */}
        {prefix && (
          <div className={`pl-4 pt-4 transition-all duration-300 z-10 ${isFocused ? 'scale-110 text-indigo-500' : 'text-gray-400'}`}>
            <span className="text-sm font-black">{prefix}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type={type}
          name={name}
          id={name}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
          step={type === 'number' ? step : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          className={`w-full h-full bg-transparent border-none pt-6 pb-2 px-4 text-xl font-black tabular-nums text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600 transition-all z-10 ${prefix ? 'pl-2' : ''}`}
        />

        {/* Action Controls */}
        <div className="flex items-center gap-2 pr-3 shrink-0 relative z-20 h-full">
          {topExtra && (
            <div className="flex items-center">
              {topExtra}
            </div>
          )}

          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
              tabIndex={-1}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {type === 'number' && (
            <div className="flex flex-col border-l border-gray-100 dark:border-gray-700/50 pl-2 h-[60%] justify-center">
              <button
                type="button"
                onClick={() => adjustValue(step)}
                className="p-0.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all"
                tabIndex={-1}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => adjustValue(-step)}
                className="p-0.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-all"
                tabIndex={-1}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {suffix && (
            <div className={`ml-2 transition-all duration-300 text-right ${isFocused ? 'scale-110 text-indigo-500' : 'text-gray-400'}`}>
              <span className="text-[10px] font-black tracking-widest uppercase">{suffix}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;