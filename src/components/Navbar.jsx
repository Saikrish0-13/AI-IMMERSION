/**
 * Navbar.jsx
 * Top navigation bar component for the Smart Classroom Attendance System.
 * Displays system brand, college department tag, real-time clock, and teacher profile.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar, ShieldCheck, Menu, X, Camera } from 'lucide-react';
import { getFormattedTodayDate } from '../utils/localStorageHelper.js';

export default function Navbar({ onOpenSmartAttendance, mobileMenuOpen, setMobileMenuOpen }) {
  const [timeString, setTimeString] = useState('');

  // Update real-time clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & App Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                  SmartAttend <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">AI Classroom</span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Department of Computer Science • Section A (53 Students)
                </p>
              </div>
            </div>
          </div>

          {/* Right: Date, Live Clock & Start AI Quick Action */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Clock & Date Badge */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{getFormattedTodayDate()}</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <div className="flex items-center gap-1.5 font-mono text-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{timeString || '09:00:00 AM'}</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={onOpenSmartAttendance}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm shadow-blue-600/25 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden xs:inline">Start AI Attendance</span>
              <span className="xs:hidden">AI Scan</span>
            </button>

            {/* Teacher Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-blue-700 font-bold text-xs flex items-center justify-center">
                PS
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">Prof. S. Sharma</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Faculty In-Charge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
