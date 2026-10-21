import React from 'react';
import { Clock, Shield, Activity } from 'lucide-react';

export default function AuditLogView({ auditLogs }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-base">Evaluation Audit & Status History</h3>
      </div>

      <div className="space-y-3">
        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No state change audit logs recorded yet.</p>
        ) : (
          auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-700">{log.action_type}</span>
                <span className="text-slate-400 text-[10px]">
                  {new Date(log.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Manila' })}
                </span>
              </div>
              <div className="text-slate-700">
                <span className="font-semibold">Actor:</span> {log.performed_by_name}
              </div>
              <div className="text-slate-600">
                <span className="font-semibold">State Transition:</span> {log.previous_state} → <span className="font-bold">{log.new_state}</span>
              </div>
              {log.comments && (
                <div className="text-slate-500 italic mt-0.5">
                  "{log.comments}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
