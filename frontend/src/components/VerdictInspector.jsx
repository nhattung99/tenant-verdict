import React, { useState } from 'react';
import { STUDIONET_CONFIG } from '../config/contracts';

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
  const [selectedImage, setSelectedImage] = useState(null);

  if (!dispute) return null;

  const handleRunVerdict = async () => {
    setIsProcessing(true);
    setConsensusStep(1);
    try {
      setTimeout(() => setConsensusStep(2), 2000);
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
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-outline text-xs py-2 px-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 font-mono text-xs">
          <a
            href={`${STUDIONET_CONFIG.blockExplorerUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-[#e9c349] flex items-center gap-1"
          >
            <span>GenLayer Explorer</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Case Header Banner & Deadline */}
      <div className="glass-card p-8 border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#e9c349] bg-[#e9c349]/10 px-3 py-1 rounded border border-[#e9c349]/20 uppercase tracking-widest">
            Case #{dispute.id} Protocol
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-2">
            Security Deposit Arbitration Trial
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            GenLayer Intelligent Contract non-deterministic execution engine inspects move-in vs move-out web evidence and executes consensus payout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Submission Deadline Card */}
          <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 p-4 rounded-xl flex items-center gap-3 glow-border-gold">
            <span className="material-symbols-outlined text-[#e9c349] text-3xl">timer</span>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#e9c349] uppercase tracking-wider">Submission Deadline</div>
              <div className="font-mono text-xl font-extrabold text-white tracking-widest">
                48h 12m <span className="animate-pulse text-[#e9c349]">_</span>
              </div>
            </div>
          </div>

          {/* Escrow Deposit Card */}
          <div className="bg-[#1a1c1c] border border-[#e9c349]/30 p-4 rounded-xl flex items-center gap-3 glow-border-gold font-mono">
            <span className="material-symbols-outlined text-[#e9c349] text-3xl">account_balance</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#e9c349] tracking-wider">Escrowed Deposit</div>
              <div className="text-xl font-extrabold text-white">{dispute.deposit_amount} GEN</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Protocol Feed */}
      <div className="glass-card p-6 rounded-xl border-l-4 border-[#4ce337]">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-[#4ce337]">psychology</span>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#4ce337]">
            AI Reasoning Protocol v4.2 & Multi-Validator Feed
          </h3>
        </div>
        <div className="font-mono text-xs text-[#4ce337]/90 space-y-1.5 bg-[#0c0f0f] p-4 rounded-lg border border-white/5">
          <p>&gt; READ STATE: MOVE-IN EVIDENCE LINKS DETECTED ({dispute.movein_evidence_urls?.length || 0})...</p>
          <p>&gt; READ STATE: MOVE-OUT EVIDENCE LINKS DETECTED ({dispute.moveout_evidence_urls?.length || 0})...</p>
          {dispute.tenant_statement ? (
            <p>&gt; TENANT DEFENSE STATEMENT LOADED: "{dispute.tenant_statement.substring(0, 70)}..."</p>
          ) : (
            <p className="text-amber-400">&gt; AWAITING TENANT COUNTER-EVIDENCE SUBMISSION...</p>
          )}
          {isClosed && (
            <p className="text-emerald-400 font-bold">&gt; CONSENSUS REACHED: TENANT REFUND {dispute.tenant_refund_pct}% • CONFIDENCE {dispute.confidence}%</p>
          )}
        </div>
      </div>

      {/* Main Trial Details Grid: Evidence Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Landlord Evidence */}
        <section className="glass-card p-6 border-white/10 space-y-5 relative overflow-hidden">
          <span className="material-symbols-outlined absolute top-4 right-4 text-7xl text-white/5 pointer-events-none">scale</span>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e9c349]">gavel</span> Landlord's Evidence
            </h3>
            <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded">Move-in Gallery</span>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 gap-3">
            {dispute.movein_evidence_urls?.map((url, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(url)}
                className="aspect-video rounded-xl bg-[#1a1c1c] border border-white/10 overflow-hidden relative group cursor-pointer hover:border-[#e9c349]/50 transition-all"
              >
                <img src={url} alt={`Move-in Evidence ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  LINK #{i + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Web Evidence Links</h4>
            <ul className="space-y-2 font-mono text-xs">
              {dispute.movein_evidence_urls?.map((url, i) => (
                <li key={i} className="bg-[#1a1c1c] p-3 rounded-lg border border-white/10 truncate">
                  <a href={url} target="_blank" rel="noreferrer" className="text-[#e9c349] hover:underline flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span className="truncate">{url}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: Tenant Counter-Evidence */}
        <section className="glass-card p-6 border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-bold text-[#4ce337] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4ce337]">upload_file</span> Tenant Counter-Evidence
            </h3>
            <span className="text-[11px] font-mono text-[#4ce337] bg-[#4ce337]/10 px-2.5 py-1 rounded border border-[#4ce337]/20">
              Move-out Gallery
            </span>
          </div>

          {/* Photo Gallery Grid */}
          {dispute.moveout_evidence_urls?.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {dispute.moveout_evidence_urls.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(url)}
                  className="aspect-video rounded-xl bg-[#1a1c1c] border border-white/10 overflow-hidden relative group cursor-pointer hover:border-[#4ce337]/50 transition-all"
                >
                  <img src={url} alt={`Move-out Evidence ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                    LINK #{i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Web Evidence Links</h4>
            {dispute.moveout_evidence_urls?.length > 0 ? (
              <ul className="space-y-2 font-mono text-xs">
                {dispute.moveout_evidence_urls.map((url, i) => (
                  <li key={i} className="bg-[#1a1c1c] p-3 rounded-lg border border-white/10 truncate">
                    <a href={url} target="_blank" rel="noreferrer" className="text-[#4ce337] hover:underline flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">link</span>
                      <span className="truncate">{url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-400 italic">No move-out evidence submitted yet.</p>
            )}
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Tenant Final Statement</h4>
            <p className="text-xs text-zinc-200 leading-relaxed italic bg-[#0c0f0f] p-3 rounded-lg border border-white/5">
              {dispute.tenant_statement || 'Awaiting tenant written statement...'}
            </p>
          </div>
        </section>
      </div>

      {/* AI Consensus Execution & Verdict Settlement Section */}
      <div className="glass-card p-8 border-white/10 space-y-6">
        {dispute.status === 'OPEN' && (
          <div className="bg-[#e9c349]/10 p-5 rounded-xl border border-[#e9c349]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e9c349] text-2xl">info</span>
              <p className="text-xs text-zinc-200">
                Tenant move-out evidence must be attached before invoking the AI arbitration court.
              </p>
            </div>
            <button onClick={() => onOpenSubmitEvidence(dispute)} className="btn-teal text-xs py-2.5 px-5">
              Submit Tenant Evidence Now
            </button>
          </div>
        )}

        {dispute.status === 'AWAITING_VERDICT' && !isProcessing && (
          <button onClick={handleRunVerdict} className="w-full btn-gold text-sm py-4 justify-center glow-border-gold">
            <span className="material-symbols-outlined">gavel</span>
            <span>Request GenLayer AI Verdict Consensus</span>
          </button>
        )}

        {isProcessing && (
          <div className="glow-border-teal p-6 rounded-2xl bg-[#0c0f0f] space-y-4 font-mono">
            <div className="flex items-center gap-3 text-[#4ce337] font-bold text-sm">
              <span className="material-symbols-outlined animate-spin">psychology</span>
              <span>GenLayer Validator AI Multi-Consensus Execution...</span>
            </div>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className={`p-2.5 rounded flex items-center gap-2 ${consensusStep >= 1 ? 'bg-[#4ce337]/15 text-[#4ce337]' : 'text-zinc-500'}`}>
                <span>1. Fetching move-in & move-out web evidence via gl.nondet.web.render</span>
              </div>
              <div className={`p-2.5 rounded flex items-center gap-2 ${consensusStep >= 2 ? 'bg-[#e9c349]/15 text-[#e9c349]' : 'text-zinc-500'}`}>
                <span>2. Leader LLM prompt execution & JSON verdict parsing</span>
              </div>
              <div className={`p-2.5 rounded flex items-center gap-2 ${consensusStep >= 3 ? 'bg-[#4ce337]/15 text-[#4ce337]' : 'text-zinc-500'}`}>
                <span>3. Validator checking ±5% tolerance & executing payout</span>
              </div>
            </div>
          </div>
        )}

        {isClosed && (
          <div className="space-y-6">
            <div className="bg-[#1a1c1c] p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-zinc-300 uppercase tracking-wider">Arbitration Settlement Split</span>
                <span className="text-[#4ce337] bg-[#4ce337]/10 px-3 py-1 rounded border border-[#4ce337]/20">
                  AI Confidence: {dispute.confidence}%
                </span>
              </div>

              {/* Percentage Split Bar */}
              <div className="h-6 bg-[#0c0f0f] rounded-lg overflow-hidden flex border border-white/10">
                <div
                  style={{ width: `${dispute.tenant_refund_pct}%` }}
                  className="bg-gradient-to-r from-[#4ce337] to-emerald-400 flex items-center justify-center text-xs font-mono font-extrabold text-[#023900]"
                >
                  {dispute.tenant_refund_pct}% Tenant
                </div>
                <div
                  style={{ width: `${100 - dispute.tenant_refund_pct}%` }}
                  className="bg-gradient-to-r from-[#e9c349] to-amber-500 flex items-center justify-center text-xs font-mono font-extrabold text-[#3c2f00]"
                >
                  {100 - dispute.tenant_refund_pct}% Landlord
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10">
                <h5 className="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#e9c349]">gavel</span> Official AI Arbitrator Reason
                </h5>
                <p className="text-zinc-200 text-xs leading-relaxed bg-[#0c0f0f] p-4 rounded-xl border border-white/5">
                  {dispute.verdict_reason}
                </p>
              </div>
            </div>

            {isAwaitingAppeal && (
              <div className="bg-rose-950/30 p-6 rounded-2xl border border-rose-500/30 space-y-4">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs font-mono">
                  <span className="material-symbols-outlined text-rose-400 text-base">warning</span> Low AI Confidence Escalation Triggered
                </div>
                <p className="text-xs text-rose-200/80">
                  The AI confidence score ({dispute.confidence}%) is below 60%. Either landlord or tenant can invoke a secondary Chief AI Appeals round.
                </p>
                <button onClick={handleRunAppeal} className="btn-gold text-xs py-3 px-6 justify-center">
                  Trigger Chief AI Appeals Round
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="glass-card max-w-3xl p-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/80 text-white p-2 rounded-full hover:bg-rose-600 transition-colors z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <img src={selectedImage} alt="Evidence Lightbox" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
