import React, { useState } from 'react';
import { PROGRAM_POLICIES, validateSubmissionInputs } from '../lib/complianceEngine';
import { Send, FileText, CheckCircle, AlertTriangle, Clock, RefreshCw, XCircle } from 'lucide-react';

export default function ScholarPortal({ activeUser, submissions, onSubmitGrade, onResubmitGrade }) {
  const [formData, setFormData] = useState({
    academic_year: '2026-2027',
    semester: 'Semester 1',
    gwa: '',
    enrolled_units: '',
    failed_count: '0',
    inc_count: '0',
    dropped_count: '0',
    evidence_reference: ''
  });

  const [formErrors, setFormErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingSubmission, setEditingSubmission] = useState(null);

  const userSubmissions = submissions.filter(s => s.scholar_id === activeUser.id);
  const activeProgram = PROGRAM_POLICIES[activeUser.programCode || 'EXCELLENCE'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMsg('');

    const validation = validateSubmissionInputs(formData, submissions, activeUser.id);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onSubmitGrade({
      scholar_id: activeUser.id,
      student_id: activeUser.student_id,
      full_name: activeUser.full_name,
      programCode: activeUser.programCode || 'EXCELLENCE',
      ...formData,
      gwa: parseFloat(formData.gwa),
      enrolled_units: parseInt(formData.enrolled_units, 10),
      failed_count: parseInt(formData.failed_count, 10),
      inc_count: parseInt(formData.inc_count, 10),
      dropped_count: parseInt(formData.dropped_count, 10),
      submitted_at: new Date().toISOString()
    });

    setSuccessMsg('Semester academic summary submitted successfully! Verification pending.');
    setFormData({
      academic_year: '2026-2027',
      semester: 'Semester 1',
      gwa: '',
      enrolled_units: '',
      failed_count: '0',
      inc_count: '0',
      dropped_count: '0',
      evidence_reference: ''
    });
  };

  const handleResubmitSubmit = (e) => {
    e.preventDefault();
    if (!editingSubmission) return;

    onResubmitGrade(editingSubmission.id, {
      evidence_reference: editingSubmission.evidence_reference,
      gwa: parseFloat(editingSubmission.gwa),
      enrolled_units: parseInt(editingSubmission.enrolled_units, 10),
      submitted_at: new Date().toISOString()
    });

    setEditingSubmission(null);
    setSuccessMsg('Returned submission updated and reset to Pending Verification.');
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Scholar Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome, <span className="font-semibold text-slate-700">{activeUser.full_name}</span> ({activeUser.student_id})</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm">
          <span className="font-semibold">Assigned Program:</span> {activeProgram ? activeProgram.name : 'Excellence Scholar'}
          <div className="text-xs text-blue-600 mt-0.5">
            GWA Limit: ≤ {activeProgram?.maxGwa} | Min Units: {activeProgram?.minUnits} | Allowed Drops: {activeProgram?.maxDropped}
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-base">Submit Semester Academic Summary</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm space-y-1">
              <div className="font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Validation Error</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2">
                {formErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Academic Year</label>
              <select 
                value={formData.academic_year}
                onChange={e => setFormData({...formData, academic_year: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Semester</label>
              <select 
                value={formData.semester}
                onChange={e => setFormData({...formData, semester: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grade Point Average (GWA)</label>
              <input 
                type="number" step="0.01" min="1.00" max="5.00" placeholder="e.g. 1.75 (1.00 = best)"
                value={formData.gwa}
                onChange={e => setFormData({...formData, gwa: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Enrolled Units</label>
              <input 
                type="number" min="0" placeholder="e.g. 18"
                value={formData.enrolled_units}
                onChange={e => setFormData({...formData, enrolled_units: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Failed Subjects Count</label>
              <input 
                type="number" min="0"
                value={formData.failed_count}
                onChange={e => setFormData({...formData, failed_count: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Incomplete (INC) Count</label>
              <input 
                type="number" min="0"
                value={formData.inc_count}
                onChange={e => setFormData({...formData, inc_count: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dropped Subjects Count</label>
              <input 
                type="number" min="0"
                value={formData.dropped_count}
                onChange={e => setFormData({...formData, dropped_count: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grade Document Reference URL</label>
              <input 
                type="url" placeholder="https://drive.google.com/your-grade-slip.pdf"
                value={formData.evidence_reference}
                onChange={e => setFormData({...formData, evidence_reference: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center space-x-2 text-sm shadow transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit Academic Record</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submissions Record List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
          <h3 className="font-bold text-slate-800 text-base">My Semester Submissions & Evaluation Status</h3>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No semester submissions recorded yet. Use the form above to submit your grades.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {userSubmissions.map((sub) => (
              <div key={sub.id} className="p-6 space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {sub.academic_year} - {sub.semester}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted: {new Date(sub.submitted_at).toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (PHT)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Badges */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      sub.verification_status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                      sub.verification_status === 'Returned' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Evidence: {sub.verification_status}
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      sub.compliance_status === 'Compliant' ? 'bg-blue-100 text-blue-800' :
                      sub.compliance_status === 'With Deficiency' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Compliance: {sub.compliance_status}
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      sub.renewal_decision === 'Approved' ? 'bg-emerald-600 text-white' :
                      sub.renewal_decision === 'Held' ? 'bg-orange-600 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      Renewal: {sub.renewal_decision}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                  <div><span className="text-slate-500">GWA:</span> <span className="font-bold">{sub.gwa}</span></div>
                  <div><span className="text-slate-500">Units:</span> <span className="font-bold">{sub.enrolled_units}</span></div>
                  <div><span className="text-slate-500">Failed:</span> <span className="font-bold">{sub.failed_count}</span></div>
                  <div><span className="text-slate-500">INC:</span> <span className="font-bold">{sub.inc_count}</span></div>
                  <div><span className="text-slate-500">Dropped:</span> <span className="font-bold">{sub.dropped_count}</span></div>
                  <div className="col-span-2 md:col-span-1 truncate">
                    <a href={sub.evidence_reference} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">
                      View Grade Slip
                    </a>
                  </div>
                </div>

                {/* Verification Feedback Notes */}
                {sub.verification_notes && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900">
                    <span className="font-bold">Staff Verification Note:</span> {sub.verification_notes}
                  </div>
                )}

                {/* Deficiency List */}
                {sub.deficiency_reasons && sub.deficiency_reasons.length > 0 && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-800 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Deficiency Feedback:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 pl-2">
                      {sub.deficiency_reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {/* Resubmission Trigger for Returned Status */}
                {sub.verification_status === 'Returned' && (
                  <div className="pt-2">
                    <button
                      onClick={() => setEditingSubmission(sub)}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3.5 py-1.5 rounded flex items-center space-x-1 shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Correct & Resubmit Document</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Resubmit Modal */}
      {editingSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Resubmit Returned Grade Evidence</h3>
            <p className="text-xs text-slate-500">Updating this record will reset verification status back to Pending Verification.</p>

            <form onSubmit={handleResubmitSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Updated Grade Reference Link</label>
                <input 
                  type="url"
                  value={editingSubmission.evidence_reference}
                  onChange={e => setEditingSubmission({...editingSubmission, evidence_reference: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GWA</label>
                <input 
                  type="number" step="0.01"
                  value={editingSubmission.gwa}
                  onChange={e => setEditingSubmission({...editingSubmission, gwa: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                >
                  Submit Corrections
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
