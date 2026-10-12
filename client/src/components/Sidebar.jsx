import React from 'react';
import { 
  Home, 
  Star, 
  LayoutGrid, 
  Database, 
  FileText, 
  Settings, 
  Zap, 
  Sparkles 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'influencers', label: 'Top Influencers', icon: Star },
    { id: 'categories', label: 'Explore by Category', icon: LayoutGrid },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'ai-predictor', label: 'AI Predictor', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-w-[256px] h-screen sticky top-0 flex flex-col justify-between p-4 bg-[#0A0D14]/95 border-r border-white/[0.07] select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] p-[2px] shadow-lg shadow-pink-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0D14] rounded-[10px] flex items-center justify-center">
              <div className="w-5 h-5 rounded-md border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border border-white"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
              InstaRank
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Influencer Analytics
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-800/90 text-white border border-white/10 shadow-lg shadow-black/40 backdrop-blur-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean minimal footer */}
      <div className="px-3 py-2 text-[11px] text-slate-500 font-mono border-t border-white/[0.05]">
        <span>v2.5 &bull; 2,180 Creators</span>
      </div>
    </aside>
  );
}
