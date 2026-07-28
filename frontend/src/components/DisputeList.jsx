import React from 'react';
import { Scale, FileText, ArrowRight, ShieldAlert, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

export default function DisputeList({ disputes, onSelectDispute, onOpenCreateModal, onRefresh }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-open"><Clock className="w-3 h-3" /> Awaiting Tenant Evidence</span>;
      case 'AWAITING_VERDICT':
        return <span className="badge badge-awaiting"><RefreshCw className="w-3 h-3 animate-spin" /> Ready for AI Verdict</span>;
      case 'AWAITING_APPEAL':
        return <span className="badge badge-appeal"><ShieldAlert className="w-3 h-3" /> Low Confidence (Appealable)</span>;
      case 'VERDICT_ISSUED':
      case 'CLOSED':
        return <span className="badge badge-verdict"><CheckCircle className="w-3 h-3" /> Verdict Executed</span>;
      default:
        return <span className="badge badge-closed">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 border-slate-700/40">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Active Security Deposit Disputes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            GenLayer Intelligent Contracts inspect move-in vs move-out evidence and execute decentralized AI consensus payouts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="btn-secondary text-xs py-2.5 px-3">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh State
          </button>
          <button onClick={onOpenCreateModal} className="btn-primary text-xs py-2.5 px-4">
            + File New Dispute
          </button>
        </div>
      </div>

      {/* Disputes Cards List */}
      {disputes.length === 0 ? (
        <div className="glass-card p-12 text-center border-dashed border-slate-700">
          <Scale className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No Disputes Recorded Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Landlords can open a new dispute by escrowing security deposit funds and providing move-in photo evidence links.
          </p>
          <button onClick={onOpenCreateModal} className="btn-primary text-xs py-2.5 px-5">
            Create First Dispute
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="glass-card p-6 border-slate-700/50 hover:border-cyan-500/40 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    Dispute #{dispute.id}
                  </span>
                  {getStatusBadge(dispute.status)}
                </div>

                <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Escrow Deposit:</span>
                    <span className="font-bold text-amber-400">{dispute.deposit_amount} GEN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Landlord:</span>
                    <span className="text-slate-200">{dispute.landlord.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tenant:</span>
                    <span className="text-slate-200">{dispute.tenant.substring(0, 8)}...</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Move-In Evidence: <strong>{dispute.movein_evidence_urls?.length || 0} link(s)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Move-Out Evidence: <strong>{dispute.moveout_evidence_urls?.length || 0} link(s)</strong></span>
                  </div>
                </div>

                {dispute.status === 'CLOSED' || dispute.status === 'VERDICT_ISSUED' ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mb-6">
                    <div className="flex justify-between text-xs font-bold text-emerald-400 mb-1">
                      <span>Tenant Refund: {dispute.tenant_refund_pct}%</span>
                      <span>Landlord Keep: {100 - dispute.tenant_refund_pct}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{dispute.verdict_reason}"
                    </p>
                  </div>
                ) : null}
              </div>

              <button
                onClick={() => onSelectDispute(dispute)}
                className="w-full btn-secondary text-xs py-2.5 justify-center group-hover:border-cyan-500/50 group-hover:text-cyan-300"
              >
                Inspect AI Trial & Evidence <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
