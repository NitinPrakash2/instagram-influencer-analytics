import React from 'react';
import { MoreHorizontal, PieChart } from 'lucide-react';

export default function CategoryDonutChart({ data }) {
  const categories = data?.categories || [];
  const total = data?.total || 0;

  // SVG Donut Calculations: radius 62, circumference 2 * PI * 62 ≈ 389.56
  const circumference = 389.56;
  let accumulatedOffset = 0;

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight">
          <PieChart className="w-4 h-4 text-indigo-400" />
          <span>Influencers by Category</span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-xs">
          <PieChart className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
          <span>No category data available</span>
        </div>
      ) : (
        /* Chart & Legend Body */
        <div className="flex items-center justify-between gap-6 my-auto">
          {/* SVG Donut Chart */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {categories.map((cat) => {
                const pctNumber = typeof cat.pct === 'number' ? cat.pct : parseFloat(cat.pct) || 0;
                const strokeDash = (pctNumber / 100) * circumference;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += strokeDash;

                return (
                  <circle
                    key={cat.name}
                    cx="80"
                    cy="80"
                    r="62"
                    fill="transparent"
                    stroke={cat.color || '#6366F1'}
                    strokeWidth="20"
                    strokeDasharray={`${strokeDash} ${Math.max(0, circumference - strokeDash)}`}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white leading-none">{total.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">Total</span>
            </div>
          </div>

          {/* Legend List */}
          <div className="flex-1 space-y-2 max-h-48 overflow-y-auto pr-1">
            {categories.slice(0, 6).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-300 font-medium truncate">{cat.name}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px] shrink-0">
                  <span className="text-white font-medium mr-1">{cat.count.toLocaleString()}</span>
                  <span>({cat.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
