import React, { useState } from 'react';
import SkyWingsGame from './SkyWingsGame';
import OrbitLander from './OrbitLander';
import FlightBrickBreaker from './FlightBrickBreaker';
import JetpackRunner from './JetpackRunner';
import FlightBingo from './FlightBingo';
import FlightJournal from './FlightJournal';
import { Gamepad2, Rocket, Layers, Zap, Sparkles, BookOpen, Plane } from 'lucide-react';

export default function ArcadeHub() {
  const [subTab, setSubTab] = useState('game');

  const tabs = [
    { id: 'game', label: 'Pilot Dodge', icon: Gamepad2 },
    { id: 'lander', label: 'Space Lander', icon: Rocket },
    { id: 'breaker', label: 'Brick Breaker', icon: Layers },
    { id: 'runner', label: 'Jetpack Dash', icon: Zap },
    { id: 'bingo', label: 'Flight Bingo', icon: Sparkles },
    { id: 'journal', label: 'Flight Log', icon: BookOpen },
  ];

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto animate-fadeIn">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-indigo-500/20 border border-amber-500/30 rounded-3xl p-4 mb-3 flex items-center justify-between">
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
      {subTab === 'game' && <SkyWingsGame />}
      {subTab === 'lander' && <OrbitLander />}
      {subTab === 'breaker' && <FlightBrickBreaker />}
      {subTab === 'runner' && <JetpackRunner />}
      {subTab === 'bingo' && <FlightBingo />}
      {subTab === 'journal' && <FlightJournal />}
    </div>
  );
}
