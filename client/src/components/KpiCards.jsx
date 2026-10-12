import React from 'react';
import { Users, BarChart3, Tag, Star } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function KpiCards({ stats, isOnline }) {
  const totalCount = stats?.total_influencers !== undefined ? stats.total_influencers.toLocaleString() : (isOnline ? '...' : '--');
  const avgEr = stats?.avg_engagement_rate !== undefined ? stats.avg_engagement_rate : (isOnline ? '...' : '--');
  const topCat = stats?.top_category || (isOnline ? 'Loading...' : '--');
  const topCatCount = stats?.top_category_influencers || 0;
  const topCatPct = stats?.top_category_pct || 0;
  const topHandle = stats?.top_influencer?.handle || (isOnline ? 'Loading...' : '--');
  const topScore = stats?.top_influencer?.score !== undefined ? stats.top_influencer.score : '--';

  const cleanTopHandle = topHandle.replace('@', '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Influencers */}
      <div className="p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#10141D] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <div className="w-6 h-6 rounded-lg bg-zinc-800/80 group-hover:bg-zinc-700/80 group-hover:scale-110 flex items-center justify-center text-zinc-300 group-hover:text-white transition-all">
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span>Total Influencers</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{totalCount.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              ↑ 12%
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
            Target: 2,000+
          </div>
        </div>

        {/* Mini Sparkline SVG with hover glow */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,28 Q15,35 30,18 T60,22 T80,8"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="group-hover:stroke-emerald-300 transition-colors filter group-hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Avg. Engagement Rate */}
      <div className="p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#10141D] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <div className="w-6 h-6 rounded-lg bg-zinc-800/80 group-hover:bg-zinc-700/80 group-hover:scale-110 flex items-center justify-center text-zinc-300 group-hover:text-white transition-all">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span>Avg. Engagement Rate</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">
              {avgEr !== '--' && avgEr !== '...' ? `${avgEr}%` : avgEr}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              ↑ 8%
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
            Across all categories
          </div>
        </div>

        {/* Mini Sparkline SVG with hover glow */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,32 Q20,34 35,22 T65,24 T80,10"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="group-hover:stroke-sky-300 transition-colors filter group-hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: Top Category */}
      <div className="p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#10141D] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <div className="w-6 h-6 rounded-lg bg-zinc-800/80 group-hover:bg-zinc-700/80 group-hover:scale-110 flex items-center justify-center text-zinc-300 group-hover:text-white transition-all">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span>Top Category</span>
          </div>
          <div className="pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{topCat}</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
            {topCatCount} influencers ({topCatPct}%)
          </div>
        </div>

        {/* Mini Sparkline SVG with hover glow */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,30 Q18,36 35,16 T60,25 T80,12"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="group-hover:stroke-purple-300 transition-colors filter group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]"
            />
          </svg>
        </div>
      </div>

      {/* Card 4: Top Influencer (by score) */}
      <div className="p-4 rounded-2xl bg-[#0D0F14] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#10141D] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <div className="w-6 h-6 rounded-lg bg-zinc-800/80 group-hover:bg-zinc-700/80 group-hover:scale-110 flex items-center justify-center text-zinc-300 group-hover:text-white transition-all">
              <Star className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span>Top Influencer</span>
          </div>
          <div className="pt-1">
            <span className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              {topHandle}
            </span>
          </div>
          <div className="text-[11px] text-zinc-400 font-medium">
            Score: <span className="text-white font-semibold">{topScore}</span> / 100
          </div>
        </div>

        {/* Creator Real Avatar with hover zoom */}
        <div className="w-11 h-11 rounded-full border border-white/[0.1] group-hover:border-white/30 bg-zinc-800 overflow-hidden shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          <img
            src={`${API_BASE_URL}/api/avatar/${cleanTopHandle}`}
            alt={topHandle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanTopHandle || 'Creator')}&background=18181b&color=ffffff&bold=true`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
