import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

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

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors font-medium"
        >
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Form Controls */}
      <div className="space-y-3.5">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Category</label>
          <select
            value={filters.category || 'All Categories'}
            onChange={(e) => setFilters({ ...filters, category: e.target.value === 'All Categories' ? '' : e.target.value })}
            className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Followers & Max Followers Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Min Followers</label>
            <select
              value={filters.minFollowers || 'Any'}
              onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            >
              <option value="Any" className="bg-slate-900 text-white">Any</option>
              <option value="10000" className="bg-slate-900 text-white">10K</option>
              <option value="50000" className="bg-slate-900 text-white">50K</option>
              <option value="100000" className="bg-slate-900 text-white">100K</option>
              <option value="500000" className="bg-slate-900 text-white">500K</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Max Followers</label>
            <select
              value={filters.maxFollowers || '1M'}
              onChange={(e) => setFilters({ ...filters, maxFollowers: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            >
              <option value="1M" className="bg-slate-900 text-white">1M</option>
              <option value="500000" className="bg-slate-900 text-white">500K</option>
              <option value="250000" className="bg-slate-900 text-white">250K</option>
              <option value="100000" className="bg-slate-900 text-white">100K</option>
            </select>
          </div>
        </div>

        {/* Engagement Rate & Has Automation Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Engagement Rate</label>
            <select
              value={filters.minEr || 'Any'}
              onChange={(e) => setFilters({ ...filters, minEr: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            >
              <option value="Any" className="bg-slate-900 text-white">Any</option>
              <option value="3" className="bg-slate-900 text-white">&gt; 3%</option>
              <option value="5" className="bg-slate-900 text-white">&gt; 5%</option>
              <option value="7" className="bg-slate-900 text-white">&gt; 7%</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">Has Automation</label>
            <select
              value={filters.hasAutomation || 'Any'}
              onChange={(e) => setFilters({ ...filters, hasAutomation: e.target.value })}
              className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-colors"
            >
              <option value="Any" className="bg-slate-900 text-white">Any</option>
              <option value="Yes" className="bg-slate-900 text-white">Yes (Bots)</option>
              <option value="No" className="bg-slate-900 text-white">No (Organic)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
