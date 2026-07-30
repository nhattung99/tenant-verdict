import React from 'react';

export default function DisputeList({ disputes, onSelectDispute, onOpenCreateModal, onRefresh }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">schedule</span> Awaiting Tenant Evidence
          </span>
        );
      case 'AWAITING_VERDICT':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#e9c349]/15 text-[#e9c349] border border-[#e9c349]/30 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs animate-spin">refresh</span> Ready for AI Verdict
          </span>
        );
      case 'AWAITING_APPEAL':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">warning</span> Low Confidence (Appealable)
          </span>
        );
      case 'VERDICT_ISSUED':
      case 'CLOSED':
        return (
          <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#4ce337]/15 text-[#4ce337] border border-[#4ce337]/30 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">check_circle</span> Verdict Executed
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded text-[11px] font-mono text-zinc-400 border border-white/10">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="glass-card p-8 border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="z-10">
          <span className="text-xs font-mono font-bold text-[#e9c349] uppercase tracking-widest bg-[#e9c349]/10 px-3 py-1 rounded border border-[#e9c349]/20">
            Case Overview & Claims
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-3">
            Active Security Deposit Disputes
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            GenLayer Intelligent Contracts evaluate move-in vs move-out web evidence with non-deterministic multi-validator consensus to execute automated settlement payouts.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <button onClick={onRefresh} className="btn-outline text-xs py-2.5 px-4">
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
          <button onClick={onOpenCreateModal} className="btn-gold text-xs py-2.5 px-5">
            + File New Dispute
          </button>
        </div>
      </div>

      {/* Disputes Cards List */}
      {disputes.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-white/10">
          <span className="material-symbols-outlined text-5xl text-zinc-500 mb-3">gavel</span>
          <h3 className="font-serif text-xl font-semibold text-zinc-300">No Active Disputes Found</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mt-2 mb-6">
            Landlords can file a new dispute by escrowing security deposit funds and providing move-in photo evidence links.
          </p>
          <button onClick={onOpenCreateModal} className="btn-gold text-xs py-2.5 px-5">
            Create First Dispute
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="glass-card p-6 border-white/10 hover:border-[#e9c349]/40 flex flex-col justify-between group transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-xs font-mono font-bold text-[#e9c349] bg-[#e9c349]/10 px-3 py-1 rounded border border-[#e9c349]/30">
                    Case #{dispute.id}
                  </span>
                  {getStatusBadge(dispute.status)}
                </div>

                <div className="bg-[#1a1c1c] rounded-xl p-4 mb-5 border border-white/10 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Escrow Deposit:</span>
                    <span className="font-bold text-[#e9c349] text-sm">{dispute.deposit_amount} GEN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Landlord:</span>
                    <span className="text-zinc-200">{dispute.landlord.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Tenant:</span>
                    <span className="text-zinc-200">{dispute.tenant.substring(0, 8)}...</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-300 mb-6 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#e9c349]">photo_library</span>
                    <span>Move-In Evidence: <strong>{dispute.movein_evidence_urls?.length || 0} link(s)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#4ce337]">photo_library</span>
                    <span>Move-Out Evidence: <strong>{dispute.moveout_evidence_urls?.length || 0} link(s)</strong></span>
                  </div>
                </div>

                {dispute.status === 'CLOSED' || dispute.status === 'VERDICT_ISSUED' ? (
                  <div className="bg-[#4ce337]/10 border border-[#4ce337]/30 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-xs font-bold text-[#4ce337] mb-1.5 font-mono">
                      <span>Tenant Refund: {dispute.tenant_refund_pct}%</span>
                      <span>Landlord Keep: {100 - dispute.tenant_refund_pct}%</span>
                    </div>
                    <p className="text-xs text-zinc-300 line-clamp-2 italic leading-relaxed">
                      "{dispute.verdict_reason}"
                    </p>
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => onSelectDispute(dispute)}
                className="w-full btn-outline text-xs py-3 justify-center group-hover:border-[#e9c349]/50 group-hover:text-[#e9c349]"
              >
                <span>Inspect AI Trial & Evidence</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
