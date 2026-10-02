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
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Title Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#111827] border border-sky-400/20 rounded-[1.75rem] p-4 mb-3 shadow-[0_18px_45px_rgba(2,6,23,.35)] flex items-center justify-between">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber-300/10 blur-2xl" />
        <div>
          <span className="text-[10px] font-black text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
            ✈️ 100% Offline Universal Flight Arcade
          </span>
          <h2 className="text-lg font-black text-white leading-tight">
            In-Flight Boredom Buster
          </h2>
          <p className="text-[11px] text-slate-300">
            Action arcade games for long flights anywhere!
          </p>
        </div>
        <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl text-amber-400 shrink-0">
          <Plane className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-white/10 bg-white/[.04] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Difficulty deck</span>
          <span className="text-[10px] font-bold text-amber-300">Best run {bestRun}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6].map((item) => {
            const locked = item > unlockedLevel;
            return (
              <button key={item} onClick={() => selectLevel(item)} disabled={locked} className={`rounded-xl py-2 text-xs font-black transition flex items-center justify-center gap-1 ${level === item ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/10' : locked ? 'bg-slate-950/60 text-slate-600 border border-white/5' : 'bg-slate-900 text-slate-400 border border-white/10'}`} aria-label={locked ? `Level ${item} locked` : `Select level ${item}`}>
                {locked && <Lock className="w-3 h-3" />}L{item}
              </button>
            );
          })}
        </div>
      </div>

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
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
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
