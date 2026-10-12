import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

/**
 * Delete.jsx - Luxury Obsidian Modal for confirming dataset deletion & restoring defaults.
 * Uses createPortal to cover 100% of the viewport (including top navbar) with a soft, premium frosted blur.
 */
export default function Delete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Custom Dataset?',
  description = 'Are you sure you want to permanently delete the uploaded dataset? This will restore the base 2,180 verified creators and reset all rankings.',
  loading = false,
}) {
  // Lock background scroll & handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    lockScroll();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center p-4 bg-black/45 backdrop-blur-[5px] transition-all animate-fadeIn"
      style={{ WebkitBackdropFilter: 'blur(5px)' }}
    >
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={loading ? undefined : onClose} 
        aria-hidden="true" 
      />

      {/* Modal Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative w-full max-w-md p-6 bg-[#0D0F14]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] z-10 space-y-5 animate-scaleUp"
      >
        {/* Top Header with Danger Icon & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-sm shrink-0">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Action Required</span>
              </div>
              <h3 id="delete-dialog-title" className="text-base font-bold text-white tracking-tight mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Body Content */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            {description}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>This action cannot be undone once confirmed.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Restoring Default...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete & Restore Default</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Mount at document.body level so the entire viewport (including top navbar) is softly blurred
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
