import React from 'react';
import { Search, Download, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Navbar({ searchQuery, setSearchQuery, onExportCsv, isOnline, recordsCount, lastUpdated }) {
  return (
    <header className="h-16 border-b border-white/[0.07] px-8 flex items-center justify-between bg-[#0A0D14]/90 backdrop-blur-md sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search influencers, categories, or keywords..."
          className="w-full bg-slate-900/90 border border-white/[0.08] rounded-xl pl-10 pr-12 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/[0.06]">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dynamic Connection Status Badge */}
        {isOnline ? (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Data ({recordsCount ? `${recordsCount.toLocaleString()} Synced` : 'Synced'})</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] font-semibold transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Backend Offline (Port 8000)</span>
          </div>
        )}

        {/* Dynamic timestamp */}
        <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
          {isOnline ? `Synced: ${lastUpdated || 'Live'}` : 'Server Not Connected'}
        </span>

        {/* Export CSV Button */}
        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/[0.09] text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08] cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase">
              NP
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
            <span>Nitin Prakash</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
