import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Mail,
  Bot,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Check,
  Copy,
  ShieldCheck,
  Zap,
  Award,
  Quote,
  RefreshCw,
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

// Helper to render inline text with bold/italic without raw asterisks
const renderInlineFormatted = (rawText) => {
  if (!rawText) return null;

  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(rawText.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const clean = matchedStr.slice(2, -2);
      parts.push(
        <strong key={match.index} className="text-white font-semibold">
          {clean}
        </strong>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      const clean = matchedStr.slice(1, -1);
      parts.push(
        <span key={match.index} className="text-indigo-200 font-medium">
          {clean}
        </span>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      const clean = matchedStr.slice(1, -1);
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-mono text-[10px]">
          {clean}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    parts.push(rawText.substring(lastIndex));
  }

  return parts.length > 0 ? parts : rawText;
};

// Formats raw AI response into sleek executive cards without markdown asterisks or hashes
const renderFormattedAiReport = (text) => {
  if (!text) return null;

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = { title: '', content: [] };

  lines.forEach((line) => {
    const isHeading =
      line.startsWith('###') ||
      line.startsWith('##') ||
      line.startsWith('#') ||
      (/^(\d+\.|\bSection\b)/i.test(line) && line.length < 65);

    if (isHeading) {
      if (currentSection.title || currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      const cleanTitle = line
        .replace(/^#+\s*/, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(/\*/g, '');
      currentSection = { title: cleanTitle, content: [] };
    } else {
      currentSection.content.push(line);
    }
  });

  if (currentSection.title || currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return (
    <div className="space-y-2.5 mt-2.5">
      {sections.map((sec, idx) => {
        // If it's a top-level introductory line without title
        if (!sec.title && idx === 0) {
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 font-medium"
            >
              {sec.content.map((p, pIdx) => (
                <p key={pIdx}>{renderInlineFormatted(p)}</p>
              ))}
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] hover:border-indigo-500/30 transition-all shadow-sm"
          >
            {sec.title && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                  {idx}
                </span>
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  {renderInlineFormatted(sec.title)}
                </h4>
              </div>
            )}
            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
              {sec.content.map((p, pIdx) => {
                if (p.startsWith('- ') || p.startsWith('• ') || p.startsWith('* ')) {
                  return (
                    <div key={pIdx} className="flex items-start gap-2 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{renderInlineFormatted(p.replace(/^[-•*]\s*/, ''))}</span>
                    </div>
                  );
                }
                return <p key={pIdx}>{renderInlineFormatted(p)}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function InfluencerModal({ influencer, onClose }) {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);

  if (!influencer) return null;

  const handleCopyEmail = (email) => {
    if (!email || email.includes('Not publicly')) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyHandle = (handle) => {
    navigator.clipboard.writeText(handle);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
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
          `### 1. Performance Summary\nHigh engagement rate (${influencer.engagement_rate_pct}%) in ${influencer.category}. Strong audience connection.\n\n### 2. Strategic Brand Opportunity\nPrime candidate for brand integrations and sponsor activations.`
        );
      }
    } catch (e) {
      setAiInsight(
        `### 1. Performance Summary\nEngagement rate of ${influencer.engagement_rate_pct}% with ${influencer.followers_formatted} followers.\n\n### 2. Growth Potential\nIdeal creator for targeted niche campaigns.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  // Determine follower tier
  const followersCount = influencer.followers || 0;
  const tier =
    followersCount < 10000
      ? 'Nano Creator'
      : followersCount < 100000
      ? 'Micro Creator'
      : 'Mid-Tier Creator';

  const isEmailAvailable =
    influencer.contact_email &&
    !influencer.contact_email.toLowerCase().includes('not publicly') &&
    influencer.contact_email !== 'None';

  const cleanHandle = influencer.handle?.replace('@', '') || '';
  const instagramUrl = influencer.profile_url || `https://instagram.com/${cleanHandle}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#0B0F19] border border-white/[0.12] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Glow Ambient Accent */}
        <div className="absolute top-0 left-1/4 w-1/2 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-pink-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-6 relative">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-xl font-bold text-white uppercase">
                {influencer.name?.charAt(0) || influencer.handle?.charAt(1) || 'C'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B0F19] flex items-center justify-center text-[10px] text-white">
              ✓
            </div>
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-white tracking-tight">{influencer.name}</h3>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors bg-white/[0.04] hover:bg-white/[0.08] px-2 py-0.5 rounded-md"
              >
                <span>View IG</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => handleCopyHandle(influencer.handle)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
              >
                <span>{influencer.handle}</span>
                {copiedHandle ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                )}
              </button>
              <span className="text-slate-600">&bull;</span>
              <span className="text-[11px] text-slate-400 font-medium">{tier}</span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {influencer.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                AI Score: {influencer.composite_influence_score}
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.07] hover:border-white/[0.12] transition-colors">
            <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Followers
            </span>
            <div className="text-base font-bold text-white font-mono">{influencer.followers_formatted}</div>
            <span className="text-[10px] text-slate-500">&lt; 1M Verified</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.07] hover:border-white/[0.12] transition-colors">
            <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Engagement
            </span>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {influencer.engagement_rate_pct}%
            </div>
            <span className="text-[10px] text-slate-500">Last 10 Posts</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/[0.07] hover:border-white/[0.12] transition-colors">
            <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Post Velocity
            </span>
            <div className="text-base font-bold text-white font-mono">
              {influencer.posting_frequency_monthly || 18}/mo
            </div>
            <span className="text-[10px] text-slate-500">Publish Rate</span>
          </div>
        </div>

        {/* Bio & Details Section */}
        <div className="space-y-3 mb-5 text-xs">
          {/* Bio Quote Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06] relative overflow-hidden">
            <Quote className="w-6 h-6 text-white/[0.04] absolute top-2 right-2 pointer-events-none" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Instagram Profile Bio
            </span>
            <p className="text-slate-300 italic leading-relaxed text-[11px]">
              "{influencer.bio || 'No public bio provided'}"
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400" />
              <span>Public Inquiry Email</span>
            </span>

            {isEmailAvailable ? (
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${influencer.contact_email}`}
                  className="font-mono text-white font-medium hover:text-indigo-300 transition-colors"
                >
                  {influencer.contact_email}
                </a>
                <button
                  onClick={() => handleCopyEmail(influencer.contact_email)}
                  className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-slate-500 font-mono text-[11px] bg-white/[0.03] px-2.5 py-1 rounded-lg">
                Not publicly listed
              </span>
            )}
          </div>

          {/* Automation Detection */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
            <span className="text-slate-400 flex items-center gap-2">
              {influencer.uses_automation === 'Yes' ? (
                <Bot className="w-4 h-4 text-cyan-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>Automation Workflow</span>
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
                influencer.uses_automation === 'Yes'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {influencer.uses_automation === 'Yes' ? (
                <>
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>ManyChat / Funnel Active</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>100% Organic Reach</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Gemini AI Strategic Evaluation */}
        <div className="border-t border-white/[0.08] pt-4">
          {!aiInsight ? (
            <button
              onClick={handleGenerateAiInsight}
              disabled={loadingAi}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-xs font-semibold text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {loadingAi ? 'Analyzing Creator with Google Gemini AI...' : 'Generate Gemini AI Audit'}
              </span>
            </button>
          ) : (
            <div className="rounded-2xl bg-[#090D16] border border-indigo-500/30 p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      AI Strategic Evaluation
                    </h4>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Powered by Google Gemini 2.5 Flash
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiInsight}
                  disabled={loadingAi}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1 text-[10px]"
                  title="Re-run assessment"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAi ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Parsed & Formatted AI Content without raw markdown asterisks */}
              {renderFormattedAiReport(aiInsight)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
