import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CATEGORY_COLORS = {
  'Tech & AI': '#3B82F6',
  'Lifestyle & Wellness': '#EC4899',
  'Business & Finance': '#10B981',
  'Travel & Adventure': '#8B5CF6',
  'Fashion & Style': '#F59E0B',
  'Food & Cooking': '#14B8A6',
  'Fitness & Health': '#EF4444',
};

export default function CustomDropdown({
  label,
  value,
  options,
  onChange,
  className = '',
  buttonClassName = '',
  placeholder = 'Select option',
  showCategoryDots = false,
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) =>
    typeof opt === 'string' ? opt === value : opt.value === value
  );

  const displayLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : value || placeholder;

  const activeColor = showCategoryDots ? CATEGORY_COLORS[value] : null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[#121620] border rounded-xl text-xs text-white transition-all text-left cursor-pointer select-none ${
          compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'
        } ${
          isOpen
            ? 'border-white/30 ring-1 ring-white/20 bg-[#161B26] shadow-lg shadow-black/40'
            : 'border-white/[0.08] hover:border-white/[0.18] hover:bg-[#151A24]'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {showCategoryDots && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeColor || '#A1A1AA' }}
            />
          )}
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-full w-max max-w-[280px] bg-[#0B0E14]/95 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] p-1.5 max-h-80 overflow-y-auto dropdown-scroll space-y-0.5 animate-fadeIn">
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const isSelected = optVal === value;
            const catDotColor = showCategoryDots ? CATEGORY_COLORS[optVal] : null;

            return (
              <button
                type="button"
                key={optVal}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-white bg-white/[0.1] font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {showCategoryDots && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: catDotColor || '#71717A' }}
                    />
                  )}
                  <span className="truncate">{optLabel}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
