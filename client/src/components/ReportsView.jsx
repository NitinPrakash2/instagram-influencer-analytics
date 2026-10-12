import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, TrendingUp, Cpu, Bot, BarChart2, ShieldCheck, Printer } from 'lucide-react';

export default function ReportsView({ onExportCsv }) {
  const [activeReport, setActiveReport] = useState('market_intel');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <span>EXECUTIVE INTELLIGENCE</span>
            <span>&bull;</span>
            <span>CAMPAIGN ANALYTICS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Executive Creator Reports & Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            In-depth statistical breakdown, predictive ML benchmarks, and audience engagement patterns across 2,180 verified creators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onExportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV (2,180 Rows)</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveReport('market_intel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeReport === 'market_intel'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Market Intelligence & Micro-Creator Benchmark</span>
        </button>

        <button
          onClick={() => setActiveReport('ml_ai_eval')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeReport === 'ml_ai_eval'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Machine Learning & Automation Detection Audit</span>
        </button>
      </div>

      {/* Report Body */}
      {activeReport === 'market_intel' && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm space-y-6">
          <div className="border-b border-white/[0.07] pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Executive Briefing: Creator Ecosystem & Engagement Efficiency
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Sample: 2,180 verified public accounts under 1,000,000 followers &bull; Audit Date: October 2026
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.06]">
              <div className="text-[11px] text-slate-400 font-medium">Audited Creators</div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">2,180</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.06]">
              <div className="text-[11px] text-slate-400 font-medium">Benchmark Avg. ER</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">7.90%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.06]">
              <div className="text-[11px] text-slate-400 font-medium">Leading Vertical</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">Tech & AI (58.2%)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.06]">
              <div className="text-[11px] text-slate-400 font-medium">Bot/Funnel Adoption</div>
              <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">8.7% (190)</div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-sm font-bold text-white">1. Micro vs Macro Creator Yield Disparity</h4>
            <p>
              Analysis of verified accounts reveals a decisive inverse correlation between follower scale and active community engagement. 
              Creators in the <strong>5,000 to 50,000 follower range</strong> average an engagement rate of <strong>8.4%</strong>, outperforming accounts above 500,000 followers (which average <strong>2.1%</strong>) by approximately <strong>4x</strong> in comment ratio and community interaction.
            </p>

            <h4 className="text-sm font-bold text-white">2. Niche Vertical Dynamics</h4>
            <p>
              The platform dataset is heavily anchored in high-conversion commercial niches:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 font-normal">
              <li><strong>Tech & AI:</strong> 1,269 creators (58.2%) — Demonstrates the highest average follower scale (4,261 avg.) and rapid commercial sponsorship adoption.</li>
              <li><strong>Lifestyle & Wellness:</strong> 785 creators (36.0%) — High visual consistency and steady story view conversion.</li>
              <li><strong>Business & Finance:</strong> 103 creators (4.7%) — Prime candidate for high-ticket affiliate programs and newsletter funnels.</li>
            </ul>

            <h4 className="text-sm font-bold text-white">3. Commercial Collaboration Recommendation</h4>
            <p>
              Brands seeking maximum return on ad spend (ROAS) should prioritize multi-creator micro syndication (contracting 5-10 targeted creators with 10k-50k followers) rather than single mega-creator placements.
            </p>
          </div>
        </div>
      )}

      {activeReport === 'ml_ai_eval' && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#0F1422] border border-white/[0.08] shadow-sm space-y-6">
          <div className="border-b border-white/[0.07] pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Machine Learning Architecture & Predictive Model Validation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Models: Gradient Boosting &bull; Random Forest &bull; Google Gemini LLM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.06] space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Engagement Rate Regressor</span>
              </div>
              <p className="text-xs text-slate-400">
                Trained on follower tiers, publishing frequency, and niche taxonomy using a <strong>Gradient Boosting Regressor</strong>.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                Accuracy Metric: R² = 0.64 &bull; MAE = 0.86%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/[0.06] space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Automation Adoption Classifier</span>
              </div>
              <p className="text-xs text-slate-400">
                Detects commercial DM automation keywords, lead magnets, and ManyChat trigger funnels using a <strong>Random Forest Classifier</strong>.
              </p>
              <div className="text-[11px] font-mono text-purple-400 pt-1">
                Accuracy Metric: ROC-AUC = 0.954 &bull; F1 = 0.89
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <h4 className="text-sm font-bold text-white">Production LLM Integration: Google Gemini 2.5 Flash</h4>
            <p>
              For deep creator assessments, the platform integrates the official Google GenAI SDK. 
              The system queries <strong>Gemini 2.5 Flash</strong> with real creator performance metadata to deliver 3-tier strategy memos (Audience Authenticity, Workflow Automation Potential, and Projected Brand Sponsorship Values).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
