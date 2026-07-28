import React, { useState } from 'react';
import {
  Scale,
  BrainCircuit,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Sparkles,
  FileCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { STUDIONET_CONFIG, CONTRACT_ADDRESSES } from '../config/contracts';

export default function VerdictInspector({
  dispute,
  onBack,
  onRequestVerdict,
  onAppeal,
  onOpenSubmitEvidence,
  account,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [consensusStep, setConsensusStep] = useState(0);

  if (!dispute) return null;

  const handleRunVerdict = async () => {
    setIsProcessing(true);
    setConsensusStep(1);
    try {
      // Step 1: Web rendering simulation
      setTimeout(() => setConsensusStep(2), 2000);
      // Step 2: Multi-validator LLM execution & tolerance check
      setTimeout(() => setConsensusStep(3), 4500);

      await onRequestVerdict(dispute.id);
    } catch (err) {
      alert(`Verdict Request Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setConsensusStep(0);
    }
  };

  const handleRunAppeal = async () => {
    setIsProcessing(true);
    try {
      await onAppeal(dispute.id);
    } catch (err) {
      alert(`Appeal Execution Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isClosed = dispute.status === 'CLOSED' || dispute.status === 'VERDICT_ISSUED';
  const isAwaitingAppeal = dispute.status === 'AWAITING_APPEAL';

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-secondary text-xs py-2 px-3">
          <ArrowLeft className="w-4 h-4" /> Back to Disputes
        </button>
        <div className="flex items-center gap-2">
          <a
            href={`${STUDIONET_CONFIG.blockExplorerUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Trial Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence & Case Brief */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                  Dispute #{dispute.id}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">Security Deposit Arbitration Trial</h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400">Escrow Amount</span>
                <p className="text-xl font-extrabold text-amber-400">{dispute.deposit_amount} GEN</p>
              </div>
            </div>

            {/* Evidence Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Move-in Evidence */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" /> Move-In Web Evidence
                </h4>
                <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                  {dispute.movein_evidence_urls?.map((url, i) => (
                    <li key={i} className="truncate bg-slate-950 p-2 rounded border border-slate-850">
                      <a href={url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                        🔗 {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Move-out Evidence */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-400" /> Move-Out Web Evidence
                </h4>
                {dispute.moveout_evidence_urls?.length > 0 ? (
                  <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                    {dispute.moveout_evidence_urls.map((url, i) => (
                      <li key={i} className="truncate bg-slate-950 p-2 rounded border border-slate-850">
                        <a href={url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                          🔗 {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No move-out evidence submitted yet.</p>
                )}
              </div>
            </div>

            {/* Tenant Statement */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Tenant Written Defense & Counter-Arguments
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-lg border border-slate-800">
                {dispute.tenant_statement || 'Awaiting tenant written statement...'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: AI Arbitrator Panel & Consensus State */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-slate-700/60 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">GenLayer AI Courtroom</h3>
                <p className="text-xs text-slate-400">Multi-Validator Consensus Engine</p>
              </div>
            </div>

            {/* Action Trigger Buttons based on Status */}
            {dispute.status === 'OPEN' && (
              <div className="space-y-3">
                <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  Tenant move-out evidence must be attached before invoking the AI arbitration court.
                </p>
                <button onClick={() => onOpenSubmitEvidence(dispute)} className="w-full btn-accent text-xs py-3 justify-center">
                  Submit Tenant Evidence Now
                </button>
              </div>
            )}

            {dispute.status === 'AWAITING_VERDICT' && !isProcessing && (
              <button onClick={handleRunVerdict} className="w-full btn-primary text-sm py-3.5 justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-4 h-4" /> Request GenLayer AI Verdict
              </button>
            )}

            {/* Consensus Multi-Validator Loading Animation */}
            {isProcessing && (
              <div className="ai-consensus-box p-5 rounded-2xl bg-cyan-950/40 space-y-4">
                <div className="flex items-center gap-3 text-cyan-300 font-bold text-sm">
                  <BrainCircuit className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>GenLayer Validator AI Consensus Running...</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className={`p-2 rounded flex items-center gap-2 ${consensusStep >= 1 ? 'bg-cyan-900/40 text-cyan-200' : 'text-slate-500'}`}>
                    <span>1. Rendering evidence URLs via gl.nondet.web.render</span>
                  </div>
                  <div className={`p-2 rounded flex items-center gap-2 ${consensusStep >= 2 ? 'bg-purple-900/40 text-purple-200' : 'text-slate-500'}`}>
                    <span>2. Leader LLM prompt execution & JSON parsing</span>
                  </div>
                  <div className={`p-2 rounded flex items-center gap-2 ${consensusStep >= 3 ? 'bg-emerald-900/40 text-emerald-200' : 'text-slate-500'}`}>
                    <span>3. Validator checking ±5% tolerance & finalizing state</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  *Unlike standard EVM smart contracts, GenLayer validators independently scrape web evidence and reach consensus on non-deterministic AI outputs.
                </p>
              </div>
            )}

            {/* Verdict Display Section */}
            {isClosed && (
              <div className="space-y-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">Verdict Settlement Split</span>
                    <span className="text-emerald-400 font-mono">Confidence: {dispute.confidence}%</span>
                  </div>

                  {/* Percentage Split Bar */}
                  <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                    <div
                      style={{ width: `${dispute.tenant_refund_pct}%` }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center text-[10px] font-extrabold text-black"
                    >
                      {dispute.tenant_refund_pct}% Tenant
                    </div>
                    <div
                      style={{ width: `${100 - dispute.tenant_refund_pct}%` }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white"
                    >
                      {100 - dispute.tenant_refund_pct}% Landlord
                    </div>
                  </div>

                  <div className="text-xs space-y-2 pt-2 border-t border-slate-800">
                    <h5 className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Official AI Arbitration Reasoning:
                    </h5>
                    <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                      {dispute.verdict_reason}
                    </p>
                  </div>
                </div>

                {isAwaitingAppeal && (
                  <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-400" /> Low AI Confidence Escalation
                    </div>
                    <p className="text-xs text-rose-200/80">
                      The confidence score ({dispute.confidence}%) fell below the 60% threshold. Either party may trigger a secondary Chief Appeals round.
                    </p>
                    <button onClick={handleRunAppeal} className="w-full btn-accent text-xs py-2.5 justify-center">
                      Trigger Chief AI Appeals Round
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
