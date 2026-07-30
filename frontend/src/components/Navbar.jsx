import React from 'react';
import { STUDIONET_CONFIG } from '../config/contracts';

export default function Navbar({
  account,
  onConnectWallet,
  activeTab,
  setActiveTab,
}) {
  const truncate = (addr) =>
    addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <header className="w-full sticky top-0 z-50 bg-[#121414]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 max-w-7xl mx-auto gap-4">
        {/* Brand & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab('disputes')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#e9c349]/20 border border-[#e9c349]/40 flex items-center justify-center text-[#e9c349]">
            <span className="material-symbols-outlined text-2xl">gavel</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              TenantVerdict
            </h1>
            <p className="text-[11px] text-zinc-400 tracking-wide font-mono">
              Digital Justice • GenLayer AI Court
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 bg-[#1a1c1c] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'disputes'
                ? 'bg-[#e9c349] text-[#3c2f00] font-bold shadow-md shadow-[#e9c349]/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Disputes Dashboard
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'create'
                ? 'bg-[#e9c349] text-[#3c2f00] font-bold shadow-md shadow-[#e9c349]/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            + File Dispute
          </button>
          <button
            onClick={() => setActiveTab('reputation')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'reputation'
                ? 'bg-[#e9c349] text-[#3c2f00] font-bold shadow-md shadow-[#e9c349]/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Trust Scores
          </button>
        </nav>

        {/* Wallet & Network Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1c1c] border border-white/10 text-xs text-zinc-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4ce337] animate-pulse"></span>
            <span>{STUDIONET_CONFIG.chainName}</span>
          </div>

          {account ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#e9c349]/10 border border-[#e9c349]/30 text-xs font-mono text-[#e9c349]">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              <span>{truncate(account)}</span>
            </div>
          ) : (
            <button onClick={onConnectWallet} className="btn-gold text-xs py-2 px-4">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
