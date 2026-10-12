import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function EngagementHistogram({ data = [] }) {
  const [hoveredBin, setHoveredBin] = useState(null);

  const chartData = data && data.length > 0 ? data : [];
  const maxVal = Math.max(...chartData.map((d) => d.count), 100);
  const totalCount = chartData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const peakCount = Math.max(...chartData.map((d) => d.count), 0);

  // Y-axis 5 step marks
  const ySteps = [
    Math.round(maxVal),
    Math.round(maxVal * 0.8),
    Math.round(maxVal * 0.6),
    Math.round(maxVal * 0.4),
    Math.round(maxVal * 0.2),
    0,
  ];

  const activeItem = hoveredBin ? chartData.find((d) => d.bin === hoveredBin) : null;

  return (
    <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 shadow-sm flex flex-col justify-between h-full relative group/card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-white tracking-wide">Engagement Rate Distribution</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          {activeItem ? (
            <span className="text-emerald-400 font-semibold animate-fadeIn">
              {activeItem.bin}%: {activeItem.count} ({((activeItem.count / totalCount) * 100).toFixed(1)}%)
            </span>
          ) : (
            <span className="text-zinc-400">Peak: {peakCount} accounts</span>
          )}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-zinc-500 text-xs">
          <TrendingUp className="w-8 h-8 mb-2 opacity-40 text-zinc-400" />
          <span>No engagement data available</span>
        </div>
      ) : (
        /* Chart Plot Canvas */
        <div className="flex items-end gap-3 h-48 my-auto pt-6 relative">
          {/* Y-Axis Grid Lines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {ySteps.map((step, idx) => (
              <div key={idx} className="flex items-center w-full">
                <span className="text-[9px] font-mono text-zinc-600 w-8 text-right pr-2 select-none">
                  {step}
                </span>
                <div className="flex-1 border-b border-white/[0.04]"></div>
              </div>
            ))}
          </div>

          {/* Histogram Bars Container */}
          <div className="flex-1 flex items-end justify-between gap-2.5 h-full pl-8 pb-6 relative">
            {chartData.map((item) => {
              const heightPct = Math.max(8, Math.round((item.count / maxVal) * 100));
              const isPeak = item.count === peakCount && item.count > 0;
              const isHovered = hoveredBin === item.bin;
              const pctOfCohort = ((item.count / totalCount) * 100).toFixed(1);

              return (
                <div
                  key={item.bin}
                  onMouseEnter={() => setHoveredBin(item.bin)}
                  onMouseLeave={() => setHoveredBin(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group z-10 relative cursor-pointer"
                >
                  {/* Floating Detail Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-10 z-30 bg-[#0B0E14] border border-white/20 rounded-lg px-2.5 py-1 shadow-2xl pointer-events-none whitespace-nowrap animate-fadeIn scale-100 flex flex-col items-center">
                      <span className="text-[10px] font-mono font-bold text-white">
                        {item.count} creators ({pctOfCohort}%)
                      </span>
                      <div className="w-1.5 h-1.5 bg-[#0B0E14] border-r border-b border-white/20 transform rotate-45 -mb-1"></div>
                    </div>
                  )}

                  {/* Count Label Above Bar */}
                  <span
                    className={`text-[10px] font-mono font-medium mb-1 transition-all duration-200 ${
                      isHovered
                        ? 'text-white font-bold scale-110'
                        : isPeak
                        ? 'text-white font-bold'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {item.count}
                  </span>

                  {/* Gradient Colored Bar with Hover Glow */}
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-t from-indigo-500 via-sky-400 to-cyan-300 shadow-lg shadow-sky-500/40 brightness-125 scale-x-105'
                        : isPeak
                        ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-sky-400 shadow-md shadow-indigo-500/20'
                        : 'bg-gradient-to-t from-slate-800 to-indigo-600/70 group-hover:to-indigo-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>

                  {/* Bin Label */}
                  <span
                    className={`text-[10px] font-mono mt-2 transition-colors ${
                      isHovered ? 'text-white font-semibold' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {item.bin}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Axis Label */}
      <div className="pt-2 text-center text-[10px] font-mono text-zinc-400">
        Engagement Rate (%)
      </div>
    </div>
  );
}
