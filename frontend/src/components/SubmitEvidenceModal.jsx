import React, { useState } from 'react';

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
      <div className="glass-card modal-content p-8 border-white/10 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4ce337]/20 text-[#4ce337] border border-[#4ce337]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">upload_file</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Submit Tenant Counter-Evidence</h3>
              <p className="text-xs text-zinc-400 font-mono">Case #{dispute.id} • Attach Move-Out Web Links & Written Defense</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Move-Out Condition Web Evidence URLs
              </label>
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-xs text-[#4ce337] hover:underline font-bold flex items-center gap-1"
              >
                + Add Link
              </button>
            </div>
            {moveOutUrls.map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  placeholder="https://..."
                  className="input-field-dark text-xs font-mono flex-1"
                  required
                />
                {moveOutUrls.length > 1 && (
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
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Tenant Written Defense / Statement
            </label>
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Detail any discrepancies between the landlord's photos and current state..."
              className="input-field-dark w-full text-xs"
              required
            />
          </div>

          <div className="pt-5 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-outline text-xs py-2.5 px-4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-teal text-xs py-2.5 px-5 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Evidence...' : 'Submit Tenant Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
