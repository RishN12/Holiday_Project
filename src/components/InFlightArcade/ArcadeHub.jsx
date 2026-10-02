import React, { useState } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import SkyWingsGame from './SkyWingsGame';
import OrbitLander from './OrbitLander';
import FlightBrickBreaker from './FlightBrickBreaker';
import JetpackRunner from './JetpackRunner';
import FlightBingo from './FlightBingo';
import FlightJournal from './FlightJournal';
import WordSearch from './WordSearch';
import CoasterMemory from './CoasterMemory';
import TriviaQuiz from './TriviaQuiz';
import { Gamepad2, Rocket, Layers, Zap, Sparkles, BookOpen, Plane, Search, Brain, HelpCircle, Lock } from 'lucide-react';

export default function ArcadeHub() {
  const [subTab, setSubTab] = useState('game');
  const [bestRun, setBestRun] = useState(() => getStorageItem('orlando_arcade_best_run', 0));
  const [level, setLevel] = useState(() => getStorageItem('orlando_arcade_level', 1));
  const [unlockedLevel, setUnlockedLevel] = useState(() => getStorageItem('orlando_arcade_unlocked_level', 1));

  const selectLevel = (nextLevel) => {
    if (nextLevel > unlockedLevel) return;
    setLevel(nextLevel);
    setStorageItem('orlando_arcade_level', nextLevel);
  };

  const completeLevel = (completedLevel) => {
    const nextUnlocked = Math.min(6, Math.max(unlockedLevel, completedLevel + 1));
    setUnlockedLevel(nextUnlocked);
    setStorageItem('orlando_arcade_unlocked_level', nextUnlocked);
    if (nextUnlocked > completedLevel) {
      setLevel(nextUnlocked);
      setStorageItem('orlando_arcade_level', nextUnlocked);
    }
  };

  const tabs = [
    { id: 'game', label: 'Pilot Dodge', icon: Gamepad2 },
    { id: 'lander', label: 'Space Lander', icon: Rocket },
    { id: 'breaker', label: 'Brick Breaker', icon: Layers },
    { id: 'runner', label: 'Jetpack Dash', icon: Zap },
    { id: 'bingo', label: 'Flight Bingo', icon: Sparkles },
    { id: 'journal', label: 'Flight Log', icon: BookOpen },
    { id: 'wordsearch', label: 'Word Search', icon: Search },
    { id: 'memory', label: 'Memory Match', icon: Brain },
    { id: 'trivia', label: 'Flight Trivia', icon: HelpCircle },
  ];

  return (
    <div className="pb-28 pt-3 px-3 max-w-md mx-auto animate-fadeIn">
      <section className="arcade-hero relative overflow-hidden rounded-[1.5rem] p-4 mb-3 shadow-[0_18px_45px_rgba(0,0,0,.3)]">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-[9px] font-black uppercase tracking-[.16em] text-amber-200">Offline arcade</span>
            <h2 className="mt-2 text-[22px] font-black leading-[1.05] tracking-[-.04em] text-white">Choose your flight.</h2>
            <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-slate-300">Quick games designed for takeoff, turbulence, and touchdown.</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-amber-200 shadow-inner shadow-white/10"><Plane className="h-5 w-5" /></div>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
          <div><div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Level</div><div className="mt-0.5 text-sm font-black text-white">{level}<span className="text-slate-500"> / 6</span></div></div>
          <div><div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Best run</div><div className="mt-0.5 text-sm font-black text-amber-200">{bestRun}</div></div>
          <div><div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Unlocked</div><div className="mt-0.5 text-sm font-black text-sky-200">{unlockedLevel}</div></div>
        </div>
      </section>

      <section className="mb-3 rounded-2xl border border-white/[0.08] bg-[#11151b] p-3 shadow-[0_12px_30px_rgba(0,0,0,.22)]">
        <div className="mb-2 flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.16em] text-slate-300">Flight progression</div><div className="mt-0.5 text-[10px] text-slate-500">Finish a level to unlock the next</div></div><span className="text-[10px] font-black text-amber-300">{Math.round((unlockedLevel / 6) * 100)}%</span></div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-300 transition-all" style={{ width: `${(unlockedLevel / 6) * 100}%` }} /></div>
        <div className="grid grid-cols-6 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((item) => { const locked = item > unlockedLevel; return <button key={item} onClick={() => selectLevel(item)} disabled={locked} className={`flex h-10 items-center justify-center gap-0.5 rounded-xl text-xs font-black transition ${level === item ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20' : locked ? 'border border-white/5 bg-slate-950/60 text-slate-600' : 'border border-white/10 bg-slate-800 text-slate-300'}`} aria-label={locked ? `Level ${item} locked` : `Select level ${item}`}>{locked && <Lock className="h-3 w-3" />}<span>{item}</span></button>; })}
        </div>
      </section>

      {/* Sub-tabs Horizontal Scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none snap-x">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`snap-start shrink-0 py-2 px-3 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 transition border ${
                isActive
                  ? 'bg-[#e7c982] text-[#11151b] border-[#f2dba4] shadow-md font-black'
                  : 'bg-[#11151b] text-slate-400 border-white/[0.08] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content rendering */}
      {subTab === 'game' && <SkyWingsGame level={level} onLevelComplete={completeLevel} />}
      {subTab === 'lander' && <OrbitLander />}
      {subTab === 'breaker' && <FlightBrickBreaker level={level} />}
      {subTab === 'runner' && <JetpackRunner />}
      {subTab === 'bingo' && <FlightBingo />}
      {subTab === 'journal' && <FlightJournal />}
      {subTab === 'wordsearch' && <WordSearch />}
      {subTab === 'memory' && <CoasterMemory />}
      {subTab === 'trivia' && <TriviaQuiz />}
    </div>
  );
}
