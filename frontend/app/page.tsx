"use client";

import React, { useState, useEffect, useRef } from 'react';
import CalibrationView from '../components/CalibrationView';
import PillMarker from '../components/PillOverlay/PillMarker';
import ControlPanel from '../components/Controls/ControlPanel';

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

  return (
    <main className="flex min-h-screen flex-col bg-black text-white overflow-hidden select-none">
      <div className="h-[80vh] w-full relative bg-slate-900/40 border-b-2 border-slate-800/50">
        {mode === 'calibrate' ? (
          <CalibrationView onComplete={() => setMode('quick')} />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <div className="text-4xl font-bold border-2 border-slate-700/30 p-10 rounded-3xl">
                  CAMERA OVERLAY AREA
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
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-600/90 text-white px-6 py-2 rounded-full font-bold shadow-xl">
                SYSTEM NOT CALIBRATED
              </div>
            )}
          </>
        )}
      </div>
      <ControlPanel
        mode={mode}
        onModeChange={(m) => setMode(m)}
        count={count}
        targetCount={targetCount}
      />
    </main>
  );
}
