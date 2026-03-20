import React, { useState } from 'react';
import { Play, ClipboardList, LogIn, Camera, CheckCircle } from 'lucide-react';

interface ControlPanelProps {
  mode: 'quick' | 'standard' | 'integrated' | 'calibrate';
  onModeChange: (mode: any) => void;
  count: number;
  targetCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ mode, onModeChange, count, targetCount }) => {
  const [showToast, setShowToast] = useState(false);

  const handleLogCount = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-[20vh] w-full bg-slate-900 border-t-4 border-blue-500/30 flex items-center justify-between px-10 gap-8 relative overflow-hidden">
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 z-50">
           <CheckCircle size={20} />
           <span>Count successfully saved to database!</span>
        </div>
      )}

      <div className="flex gap-4">
        {[
          { id: 'quick', icon: Play, label: 'Quick' },
          { id: 'standard', icon: ClipboardList, label: 'Standard' },
          { id: 'integrated', icon: LogIn, label: 'Integrated' },
          { id: 'calibrate', icon: Camera, label: 'Calibrate' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex flex-col items-center justify-center p-3 w-24 rounded-xl transition-all ${
              mode === m.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <m.icon size={24} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/50 border border-slate-700/50 rounded-2xl h-3/4 py-2">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total Pill Count</div>
        <div className="text-6xl font-black font-mono text-white flex items-baseline gap-2 leading-none">
          {count}
          {mode === 'standard' && (
            <span className="text-xl text-slate-600">/ {targetCount}</span>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center min-w-[300px] justify-end">
        {mode === 'standard' && (
           <div className="flex flex-col gap-1 items-end mr-4">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Progress Status</div>
             <div className={`text-sm font-bold px-3 py-1 rounded-full ${count >= targetCount ? 'bg-green-600/20 text-green-500' : 'bg-yellow-600/20 text-yellow-500'}`}>
                {count >= targetCount ? 'TARGET REACHED' : `${Math.round((count/targetCount)*100)}% COMPLETE`}
             </div>
           </div>
        )}

        <button
          onClick={handleLogCount}
          className="bg-emerald-600 hover:bg-emerald-700 px-8 py-5 rounded-2xl font-black text-xl text-white shadow-lg shadow-emerald-500/20 transition-all"
        >
          LOG COUNT
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
