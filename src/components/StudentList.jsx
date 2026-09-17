/**
 * StudentList.jsx
 * Comprehensive directory of all 53 students enrolled in the classroom.
 * Features search by student ID or name, filtering by attendance status (All, Present, Absent),
 * and clickable rows to inspect individual student attendance analytics.
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/initialStudents.js';

export default function StudentList({
  attendanceMap,
  onOpenStudentDetails,
  onToggleStudentStatus,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PRESENT' | 'ABSENT'
  const [sortBy, setSortBy] = useState('roll'); // 'roll' | 'name' | 'id'

  // Filter students based on search and status
  const filteredStudents = INITIAL_STUDENTS.filter((student) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(term) ||
      student.id.toLowerCase().includes(term) ||
      student.rollNo.includes(term);

    const isPresent = attendanceMap[student.id]?.status === 'Present';

    if (filterStatus === 'PRESENT') return matchesSearch && isPresent;
    if (filterStatus === 'ABSENT') return matchesSearch && !isPresent;
    return matchesSearch;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'id') return a.id.localeCompare(b.id);
    return Number(a.rollNo) - Number(b.rollNo);
  });

  const presentCount = Object.values(attendanceMap).filter((s) => s?.status === 'Present').length;
  const absentCount = INITIAL_STUDENTS.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Class Student Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Complete roster of all 53 students registered in CS-301. Click any student to view detailed analytics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              Total: 53
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              Present: {presentCount}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              Absent: {absentCount}
            </span>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or ID (e.g. Diya, CS2026-012)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Filter and Sort Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (53)
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PRESENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === 'PRESENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Present ({presentCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('ABSENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === 'ABSENT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Absent ({absentCount})
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="roll">Roll Number</option>
                <option value="name">Student Name</option>
                <option value="id">Student ID</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Roll No</th>
                <th className="py-3.5 px-4 sm:px-6">Student ID</th>
                <th className="py-3.5 px-4 sm:px-6">Student Name</th>
                <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Department</th>
                <th className="py-3.5 px-4 sm:px-6">Attendance Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Profile & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.length > 0 ? (
                sortedStudents.map((student) => {
                  const record = attendanceMap[student.id];
                  const isPresent = record?.status === 'Present';

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onOpenStudentDetails(student.id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Roll Number */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700">
                        #{student.rollNo}
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-semibold text-slate-600">
                        <span className="bg-slate-100 group-hover:bg-white px-2 py-0.5 rounded border border-slate-200/60">
                          {student.id}
                        </span>
                      </td>

                      {/* Student Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-700 leading-tight">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 sm:px-6 hidden md:table-cell text-slate-600">
                        {student.department}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 sm:px-6">
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
                      </td>

                      {/* View details CTA */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                          <span>View Records</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No students matched your search criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Reset filter
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
