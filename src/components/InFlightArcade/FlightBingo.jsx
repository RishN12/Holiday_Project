import React, { useState, useEffect } from 'react';
import { BINGO_TILES, FLIGHT_QUESTS } from '../../data/bingoData';
import { getStorageItem, setStorageItem, KEYS } from '../../utils/storage';
import { Sparkles, Award, CheckCircle, RotateCcw } from 'lucide-react';

export default function FlightBingo() {
  const [checkedTiles, setCheckedTiles] = useState(() => getStorageItem(KEYS.BINGO, []));
  const [checkedQuests, setCheckedQuests] = useState(() => getStorageItem(KEYS.QUESTS, []));

  useEffect(() => {
    setStorageItem(KEYS.BINGO, checkedTiles);
  }, [checkedTiles]);

  useEffect(() => {
    setStorageItem(KEYS.QUESTS, checkedQuests);
  }, [checkedQuests]);

  const toggleTile = (idx) => {
    setCheckedTiles((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleQuest = (qid) => {
    setCheckedQuests((prev) =>
      prev.includes(qid) ? prev.filter((q) => q !== qid) : [...prev, qid]
    );
  };

  const resetBingo = () => {
    if (window.confirm("Reset Bingo board state?")) {
      setCheckedTiles([]);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          In-Flight Bingo Board
        </h3>
        <p className="text-xs text-slate-400">
          Tap tiles as you observe these events during your transatlantic flight!
        </p>
      </div>

      {/* Bingo Grid (4x4) */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-3xl border border-slate-800 shadow-xl">
        {BINGO_TILES.map((text, idx) => {
          const isChecked = checkedTiles.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => toggleTile(idx)}
              className={`p-2 rounded-2xl text-[10px] font-extrabold leading-tight h-20 flex flex-col justify-between text-left border transition active:scale-95 ${
                isChecked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{text}</span>
              <span className={`self-end font-mono text-[9px] ${isChecked ? 'text-slate-950' : 'text-slate-500'}`}>
                {isChecked ? '✓ GOT IT' : `#${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-slate-400 font-bold">
          Completed: <strong className="text-amber-400">{checkedTiles.length} / {BINGO_TILES.length}</strong>
        </span>
        <button
          onClick={resetBingo}
          className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Grid
        </button>
      </div>

      {/* In-Flight Quests */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-sky-400" />
          In-Flight Boredom Quests
        </h4>

        <div className="space-y-2">
          {FLIGHT_QUESTS.map((q) => {
            const isDone = checkedQuests.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleQuest(q.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="pr-2">
                  <span className="text-xs font-bold block leading-snug">{q.task}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">{q.reward}</span>
                </div>
                <div className={`p-1.5 rounded-xl shrink-0 ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
