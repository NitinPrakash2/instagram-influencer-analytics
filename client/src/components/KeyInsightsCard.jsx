import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function KeyInsightsCard({ insights = [] }) {
  const items = insights && insights.length > 0 ? insights : [];

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight mb-3.5">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <span>Key Insights</span>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs">
          <span>Waiting for backend statistical engine...</span>
        </div>
      ) : (
        /* Bullets List */
        <div className="space-y-3">
          {items.map((item, idx) => {
            const text = typeof item === 'string' ? item : item.text;
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
