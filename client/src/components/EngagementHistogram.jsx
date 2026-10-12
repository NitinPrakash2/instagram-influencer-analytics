import React from 'react';
import { MoreHorizontal, TrendingUp } from 'lucide-react';

export default function EngagementHistogram({ data = [] }) {
  const chartData = data && data.length > 0 ? data : [];
  const maxVal = Math.max(...chartData.map((d) => d.count), 100);
  const peakCount = Math.max(...chartData.map((d) => d.count), 0);

  // Y-axis 5 step marks
  const ySteps = [
    Math.round(maxVal),
    Math.round(maxVal * 0.8),
    Math.round(maxVal * 0.6),
    Math.round(maxVal * 0.4),
    Math.round(maxVal * 0.2),
    0
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Engagement Rate Distribution</span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
          <TrendingUp className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
          <span>No engagement data available</span>
        </div>
      ) : (
        /* Histogram Chart with Y-axis */
        <div className="flex items-end gap-2.5 h-48 pt-6 pb-2 w-full">
          {/* Y-axis markers */}
          <div className="h-full flex flex-col justify-between text-[10px] text-slate-500 font-mono pr-1 select-none">
            {ySteps.map((step, idx) => (
              <span key={idx}>{step}</span>
            ))}
          </div>

          {/* Bars Container */}
          <div className="flex-1 h-full flex items-end justify-between gap-2 border-b border-l border-white/[0.08] px-2 pb-1 relative">
            {/* Subtle grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
              <div className="border-b border-dashed border-white/40"></div>
              <div className="border-b border-dashed border-white/40"></div>
              <div className="border-b border-dashed border-white/40"></div>
              <div className="border-b border-dashed border-white/40"></div>
              <div className="border-b border-dashed border-white/40"></div>
            </div>

            {chartData.map((item) => {
              const heightPct = Math.min(100, Math.max(8, (item.count / maxVal) * 100));
              const isPeak = item.count === peakCount && item.count > 0;
              return (
                <div key={item.bin} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  {/* Count Label Above Bar */}
                  <span
                    className={`text-[10px] font-mono font-medium mb-1 transition-colors ${
                      isPeak ? 'text-white font-bold' : 'text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {item.count}
                  </span>

                  {/* Animated Vertical Bar */}
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 cursor-pointer ${
                      isPeak
                        ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 shadow-md shadow-indigo-500/25'
                        : 'bg-gradient-to-t from-slate-700/80 to-slate-500/90 hover:from-slate-600 hover:to-indigo-500/80'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>

                  {/* Bin Label */}
                  <span className="text-[10px] text-slate-400 font-mono mt-2 group-hover:text-slate-200 transition-colors">
                    {item.bin}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Axis Footer */}
      <div className="text-center text-[10px] text-slate-500 font-medium mt-1">
        Engagement Rate (%)
      </div>
    </div>
  );
}
