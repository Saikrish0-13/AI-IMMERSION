/**
 * localStorageHelper.js
 * Utility functions for loading and saving attendance data into the browser's localStorage.
 * Ensures data stays intact across page reloads without requiring a backend server.
 */

import { INITIAL_STUDENTS, INITIAL_HISTORY } from '../data/initialStudents.js';

const STORAGE_KEYS = {
  TODAY_ATTENDANCE: 'smart_attendance_today',
  HISTORY: 'smart_attendance_history',
  SETTINGS: 'smart_attendance_settings',
  SESSION_DATE: 'smart_attendance_date',
};

/**
 * Formats a Date object into a readable string (e.g. "Thursday, Sep 17, 2026")
 */
export function getFormattedTodayDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

/**
 * Gets ISO date string YYYY-MM-DD
 */
export function getISODate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Load today's attendance map { [studentId]: { status: 'Present' | 'Absent', timeMarked?: string, method?: string } }
 * If none exists, initialize all 53 students (with some marked present for realistic feel, or marked as absent by default)
 */
export function getTodayAttendance() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODAY_ATTENDANCE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Failed to parse attendance from localStorage:', error);
  }

  // Default initial today attendance:
  // Pre-populate some realistic initial attendance (e.g. 38 present, 15 absent) so the dashboard looks vibrant on first load
  const initialMap = {};
  INITIAL_STUDENTS.forEach((student, index) => {
    // 80% initially present on first launch, rest absent
    const isPresent = index % 5 !== 0;
    initialMap[student.id] = {
      status: isPresent ? 'Present' : 'Absent',
      timeMarked: isPresent ? '08:58 AM' : null,
      method: isPresent ? 'AI Facial Scan' : 'Manual',
    };
  });

  saveTodayAttendance(initialMap);
  return initialMap;
}

/**
 * Save today's attendance map to localStorage
 */
export function saveTodayAttendance(attendanceMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_ATTENDANCE, JSON.stringify(attendanceMap));
  } catch (error) {
    console.error('Failed to save attendance to localStorage:', error);
  }
}

/**
 * Load attendance history records
 */
export function getAttendanceHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Failed to parse history from localStorage:', error);
  }

  // Fallback to INITIAL_HISTORY
  saveAttendanceHistory(INITIAL_HISTORY);
  return INITIAL_HISTORY;
}

/**
 * Save attendance history records
 */
export function saveAttendanceHistory(historyArray) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyArray));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
}

/**
 * Calculate summary metrics for today
 */
export function calculateAttendanceMetrics(attendanceMap) {
  const total = INITIAL_STUDENTS.length;
  let present = 0;
  let absent = 0;

  INITIAL_STUDENTS.forEach((student) => {
    const record = attendanceMap[student.id];
    if (record && record.status === 'Present') {
      present += 1;
    } else {
      absent += 1;
    }
  });

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    total,
    present,
    absent,
    percentage,
  };
}

/**
 * Calculate past attendance rate for a specific student across all history sessions
 */
export function getStudentHistoricalStats(studentId, currentStatus) {
  const history = getAttendanceHistory();
  // Deterministic seed for realistic historical student attendance based on roll number
  const studentIndex = INITIAL_STUDENTS.findIndex((s) => s.id === studentId);
  const totalSessions = history.length + 1; // past history + today

  let attendedCount = 0;
  const sessionLogs = [];

  // Add today
  const isPresentToday = currentStatus === 'Present';
  if (isPresentToday) attendedCount += 1;
  sessionLogs.push({
    date: 'Today (' + getFormattedTodayDate() + ')',
    status: isPresentToday ? 'Present' : 'Absent',
    method: isPresentToday ? 'AI Facial Scan' : 'Manual',
  });

  // Calculate for past history
  history.forEach((h, hIdx) => {
    // Generate consistent variation per student
    const pseudoRand = ((studentIndex * 13 + hIdx * 7) % 100) / 100;
    // Base 85% attendance rate
    const wasPresent = pseudoRand > 0.18;
    if (wasPresent) attendedCount += 1;
    sessionLogs.push({
      date: h.formattedDate,
      status: wasPresent ? 'Present' : 'Absent',
      method: h.method || 'AI Facial Scan',
    });
  });

  const percentage = Math.round((attendedCount / totalSessions) * 100);

  return {
    attendedCount,
    totalSessions,
    percentage,
    sessionLogs,
  };
}

/**
 * Export today's attendance as a CSV file
 */
export function exportAttendanceToCSV(attendanceMap) {
  const dateStr = getISODate();
  const headers = ['Student ID', 'Roll No', 'Student Name', 'Department', 'Status', 'Marked Time', 'Method'];
  
  const rows = INITIAL_STUDENTS.map((student) => {
    const rec = attendanceMap[student.id] || { status: 'Absent', timeMarked: '-', method: '-' };
    return [
      student.id,
      student.rollNo,
      `"${student.name}"`,
      `"${student.department}"`,
      rec.status,
      rec.timeMarked || '-',
      rec.method || '-',
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Attendance_Report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
