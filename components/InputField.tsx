import React, { useRef } from 'react';
import { X } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  name: string;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  name,
  min = 0,
  step = 0.01,
  prefix,
  suffix,
  placeholder
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus to allow immediate typing
    e.target.select();
  };

  const showClear = value !== '' && value !== 0;

  return (
    <div className="flex flex-col space-y-1 group">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="number"
          name={name}
          id={name}
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 ${
            prefix ? 'pl-8' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-8'}`} 
          placeholder={placeholder}
        />
        
        {/* Right-side elements container */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
           {showClear && (
            <button 
              type="button"
              onClick={handleClear}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X className="w-3 h-3" />
            </button>
           )}
           {suffix && (
             <span className="pointer-events-none text-gray-500 dark:text-gray-400 sm:text-sm">{suffix}</span>
           )}
        </div>
      </div>
    </div>
  );
};

export default InputField;