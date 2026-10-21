import React, { useState } from 'react';
import { PROGRAM_POLICIES, evaluateCompliance } from '../lib/complianceEngine';
import VerificationModal from './VerificationModal';
import AuditLogView from './AuditLogView';
import { Users, CheckCircle, AlertTriangle, Clock, Search, Filter, Shield, Activity, FileCheck, Award } from 'lucide-react';

export default function StaffDashboard({
  submissions,
  profiles,
  auditLogs,
  onVerifySubmission,
  onEvaluateSubmission,
  onRecordRenewal,
  onAssignPolicy
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [complianceFilter, setComplianceFilter] = useState('ALL');
  const [selectedSubmissionForVerify, setSelectedSubmissionForVerify] = useState(null);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'logs' | 'assignments'

  // Metric Computations
  const totalSubmissions = submissions.length;
  const pendingVerification = submissions.filter(s => s.verification_status === 'Pending verification').length;
  const compliantCount = submissions.filter(s => s.compliance_status === 'Compliant').length;
  const deficiencyCount = submissions.filter(s => s.compliance_status === 'With Deficiency').length;

  // Search and Filter Logic
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'ALL' || s.programCode === programFilter;
    const matchesCompliance = complianceFilter === 'ALL' || s.compliance_status === complianceFilter;
    return matchesSearch && matchesProgram && matchesCompliance;
  });

  const handleRunComplianceCheck = (submission) => {
    const policy = PROGRAM_POLICIES[submission.programCode || 'EXCELLENCE'];
    const result = evaluateCompliance(submission, policy);
    onEvaluateSubmission(submission.id, result.status, result.reasons);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalSubmissions}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Verification</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingVerification}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliant Records</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{compliantCount}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">With Deficiency</p>
            <p className="text-2xl font-black text-red-600 mt-1">{deficiencyCount}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-xl text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'submissions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Submissions & Evaluations</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scholar Program Management</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit History Log</span>
        </button>
      </div>

      {activeTab === 'submissions' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-4 p-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search by Student ID or Name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={programFilter}
                onChange={e => setProgramFilter(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Filter by Program: All</option>
                <option value="EXCELLENCE">Excellence Scholar</option>
                <option value="ACCESS">Access Scholar</option>
              </select>
            </div>

            <div>
              <select
                value={complianceFilter}
                onChange={e => setComplianceFilter(e.target.value)}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Filter by Compliance: All</option>
                <option value="Pending">Pending Evaluation</option>
                <option value="Compliant">Compliant</option>
                <option value="With Deficiency">With Deficiency</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-800 text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="p-3">Scholar</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Metrics</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Compliance</th>
                  <th className="p-3">Renewal Decision</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">
                      No scholar submission records found matching active search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(s => {
                    const policy = PROGRAM_POLICIES[s.programCode || 'EXCELLENCE'];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-800 text-sm">{s.full_name}</div>
                          <div className="text-slate-500 font-mono">{s.student_id}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-semibold text-slate-700">{policy?.name || 'Excellence'}</span>
                          <div className="text-slate-400 font-mono text-[10px]">{s.academic_year} {s.semester}</div>
                        </td>

                        <td className="p-3 font-mono">
                          <div>GWA: <span className="font-bold">{s.gwa}</span> (Max {policy?.maxGwa})</div>
                          <div>Units: <span className="font-bold">{s.enrolled_units}</span> (Min {policy?.minUnits})</div>
                          <div>Fail: {s.failed_count} | INC: {s.inc_count} | Drop: {s.dropped_count}</div>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] inline-block ${
                            s.verification_status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                            s.verification_status === 'Returned' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {s.verification_status}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] inline-block ${
                            s.compliance_status === 'Compliant' ? 'bg-blue-100 text-blue-800' :
                            s.compliance_status === 'With Deficiency' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {s.compliance_status}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] inline-block ${
                            s.renewal_decision === 'Approved' ? 'bg-emerald-600 text-white' :
                            s.renewal_decision === 'Held' ? 'bg-orange-600 text-white' : 'bg-slate-500 text-white'
                          }`}>
                            {s.renewal_decision}
                          </span>
                        </td>

                        <td className="p-3 text-right space-y-1">
                          {/* 1. Verify Evidence Button */}
                          <button
                            onClick={() => setSelectedSubmissionForVerify(s)}
                            className="w-full text-[11px] bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 rounded font-medium shadow-sm"
                          >
                            Verify Evidence
                          </button>

                          {/* 2. Evaluate Compliance Button */}
                          <button
                            onClick={() => handleRunComplianceCheck(s)}
                            disabled={s.verification_status !== 'Verified'}
                            className={`w-full text-[11px] px-2 py-1 rounded font-medium shadow-sm transition ${
                              s.verification_status === 'Verified'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                            title={s.verification_status !== 'Verified' ? 'Must verify evidence before evaluation' : ''}
                          >
                            Evaluate Compliance
                          </button>

                          {/* 3. Record Renewal Decision */}
                          <div className="flex space-x-1 pt-0.5">
                            <button
                              onClick={() => onRecordRenewal(s.id, 'Approved', 'Approved by Staff after verification.')}
                              disabled={s.verification_status !== 'Verified' || s.compliance_status !== 'Compliant'}
                              className={`flex-1 text-[10px] py-0.5 rounded font-bold ${
                                s.verification_status === 'Verified' && s.compliance_status === 'Compliant'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRecordRenewal(s.id, 'Held', 'Renewal on hold pending academic compliance.')}
                              disabled={s.verification_status !== 'Verified'}
                              className={`flex-1 text-[10px] py-0.5 rounded font-bold ${
                                s.verification_status === 'Verified'
                                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Hold
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Scholar Policy Assignments</h3>
          <p className="text-xs text-slate-500">Bind scholars to configurable policy thresholds (Excellence Scholar / Access Scholar).</p>

          <div className="divide-y divide-slate-200">
            {profiles.filter(p => p.role === 'Scholar').map(scholar => (
              <div key={scholar.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-slate-800">{scholar.full_name}</span> ({scholar.student_id})
                  <div className="text-xs text-slate-500">{scholar.email}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Active Program:</span>
                  <select
                    value={scholar.programCode || 'EXCELLENCE'}
                    onChange={e => onAssignPolicy(scholar.id, e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="EXCELLENCE">Excellence Scholar (Max GWA 2.00, Min Units 18)</option>
                    <option value="ACCESS">Access Scholar (Max GWA 2.50, Min Units 15)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <AuditLogView auditLogs={auditLogs} />
      )}

      {/* Verification Modal */}
      {selectedSubmissionForVerify && (
        <VerificationModal
          submission={selectedSubmissionForVerify}
          onClose={() => setSelectedSubmissionForVerify(null)}
          onConfirm={(status, notes) => {
            onVerifySubmission(selectedSubmissionForVerify.id, status, notes);
            setSelectedSubmissionForVerify(null);
          }}
        />
      )}
    </div>
  );
}
