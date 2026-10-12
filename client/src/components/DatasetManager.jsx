import React, { useState, useEffect, useRef } from 'react';
import { Upload, Database, RotateCcw, Download, CheckCircle2, AlertCircle, FileSpreadsheet, Loader2, Trash2 } from 'lucide-react';
import Delete from './Delete';
import { API_BASE_URL } from '../config/api';

export default function DatasetManager({ onExportCsv, onDatasetChanged }) {
  const [datasetStatus, setDatasetStatus] = useState({ is_custom: false, records_count: 2180, filename: 'ranked_influencers.csv' });
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const fetchStatus = () => {
    fetch(`${API_BASE_URL}/api/dataset-status`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDatasetStatus(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext !== 'csv' && ext !== 'xlsx' && ext !== 'xls') {
        setNotification({ type: 'error', message: 'Please upload a .csv or .xlsx file.' });
        return;
      }
      setSelectedFile(file);
      setNotification(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setNotification(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload-dataset`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok && data.success) {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setNotification({ type: 'success', message: data.message });
        fetchStatus();
        if (onDatasetChanged) onDatasetChanged();
      } else {
        setNotification({ type: 'error', message: data.detail || 'Upload failed. Check file format.' });
      }
    } catch (err) {
      setUploading(false);
      setNotification({ type: 'error', message: 'Network error communicating with backend.' });
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    setNotification(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-dataset`, { method: 'POST' });
      const data = await res.json();
      setResetting(false);
      setShowDeleteModal(false);

      if (res.ok && data.success) {
        setNotification({ type: 'success', message: data.message });
        fetchStatus();
        if (onDatasetChanged) onDatasetChanged();
      } else {
        setNotification({ type: 'error', message: data.detail || 'Failed to reset dataset.' });
      }
    } catch (err) {
      setResetting(false);
      setShowDeleteModal(false);
      setNotification({ type: 'error', message: 'Network error resetting dataset.' });
    }
  };

  const downloadSampleTemplate = () => {
    const sampleCsv = `instagram_handle,name,followers,category,engagement_rate_pct,posting_frequency_monthly,email_or_contact,has_automation,bio
@tech_reviewer_pro,Alex Tech,45000,Tech & AI,7.85,18,contact@alextech.io,Yes,Reviewing cutting-edge AI tools and developer gear daily.
@wellness_with_maya,Maya Lifestyle,88000,Lifestyle & Wellness,9.20,24,maya@collabs.com,No,Mindful daily habits and holistic wellness routines.
@finance_insights_daily,Rohan Finance,125000,Business & Finance,5.40,12,partner@fininsights.com,Yes,Simplifying stock market trends & venture capital for founders.
@travel_with_sam,Sam Travels,32000,Travel & Adventure,11.50,15,sam@traveldest.com,No,Backpacking through hidden spots across Asia & Europe.
@urban_fashion_guide,Zara Styles,95000,Fashion & Style,6.75,20,zara@styleagency.com,Yes,Minimalist streetwear and sustainable wardrobe essentials.`;

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_influencers_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Dataset Management & Ingestion Engine</h2>
            {datasetStatus.is_custom ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                Custom Dataset Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-semibold">
                Base Verified Dataset
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Currently loaded: <span className="text-white font-medium">{datasetStatus.records_count.toLocaleString()}</span> creators (<span className="font-mono text-zinc-300">{datasetStatus.filename}</span>).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={downloadSampleTemplate}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Download formatted CSV template for upload"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sample CSV</span>
          </button>

          {datasetStatus.is_custom && (
            <button
              onClick={handleOpenDeleteModal}
              disabled={resetting}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-medium text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Custom & Restore Default</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold shadow-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Active CSV</span>
          </button>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide">Upload & Ingest Custom Dataset</h3>
          </div>
          <span className="text-[11px] text-zinc-400">Supported: .CSV, .XLSX (&lt; 1M followers)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-white/[0.15] hover:border-white/[0.3] rounded-xl p-4 text-center cursor-pointer bg-[#121620]/50 hover:bg-[#121620] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-medium text-white">
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop custom dataset'}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB selected • Ready to process`
                    : 'System will automatically normalize handles, run ML engagement models, and compute rankings'}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedFile && !uploading
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing & Scoring ML...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ingest & Scrape Dataset</span>
                </>
              )}
            </button>

            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-[11px] text-zinc-400 hover:text-white text-center py-1 transition-colors cursor-pointer"
              >
                Clear selected file
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {notification && (
          <div
            className={`mt-3.5 p-3 rounded-xl border flex items-center gap-2 text-xs animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* Luxury Obsidian Delete Confirmation Modal */}
      <Delete
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmReset}
        loading={resetting}
        title="Delete Custom Dataset?"
        description="Are you sure you want to permanently delete the uploaded dataset? This will restore the base 2,180 verified creators and reset all rankings."
      />
    </div>
  );
}
