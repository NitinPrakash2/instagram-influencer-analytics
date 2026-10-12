import React, { useState } from 'react';
import { PieChart } from 'lucide-react';

const CATEGORY_COLORS = {
  'Tech & AI': '#3B82F6',
  'Lifestyle & Wellness': '#EC4899',
  'Business & Finance': '#10B981',
  'Travel & Adventure': '#8B5CF6',
  'Fashion & Style': '#F59E0B',
  'Food & Cooking': '#06B6D4',
  'Fitness & Health': '#EF4444',
};

const DEFAULT_PALETTE = ['#3B82F6', '#EC4899', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

export default function CategoryDonutChart({ data }) {
  const [hoveredCat, setHoveredCat] = useState(null);

  const categories = data?.categories || [];
  const total = data?.total || 0;

  // SVG Donut Calculations: radius 52, circumference 2 * PI * 52 ≈ 326.73
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  // Find active hovered category stats
  const activeItem = hoveredCat
    ? categories.find((c) => c.name === hoveredCat)
    : null;

  return (
    <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 shadow-sm flex flex-col justify-between h-full group/card">
      {/* Card Header: Dynamically shows full hovered category name without truncation */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 min-w-0">
          <PieChart
            className="w-4 h-4 shrink-0 transition-colors"
            style={{ color: activeItem ? CATEGORY_COLORS[activeItem.name] || '#3B82F6' : '#60A5FA' }}
          />
          <h3 className="text-xs font-semibold text-white tracking-wide truncate transition-all">
            {activeItem ? activeItem.name : 'Influencers by Category'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-2">
          {activeItem ? `${activeItem.pct}% share` : `Total: ${total.toLocaleString()}`}
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-zinc-500 text-xs">
          <PieChart className="w-8 h-8 mb-2 opacity-40 text-zinc-400" />
          <span>No category data available</span>
        </div>
      ) : (
        /* Chart & Legend Body */
        <div className="flex items-center justify-between gap-4 my-auto">
          {/* SVG Donut Chart with Hover Interaction */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              {categories.map((cat, idx) => {
                const pctNumber = typeof cat.pct === 'number' ? cat.pct : parseFloat(cat.pct) || 0;
                const strokeDash = (pctNumber / 100) * circumference;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += strokeDash;
                const color = CATEGORY_COLORS[cat.name] || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
                const isHovered = hoveredCat === cat.name;
                const isAnyHovered = Boolean(hoveredCat);

                return (
                  <circle
                    key={cat.name}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={isHovered ? 18 : 14}
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    onMouseEnter={() => setHoveredCat(cat.name)}
                    onMouseLeave={() => setHoveredCat(null)}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      opacity: isAnyHovered ? (isHovered ? 1 : 0.3) : 1,
                      filter: isHovered ? `drop-shadow(0 0 8px ${color}90)` : 'none',
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </svg>

            {/* Dynamic Center Metrics on Hover (No truncated text, large clear stats) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none transition-all duration-300">
              {activeItem ? (
                <div className="flex flex-col items-center justify-center animate-fadeIn">
                  <span
                    className="text-2xl font-bold font-mono tracking-tight transition-colors leading-none"
                    style={{ color: CATEGORY_COLORS[activeItem.name] || '#3B82F6' }}
                  >
                    {activeItem.pct}%
                  </span>
                  <span className="text-xs font-semibold text-white font-mono mt-1 leading-none">
                    {activeItem.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
                    creators
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white tracking-tight font-mono leading-none">
                    {total.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-1">
                    Total
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Legend with Clear Legibility */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {categories.slice(0, 6).map((cat, idx) => {
              const color = CATEGORY_COLORS[cat.name] || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
              const isHovered = hoveredCat === cat.name;

              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHoveredCat(cat.name)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-white/[0.08] shadow-sm'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 transition-transform ${
                        isHovered ? 'scale-125' : ''
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                      }}
                    />
                    <span
                      className={`truncate font-medium text-[11px] transition-colors ${
                        isHovered ? 'text-white font-semibold' : 'text-zinc-300'
                      }`}
                      title={cat.name}
                    >
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs text-right">
                    <span className={isHovered ? 'text-white font-bold' : 'text-zinc-200 font-medium'}>
                      {cat.count.toLocaleString()}
                    </span>
                    <span className="text-zinc-400 text-[11px]">({cat.pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
