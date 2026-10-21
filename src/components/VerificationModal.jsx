import React, { useState } from 'react';
import { Shield, Check, X, FileText } from 'lucide-react';

export default function VerificationModal({ submission, onClose, onConfirm }) {
  const [status, setStatus] = useState('Verified');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(status, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Verify Scholar Grade Document</h3>
        </div>

        <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded">
          <div><span className="font-semibold">Scholar:</span> {submission.full_name} ({submission.student_id})</div>
          <div><span className="font-semibold">Term:</span> {submission.academic_year} - {submission.semester}</div>
          <div><span className="font-semibold">Evidence Link:</span> <a href={submission.evidence_reference} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">Open Document</a></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verification Action</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Verified')}
                className={`py-2 rounded font-bold border transition ${
                  status === 'Verified' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Mark Verified
              </button>
              <button
                type="button"
                onClick={() => setStatus('Returned')}
                className={`py-2 rounded font-bold border transition ${
                  status === 'Returned' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Return for Correction
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Verification Reason / Remarks</label>
            <textarea
              rows="3"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={status === 'Returned' ? "Explain why document was returned (e.g. illegible scan, missing pages)..." : "Verified against official grade slip guidelines..."}
              className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500"
              required={status === 'Returned'}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 shadow"
            >
              Confirm State
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
