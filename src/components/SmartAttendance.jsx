/**
 * SmartAttendance.jsx
 * AI-Assisted Smart Attendance simulation component.
 * Features an interactive camera-like viewfinder, scanning laser, facial detection bounding boxes,
 * status messages ("Scanning...", "Student recognized", "Attendance marked"),
 * and automatic JavaScript marking of absent students.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/initialStudents.js';

export default function SmartAttendance({
  attendanceMap,
  onMarkStudent,
  onOpenStudentDetails,
  onMarkAllPresent,
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Idle'); // 'Idle' | 'Scanning...' | 'Student recognized' | 'Attendance marked'
  const [currentRecognized, setCurrentRecognized] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [recognizedFeed, setRecognizedFeed] = useState([]);
  const [useRealWebcam, setUseRealWebcam] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [scanSpeed, setScanSpeed] = useState(1600); // ms per scan cycle
  const [soundEnabled, setSoundEnabled] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Audio beep generator using browser Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted without user interaction
    }
  };

  // Handle optional real webcam toggle
  useEffect(() => {
    if (useRealWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setWebcamError(null);
        })
        .catch((err) => {
          console.warn('Webcam permission denied or not available:', err);
          setWebcamError('Camera access not granted or not supported in this frame. Falling back to simulation mode.');
          setUseRealWebcam(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealWebcam]);

  // Execute a single simulated recognition step
  const executeRecognitionStep = () => {
    // Find students who are currently marked Absent
    const absentStudents = INITIAL_STUDENTS.filter(
      (s) => !attendanceMap[s.id] || attendanceMap[s.id].status === 'Absent'
    );

    // If all are already marked present
    if (absentStudents.length === 0) {
      setScanStatus('All students marked present!');
      setIsScanning(false);
      return;
    }

    // Step 1: Scanning...
    setScanStatus('Scanning...');
    setCurrentRecognized(null);
    setConfidence(null);

    setTimeout(() => {
      // Pick a random absent student
      const randomIndex = Math.floor(Math.random() * absentStudents.length);
      const student = absentStudents[randomIndex];
      const randomConfidence = (96.5 + Math.random() * 3.3).toFixed(1);

      // Step 2: Student recognized
      setScanStatus(`Student recognized: ${student.name}`);
      setCurrentRecognized(student);
      setConfidence(randomConfidence);
      playBeep();

      setTimeout(() => {
        // Step 3: Attendance marked
        setScanStatus(`Attendance marked for ${student.name} [ID: ${student.id}]`);
        onMarkStudent(student.id, 'Present', 'AI Facial Scan');

        // Add to live recognition feed
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        setRecognizedFeed((prev) => [
          {
            ...student,
            time: timeString,
            confidence: randomConfidence,
          },
          ...prev.slice(0, 19),
        ]);
      }, 500);
    }, 600);
  };

  // Continuous scanning loop when isScanning is active
  useEffect(() => {
    if (isScanning) {
      executeRecognitionStep();
      scanIntervalRef.current = setInterval(() => {
        executeRecognitionStep();
      }, scanSpeed);
    } else {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, scanSpeed, attendanceMap]);

  // Compute live counts
  const totalStudents = INITIAL_STUDENTS.length;
  const presentCount = Object.values(attendanceMap).filter((s) => s?.status === 'Present').length;
  const absentCount = totalStudents - presentCount;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner Required by Guidelines */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-amber-900 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-amber-950">Academic Prototype Notice</p>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            This is a frontend prototype demonstrating an automated smart classroom attendance workflow.
            Facial detection and student matching are safely simulated using JavaScript algorithms.
            No personal biometric data is captured, analyzed, or stored.
          </p>
        </div>
      </div>

      {/* Main Scanner Layout: Viewport (left 7 cols) & Live Recognized Stream (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Camera HUD Viewport */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                AI Attendance Scanner
              </h3>
              <p className="text-xs text-slate-500">
                Live simulated facial recognition stream for 53 students
              </p>
            </div>

            {/* Viewport controls (Camera switch & Sound toggle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseRealWebcam(!useRealWebcam)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  useRealWebcam
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Toggle real webcam or simulated classroom view"
              >
                {useRealWebcam ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span>{useRealWebcam ? 'Real Camera' : 'Simulated Feed'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {webcamError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{webcamError}</span>
            </div>
          )}

          {/* Camera Viewfinder Screen */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center select-none">
            {/* Real webcam video element if enabled */}
            {useRealWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              /* Simulated classroom scene background */
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                {/* Classroom desks & students silhouette representation */}
                <div className="w-full max-w-sm h-32 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950" />
              </div>
            )}

            {/* HUD Overlays */}
            {/* Top HUD Bar */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10 z-20">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isScanning ? 'bg-rose-500 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <span className="font-bold text-white tracking-wider">
                  {isScanning ? 'REC • SCANNING' : 'AI STANDBY'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span>FPS: {isScanning ? '29.97' : '0.00'}</span>
                <span className="hidden sm:inline">1080P HD</span>
                <span className="text-blue-400 font-semibold">MODEL: CS-FACE-v2</span>
              </div>
            </div>

            {/* Scanner Laser Beam Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_rgba(34,211,238,0.8)] z-10 animate-bounce" />
            )}

            {/* Target Reticle in Center */}
            <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-blue-400/40 rounded-3xl flex flex-col items-center justify-center p-4">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />

              {currentRecognized ? (
                <div className="text-center space-y-1.5 animate-scale-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-bold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    {currentRecognized.name.charAt(0)}
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-500/60 px-2.5 py-1 rounded-md text-emerald-300">
                    <p className="text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
                      {currentRecognized.name}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400">
                      ID: {currentRecognized.id}
                    </p>
                  </div>
                  {confidence && (
                    <span className="inline-block text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      Confidence: {confidence}%
                    </span>
                  )}
                </div>
              ) : isScanning ? (
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full border-2 border-t-cyan-400 border-cyan-400/20 animate-spin" />
                  <p className="text-xs font-mono text-cyan-300">Detecting Faces...</p>
                </div>
              ) : (
                <div className="text-center space-y-1 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                  <p className="text-xs font-medium">Position classroom in frame</p>
                </div>
              )}
            </div>

            {/* Bottom Status Ticker Overlay */}
            <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    scanStatus === 'Idle'
                      ? 'bg-slate-400'
                      : scanStatus.startsWith('Student recognized')
                      ? 'bg-amber-400 animate-pulse'
                      : scanStatus.startsWith('Attendance marked')
                      ? 'bg-emerald-400'
                      : 'bg-cyan-400 animate-ping'
                  }`}
                />
                <span className="text-xs font-mono font-medium text-white truncate max-w-[200px] sm:max-w-md">
                  {scanStatus}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                {presentCount}/{totalStudents} Present
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              {!isScanning ? (
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  disabled={absentCount === 0}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all cursor-pointer ${
                    absentCount === 0
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-600/20'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start AI Attendance</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsScanning(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 active:scale-98 transition-all shadow-sm shadow-rose-600/20 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop AI Attendance</span>
                </button>
              )}

              {/* Single step trigger */}
              <button
                type="button"
                onClick={executeRecognitionStep}
                disabled={isScanning || absentCount === 0}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
                title="Trigger a single face detection test"
              >
                Scan Single Face
              </button>
            </div>

            {/* Speed selection */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FastForward className="w-3.5 h-3.5 text-slate-400" />
              <span>Speed:</span>
              <select
                value={scanSpeed}
                onChange={(e) => setScanSpeed(Number(e.target.value))}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
              >
                <option value={2400}>Slow (2.4s)</option>
                <option value={1500}>Normal (1.5s)</option>
                <option value={800}>Fast (0.8s)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Live Feed of Recognized Students */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  AI Recognition Stream
                </h4>
                <p className="text-[11px] text-slate-400">
                  Students detected during current active session
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                {recognizedFeed.length} Detected
              </span>
            </div>

            {/* Scrollable list */}
            <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {recognizedFeed.length > 0 ? (
                recognizedFeed.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => onOpenStudentDetails(item.id)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/70 hover:border-blue-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          ID: {item.id} • Roll: {item.rollNo}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Present
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No live recognitions in this view yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Click "Start AI Attendance" to begin automated scanning.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick manual bypass */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Remaining absent: <b>{absentCount}</b>
            </span>
            <button
              type="button"
              onClick={onMarkAllPresent}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Mark All 53 Present
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
