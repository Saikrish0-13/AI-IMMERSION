/**
 * ManualAttendance.jsx
 * Component for teachers to manually review and toggle student attendance status.
 * Allows switching status between 'Present' and 'Absent' with instant feedback,
 * provides 'Mark All Present' and 'Mark All Absent' bulk actions, and includes search/filtering.
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  RotateCcw,
  Sparkles,
  Filter,
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/initialStudents.js';

export default function ManualAttendance({
  attendanceMap,
  onToggleStudentStatus,
  onMarkAllPresent,
  onMarkAllAbsent,
  onOpenStudentDetails,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PRESENT' | 'ABSENT'

  // Filter students by search term and status
  const filteredStudents = INITIAL_STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);

    const isPresent = attendanceMap[student.id]?.status === 'Present';

    if (statusFilter === 'PRESENT') return matchesSearch && isPresent;
    if (statusFilter === 'ABSENT') return matchesSearch && !isPresent;
    return matchesSearch;
  });

  const presentCount = Object.values(attendanceMap).filter((s) => s?.status === 'Present').length;
  const absentCount = INITIAL_STUDENTS.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Manual Attendance Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct faculty override: verify roll call or adjust statuses for individual students.
            </p>
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onMarkAllPresent}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all shadow-xs shadow-emerald-600/20 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>

            <button
              type="button"
              onClick={onMarkAllAbsent}
              className="px-4 py-2 text-xs font-bold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-98 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student by name, ID (e.g. CS2026-015), or roll no..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({INITIAL_STUDENTS.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PRESENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'PRESENT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Present ({presentCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ABSENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'ABSENT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Absent ({absentCount})
            </button>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Roll</th>
                <th className="py-3.5 px-4 sm:px-6">Student Info</th>
                <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">ID & Department</th>
                <th className="py-3.5 px-4 sm:px-6">Current Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Toggle Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const record = attendanceMap[student.id];
                  const isPresent = record?.status === 'Present';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Roll number */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700">
                        #{student.rollNo}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div
                          onClick={() => onOpenStudentDetails(student.id)}
                          className="flex items-center gap-3 cursor-pointer group-hover:text-blue-600 transition-colors"
                        >
                          <div
                            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                              isPresent
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 leading-tight">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400 sm:hidden">
                              {student.id} • {student.department}
                            </p>
                            <p className="text-[11px] text-slate-400 hidden sm:block">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department / ID (desktop) */}
                      <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell">
                        <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {student.id}
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-1">
                          {student.department}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isPresent
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPresent ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                          {record?.timeMarked && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              at {record.timeMarked} ({record.method || 'Manual'})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action toggle buttons */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => onToggleStudentStatus(student.id, 'Present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title="Mark Present"
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleStudentStatus(student.id, 'Absent')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              !isPresent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title="Mark Absent"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No students matched "{searchTerm}"</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Clear search & filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
