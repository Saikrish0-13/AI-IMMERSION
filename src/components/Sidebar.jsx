/**
 * Sidebar.jsx
 * Navigation sidebar component with clean icons, active tab highlights,
 * and quick student attendance summary counters.
 */

import React from 'react';
import {
  LayoutDashboard,
  Camera,
  CheckSquare,
  Users,
  History,
  FileSpreadsheet,
  Info,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  metrics,
  mobileMenuOpen,
  setMobileMenuOpen,
  onExportCSV,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
    },
    {
      id: 'smart',
      label: 'Smart Attendance',
      icon: Camera,
      badge: 'AI Powered',
      description: 'Face Recognition Scan',
    },
    {
      id: 'manual',
      label: 'Manual Attendance',
      icon: CheckSquare,
      description: 'Teacher Quick Override',
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: Users,
      count: metrics.total,
      description: 'All 53 Class Enrollees',
    },
    {
      id: 'history',
      label: 'Attendance History',
      icon: History,
      description: 'Previous Session Logs',
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation items list */}
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </div>

          {/* Export CSV report */}
          <button
            type="button"
            onClick={onExportCSV}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="block leading-tight">Export CSV Report</span>
              <span className="text-[10px] text-slate-400 block font-normal">
                Download today's roll
              </span>
            </div>
          </button>
        </div>

        {/* Bottom Session Widget */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 m-3 rounded-2xl border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Today's Class Roll</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              {metrics.percentage}% Present
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(metrics.present / metrics.total) * 100}%` }}
              title={`${metrics.present} Present`}
            />
            <div
              className="bg-rose-400 h-full transition-all duration-500"
              style={{ width: `${(metrics.absent / metrics.total) * 100}%` }}
              title={`${metrics.absent} Absent`}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Present: <b>{metrics.present}</b>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Absent: <b>{metrics.absent}</b>
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-slate-500">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>53 Enrolled • Target &ge;75%</span>
          </div>
        </div>
      </aside>
    </>
  );
}
