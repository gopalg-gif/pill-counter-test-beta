import React, { useState } from 'react';
import { Play, ClipboardList, LogIn, Camera, CheckCircle, User, LogOut, Database } from 'lucide-react';

interface ControlPanelProps {
  mode: 'quick' | 'standard' | 'integrated' | 'calibrate';
  onModeChange: (mode: any) => void;
  count: number;
  targetCount: number;
  user: string | null;
  onLogout: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ mode, onModeChange, count, targetCount, user, onLogout }) => {
  const [showToast, setShowToast] = useState(false);

  const handleLogCount = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-[20vh] w-full bg-slate-900/90 border-t-4 border-blue-600/40 flex items-center justify-between px-10 gap-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-3xl font-black shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center gap-3 z-[100] animate-in slide-in-from-top duration-300">
           <Database size={24} className="animate-pulse" />
           <span className="uppercase tracking-tight text-lg">Logged to Secure Database</span>
        </div>
      )}

      {/* Modern Mode Switcher */}
      <div className="flex gap-4 p-2 bg-slate-950/40 rounded-[2rem] border border-slate-800/50">
        {[
          { id: 'quick', icon: Play, label: 'Quick' },
          { id: 'standard', icon: ClipboardList, label: 'Standard' },
          { id: 'integrated', icon: LogIn, label: 'Integrated' },
          { id: 'calibrate', icon: Camera, label: 'Calibrate' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex flex-col items-center justify-center p-3 w-28 h-24 rounded-[1.5rem] transition-all duration-300 ${
              mode === m.id
              ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-105 ring-2 ring-blue-400/30'
              : 'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <m.icon size={32} strokeWidth={2.5} />
            <span className="text-[10px] font-black mt-2 uppercase tracking-tighter opacity-80">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Counter Display with Glow Effect */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/80 border-2 border-slate-800/80 rounded-[2.5rem] h-[85%] py-4 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative group">
        <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Real-Time Inventory Count</div>
        <div className="text-8xl font-black font-mono text-white flex items-baseline gap-2 leading-none tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {count}
          {mode === 'standard' && (
            <span className="text-3xl text-slate-700 font-bold ml-2">/ {targetCount}</span>
          )}
        </div>
      </div>

      {/* Status & User Area with Modern Styling */}
      <div className="flex gap-6 items-center min-w-[340px] justify-end">
        {mode === 'standard' && (
           <div className="flex flex-col gap-1 items-end mr-2">
             <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Progress</div>
             <div className={`text-sm font-black px-5 py-2 rounded-2xl ${count >= targetCount ? 'bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-400 border-2 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]'}`}>
                {count >= targetCount ? 'TARGET REACHED' : `${Math.round((count/targetCount)*100)}%`}
             </div>
           </div>
        )}

        {user && (
           <div className="flex flex-col gap-1 items-end mr-2">
             <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Operator</div>
             <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border-2 border-slate-800/80 shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                   <User size={18} className="text-blue-500" />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-tight">{user}</span>
                <button onClick={onLogout} className="ml-2 p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all">
                  <LogOut size={16} />
                </button>
             </div>
           </div>
        )}

        <button
          onClick={handleLogCount}
          className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-12 py-7 rounded-[1.75rem] font-black text-2xl text-white shadow-[0_10px_40px_rgba(16,185,129,0.2)] active:scale-95 transition-all duration-300 uppercase tracking-tighter ring-4 ring-emerald-500/10"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
