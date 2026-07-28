import React, { useState } from 'react';
import { X, Scale, Plus, Trash2, ShieldCheck, DollarSign } from 'lucide-react';

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
      <div className="glass-card modal-content p-6 border-slate-700/60 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">File Security Deposit Dispute</h3>
              <p className="text-xs text-slate-400">Landlord Portal — Escrow Deposit & Register Move-in Evidence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <label className="input-label">Tenant Wallet Address</label>
            <input
              type="text"
              value={tenantAddress}
              onChange={(e) => setTenantAddress(e.target.value)}
              placeholder="0x..."
              className="input-field font-mono text-sm"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label flex items-center justify-between">
              <span>Security Deposit Amount (GEN)</span>
              <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Will be escrowed to Treasury
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="1.5"
              className="input-field font-mono text-sm"
              required
            />
          </div>

          <div className="input-group">
            <div className="flex items-center justify-between mb-1">
              <label className="input-label">Move-In Condition Web Evidence URLs</label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            {urls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  placeholder="https://..."
                  className="input-field text-xs font-mono flex-1"
                  required
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <p className="text-[11px] text-slate-400 italic">
              Provide publicly accessible image/report URLs (e.g. GitHub/Imgur) for AI Web rendering.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-xs py-2.5 px-4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Escrowing Deposit...' : 'Confirm Escrow & Open Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
