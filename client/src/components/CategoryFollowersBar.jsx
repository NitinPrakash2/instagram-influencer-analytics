import React, { useState } from 'react';
import { Trophy, ChevronRight, Cpu, Shirt, Plane, Dumbbell, Sparkles } from 'lucide-react';

const ICON_MAP = {
  'Tech & AI': { icon: Cpu, barColor: 'bg-gradient-to-r from-blue-600 to-sky-400', glowColor: 'rgba(59,130,246,0.4)', iconColor: 'text-blue-400' },
  'Lifestyle & Wellness': { icon: Sparkles, barColor: 'bg-gradient-to-r from-pink-600 to-rose-400', glowColor: 'rgba(236,72,153,0.4)', iconColor: 'text-pink-400' },
  'Business & Finance': { icon: Trophy, barColor: 'bg-gradient-to-r from-emerald-600 to-teal-400', glowColor: 'rgba(16,185,129,0.4)', iconColor: 'text-emerald-400' },
  'Fashion & Style': { icon: Shirt, barColor: 'bg-gradient-to-r from-amber-600 to-yellow-400', glowColor: 'rgba(245,158,11,0.4)', iconColor: 'text-amber-400' },
  'Travel & Adventure': { icon: Plane, barColor: 'bg-gradient-to-r from-purple-600 to-violet-400', glowColor: 'rgba(139,92,246,0.4)', iconColor: 'text-purple-400' },
  'Fitness & Health': { icon: Dumbbell, barColor: 'bg-gradient-to-r from-red-600 to-orange-400', glowColor: 'rgba(239,68,68,0.4)', iconColor: 'text-red-400' },
};

export default function CategoryFollowersBar({ data = [], onSeeAll }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categories = data && data.length > 0 ? data : [];

  return (
    <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 shadow-sm flex flex-col justify-between h-full group/card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-white tracking-wide">Top Categories by Followers</h3>
        </div>
        <button
          onClick={onSeeAll}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 transition-colors font-medium cursor-pointer"
        >
          <span>See all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-zinc-500 text-xs">
          <Trophy className="w-8 h-8 mb-2 opacity-40 text-zinc-400" />
          <span>No follower scale data available</span>
        </div>
      ) : (
        /* Category Scale Bars List */
        <div className="space-y-3 my-auto">
          {categories.slice(0, 5).map((item, idx) => {
            const config = ICON_MAP[item.category] || {
              icon: Trophy,
              barColor: 'bg-gradient-to-r from-indigo-500 to-blue-400',
              glowColor: 'rgba(99,102,241,0.4)',
              iconColor: 'text-indigo-400',
            };
            const Icon = config.icon;
            const pct = Math.min(100, Math.max(12, Math.round(item.pct_of_max || item.pct || 50)));
            const isHovered = hoveredCategory === item.category;

            // Proper fallback for formatted followers
            const formattedVal =
              item.formatted ||
              item.avg_followers_formatted ||
              (item.avg_followers ? `${(item.avg_followers / 1000).toFixed(1)}K` : '--');

            return (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-white/[0.05] shadow-sm' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isHovered ? 'bg-white/10 scale-110' : 'bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                    </div>
                    <span
                      className={`font-medium text-[11px] transition-colors ${
                        isHovered ? 'text-white font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-white text-xs font-semibold">
                      {formattedVal}
                    </span>
                    <span className="text-[10px] text-zinc-500">avg</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.barColor} rounded-full transition-all duration-500 shadow-sm`}
                    style={{
                      width: `${pct}%`,
                      boxShadow: isHovered ? `0 0 10px ${config.glowColor}` : 'none',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
