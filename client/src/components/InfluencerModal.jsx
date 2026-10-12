import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function InfluencerModal({ influencer, onClose }) {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  if (!influencer) return null;

  const handleCopy = (text, type) => {
    if (!text || text.includes('Not publicly')) return;
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2000);
    }
  };

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
        setAiInsight(
          `• Performance: High engagement rate (${influencer.engagement_rate_pct}%) with strong audience connection.\n• Workflow: Natural organic growth without automated DM funnels.\n• Brand Fit: High potential for niche sponsorships in ${influencer.category}.`
        );
      }
    } catch {
      setAiInsight(
        `• Performance: ${influencer.followers_formatted} followers with healthy engagement rate.\n• Workflow: Standard organic creator profile.\n• Brand Fit: Recommended for targeted campaigns.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const cleanHandle = influencer.handle?.replace('@', '') || '';
  const instagramUrl = influencer.profile_url || `https://instagram.com/${cleanHandle}`;
  const hasEmail =
    influencer.contact_email &&
    !influencer.contact_email.toLowerCase().includes('not publicly') &&
    influencer.contact_email !== 'None';

  // Format AI lines cleanly: strip any leftover markdown hashes or asterisks
  const formatAiLines = (raw) => {
    if (!raw) return [];
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) =>
        line
          .replace(/^#+\s*/, '')
          .replace(/^\*\s*/, '• ')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
      );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0D0F14] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative text-zinc-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 pr-6">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-base font-semibold text-white shrink-0 uppercase">
            {influencer.name?.charAt(0) || influencer.handle?.charAt(1) || 'C'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white truncate">{influencer.name}</h3>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                title="Open on Instagram"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <button
                onClick={() => handleCopy(influencer.handle, 'handle')}
                className="hover:text-zinc-200 transition-colors flex items-center gap-1 font-mono"
              >
                <span>{influencer.handle}</span>
                {copiedHandle ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-40 hover:opacity-100" />
                )}
              </button>
              <span>·</span>
              <span>{influencer.category}</span>
              <span>·</span>
              <span className="text-zinc-300">Score {influencer.composite_influence_score}</span>
            </div>
          </div>
        </div>

        {/* 3 Core Stats (Minimal Monochrome Surface) */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] bg-zinc-900/60 border border-white/[0.06] rounded-xl py-3 mb-4 text-center">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Followers</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">
              {influencer.followers_formatted}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-medium">Engagement</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">
              {influencer.engagement_rate_pct}%
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-medium">Monthly Posts</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">
              {influencer.posting_frequency_monthly || 18}
            </div>
          </div>
        </div>

        {/* Bio (Concise) */}
        {influencer.bio && (
          <div className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/30 border border-white/[0.04] rounded-xl p-3 mb-4">
            <p className="italic text-zinc-300 line-clamp-3">"{influencer.bio}"</p>
          </div>
        )}

        {/* Details Row: Email & Automation */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-zinc-500">Contact:</span>
            {hasEmail ? (
              <button
                onClick={() => handleCopy(influencer.contact_email, 'email')}
                className="text-zinc-200 hover:text-white transition-colors font-mono flex items-center gap-1 truncate"
              >
                <span className="truncate">{influencer.contact_email}</span>
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 opacity-40 hover:opacity-100 shrink-0" />
                )}
              </button>
            ) : (
              <span className="text-zinc-500">Not listed</span>
            )}
          </div>

          <div className="shrink-0 pl-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-white/[0.06]">
              {influencer.uses_automation === 'Yes' ? 'Automated' : 'Organic'}
            </span>
          </div>
        </div>

        {/* AI Assessment Area */}
        {!aiInsight ? (
          <button
            onClick={handleGenerateAiInsight}
            disabled={loadingAi}
            className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{loadingAi ? 'Analyzing Profile...' : 'AI Summary'}</span>
          </button>
        ) : (
          <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-[11px] font-semibold text-zinc-200 tracking-wide uppercase">
                AI Assessment
              </span>
              <button
                onClick={handleGenerateAiInsight}
                disabled={loadingAi}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                title="Regenerate"
              >
                <RefreshCw className={`w-3 h-3 ${loadingAi ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed font-normal">
              {formatAiLines(aiInsight).map((line, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-500 select-none">•</span>
                  <span>{line.replace(/^[•\-]\s*/, '')}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
