/**
 * AttendanceHistory.jsx
 * Displays previous attendance session records in a comprehensive table.
 * Shows date, total students (53), present count, absent count, and attendance percentage,
 * with options to save today's live session and export historical records.
 */

import React, { useState } from 'react';
import {
  History,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Percent,
  FileSpreadsheet,
  PlusCircle,
  Sparkles,
  Clock,
  Download,
} from 'lucide-react';
import {
  getAttendanceHistory,
  saveAttendanceHistory,
  getISODate,
  getFormattedTodayDate,
} from '../utils/localStorageHelper.js';

export default function AttendanceHistory({ metrics, onExportCSV }) {
  const [historyRecords, setHistoryRecords] = useState(() => getAttendanceHistory());
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Save today's live session to history table
  const handleSaveTodaySession = () => {
    const todayISO = getISODate();
    const existingIndex = historyRecords.findIndex((r) => r.date === todayISO);

    const newRecord = {
      id: `session-${todayISO}`,
      date: todayISO,
      formattedDate: getFormattedTodayDate(),
      totalStudents: metrics.total,
      presentCount: metrics.present,
      absentCount: metrics.absent,
      percentage: `${metrics.percentage}%`,
      method: 'AI Facial Scan',
      timeTaken: '42 seconds',
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...historyRecords];
      updated[existingIndex] = newRecord;
    } else {
      updated = [newRecord, ...historyRecords];
    }

    setHistoryRecords(updated);
    saveAttendanceHistory(updated);
    setSaveSuccessMessage("Today's session attendance has been recorded in the history logs!");
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  };

  // Compute average historical attendance percentage
  const averagePercentage =
    historyRecords.length > 0
      ? Math.round(
          historyRecords.reduce(
            (acc, curr) => acc + parseFloat(curr.percentage.replace('%', '')),
            0
          ) / historyRecords.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Class Attendance History
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Historical ledger of past classroom sessions for CS-301. All data is persisted in browser localStorage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveTodaySession}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-xs shadow-blue-600/20 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save Today's Session</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              className="px-4 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-98 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {saveSuccessMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* History Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Logged Sessions
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{historyRecords.length}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Semester Average Attendance
            </span>
            <p className="text-2xl font-black text-blue-600 mt-1">{averagePercentage}%</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Scan Speed
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-1">44 sec / class</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Session Date</th>
                <th className="py-3.5 px-4 sm:px-6">Total Students</th>
                <th className="py-3.5 px-4 sm:px-6">Present Count</th>
                <th className="py-3.5 px-4 sm:px-6">Absent Count</th>
                <th className="py-3.5 px-4 sm:px-6">Attendance %</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Method & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyRecords.map((record) => {
                const pctNumber = parseFloat(record.percentage.replace('%', ''));
                const isHigh = pctNumber >= 90;
                const isGood = pctNumber >= 75 && pctNumber < 90;

                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{record.formattedDate || record.date}</span>
                    </td>

                    {/* Total students */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-700">
                      {record.totalStudents}
                    </td>

                    {/* Present count */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {record.presentCount}
                      </span>
                    </td>

                    {/* Absent count */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        {record.absentCount}
                      </span>
                    </td>

                    {/* Attendance percentage */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            isHigh
                              ? 'text-blue-700'
                              : isGood
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {record.percentage}
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              isHigh ? 'bg-blue-600' : isGood ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: record.percentage }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Method & Time Taken */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          {record.method}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Duration: {record.timeTaken}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
