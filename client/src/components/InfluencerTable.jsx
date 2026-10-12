import React, { useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function InfluencerTable({
  influencers,
  selectedCategory,
  setSelectedCategory,
  onViewInfluencer,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const categories = ['All', 'Tech & AI', 'Lifestyle & Wellness', 'Business & Finance', 'Travel & Adventure', 'Fashion & Style'];

  const categoryBadgeStyles = {
    'Tech & AI': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Tech': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Lifestyle & Wellness': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    'Lifestyle': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    'Business & Finance': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Travel & Adventure': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'Fashion & Style': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Food & Cooking': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    'Fitness & Health': 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const getAvatarUrl = (idx) => {
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&h=60&fit=crop&crop=face',
    ];
    return avatars[idx % avatars.length];
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0F1422] border border-white/[0.07] shadow-sm flex flex-col justify-between">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Title */}
        <div className="flex items-center gap-2 text-sm font-bold text-white tracking-tight">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Top Influencers</span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All' && !selectedCategory);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            );
          })}

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ml-1"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-3">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Quick filter table..."
            className="w-full bg-slate-900 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.07] text-slate-400 font-medium">
              <th className="py-2.5 px-3 w-8">#</th>
              <th className="py-2.5 px-3">Profile</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Followers</th>
              <th className="py-2.5 px-3">Engagement Rate</th>
              <th className="py-2.5 px-3">Influence Score</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {influencers && influencers.length > 0 ? (
              influencers.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-3 font-mono text-slate-500 font-medium">{item.rank || idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getAvatarUrl(idx)}
                        alt={item.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                      />
                      <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {item.handle}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        categoryBadgeStyles[item.category] || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300 font-medium">{item.followers_formatted}</td>
                  <td className="py-3 px-3 font-mono text-slate-300 font-medium">{item.engagement_rate_pct}%</td>
                  <td className="py-3 px-3 font-mono font-semibold text-white">{item.composite_influence_score}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onViewInfluencer(item)}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-indigo-600 border border-white/[0.08] hover:border-indigo-500 text-[11px] font-medium text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  No influencers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="text-white font-medium">
            {totalCount === 0 ? 0 : (currentPage - 1) * 10 + 1} - {Math.min(totalCount, currentPage * 10)}
          </span>{' '}
          of <span className="text-white font-medium">{(totalCount || 0).toLocaleString()}</span> influencers
        </div>

        <div className="flex items-center gap-1 font-mono">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-white/[0.06] text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold transition-all ${
                currentPage === pageNum
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {pageNum}
            </button>
          ))}
          {totalPages > 5 && (
            <>
              <span className="px-1 text-slate-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`min-w-6 px-1.5 h-6 rounded flex items-center justify-center text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-white/[0.06] text-slate-300 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
