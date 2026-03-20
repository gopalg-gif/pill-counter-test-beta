import React from 'react';
import { History, FileText, CheckCircle2 } from 'lucide-react';

interface HistoryViewProps {
  logs: Array<{ id: string; user: string; drug: string; count: number; date: string }>;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md p-10 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <History className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Recent Count Logs</h2>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all">
          <FileText size={18} /> EXPORT CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 flex items-center justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{log.drug}</div>
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span>ID: {log.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>USER: {log.user.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-right">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Quantity</div>
                <div className="text-3xl font-black text-white font-mono">{log.count}</div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="min-w-[120px]">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Timestamp</div>
                <div className="text-sm font-bold text-blue-400">{log.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
