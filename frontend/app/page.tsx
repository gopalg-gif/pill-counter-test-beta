"use client";

import React, { useState, useEffect, useRef } from 'react';
import CalibrationView from '../components/CalibrationView';
import PillMarker from '../components/PillOverlay/PillMarker';
import ControlPanel from '../components/Controls/ControlPanel';
import LoginView from '../components/Integrated/LoginView';
import HistoryView from '../components/Integrated/HistoryView';

interface PillData {
  id: number;
  bbox: number[];
  screen_bbox: number[];
  status: 'normal' | 'yellow' | 'red';
}

export default function Home() {
  const [mode, setMode] = useState<'quick' | 'standard' | 'integrated' | 'calibrate'>('quick');
  const [pills, setPills] = useState<PillData[]>([]);
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(30);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [logs, setLogs] = useState([
    { id: 'TX-4921', user: 'Dr. Smith', drug: 'Amoxicillin 500mg', count: 30, date: '2023-10-27 14:22' },
    { id: 'TX-4922', user: 'Dr. Jones', drug: 'Lisinopril 10mg', count: 60, date: '2023-10-27 15:45' },
    { id: 'TX-4923', user: 'Dr. Smith', drug: 'Metformin 850mg', count: 45, date: '2023-10-27 16:10' },
  ]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPills(data.pills || []);
      setCount(data.count || 0);
      setIsCalibrated(data.is_calibrated);
    };
    return () => ws.current?.close();
  }, []);

  const handleLogout = () => {
    setUser(null);
    setMode('quick');
  };

  const renderTrayOverlay = () => {
    if (mode === 'calibrate') {
      return <CalibrationView onComplete={() => setMode('quick')} />;
    }

    if (mode === 'integrated') {
      if (!user) {
        return <LoginView onLogin={(u) => setUser(u)} />;
      }
      return <HistoryView logs={logs} />;
    }

    return (
      <>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="text-4xl font-bold border-2 border-slate-700/30 p-10 rounded-3xl uppercase tracking-widest text-slate-400">
              Camera Overlay Area
           </div>
        </div>
        {pills.map((pill) => (
          <PillMarker
            key={pill.id}
            x={pill.screen_bbox[0]}
            y={pill.screen_bbox[1]}
            w={pill.screen_bbox[2]}
            h={pill.screen_bbox[3]}
            status={pill.status}
          />
        ))}
        {!isCalibrated && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-yellow-600/90 text-white px-8 py-3 rounded-full font-black shadow-2xl animate-pulse tracking-tight text-lg">
            SYSTEM NOT CALIBRATED - RUN CALIBRATION
          </div>
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white overflow-hidden select-none">
      {/* Top 80%: The "Transparent" Tray View */}
      <div className="h-[80vh] w-full relative bg-slate-900/20 border-b-2 border-slate-800/30 overflow-hidden">
        {renderTrayOverlay()}
      </div>

      {/* Bottom 20%: Control Panel */}
      <ControlPanel
        mode={mode}
        onModeChange={(m) => setMode(m)}
        count={count}
        targetCount={targetCount}
        user={user}
        onLogout={handleLogout}
      />
    </main>
  );
}
