import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select option',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const isLabelFloating = isOpen || !!value;

    return (
        <div className={`relative flex flex-col group transition-all duration-300 ${isOpen ? 'scale-[1.02]' : ''} ${className}`} ref={containerRef}>
            {/* Radiant Focus Glow wrapper */}
            <div className={`absolute -inset-1.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-[1.4rem] blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`relative h-[4.5rem] w-full flex items-center rounded-2xl transition-all duration-300 border-2 z-10 ${isOpen
                ? 'border-indigo-500 bg-white dark:bg-gray-800 shadow-lg shadow-indigo-500/10'
                : 'border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20 backdrop-blur-xl hover:border-gray-200 dark:hover:border-gray-700'
                }`}>

                {/* Floating Label */}
                {label && (
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none font-bold tracking-tight z-20 ${isLabelFloating
                        ? 'top-2.5 text-[10px] text-indigo-500 dark:text-indigo-400 opacity-100 uppercase'
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 opacity-60'
                        }`}>
                        {label}
                    </label>
                )}

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-full flex items-center justify-between px-4 pt-6 pb-2 text-gray-900 dark:text-white bg-transparent border-none transition-all z-10 text-xl"
                >
                    <span className="font-black truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-50 top-[110%] left-0 w-full glass bg-white/95 dark:bg-gray-900/95 rounded-2xl overflow-hidden shadow-2xl border-white/20 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 p-2">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${option.value === value
                                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {option.label}
                                    {option.value === value && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;
