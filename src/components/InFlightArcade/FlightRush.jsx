import React, { useEffect, useMemo, useState } from 'react';
import { Gauge, RotateCcw, Star, Zap } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const LEVELS = [
  { target: 8, time: 18, label: 'Cruise' },
  { target: 12, time: 16, label: 'Climb' },
  { target: 16, time: 14, label: 'Jet stream' },
  { target: 21, time: 12, label: 'Turbulence' },
  { target: 27, time: 11, label: 'Storm front' },
  { target: 34, time: 10, label: 'Speed run' },
  { target: 42, time: 9, label: 'Supersonic' },
  { target: 50, time: 8, label: 'Final approach' },
  { target: 58, time: 8, label: 'Mach one' },
  { target: 67, time: 7, label: 'High altitude' },
  { target: 77, time: 7, label: 'Cloud breaker' },
  { target: 88, time: 6, label: 'Night flight' },
  { target: 100, time: 6, label: 'Orlando arrival' },
  { target: 113, time: 6, label: 'Runway lights' },
  { target: 127, time: 5, label: 'Final descent' },
  { target: 142, time: 5, label: 'Gate approach' },
  { target: 158, time: 5, label: 'Touchdown' },
  { target: 175, time: 4, label: 'Grand arrival' },
  { target: 193, time: 4, label: 'Sky champion' },
];

export default function FlightRush() {
  const [level, setLevel] = useState(() => getStorageItem('orlando_rush_level_v1', 1));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].time);
  const [playing, setPlaying] = useState(false);
  const [best, setBest] = useState(() => getStorageItem('orlando_rush_best_v1', 0));
  const [unlocked, setUnlocked] = useState(() => getStorageItem('orlando_rush_unlocked_v1', 1));
  const current = LEVELS[level - 1];
  const progress = Math.min(100, (score / current.target) * 100);

  useEffect(() => {
    if (!playing) return undefined;
    if (timeLeft <= 0) { setPlaying(false); return undefined; }
    const timer = window.setInterval(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [playing, timeLeft]);

  const start = () => { setScore(0); setTimeLeft(current.time); setPlaying(true); };
  const tap = () => {
    if (!playing) return;
    const next = score + 1;
    setScore(next);
    if (next > best) { setBest(next); setStorageItem('orlando_rush_best_v1', next); }
    if (next >= current.target) {
      setPlaying(false);
      const nextLevel = Math.min(LEVELS.length, level + 1);
      setUnlocked((value) => { const result = Math.max(value, nextLevel); setStorageItem('orlando_rush_unlocked_v1', result); return result; });
    }
  };
  const chooseLevel = (value) => { if (value <= unlocked) { setLevel(value); setStorageItem('orlando_rush_level_v1', value); setPlaying(false); setScore(0); setTimeLeft(LEVELS[value - 1].time); } };
  const status = score >= current.target ? 'Level cleared' : playing ? 'Tap the boost' : 'Ready for takeoff';

  return <div className="space-y-4 animate-fadeIn">
    <div className="flex items-start justify-between"><div><h3 className="text-sm font-extrabold text-white flex items-center gap-1.5"><Gauge className="w-4 h-4 text-cyan-300" /> Flight Rush</h3><p className="text-xs text-slate-400">Charge the engines before the countdown hits zero.</p></div><div className="text-right"><div className="text-[10px] text-slate-500 uppercase tracking-wider">Best</div><div className="text-sm font-black text-cyan-300">{best}</div></div></div>
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1" aria-label="Flight Rush levels">{LEVELS.map((item, index) => { const value = index + 1; const locked = value > unlocked; return <button key={value} disabled={locked} onClick={() => chooseLevel(value)} className={`level-chip ${level === value ? 'level-chip-active' : ''} ${locked ? 'level-chip-locked' : ''}`} aria-label={`${item.label}, level ${value}${locked ? ', locked' : ''}`}>{locked ? '•' : value}</button>; })}</div>
    <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/60 via-slate-950 to-indigo-950 p-4 shadow-xl"><div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>Level {level} · {current.label}</span><span>{timeLeft}s</span></div><div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} /></div><button onClick={tap} disabled={!playing} className="mx-auto mt-6 flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-cyan-300/50 bg-cyan-400 text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.35)] transition active:scale-95 disabled:cursor-default disabled:opacity-80"><Zap className="h-8 w-8" /><span className="mt-1 text-sm font-black">{playing ? 'BOOST' : status}</span><span className="text-[10px] font-bold opacity-70">{score} / {current.target}</span></button><p className="mt-5 text-center text-xs text-slate-400">{playing ? 'Tap as fast as you can.' : score >= current.target ? 'Nice flight. Next level unlocked.' : 'Start a round, then tap the boost button.'}</p></div>
    <button onClick={start} className="w-full rounded-2xl bg-cyan-300 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 active:scale-[.98]">{playing ? 'Restart level' : 'Start flight'}</button>
    <button onClick={() => { setScore(0); setPlaying(false); setTimeLeft(current.time); }} className="mx-auto flex items-center gap-1 text-[11px] font-bold text-slate-500"><RotateCcw className="h-3 w-3" /> Reset attempt</button>
  </div>;
}
