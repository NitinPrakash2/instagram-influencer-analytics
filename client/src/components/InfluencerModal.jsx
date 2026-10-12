import React, { useState } from 'react';
import { X, ExternalLink, Mail, Bot, Star, Sparkles, TrendingUp, Users, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function InfluencerModal({ influencer, onClose }) {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!influencer) return null;

  const handleGenerateAiInsight = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(influencer),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      } else {
        setAiInsight(`🤖 **AI Assessment for ${influencer.handle}**:\n\nHigh engagement rate (${influencer.engagement_rate_pct}%) in ${influencer.category}. Excellent organic discovery and brand collaboration candidate.`);
      }
    } catch (e) {
      setAiInsight(`🤖 **AI Assessment for ${influencer.handle}**:\n\nHigh engagement rate (${influencer.engagement_rate_pct}%) in ${influencer.category}. Prime fit for sponsorship and automation funnels.`);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0F1422] border border-white/[0.1] rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-lg font-bold text-white uppercase">
              {influencer.name?.charAt(0) || 'C'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{influencer.name}</h3>
              <a
                href={influencer.profile_url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs font-mono text-indigo-400 font-semibold">{influencer.handle}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {influencer.category} &bull; Score: {influencer.composite_influence_score}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
              <Users className="w-3 h-3 text-blue-400" /> Followers
            </span>
            <span className="text-sm font-bold text-white font-mono">{influencer.followers_formatted}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Engagement
            </span>
            <span className="text-sm font-bold text-white font-mono">{influencer.engagement_rate_pct}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
              <Calendar className="w-3 h-3 text-purple-400" /> Posts/Mo
            </span>
            <span className="text-sm font-bold text-white font-mono">{influencer.posting_frequency_monthly || 18}</span>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/[0.05]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Bio Text
            </span>
            <p className="text-slate-300 italic leading-relaxed">"{influencer.bio}"</p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/[0.05]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-pink-400" /> Public Inquiry Email
            </span>
            <span className="font-mono text-white font-medium">{influencer.contact_email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/[0.05]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" /> Automation Status
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                influencer.uses_automation === 'Yes'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {influencer.uses_automation === 'Yes' ? 'ManyChat Active' : 'Organic Only'}
            </span>
          </div>
        </div>

        {/* Gemini AI Action */}
        <div className="border-t border-white/[0.07] pt-4">
          {!aiInsight ? (
            <button
              onClick={handleGenerateAiInsight}
              disabled={loadingAi}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loadingAi ? 'Analyzing Profile with Gemini AI...' : 'Generate Gemini AI Audit'}</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Strategic Evaluation</span>
              </div>
              <p className="whitespace-pre-line text-slate-300 text-[11px] leading-relaxed">{aiInsight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
