import React from 'react';
import { 
  Home, 
  Star, 
  LayoutGrid, 
  Database, 
  FileText, 
  Settings, 
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
    <aside className="w-64 min-w-[256px] h-screen sticky top-0 flex flex-col justify-between p-4 bg-[#07090E] border-r border-white/[0.06] select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/[0.08] flex items-center justify-center shadow-sm">
            <div className="w-5 h-5 rounded-md border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full border border-white"></div>
            </div>
          </div>
          <div>
            <div className="text-base font-semibold text-white tracking-tight flex items-center gap-1.5 leading-none">
              InstaRank
            </div>
            <div className="text-[11px] text-zinc-400 font-medium mt-1">
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
                type="button"
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-zinc-800/90 text-white border border-white/[0.08] shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean minimal footer */}
      <div className="px-3 py-2 text-[11px] text-zinc-500 font-mono border-t border-white/[0.06]">
        <span>v2.5 &bull; 2,180 Creators</span>
      </div>
    </aside>
  );
}
