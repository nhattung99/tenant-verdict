import React from 'react';
import { AlertTriangle, Code, ExternalLink, HelpCircle } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export default function UnconfiguredBanner({ onSimulateContractAddresses }) {
  return (
    <div className="glass-card mb-8 border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              GenLayer Studio Contract Deployment Pending
            </h3>
            <p className="text-sm text-amber-200/80 mt-1 max-w-2xl">
              Contract addresses are currently unconfigured in the frontend environment. You can deploy the Python contracts in GenLayer Studio panel (<code className="bg-black/40 px-2 py-0.5 rounded text-amber-300">studionet</code>) and set the addresses, or enable Simulated Studio Mode to preview full app interactions immediately.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://studio.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-4 border-amber-500/40 hover:border-amber-400 text-amber-300"
          >
            <ExternalLink className="w-4 h-4" /> Open GenLayer Studio
          </a>
          <button
            onClick={onSimulateContractAddresses}
            className="btn-primary text-sm py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 border-none shadow-amber-500/20"
          >
            <Code className="w-4 h-4" /> Enable Interactive Preview
          </button>
        </div>
      </div>
    </div>
  );
}
