import React, { useState } from 'react';

export default function CreateDisputeModal({ isOpen, onClose, onSubmit, account }) {
  const [tenantAddress, setTenantAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [depositAmount, setDepositAmount] = useState('1.5');
  const [urls, setUrls] = useState([
    'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/movein_livingroom.jpg',
    'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/movein_walls.jpg',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index, val) => {
    const updated = [...urls];
    updated[index] = val;
    setUrls(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenantAddress || !depositAmount || urls.filter((u) => u.trim()).length === 0) {
      alert('Please fill in all required fields and provide at least 1 move-in evidence URL.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        tenantAddress,
        depositAmount,
        moveInUrls: urls.filter((u) => u.trim()),
      });
      onClose();
    } catch (err) {
      alert(`Error creating dispute: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content p-8 border-white/10 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e9c349]/20 text-[#e9c349] border border-[#e9c349]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">scale</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">File Security Deposit Dispute</h3>
              <p className="text-xs text-zinc-400 font-mono">Landlord Portal • Register Move-In Web Evidence & Escrow GEN</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Tenant Wallet Address
            </label>
            <input
              type="text"
              value={tenantAddress}
              onChange={(e) => setTenantAddress(e.target.value)}
              placeholder="0x..."
              className="input-field-dark w-full text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Security Deposit Amount (GEN)
              </label>
              <span className="text-[11px] text-[#e9c349] font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">monetization_on</span> Escrowed into Treasury
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="1.5"
              className="input-field-dark w-full text-xs font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Move-In Condition Web Evidence URLs
              </label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-xs text-[#e9c349] hover:underline font-bold flex items-center gap-1"
              >
                + Add Link
              </button>
            </div>
            {urls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  placeholder="https://..."
                  className="input-field-dark text-xs font-mono flex-1"
                  required
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            ))}
            <p className="text-[11px] text-zinc-400 italic">
              Provide publicly accessible image/report URLs (e.g. GitHub/Imgur) for AI Web rendering.
            </p>
          </div>

          <div className="pt-5 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Escrowing Deposit...' : 'Confirm Escrow & Open Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
