import React, { useState } from 'react';
import { X, FileText, Plus, Trash2, Shield } from 'lucide-react';

export default function SubmitEvidenceModal({ isOpen, onClose, dispute, onSubmit }) {
  const [moveOutUrls, setMoveOutUrls] = useState([
    'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/moveout_livingroom_cleaned.jpg',
    'https://raw.githubusercontent.com/genlayer/demo/main/tenantverdict/moveout_walls_repaired.jpg',
  ]);
  const [statement, setStatement] = useState(
    'I professionally cleaned all carpets and spackled small nail holes upon move-out. The wall mark mentioned by the landlord was preexisting as shown in move-in photos.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !dispute) return null;

  const handleAddUrl = () => {
    setMoveOutUrls([...moveOutUrls, '']);
  };

  const handleRemoveUrl = (idx) => {
    setMoveOutUrls(moveOutUrls.filter((_, i) => i !== idx));
  };

  const handleUrlChange = (idx, val) => {
    const updated = [...moveOutUrls];
    updated[idx] = val;
    setMoveOutUrls(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (moveOutUrls.filter((u) => u.trim()).length === 0 || !statement.trim()) {
      alert('Please provide move-out evidence links and a counter statement.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(dispute.id, moveOutUrls.filter((u) => u.trim()), statement);
      onClose();
    } catch (err) {
      alert(`Error submitting evidence: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content p-6 border-slate-700/60 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Submit Tenant Defense & Evidence</h3>
              <p className="text-xs text-slate-400">Dispute #{dispute.id} — Attach Move-out Links & Statement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <div className="flex items-center justify-between mb-1">
              <label className="input-label">Move-Out Condition Web Evidence URLs</label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            {moveOutUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  placeholder="https://..."
                  className="input-field text-xs font-mono flex-1"
                  required
                />
                {moveOutUrls.length > 1 && (
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
          </div>

          <div className="input-group">
            <label className="input-label">Tenant Written Defense / Statement</label>
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Explain move-out condition, cleaning efforts, or wear-and-tear arguments..."
              className="input-field text-xs"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-xs py-2.5 px-4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Evidence...' : 'Submit Tenant Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
