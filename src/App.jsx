/**
 * App.jsx
 * Main Application Component for the AI-Based Smart Classroom Attendance System.
 * Coordinates global attendance state, localStorage persistence, active view routing,
 * student detail modal view, and bulk actions.
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import SmartAttendance from './components/SmartAttendance.jsx';
import ManualAttendance from './components/ManualAttendance.jsx';
import StudentList from './components/StudentList.jsx';
import AttendanceHistory from './components/AttendanceHistory.jsx';
import StudentDetails from './components/StudentDetails.jsx';

import { INITIAL_STUDENTS } from './data/initialStudents.js';
import {
  getTodayAttendance,
  saveTodayAttendance,
  calculateAttendanceMetrics,
  exportAttendanceToCSV,
} from './utils/localStorageHelper.js';

export default function App() {
  // Navigation active tab: 'dashboard' | 'smart' | 'manual' | 'students' | 'history'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Today's attendance mapping { [studentId]: { status, timeMarked, method } }
  const [attendanceMap, setAttendanceMap] = useState(() => getTodayAttendance());

  // Currently inspected student for the detail modal (null = closed)
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Sync with localStorage on changes
  useEffect(() => {
    saveTodayAttendance(attendanceMap);
  }, [attendanceMap]);

  // Derived metrics (Total: 53, Present, Absent, Percentage)
  const metrics = calculateAttendanceMetrics(attendanceMap);

  /**
   * Mark an individual student (used by AI scan simulation and detail modal)
   */
  const handleMarkStudent = (studentId, status = 'Present', method = 'AI Facial Scan') => {
    const now = new Date();
    const timeMarked = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        timeMarked,
        method,
      },
    }));
  };

  /**
   * Toggle student status between 'Present' and 'Absent' (used in manual review)
   */
  const handleToggleStudentStatus = (studentId, requestedStatus = null) => {
    setAttendanceMap((prev) => {
      const current = prev[studentId]?.status || 'Absent';
      const newStatus = requestedStatus || (current === 'Present' ? 'Absent' : 'Present');
      const now = new Date();
      const timeMarked = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        ...prev,
        [studentId]: {
          status: newStatus,
          timeMarked: newStatus === 'Present' ? timeMarked : null,
          method: 'Manual Verification',
        },
      };
    });
  };

  /**
   * Mark all 53 students as Present
   */
  const handleMarkAllPresent = () => {
    const now = new Date();
    const timeMarked = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = {};
    INITIAL_STUDENTS.forEach((student) => {
      updated[student.id] = {
        status: 'Present',
        timeMarked,
        method: 'Manual (Mark All)',
      };
    });

    setAttendanceMap(updated);
  };

  /**
   * Mark all 53 students as Absent
   */
  const handleMarkAllAbsent = () => {
    const updated = {};
    INITIAL_STUDENTS.forEach((student) => {
      updated[student.id] = {
        status: 'Absent',
        timeMarked: null,
        method: 'Manual (Reset)',
      };
    });

    setAttendanceMap(updated);
  };

  /**
   * Export today's roll to CSV file
   */
  const handleExportCSV = () => {
    exportAttendanceToCSV(attendanceMap);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Fixed Navigation Bar */}
      <Navbar
        onOpenSmartAttendance={() => setActiveTab('smart')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          metrics={metrics}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onExportCSV={handleExportCSV}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              metrics={metrics}
              attendanceMap={attendanceMap}
              setActiveTab={setActiveTab}
              onOpenStudentDetails={(id) => setSelectedStudentId(id)}
              onExportCSV={handleExportCSV}
              onMarkAllPresent={handleMarkAllPresent}
            />
          )}

          {activeTab === 'smart' && (
            <SmartAttendance
              attendanceMap={attendanceMap}
              onMarkStudent={handleMarkStudent}
              onOpenStudentDetails={(id) => setSelectedStudentId(id)}
              onMarkAllPresent={handleMarkAllPresent}
            />
          )}

          {activeTab === 'manual' && (
            <ManualAttendance
              attendanceMap={attendanceMap}
              onToggleStudentStatus={handleToggleStudentStatus}
              onMarkAllPresent={handleMarkAllPresent}
              onMarkAllAbsent={handleMarkAllAbsent}
              onOpenStudentDetails={(id) => setSelectedStudentId(id)}
            />
          )}

          {activeTab === 'students' && (
            <StudentList
              attendanceMap={attendanceMap}
              onOpenStudentDetails={(id) => setSelectedStudentId(id)}
              onToggleStudentStatus={handleToggleStudentStatus}
            />
          )}

          {activeTab === 'history' && (
            <AttendanceHistory metrics={metrics} onExportCSV={handleExportCSV} />
          )}
        </main>
      </div>

      {/* Student Details Modal */}
      {selectedStudentId && (
        <StudentDetails
          studentId={selectedStudentId}
          attendanceMap={attendanceMap}
          onClose={() => setSelectedStudentId(null)}
          onToggleStudentStatus={handleToggleStudentStatus}
        />
      )}
    </div>
  );
}
