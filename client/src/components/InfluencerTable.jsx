import React, { useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import { API_BASE_URL } from '../config/api';

export default function InfluencerTable({
  influencers,
  selectedCategory,
  setSelectedCategory,
  onViewInfluencer,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  pageSize = 6,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    'All',
    'Tech & AI',
    'Lifestyle & Wellness',
    'Business & Finance',
    'Travel & Adventure',
    'Fashion & Style',
    'Food & Cooking',
    'Fitness & Health',
  ];

  const getCreatorAvatarUrl = (item) => {
    const cleanHandle = (item.handle || item.name || '').replace('@', '').trim();
    return `${API_BASE_URL}/api/avatar/${cleanHandle}`;
  };

  return (
    <div className="p-3.5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm flex flex-col justify-between transition-all">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5 pb-2 border-b border-white/[0.06]">
        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white tracking-wide shrink-0">
          <Users className="w-3.5 h-3.5 text-white" />
          <span>Top Influencers</span>
          <span className="text-[11px] text-zinc-500 font-normal ml-1">
            ({totalCount ? totalCount.toLocaleString() : 0})
          </span>
        </div>

        {/* Header Action Controls: Category Dropdown & Quick Search */}
        <div className="flex items-center gap-2">
          <CustomDropdown
            value={selectedCategory || 'All'}
            options={categories}
            onChange={(val) => setSelectedCategory(val === 'All' ? '' : val)}
            showCategoryDots={true}
            compact={true}
            className="w-40"
          />

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              showSearch
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-[#121620] border-white/[0.08] hover:border-white/[0.18] text-zinc-400 hover:text-white hover:bg-[#151A24]'
            }`}
            title="Search table"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-2.5 animate-fadeIn">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Quick filter table..."
            className="w-full bg-[#121620] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-zinc-400 font-medium text-[11px]">
              <th className="py-2 px-2.5 w-8">#</th>
              <th className="py-2 px-2.5">Profile</th>
              <th className="py-2 px-2.5">Category</th>
              <th className="py-2 px-2.5">Followers</th>
              <th className="py-2 px-2.5">Engagement Rate</th>
              <th className="py-2 px-2.5">Influence Score</th>
              <th className="py-2 px-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {influencers && influencers.length > 0 ? (
              influencers.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-2 px-2.5 font-mono text-zinc-500 font-medium text-[11px]">{item.rank || idx + 1}</td>
                  <td className="py-2 px-2.5">
                    <a
                      href={item.profile_url || `https://www.instagram.com/${(item.handle || '').replace('@', '').trim()}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 group/creator hover:opacity-95 transition-all cursor-pointer"
                      title={`Open Instagram profile for ${item.handle}`}
                    >
                      <img
                        src={getCreatorAvatarUrl(item)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/10 bg-zinc-800 group-hover/creator:border-pink-500/50 group-hover/creator:shadow-[0_0_8px_rgba(236,72,153,0.3)] transition-all"
                        onError={(e) => {
                          const clean = (item.name || item.handle || 'C').replace('@', '');
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(clean)}&background=18181b&color=ffffff&bold=true`;
                        }}
                      />
                      <span className="font-semibold text-white group-hover/creator:text-pink-400 group-hover/creator:underline underline-offset-2 transition-colors flex items-center gap-1.5 text-xs">
                        <span>{item.handle}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500 group-hover/creator:text-pink-400 opacity-0 group-hover/creator:opacity-100 transition-opacity shrink-0" />
                      </span>
                    </a>
                  </td>
                  <td className="py-2 px-2.5 text-zinc-300 font-normal text-[11px]">
                    {item.category}
                  </td>
                  <td className="py-2 px-2.5 font-mono text-zinc-300 font-medium text-[11px]">{item.followers_formatted}</td>
                  <td className="py-2 px-2.5 font-mono text-zinc-300 font-medium text-[11px]">{item.engagement_rate_pct}%</td>
                  <td className="py-2 px-2.5 font-mono font-semibold text-white text-[11px]">{item.composite_influence_score}</td>
                  <td className="py-2 px-2.5 text-right">
                    <button
                      onClick={() => onViewInfluencer(item)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-white/[0.08] text-[10px] font-medium text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-zinc-500 text-xs">
                  No influencers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-2.5 mt-1 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-zinc-400">
        <div>
          Showing{' '}
          <span className="text-white font-medium">
            {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(totalCount, currentPage * pageSize)}
          </span>{' '}
          of <span className="text-white font-medium">{(totalCount || 0).toLocaleString()}</span> influencers
        </div>

        <div className="flex items-center gap-1 font-mono">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className={`p-1.5 rounded-lg border border-white/[0.06] text-zinc-300 transition-colors ${
              currentPage <= 1
                ? 'opacity-25 cursor-not-allowed bg-zinc-900/40'
                : 'bg-zinc-900 hover:bg-zinc-800 cursor-pointer active:scale-95 hover:text-white'
            }`}
            title={currentPage <= 1 ? 'First page reached' : 'Previous page'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
            <button
              type="button"
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {pageNum}
            </button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="px-1 text-zinc-500">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className={`p-1.5 rounded-lg border border-white/[0.06] text-zinc-300 transition-colors ${
              currentPage >= totalPages
                ? 'opacity-25 cursor-not-allowed bg-zinc-900/40'
                : 'bg-zinc-900 hover:bg-zinc-800 cursor-pointer active:scale-95 hover:text-white'
            }`}
            title={currentPage >= totalPages ? 'Last page reached' : 'Next page'}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
