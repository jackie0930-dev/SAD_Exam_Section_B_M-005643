import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ScholarPortal from './components/ScholarPortal';
import StaffDashboard from './components/StaffDashboard';
import { INITIAL_PROFILES, INITIAL_SUBMISSIONS, INITIAL_AUDIT_LOGS } from './lib/mockData';

export default function App() {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('sad_exam_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [activeUser, setActiveUser] = useState(profiles[1]); // Default to Juan Dela Cruz (B01)

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('sad_exam_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('sad_exam_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('sad_exam_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('sad_exam_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('sad_exam_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const handleResetData = () => {
    setProfiles(INITIAL_PROFILES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveUser(INITIAL_PROFILES[1]);
  };

  const handleAddSubmission = (newSubData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      verification_status: 'Pending verification',
      verification_notes: '',
      compliance_status: 'Pending',
      deficiency_reasons: [],
      renewal_decision: 'Pending',
      decision_notes: '',
      ...newSubData
    };

    setSubmissions([newSub, ...submissions]);

    // Append Audit Log
    const newLog = {
      id: `log-${Date.now()}`,
      submission_id: newSub.id,
      performed_by_name: `${activeUser.full_name} (Scholar)`,
      action_type: 'SEMESTER_SUBMISSION_CREATED',
      previous_state: 'None',
      new_state: 'Pending verification',
      comments: `New submission for ${newSubData.academic_year} ${newSubData.semester}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleResubmitGrade = (submissionId, updatedData) => {
    setSubmissions(submissions.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          ...updatedData,
          verification_status: 'Pending verification',
          compliance_status: 'Pending',
          deficiency_reasons: []
        };
      }
      return s;
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      submission_id: submissionId,
      performed_by_name: `${activeUser.full_name} (Scholar)`,
      action_type: 'EVIDENCE_RESUBMITTED',
      previous_state: 'Returned',
      new_state: 'Pending verification',
      comments: 'Resubmitted updated grade evidence.',
      timestamp: new Date().toISOString()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleVerifySubmission = (submissionId, status, notes) => {
    setSubmissions(submissions.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          verification_status: status,
          verification_notes: notes
        };
      }
      return s;
    }));

    const target = submissions.find(s => s.id === submissionId);
    const newLog = {
      id: `log-${Date.now()}`,
      submission_id: submissionId,
      performed_by_name: activeUser.full_name,
      action_type: status === 'Verified' ? 'EVIDENCE_VERIFIED' : 'EVIDENCE_RETURNED',
      previous_state: target?.verification_status || 'Pending verification',
      new_state: status,
      comments: notes,
      timestamp: new Date().toISOString()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleEvaluateSubmission = (submissionId, complianceStatus, reasons) => {
    setSubmissions(submissions.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          compliance_status: complianceStatus,
          deficiency_reasons: reasons
        };
      }
      return s;
    }));

    const target = submissions.find(s => s.id === submissionId);
    const newLog = {
      id: `log-${Date.now()}`,
      submission_id: submissionId,
      performed_by_name: activeUser.full_name,
      action_type: 'COMPLIANCE_EVALUATED',
      previous_state: target?.compliance_status || 'Pending',
      new_state: complianceStatus,
      comments: reasons.length > 0 ? reasons.join('; ') : 'Compliant under active program rules.',
      timestamp: new Date().toISOString()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRecordRenewal = (submissionId, decision, notes) => {
    setSubmissions(submissions.map(s => {
      if (s.id === submissionId) {
        return {
          ...s,
          renewal_decision: decision,
          decision_notes: notes
        };
      }
      return s;
    }));

    const target = submissions.find(s => s.id === submissionId);
    const newLog = {
      id: `log-${Date.now()}`,
      submission_id: submissionId,
      performed_by_name: activeUser.full_name,
      action_type: `RENEWAL_${decision.toUpperCase()}`,
      previous_state: target?.renewal_decision || 'Pending',
      new_state: decision,
      comments: notes,
      timestamp: new Date().toISOString()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleAssignPolicy = (scholarId, programCode) => {
    setProfiles(profiles.map(p => {
      if (p.id === scholarId) {
        return { ...p, programCode };
      }
      return p;
    }));

    setSubmissions(submissions.map(s => {
      if (s.scholar_id === scholarId) {
        return { ...s, programCode };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navigation
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        profiles={profiles}
        onResetData={handleResetData}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeUser.role === 'Scholar' ? (
          <ScholarPortal
            activeUser={activeUser}
            submissions={submissions}
            onSubmitGrade={handleAddSubmission}
            onResubmitGrade={handleResubmitGrade}
          />
        ) : (
          <StaffDashboard
            submissions={submissions}
            profiles={profiles}
            auditLogs={auditLogs}
            onVerifySubmission={handleVerifySubmission}
            onEvaluateSubmission={handleEvaluateSubmission}
            onRecordRenewal={handleRecordRenewal}
            onAssignPolicy={handleAssignPolicy}
          />
        )}
      </main>
    </div>
  );
}
