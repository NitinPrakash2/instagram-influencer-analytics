import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, User, Check, Sparkles, ChevronDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function Navbar({ searchQuery, setSearchQuery, onExport, onExportCsv, isOnline, recordsCount, lastUpdated }) {
  const [userProfile, setUserProfile] = useState({
    name: 'Analyst',
    role: 'Lead Data Strategist',
    email: 'analyst@instarank.ai',
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [savedBadge, setSavedBadge] = useState(false);
  const profileRef = useRef(null);
  const exportRef = useRef(null);

  // Fetch dynamic user profile from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user-profile`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.name) {
          setUserProfile(data);
          setEditNameInput(data.name);
        }
      })
      .catch(() => {
        // Fallback to local storage if offline
        const local = localStorage.getItem('instarank_analyst_name');
        if (local) {
          setUserProfile((prev) => ({ ...prev, name: local }));
          setEditNameInput(local);
        }
      });
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveName = async () => {
    if (!editNameInput.trim()) return;
    const newName = editNameInput.trim();

    // Optimistic update
    setUserProfile((prev) => ({ ...prev, name: newName }));
    localStorage.setItem('instarank_analyst_name', newName);

    try {
      await fetch(`${API_BASE_URL}/api/user-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      setSavedBadge(true);
      setTimeout(() => setSavedBadge(false), 2000);
    } catch {
      // Local storage already set
    }
  };

  // Dynamic Initials from user's active name (e.g. "Nitin Prakash" -> "NP")
  const initials = (userProfile?.name || 'Analyst')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AN';

  return (
    <header className="h-16 border-b border-white/[0.06] px-8 flex items-center justify-between bg-[#07090E]/95 backdrop-blur-md sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search influencers, categories, or keywords..."
          className="w-full bg-[#121620] border border-white/[0.08] hover:border-white/[0.18] rounded-xl pl-10 pr-12 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-zinc-400 font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded border border-white/[0.06]">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Connection Status Badge */}
        {isOnline ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-white/[0.08] text-zinc-400 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            <span>Offline</span>
          </div>
        )}

        {/* Luxury Export Data Dropdown Button */}
        <div className="relative" ref={exportRef}>
          <button
            type="button"
            onClick={() => setIsExportOpen(!isExportOpen)}
            disabled={isDownloading !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-60"
            title="Download Influencer Analytics Dataset"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>{isDownloading ? 'Downloading...' : 'Export Data'}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isExportOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#0B0E14]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] p-2 space-y-1 animate-fadeIn">
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                Choose Export Format
              </div>

              {/* Option 1: Microsoft Excel (.xlsx) */}
              <button
                type="button"
                onClick={async () => {
                  setIsExportOpen(false);
                  setIsDownloading('excel');
                  try {
                    await (onExport ? onExport('excel') : onExportCsv('excel'));
                  } finally {
                    setIsDownloading(null);
                  }
                }}
                className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500/20">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200 group-hover:text-white">
                    <span>Microsoft Excel (.xlsx)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">Recommended</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                    Best for Excel • Auto-fit columns • Native Unicode & Emojis • Frozen headers
                  </p>
                </div>
              </button>

              {/* Option 2: CSV Dataset (.csv) */}
              <button
                type="button"
                onClick={async () => {
                  setIsExportOpen(false);
                  setIsDownloading('csv');
                  try {
                    await (onExport ? onExport('csv') : onExportCsv('csv'));
                  } finally {
                    setIsDownloading(null);
                  }
                }}
                className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5 group-hover:bg-blue-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-zinc-200 group-hover:text-white">
                    CSV Dataset (.csv)
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                    UTF-8 with BOM format • 27 Columns • Universal spreadsheet & pandas format
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Real-Time User Profile Pill (Interactive & Dynamic) */}
        <div className="relative pl-2 border-l border-white/[0.06]" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer group select-none text-left"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.1] group-hover:border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0 transition-all">
              {initials}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
              <span className="max-w-[120px] truncate">{userProfile.name}</span>
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-white' : ''}`} />
            </div>
          </button>

          {/* Luxury Obsidian Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-[#0B0E14]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] p-3 space-y-3 animate-fadeIn">
              {/* Header Info */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{userProfile.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{userProfile.role}</div>
                </div>
              </div>

              {/* Dynamic Name Editor */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-zinc-400 block">Analyst Profile Name</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    placeholder="Enter display name..."
                    className="w-full bg-[#121620] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-2.5 py-1.5 rounded-xl bg-white text-black text-[11px] font-semibold hover:bg-zinc-200 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                  >
                    Save
                  </button>
                </div>
                {savedBadge && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono pt-0.5 animate-fadeIn">
                    <Check className="w-3 h-3" /> Profile updated in real time!
                  </span>
                )}
              </div>

              {/* Footer Status */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Analyst Session
                </span>
                <span>v2.5 Pro</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
