import React from 'react';
import { ShieldCheck, Award, TrendingUp, UserCheck, Star } from 'lucide-react';

export default function ReputationLeaderboard({ userReputation, userAddress }) {
  const defaultLeaderboard = [
    { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', role: 'Tenant', trustScore: 94, totalDisputes: 5, wins: 4, losses: 1 },
    { address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', role: 'Landlord', trustScore: 88, totalDisputes: 8, wins: 6, losses: 2 },
    { address: '0x3C44CdD05aB7513794d3023d1636f32e60058b87', role: 'Landlord', trustScore: 78, totalDisputes: 4, wins: 2, losses: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-slate-700/60">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trust & Reputation Scores</h2>
            <p className="text-sm text-slate-400">
              Recorded directly by the GenLayer <code className="text-purple-300">Reputation.py</code> Intelligent Contract.
            </p>
          </div>
        </div>

        {/* User's own reputation card if connected */}
        {userAddress && userReputation && (
          <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-extrabold text-xl">
                {userReputation.trust_score}%
              </div>
              <div>
                <span className="badge badge-open text-[10px] mb-1">Your On-Chain Metric</span>
                <h3 className="text-lg font-bold text-white font-mono">{userAddress}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arbitrated {userReputation.total_disputes} disputes • {userReputation.wins} Wins / {userReputation.losses} Losses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> High Reliability Participant
            </div>
          </div>
        )}

        {/* Global Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-4">Participant</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4 text-center">Trust Score</th>
                <th className="pb-3 px-4 text-center">Total Disputes</th>
                <th className="pb-3 px-4 text-center">Win / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {defaultLeaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-200">{item.address}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold ${
                      item.role === 'Tenant' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-extrabold text-emerald-400 text-sm">{item.trustScore}%</span>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-300">{item.totalDisputes}</td>
                  <td className="py-4 px-4 text-center text-slate-300">
                    <span className="text-emerald-400">{item.wins}W</span> / <span className="text-rose-400">{item.losses}L</span>
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
