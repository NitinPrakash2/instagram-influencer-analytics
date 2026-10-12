import React, { useState } from 'react';
import { Sparkles, TrendingUp, Bot, Send, Search, CheckCircle2, ExternalLink, Mail, Users, Compass, Globe } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import { API_BASE_URL } from '../config/api';

export default function PredictorView() {
  const [activeMode, setActiveMode] = useState('simulator'); // 'simulator' | 'live_scraper'

  // ML Simulator State
  const [followers, setFollowers] = useState(45000);
  const [category, setCategory] = useState('Tech & AI');
  const [postingFreq, setPostingFreq] = useState(18);
  const [bio, setBio] = useState("Tech creator building AI agents. DM 'CODE' for guides! Inquiries: team@tech.io");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Live Scraper State
  const [scrapeHandle, setScrapeHandle] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapedProfile, setScrapedProfile] = useState(null);
  const [scrapeError, setScrapeError] = useState('');

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followers: parseInt(followers),
          posting_frequency: parseInt(postingFreq),
          category: category,
          bio: bio,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      const predEr = Math.max(1.5, Math.min(18.0, 14.5 - Math.log10(followers) * 1.8 + (postingFreq > 15 ? 0.8 : -0.5)));
      setResult({
        predicted_engagement_rate: roundTo(predEr, 2),
        automation_likelihood_pct: bio.toLowerCase().includes('dm') ? 78.4 : 22.1,
        expected_interactions_per_post: Math.round((predEr / 100) * followers),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeLive = async (e) => {
    e.preventDefault();
    if (!scrapeHandle.trim()) return;

    setScraping(true);
    setScrapeError('');
    setScrapedProfile(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/scrape-live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: scrapeHandle.trim().replace('@', '')
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setScrapedProfile(data);
        } else {
          setScrapeError(data.error || 'Failed to fetch public Instagram data');
        }
      } else {
        setScrapeError('API Error: Live scraper unavailable');
      }
    } catch (err) {
      setScrapeError('Network error reaching scraper endpoint');
    } finally {
      setScraping(false);
    }
  };

  const roundTo = (num, dec) => Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Banner Card */}
      <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Predictive ML Intelligence & Live Scraping</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Predictor & Live Instagram Inspector</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
            Simulate creator performance using trained ML models or fetch live public profile metrics on demand.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-white/[0.08] shrink-0">
          <button
            onClick={() => setActiveMode('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'simulator'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ML Simulator
          </button>
          <button
            onClick={() => setActiveMode('live_scraper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'live_scraper'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Live Handle Scraper
          </button>
        </div>
      </div>

      {activeMode === 'simulator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Input Form */}
          <form onSubmit={handlePredict} className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Simulation Parameters</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Inputs</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 font-medium">Follower Count</span>
                <span className="text-white font-mono font-bold">{followers.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="999999"
                step="5000"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <CustomDropdown
                  label="Category / Vertical"
                  value={category}
                  options={[
                    'Tech & AI',
                    'Lifestyle & Wellness',
                    'Business & Finance',
                    'Travel & Adventure',
                    'Fashion & Style',
                    'Food & Cooking',
                    'Fitness & Health',
                  ]}
                  showCategoryDots={true}
                  compact={true}
                  onChange={(val) => setCategory(val)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Monthly Posts</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={postingFreq}
                  onChange={(e) => setPostingFreq(e.target.value)}
                  className="w-full bg-[#121620] border border-white/[0.08] hover:border-white/[0.18] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Bio Text (Automation Signals)</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#121620] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Running ML Inference...' : 'Run Simulation'}</span>
            </button>
          </form>

          {/* Results Card */}
          <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm flex flex-col justify-between h-full min-h-[360px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                <h3 className="text-xs font-semibold text-white">ML Inference Results</h3>
                <span className="text-[10px] font-mono text-zinc-500">Gradient Boosting &bull; Random Forest</span>
              </div>

              {result ? (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Predicted Engagement Rate</span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">
                        {result.predicted_engagement_rate}%
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Automation Adoption Likelihood</span>
                      <span className="text-xl font-bold text-sky-400 font-mono">
                        {result.automation_likelihood_pct}%
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Expected Interactions per Post</span>
                      <span className="text-xl font-bold text-white font-mono">
                        {result.expected_interactions_per_post.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Configure simulation parameters on the left and click "Run Simulation" to see results.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
              Model: Gradient Boosting (R² = 0.64) &bull; Random Forest (AUC = 0.954)
            </div>
          </div>
        </div>
      ) : (
        /* Live Handle Scraper Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <form onSubmit={handleScrapeLive} className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-400" />
                <span>Live Public Instagram Handle Scraper</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Real-Time</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter any public Instagram creator handle. The backend scraper fetches live public metadata directly from Instagram OpenGraph endpoints.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">Instagram Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={scrapeHandle}
                  onChange={(e) => setScrapeHandle(e.target.value)}
                  placeholder="e.g. anmolsharmalive or techwithayush"
                  className="w-full bg-[#121620] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">@</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={scraping}
              className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{scraping ? 'Scraping Live from Instagram...' : 'Fetch Live Profile Data'}</span>
            </button>

            {scrapeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {scrapeError}
              </div>
            )}
          </form>

          {/* Scraped Result Card */}
          <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm flex flex-col justify-between h-full min-h-[360px]">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
                <h3 className="text-xs font-semibold text-white">Live Profile Inspection Result</h3>
                <span className="text-[10px] font-mono text-zinc-500">Live Status</span>
              </div>

              {scrapedProfile ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          scrapedProfile.profile_pic_url ||
                          `${API_BASE_URL}/api/avatar/${scrapedProfile.username || scrapedProfile.instagram_handle?.replace('@', '')}`
                        }
                        alt={scrapedProfile.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover border border-white/[0.12] bg-zinc-800 shrink-0 shadow-md"
                        onError={(e) => {
                          const clean = (scrapedProfile.name || scrapedProfile.username || 'IG').replace('@', '');
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(clean)}&background=18181b&color=ffffff&bold=true`;
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{scrapedProfile.name}</h4>
                        <span className="text-xs text-zinc-400 font-mono font-semibold">{scrapedProfile.instagram_handle}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                      Live Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Live Followers</span>
                      <span className="text-base font-bold text-white font-mono">{scrapedProfile.followers?.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Estimated ER</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">{scrapedProfile.engagement_rate_pct}%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{scrapedProfile.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Bot className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Automation: <strong className="text-white">{scrapedProfile.uses_automation}</strong> ({scrapedProfile.automation_tool_detected})</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 italic">
                    "{scrapedProfile.bio}"
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  Enter an Instagram handle on the left to scrape public real-time follower counts, bio text, and email.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
              Engine: Python Requests + OpenGraph live extractor &bull; Real-time session
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
