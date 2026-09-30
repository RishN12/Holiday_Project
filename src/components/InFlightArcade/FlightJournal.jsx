import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, KEYS } from '../../utils/storage';
import { BookOpen, Plus, Trash2, Clock, MapPin } from 'lucide-react';

export default function FlightJournal() {
  const [logs, setLogs] = useState(() => getStorageItem(KEYS.JOURNAL, []));
  const [text, setText] = useState('');
  const [ukTime, setUkTime] = useState('');
  const [floridaTime, setFloridaTime] = useState('');

  useEffect(() => {
    setStorageItem(KEYS.JOURNAL, logs);
  }, [logs]);

  // Live time difference display
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // UK time string
      const ukStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Florida EST is UK - 5 hours
      const flDate = new Date(now.getTime() - 5 * 60 * 60 * 1000);
      const flStr = flDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setUkTime(ukStr);
      setFloridaTime(flStr);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newLog = {
      id: `log_${Date.now()}`,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    setLogs([newLog, ...logs]);
    setText('');
  };

  const handleDelete = (id) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Timezone Clocks Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl grid grid-cols-2 gap-3 text-center">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-sky-400 block mb-0.5">🇬🇧 LONDON TIME</span>
          <span className="text-xl font-black text-white font-mono">{ukTime || '--:--'}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold text-amber-400 block mb-0.5">🇺🇸 FLORIDA EST (UK-5h)</span>
          <span className="text-xl font-black text-amber-300 font-mono">{floridaTime || '--:--'}</span>
        </div>
      </div>

      {/* Write Log Input */}
      <form onSubmit={handleAddLog} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-sky-400" />
          In-Flight Logbook & Memories
        </h4>
        <textarea
          placeholder="Log your flight thoughts, movies watched, turbulence notes..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-700 text-xs rounded-2xl p-3 text-white focus:outline-none focus:border-sky-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-md flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Save Memory Entry
          </button>
        </div>
      </form>

      {/* Logs List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Saved Flight Entries ({logs.length})
        </h4>

        {logs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
            No flight journal entries yet. Record your flight milestones here!
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded-md inline-block mb-1.5">
                  {log.date} at {log.timestamp}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{log.content}</p>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="text-slate-600 hover:text-rose-400 p-1 shrink-0 opacity-60 hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
