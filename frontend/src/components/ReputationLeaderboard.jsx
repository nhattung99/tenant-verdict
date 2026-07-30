import React from 'react';

export default function ReputationLeaderboard({ userReputation, userAddress }) {
  const defaultLeaderboard = [
    { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', role: 'Tenant', trustScore: 94, totalDisputes: 5, wins: 4, losses: 1 },
    { address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', role: 'Landlord', trustScore: 88, totalDisputes: 8, wins: 6, losses: 2 },
    { address: '0x3C44CdD05aB7513794d3023d1636f32e60058b87', role: 'Landlord', trustScore: 78, totalDisputes: 4, wins: 2, losses: 2 },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 border-white/10 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/10 pb-5">
          <div className="w-12 h-12 rounded-xl bg-[#e9c349]/20 text-[#e9c349] border border-[#e9c349]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-white">Trust & On-Chain Reputation</h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Recorded directly by the GenLayer <code className="text-[#e9c349]">TenantVerdict</code> Intelligent Contract
            </p>
          </div>
        </div>

        {/* User's own reputation card if connected */}
        {userAddress && userReputation && (
          <div className="bg-[#1a1c1c] border border-[#e9c349]/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 glow-border-gold">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-[#e9c349]/20 border border-[#e9c349]/40 flex items-center justify-center text-[#e9c349] font-mono font-extrabold text-2xl">
                {userReputation.trust_score}%
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#e9c349] bg-[#e9c349]/10 px-2.5 py-0.5 rounded border border-[#e9c349]/20">
                  Your On-Chain Metric
                </span>
                <h3 className="text-base font-bold text-white font-mono mt-1">{userAddress}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  Arbitrated {userReputation.total_disputes} disputes • {userReputation.wins} Wins / {userReputation.losses} Losses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#0c0f0f] px-4 py-2 rounded-xl border border-white/10 text-xs text-[#4ce337] font-mono">
              <span className="material-symbols-outlined text-base text-[#4ce337]">verified_user</span> Verified Participant
            </div>
          </div>
        )}

        {/* Global Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-widest text-[11px]">
                <th className="pb-4 px-4">Participant Address</th>
                <th className="pb-4 px-4">Role</th>
                <th className="pb-4 px-4 text-center">Trust Score</th>
                <th className="pb-4 px-4 text-center">Total Disputes</th>
                <th className="pb-4 px-4 text-center">Win / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {defaultLeaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-zinc-200">{item.address}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                      item.role === 'Tenant' ? 'bg-[#4ce337]/15 text-[#4ce337] border border-[#4ce337]/30' : 'bg-[#e9c349]/15 text-[#e9c349] border border-[#e9c349]/30'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-extrabold text-[#4ce337] text-sm">{item.trustScore}%</span>
                  </td>
                  <td className="py-4 px-4 text-center text-zinc-300">{item.totalDisputes}</td>
                  <td className="py-4 px-4 text-center text-zinc-300">
                    <span className="text-[#4ce337]">{item.wins}W</span> / <span className="text-rose-400">{item.losses}L</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
