import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function FiltersCard({ filters, setFilters, onReset }) {
  const categories = [
    'All Categories',
    'Tech & AI',
    'Lifestyle & Wellness',
    'Business & Finance',
    'Travel & Adventure',
    'Fashion & Style',
    'Food & Cooking',
    'Fitness & Health',
  ];

  const ALL_MIN_OPTIONS = [
    { label: 'Any', value: 'Any', num: 0 },
    { label: '10K+', value: '10000', num: 10000 },
    { label: '50K+', value: '50000', num: 50000 },
    { label: '100K+', value: '100000', num: 100000 },
    { label: '250K+', value: '250000', num: 250000 },
    { label: '500K+', value: '500000', num: 500000 },
  ];

  const ALL_MAX_OPTIONS = [
    { label: '1M', value: '1M', num: 1000000 },
    { label: '500K', value: '500000', num: 500000 },
    { label: '250K', value: '250000', num: 250000 },
    { label: '100K', value: '100000', num: 100000 },
    { label: '50K', value: '50000', num: 50000 },
  ];

  const erOptions = [
    { label: 'Any', value: 'Any' },
    { label: '> 3%', value: '3' },
    { label: '> 5%', value: '5' },
    { label: '> 7%', value: '7' },
  ];

  const autoOptions = [
    { label: 'Any', value: 'Any' },
    { label: 'Automated', value: 'Yes' },
    { label: 'Organic Only', value: 'No' },
  ];

  // Numerical helpers to ensure Min is always strictly less than Max
  const parseMinNum = (val) => (!val || val === 'Any' ? 0 : parseInt(val, 10));
  const parseMaxNum = (val) => (!val || val === '1M' ? 1000000 : parseInt(val, 10));

  const currentMinNum = parseMinNum(filters.minFollowers);
  const currentMaxNum = parseMaxNum(filters.maxFollowers);

  // Available options filtered dynamically so user cannot pick an invalid conflicting range
  const availableMinOptions = ALL_MIN_OPTIONS.filter(
    (opt) => opt.value === 'Any' || opt.num < currentMaxNum
  );

  const availableMaxOptions = ALL_MAX_OPTIONS.filter(
    (opt) => opt.num > currentMinNum
  );

  // Handle Min Followers change: auto-reconcile Max if Min >= Max
  const handleMinChange = (newMinVal) => {
    const newMin = parseMinNum(newMinVal);
    let nextMaxVal = filters.maxFollowers || '1M';
    const currentMax = parseMaxNum(nextMaxVal);

    if (newMin >= currentMax) {
      nextMaxVal = '1M'; // auto-adjust Max to 1M to preserve a valid filter window
    }

    setFilters({
      ...filters,
      minFollowers: newMinVal,
      maxFollowers: nextMaxVal,
    });
  };

  // Handle Max Followers change: auto-reconcile Min if Max <= Min
  const handleMaxChange = (newMaxVal) => {
    const newMax = parseMaxNum(newMaxVal);
    let nextMinVal = filters.minFollowers || 'Any';
    const currentMin = parseMinNum(nextMinVal);

    if (newMax <= currentMin) {
      nextMinVal = 'Any'; // auto-relax Min to Any to preserve a valid filter window
    }

    setFilters({
      ...filters,
      minFollowers: nextMinVal,
      maxFollowers: newMaxVal,
    });
  };

  const hasActiveFilters = Boolean(
    (filters.category && filters.category !== 'All Categories') ||
    (filters.minFollowers && filters.minFollowers !== 'Any') ||
    (filters.maxFollowers && filters.maxFollowers !== '1M') ||
    (filters.minEr && filters.minEr !== 'Any') ||
    (filters.hasAutomation && filters.hasAutomation !== 'Any')
  );

  return (
    <div className="p-3.5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-white" />
          <h3 className="text-xs font-semibold text-white tracking-wide">Filters</h3>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="Active filters applied" />
          )}
        </div>
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-zinc-500" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Form Controls */}
      <div className="space-y-2.5">
        {/* Category with glowing category indicator dots */}
        <CustomDropdown
          label="Category"
          value={filters.category || 'All Categories'}
          options={categories}
          showCategoryDots={true}
          compact={true}
          onChange={(val) => setFilters({ ...filters, category: val === 'All Categories' ? '' : val })}
        />

        {/* Min Followers & Max Followers Row (Coordinated & Mutually Guarded) */}
        <div className="grid grid-cols-2 gap-2">
          <CustomDropdown
            label="Min Followers"
            value={filters.minFollowers || 'Any'}
            options={availableMinOptions}
            compact={true}
            onChange={handleMinChange}
          />

          <CustomDropdown
            label="Max Followers"
            value={filters.maxFollowers || '1M'}
            options={availableMaxOptions}
            compact={true}
            onChange={handleMaxChange}
          />
        </div>

        {/* Engagement Rate & Has Automation Row */}
        <div className="grid grid-cols-2 gap-2">
          <CustomDropdown
            label="Engagement Rate"
            value={filters.minEr || 'Any'}
            options={erOptions}
            compact={true}
            onChange={(val) => setFilters({ ...filters, minEr: val })}
          />

          <CustomDropdown
            label="Automation"
            value={filters.hasAutomation || 'Any'}
            options={autoOptions}
            compact={true}
            onChange={(val) => setFilters({ ...filters, hasAutomation: val })}
          />
        </div>
      </div>
    </div>
  );
}
