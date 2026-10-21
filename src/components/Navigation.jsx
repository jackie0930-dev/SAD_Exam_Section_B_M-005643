import React from 'react';
import { Award, UserCheck, Shield, RefreshCw } from 'lucide-react';

export default function Navigation({ activeUser, setActiveUser, profiles, onResetData }) {
  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">Scholarship Compliance System</h1>
            <p className="text-xs text-slate-400">SAD Laboratory Examination Section B Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Simulate Role:</span>
            <select 
              value={activeUser.id}
              onChange={(e) => {
                const user = profiles.find(p => p.id === e.target.value);
                if (user) setActiveUser(user);
              }}
              className="bg-slate-900 text-sm text-blue-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.student_id} - {p.full_name} ({p.role})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetData}
            title="Reset Mock Data to Default Exam State"
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
