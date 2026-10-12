import React from 'react';
import { Trophy, ChevronRight, Cpu, Shirt, Plane, Dumbbell, Sparkles } from 'lucide-react';

const ICON_MAP = {
  'Tech & AI': { icon: Cpu, color: 'from-blue-600 to-blue-400', iconColor: 'text-blue-400' },
  'Lifestyle & Wellness': { icon: Sparkles, color: 'from-pink-600 to-pink-400', iconColor: 'text-pink-400' },
  'Business & Finance': { icon: Trophy, color: 'from-emerald-600 to-emerald-400', iconColor: 'text-emerald-400' },
  'Fashion & Style': { icon: Shirt, color: 'from-amber-600 to-amber-400', iconColor: 'text-amber-400' },
  'Travel & Adventure': { icon: Plane, color: 'from-purple-600 to-purple-400', iconColor: 'text-purple-400' },
  'Fitness & Health': { icon: Dumbbell, color: 'from-red-600 to-red-400', iconColor: 'text-red-400' },
};

export default function CategoryFollowersBar({ data = [], onSeeAll }) {
  const categories = data && data.length > 0 ? data : [];

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Top 5 Categories by Average Followers</span>
        </div>
        <button
          onClick={onSeeAll}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-0.5 transition-colors font-medium"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-xs">
          <Trophy className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
          <span>No follower scale data available</span>
        </div>
      ) : (
        /* Horizontal Progress Bars */
        <div className="space-y-3.5 my-auto">
          {categories.map((cat) => {
            const config = ICON_MAP[cat.category] || { icon: Sparkles, color: 'from-indigo-600 to-indigo-400', iconColor: 'text-indigo-400' };
            const Icon = config.icon;
            return (
              <div key={cat.category} className="flex items-center gap-3">
                {/* Category Label with Icon */}
                <div className="w-28 shrink-0 flex items-center gap-2 text-xs font-medium text-slate-300 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />
                  <span className="truncate">{cat.category}</span>
                </div>

                {/* Bar Track */}
                <div className="flex-1 h-3 bg-slate-800/80 rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-500`}
                    style={{ width: `${Math.max(5, cat.pct)}%` }}
                  ></div>
                </div>

                {/* Number Label */}
                <div className="w-12 text-right text-xs font-mono font-semibold text-slate-200">
                  {cat.formatted}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
