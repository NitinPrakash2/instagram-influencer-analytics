import React from 'react';
import { Sparkles, Users, TrendingUp, Award, Zap } from 'lucide-react';

const TYPE_CONFIG = {
  reach: {
    icon: Users,
    iconColor: 'text-sky-400',
    bg: 'bg-sky-500/10',
    shortLabel: 'Reach Leader',
  },
  engagement: {
    icon: TrendingUp,
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    shortLabel: 'Peak ER Vertical',
  },
  leader: {
    icon: Award,
    iconColor: 'text-amber-400',
    bg: 'bg-amber-500/10',
    shortLabel: '#1 Creator',
  },
  automation: {
    icon: Zap,
    iconColor: 'text-purple-400',
    bg: 'bg-purple-500/10',
    shortLabel: 'Automation Funnel',
  },
};

export default function KeyInsightsCard({ insights = [] }) {
  const items = insights && insights.length > 0 ? insights : [];

  return (
    <div className="p-3.5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-semibold text-white tracking-wide">
            Platform Intelligence
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
          Live AI Signals
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-3 text-center text-zinc-500 text-xs font-normal">
          Computing platform metrics...
        </div>
      ) : (
        /* Compact 2x2 Grid with Zero Truncation */
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, idx) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.reach;
            const Icon = config.icon;
            const isCreator = typeof item.highlight === 'string' && item.highlight.startsWith('@');

            return (
              <div
                key={item.id || idx}
                className="p-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/[0.05] hover:border-white/[0.12] transition-all flex flex-col justify-between group cursor-default"
                title={item.text}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-medium text-zinc-400 truncate">
                    {config.shortLabel}
                  </span>
                  <div className={`w-4 h-4 rounded-md ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-2.5 h-2.5 ${config.iconColor}`} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-white font-mono truncate">
                    {item.value || item.highlight}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium">
                    {isCreator ? (
                      <a
                        href={`https://www.instagram.com/${item.highlight.replace('@', '').trim()}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-400 hover:underline transition-colors font-mono cursor-pointer"
                        title="Open profile on Instagram"
                      >
                        {item.highlight}
                      </a>
                    ) : (
                      item.highlight || item.value
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
