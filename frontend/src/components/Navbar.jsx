import React from 'react';
import { Scale, Wallet, CheckCircle2, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { STUDIONET_CONFIG } from '../config/contracts';

export default function Navbar({
  account,
  onConnectWallet,
  activeTab,
  setActiveTab,
  isContractReady,
}) {
  const truncate = (addr) =>
    addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <nav className="glass-card sticky top-4 z-50 mb-8 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-700/50">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('disputes')}>
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white">TenantVerdict</h1>
            <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
              <Sparkles className="w-3 h-3" /> GenLayer AI
            </span>
          </div>
          <p className="text-xs text-slate-400">Decentralized AI Rental Security Deposit Arbitrator</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'disputes'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          All Disputes
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          + File Dispute
        </button>
        <button
          onClick={() => setActiveTab('reputation')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'reputation'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5 inline mr-1" /> Trust Scores
        </button>
      </div>

      {/* Wallet & Network Info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{STUDIONET_CONFIG.chainName}</span>
        </div>

        {account ? (
          <div className="flex items-center gap-2 glass-pill text-xs font-mono text-cyan-300 border-cyan-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{truncate(account)}</span>
          </div>
        ) : (
          <button onClick={onConnectWallet} className="btn-primary text-xs py-2 px-4">
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
