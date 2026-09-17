/**
 * StudentDetails.jsx
 * Modal dialog showing in-depth attendance analytics for an individual student.
 * Displays overall attendance percentage, total classes attended, college compliance eligibility,
 * and a chronological history table of all previous sessions.
 */

import React from 'react';
import {
  X,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Clock,
  Sparkles,
  Mail,
  Building,
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/initialStudents.js';
import { getStudentHistoricalStats } from '../utils/localStorageHelper.js';

export default function StudentDetails({
  studentId,
  attendanceMap,
  onClose,
  onToggleStudentStatus,
}) {
  if (!studentId) return null;

  const student = INITIAL_STUDENTS.find((s) => s.id === studentId);
  if (!student) return null;

  const todayRecord = attendanceMap[studentId];
  const isPresentToday = todayRecord?.status === 'Present';

  // Calculate student historical records
  const stats = getStudentHistoricalStats(studentId, todayRecord?.status);

  // College attendance threshold: 75% required
  const isEligible = stats.percentage >= 75;
  const isWarning = stats.percentage >= 65 && stats.percentage < 75;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header with profile banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-blue-800 text-2xl font-black flex items-center justify-center shadow-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded">
                  Roll #{student.rollNo}
                </span>
                <span className="font-mono text-xs bg-white/20 text-white px-2 py-0.5 rounded">
                  {student.id}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">{student.name}</h3>
              <p className="text-blue-200 text-xs mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {student.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Overall Attendance Percentage */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attendance Rate
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold ${
                    isEligible ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-rose-600'
                  }`}
                >
                  {stats.percentage}%
                </span>
                <span className="text-xs text-slate-500">overall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {stats.attendedCount} of {stats.totalSessions} sessions attended
              </p>
            </div>

            {/* University Compliance Status */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Semester Status
              </span>
              <div className="mt-2">
                {isEligible ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    Exam Eligible
                  </span>
                ) : isWarning ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                    Attendance Warning
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                    <XCircle className="w-4 h-4" />
                    Critical Shortage
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Requirement: &ge;75% minimum</p>
            </div>

            {/* Today's Status Card with instant toggle */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Today's Roll
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPresentToday
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {isPresentToday ? 'Present' : 'Absent'}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onToggleStudentStatus(student.id, isPresentToday ? 'Absent' : 'Present')
                  }
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                >
                  Change
                </button>
              </div>
              <p className="text-[11px] text-blue-700/80 mt-2">
                {todayRecord?.method || 'Manual verification'}
              </p>
            </div>
          </div>

          {/* Detailed Session History Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recorded Session Log History
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Session Date</th>
                    <th className="py-2.5 px-4">Verification Method</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.sessionLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-medium text-slate-800">{log.date}</td>
                      <td className="py-2.5 px-4 text-slate-500 flex items-center gap-1.5">
                        {log.method.includes('AI') ? (
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{log.method}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`inline-block font-bold px-2 py-0.5 rounded text-[11px] ${
                            log.status === 'Present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
