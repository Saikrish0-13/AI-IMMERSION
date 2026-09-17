/**
 * Dashboard.jsx
 * Primary analytics and overview component.
 * Displays total students (53), present/absent counters, percentage gauge,
 * today's date, quick action cards, and attendance distribution.
 */

import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  CheckSquare,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';
import { getFormattedTodayDate } from '../utils/localStorageHelper.js';
import { INITIAL_STUDENTS } from '../data/initialStudents.js';

export default function Dashboard({
  metrics,
  attendanceMap,
  setActiveTab,
  onOpenStudentDetails,
  onExportCSV,
  onMarkAllPresent,
}) {
  const todayFormatted = getFormattedTodayDate();

  // Find recently marked students (or first 5 present students)
  const recentPresentStudents = INITIAL_STUDENTS.filter(
    (student) => attendanceMap[student.id]?.status === 'Present'
  ).slice(0, 6);

  // Absent students needing attention
  const absentStudents = INITIAL_STUDENTS.filter(
    (student) => attendanceMap[student.id]?.status === 'Absent'
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today: {todayFormatted}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Class Attendance Dashboard
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Course: <span className="font-semibold text-white">CS-301 Algorithms & Data Structures</span>.
              Eliminate 10-minute roll calls using automated facial scanning for all 53 registered students.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('smart')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-800 font-bold text-sm shadow-sm hover:bg-blue-50 active:scale-98 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Start AI Attendance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-xs transition-colors cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Manual Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Class Roll
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {metrics.total}
            </span>
            <span className="text-xs font-semibold text-slate-500">Students</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Enrolled in CS-301</span>
          </p>
        </div>

        {/* Present Students Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Present Today
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
              {metrics.present}
            </span>
            <span className="text-xs font-semibold text-slate-500">of 53</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">In Attendance</span>
            <span className="text-slate-400 font-mono">
              {Math.round((metrics.present / metrics.total) * 100)}%
            </span>
          </div>
        </div>

        {/* Absent Students Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Absent Today
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-rose-600">
              {metrics.absent}
            </span>
            <span className="text-xs font-semibold text-slate-500">Unaccounted</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-medium">Requires follow-up</span>
            <span className="text-slate-400 font-mono">
              {Math.round((metrics.absent / metrics.total) * 100)}%
            </span>
          </div>
        </div>

        {/* Attendance Percentage Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attendance Rate
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-extrabold ${
                metrics.percentage >= 75
                  ? 'text-indigo-600'
                  : metrics.percentage >= 60
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {metrics.percentage}%
            </span>
            <span className="text-xs font-medium text-slate-500">Overall</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.percentage >= 75
                    ? 'bg-indigo-600'
                    : metrics.percentage >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${metrics.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Attendance Summary & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Summary & Speed Comparison */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time performance comparison vs traditional laptop manual roll call
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMarkAllPresent}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={onExportCSV}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Efficiency Metric Box: 10 mins vs 45 seconds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">Traditional Roll Call</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Slow
                </span>
              </div>
              <p className="text-2xl font-black text-slate-800">~10.0 mins</p>
              <p className="text-xs text-slate-500 mt-1">
                Calling 53 names individually; students distracted or absent during call.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Smart AI Attendance
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  92% Faster
                </span>
              </div>
              <p className="text-2xl font-black text-blue-700">&lt; 45 secs</p>
              <p className="text-xs text-blue-900/80 mt-1">
                Simultaneous batch facial scan. Unobtrusive, automated, and tamper-resistant.
              </p>
            </div>
          </div>

          {/* Ratio bar breakdown */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Attendance Distribution</span>
              <span>{metrics.present} Present / {metrics.absent} Absent</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${(metrics.present / metrics.total) * 100}%` }}
                title={`Present: ${metrics.present}`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${(metrics.absent / metrics.total) * 100}%` }}
                title={`Absent: ${metrics.absent}`}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Present ({Math.round((metrics.present / metrics.total) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Absent ({Math.round((metrics.absent / metrics.total) * 100)}%)</span>
              </div>
            </div>
          </div>

          {/* Quick links banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className="font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View full student roster (53)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View past sessions history</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Absent Follow-Up & Recently Recognized */}
        <div className="space-y-6">
          {/* Absent list mini card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-800">Unmarked / Absent</h4>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {metrics.absent} Students
              </span>
            </div>

            {absentStudents.length > 0 ? (
              <div className="space-y-2">
                {absentStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => onOpenStudentDetails(student.id)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{student.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">{student.id}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Absent
                    </span>
                  </div>
                ))}
                {metrics.absent > 4 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-800 pt-1"
                  >
                    + {metrics.absent - 4} more absent students
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-medium">
                🎉 All 53 students are marked Present today!
              </div>
            )}
          </div>

          {/* Recently Recognized Mini card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-800">Recent AI Detections</h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Live feed</span>
            </div>

            <div className="space-y-2">
              {recentPresentStudents.slice(0, 4).map((student) => (
                <div
                  key={student.id}
                  onClick={() => onOpenStudentDetails(student.id)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {student.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">{student.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {attendanceMap[student.id]?.timeMarked || '09:02 AM'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
