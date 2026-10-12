import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import CategoryDonutChart from './components/CategoryDonutChart';
import EngagementHistogram from './components/EngagementHistogram';
import CategoryFollowersBar from './components/CategoryFollowersBar';
import InfluencerTable from './components/InfluencerTable';
import FiltersCard from './components/FiltersCard';
import KeyInsightsCard from './components/KeyInsightsCard';
import InfluencerModal from './components/InfluencerModal';
import ReportsView from './components/ReportsView';
import PredictorView from './components/PredictorView';
import SettingsView from './components/SettingsView';
import { WifiOff, AlertTriangle, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from './config/api';

const TAB_TITLES = {
  dashboard: { title: 'Dashboard Overview', desc: 'Real-time performance metrics across 2,180 verified creators' },
  influencers: { title: 'Top Influencers Leaderboard', desc: 'Ranked by composite score, authentic engagement, and audience reach' },
  categories: { title: 'Category Intelligence', desc: 'Distribution and follower scale across creator verticals' },
  dataset: { title: 'Verified Ingested Dataset', desc: 'Full public Instagram dataset under 1M followers' },
  'ai-predictor': { title: 'AI Performance Simulator', desc: 'Real-time predictive inference using Gradient Boosting & Random Forest' },
  reports: { title: 'Executive Intelligence Reports', desc: 'Strategic audience benchmarks, monetization metrics & LLM audits' },
  settings: { title: 'Platform & API Settings', desc: 'Runtime configuration, Google Gemini API management & scoring weights' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minFollowers: 'Any',
    maxFollowers: '1M',
    minEr: 'Any',
    hasAutomation: 'Any',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  // Dynamic API state (Zero hardcoded values)
  const [isOnline, setIsOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [engagementData, setEngagementData] = useState([]);
  const [topCategoriesFollowers, setTopCategoriesFollowers] = useState([]);
  const [keyInsights, setKeyInsights] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. Health check & connectivity heartbeat
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setIsOnline(true);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        return true;
      } else {
        setIsOnline(false);
        return false;
      }
    } catch (err) {
      setIsOnline(false);
      return false;
    }
  }, []);

  // Poll server health every 3 seconds
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 3000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // 2. Fetch all dynamic dashboard charts & stats when online
  useEffect(() => {
    if (!isOnline) {
      setStats(null);
      setCategoryData(null);
      setEngagementData([]);
      setTopCategoriesFollowers([]);
      setKeyInsights([]);
      return;
    }

    // Fetch Stats
    fetch(`${API_BASE_URL}/api/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});

    // Fetch Category Distribution
    fetch(`${API_BASE_URL}/api/category-distribution`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCategoryData(data);
      })
      .catch(() => {});

    // Fetch Engagement Distribution
    fetch(`${API_BASE_URL}/api/engagement-distribution`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setEngagementData(data);
      })
      .catch(() => {});

    // Fetch Top Categories Followers
    fetch(`${API_BASE_URL}/api/top-categories-followers`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setTopCategoriesFollowers(data);
      })
      .catch(() => {});

    // Fetch Key Insights
    fetch(`${API_BASE_URL}/api/key-insights`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKeyInsights(data);
      })
      .catch(() => {});
  }, [isOnline]);

  // 3. Fetch real influencers list from API
  useEffect(() => {
    if (!isOnline) {
      setInfluencers([]);
      setTotalPages(1);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (filters.category && filters.category !== 'All Categories') params.append('category', filters.category);
    if (searchQuery) params.append('search', searchQuery);
    if (filters.minFollowers && filters.minFollowers !== 'Any') params.append('min_followers', filters.minFollowers);
    if (filters.maxFollowers && filters.maxFollowers !== '1M') params.append('max_followers', filters.maxFollowers);
    if (filters.minEr && filters.minEr !== 'Any') params.append('min_er', filters.minEr);
    if (filters.hasAutomation && filters.hasAutomation !== 'Any') params.append('has_automation', filters.hasAutomation);
    params.append('page', currentPage.toString());
    params.append('limit', '10');

    fetch(`${API_BASE_URL}/api/influencers?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setLoading(false);
        if (data && data.items) {
          setInfluencers(data.items);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        } else {
          setInfluencers([]);
        }
      })
      .catch(() => {
        setLoading(false);
        setInfluencers([]);
      });
  }, [isOnline, selectedCategory, filters, searchQuery, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setFilters({
      category: '',
      minFollowers: 'Any',
      maxFollowers: '1M',
      minEr: 'Any',
      hasAutomation: 'Any',
    });
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    if (isOnline) {
      window.open(`${API_BASE_URL}/api/export-csv`, '_blank');
    } else {
      alert('Backend server is offline. Please start FastAPI on port 8000 to export data.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0D14] text-slate-100 font-sans antialiased selection:bg-indigo-500/30">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExportCsv={handleExportCsv}
          isOnline={isOnline}
          recordsCount={totalCount || stats?.total_influencers}
          lastUpdated={lastUpdated}
        />

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Top Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {TAB_TITLES[activeTab]?.title || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {TAB_TITLES[activeTab]?.desc}
              </p>
            </div>

            {/* Sync button */}
            <button
              onClick={checkHealth}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Sync</span>
            </button>
          </div>

          {/* Offline Banner Warning - Appears ONLY when server is disconnected */}
          {!isOnline && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Backend Server Offline</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                      Disconnected
                    </span>
                  </h3>
                  <p className="text-xs text-rose-200/80 mt-0.5">
                    No hardcoded mock data is displayed. Run this command in your server terminal to load real-time analytics:
                  </p>
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px] bg-black/60 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-100 select-all">
                    <Terminal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>..\.venv\Scripts\python -m uvicorn main:app --reload --port 8000</span>
                  </div>
                </div>
              </div>
              <button
                onClick={checkHealth}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md transition-all active:scale-95 shrink-0"
              >
                Check Status
              </button>
            </div>
          )}

          {/* Conditional Tab Rendering */}
          {activeTab === 'dashboard' && (
            <>
              {/* Row 1: 4 KPI Cards */}
              <KpiCards stats={stats} isOnline={isOnline} />

              {/* Row 2: 3 Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <CategoryDonutChart data={categoryData} />
                <EngagementHistogram data={engagementData} />
                <CategoryFollowersBar data={topCategoriesFollowers} onSeeAll={() => setActiveTab('categories')} />
              </div>

              {/* Row 3: Bottom Split (Table on Left, Filters & Key Insights on Right) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* 70% Left: Top Influencers Table */}
                <div className="xl:col-span-8">
                  <InfluencerTable
                    influencers={influencers}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onViewInfluencer={(item) => setSelectedInfluencer(item)}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                  />
                </div>

                {/* 30% Right: Filters Card + Key Insights */}
                <div className="xl:col-span-4 space-y-6">
                  <FiltersCard
                    filters={filters}
                    setFilters={setFilters}
                    onReset={handleResetFilters}
                  />
                  <KeyInsightsCard insights={keyInsights} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'influencers' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm">
                <h2 className="text-xl font-bold text-white mb-1">Top Influencer Leaderboards</h2>
                <p className="text-xs text-slate-400">
                  Comprehensive ranking across all verified creators based on multi-factor engagement & consistency.
                </p>
              </div>
              <InfluencerTable
                influencers={influencers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onViewInfluencer={(item) => setSelectedInfluencer(item)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm">
                <h2 className="text-xl font-bold text-white mb-1">Niche Category Analytics</h2>
                <p className="text-xs text-slate-400">
                  Explore distribution, average followers, and engagement patterns across creator verticals.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryDonutChart data={categoryData} />
                <CategoryFollowersBar data={topCategoriesFollowers} onSeeAll={() => {}} />
              </div>
              <InfluencerTable
                influencers={influencers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onViewInfluencer={(item) => setSelectedInfluencer(item)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Full Ingested Dataset (100% Real Records)</h2>
                  <p className="text-xs text-slate-400">
                    2,180 verified creators under 1M followers scraped from public Instagram profiles.
                  </p>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30"
                >
                  Download Raw CSV
                </button>
              </div>
              <InfluencerTable
                influencers={influencers}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onViewInfluencer={(item) => setSelectedInfluencer(item)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalCount={totalCount}
              />
            </div>
          )}

          {activeTab === 'ai-predictor' && (
            <PredictorView />
          )}

          {activeTab === 'reports' && (
            <ReportsView onExportCsv={handleExportCsv} />
          )}

          {activeTab === 'settings' && (
            <SettingsView isOnline={isOnline} onExportCsv={handleExportCsv} />
          )}
        </main>
      </div>

      {/* Influencer Inspector Modal */}
      <InfluencerModal
        influencer={selectedInfluencer}
        onClose={() => setSelectedInfluencer(null)}
      />
    </div>
  );
}
