import React, { useState } from 'react';
import SkyWingsGame from './SkyWingsGame';
import OrbitLander from './OrbitLander';
import FlightBrickBreaker from './FlightBrickBreaker';
import JetpackRunner from './JetpackRunner';
import FlightBingo from './FlightBingo';
import FlightJournal from './FlightJournal';
import { Gamepad2, Rocket, Layers, Zap, Sparkles, BookOpen } from 'lucide-react';

const TABS = [
  { id: 'dodge',   label: 'Dodge',    icon: Gamepad2,  color: 'text-sky-400' },
  { id: 'lander',  label: 'Lander',   icon: Rocket,    color: 'text-rose-400' },
  { id: 'breaker', label: 'Bricks',   icon: Layers,    color: 'text-amber-400' },
  { id: 'runner',  label: 'Runner',   icon: Zap,       color: 'text-emerald-400' },
  { id: 'bingo',   label: 'Bingo',    icon: Sparkles,  color: 'text-purple-400' },
  { id: 'journal', label: 'Journal',  icon: BookOpen,  color: 'text-sky-300' },
];

export default function ArcadeHub() {
  const [tab, setTab] = useState('dodge');

  return (
    <div className="flex flex-col gap-3 pb-24 pt-1 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            In-Flight Arcade
          </h2>
          <p className="text-[10px] text-[var(--ink2)]">4 games · 100% offline · high scores saved</p>
        </div>
        <div className="text-[10px] font-bold text-amber-400 border border-amber-500/30 bg-amber-400/10 px-2 py-1 rounded-full">
          ✈ Airplane Mode OK
        </div>
      </div>

      {/* Game tab pills - horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`snap-start shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-150 ${
                active
                  ? 'bg-[var(--surface2)] border-[var(--accent)] text-white shadow-md'
                  : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink2)] hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? t.color : ''}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-1">
        {tab === 'dodge'   && <SkyWingsGame />}
        {tab === 'lander'  && <OrbitLander />}
        {tab === 'breaker' && <FlightBrickBreaker />}
        {tab === 'runner'  && <JetpackRunner />}
        {tab === 'bingo'   && <FlightBingo />}
        {tab === 'journal' && <FlightJournal />}
      </div>
    </div>
  );
}
