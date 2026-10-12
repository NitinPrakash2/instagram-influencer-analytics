import React from 'react';
import { Users, BarChart3, Tag, Star } from 'lucide-react';

export default function KpiCards({ stats, isOnline }) {
  const totalCount = stats?.total_influencers !== undefined ? stats.total_influencers.toLocaleString() : (isOnline ? '...' : '--');
  const avgEr = stats?.avg_engagement_rate !== undefined ? stats.avg_engagement_rate : (isOnline ? '...' : '--');
  const topCat = stats?.top_category || (isOnline ? 'Loading...' : '--');
  const topCatCount = stats?.top_category_influencers || 0;
  const topCatPct = stats?.top_category_pct || 0;
  const topHandle = stats?.top_influencer?.handle || (isOnline ? 'Loading...' : '--');
  const topScore = stats?.top_influencer?.score !== undefined ? stats.top_influencer.score : '--';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Influencers Collected */}
      <div className="p-4 rounded-2xl bg-[#0F1422] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span>Total Influencers Collected</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{totalCount.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              ↑ 12%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Target: 2,000+
          </div>
        </div>

        {/* Mini Sparkline SVG */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,28 Q15,35 30,18 T60,22 T80,8"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Avg. Engagement Rate */}
      <div className="p-4 rounded-2xl bg-[#0F1422] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
              <BarChart3 className="w-3.5 h-3.5" />
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
          <div className="text-[11px] text-slate-500 font-medium">
            Across all categories
          </div>
        </div>

        {/* Mini Sparkline SVG */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,32 Q20,34 35,22 T65,24 T80,10"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: Top Category */}
      <div className="p-4 rounded-2xl bg-[#0F1422] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <span>Top Category</span>
          </div>
          <div className="pt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{topCat}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {topCatCount} influencers ({topCatPct}%)
          </div>
        </div>

        {/* Mini Sparkline SVG */}
        <div className="w-20 h-10 opacity-75 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 80 40" className="w-full h-full overflow-visible">
            <path
              d="M0,30 Q18,36 35,16 T60,25 T80,12"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Card 4: Top Influencer (by score) */}
      <div className="p-4 rounded-2xl bg-[#0F1422] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400/20" />
            </div>
            <span>Top Influencer (by score)</span>
          </div>
          <div className="pt-1">
            <span className="text-xl font-bold text-white tracking-tight hover:text-indigo-400 transition-colors">
              {topHandle}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Score: <span className="text-white font-semibold">{topScore}</span> / 100
          </div>
        </div>

        {/* Creator Avatar with gradient ring */}
        <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-500 shrink-0 shadow-md">
          <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" 
              alt="Top Creator" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
