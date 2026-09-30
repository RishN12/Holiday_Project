import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { Sparkles, Trophy, Play, RotateCcw, Zap } from 'lucide-react';

export default function CoasterMemory() {
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [statusText, setStatusText] = useState('Press Start to begin sequence');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getStorageItem('orlando_memory_high_score', 0));

  const PADS = [
    { id: 0, label: 'VelociCoaster', color: 'bg-teal-400 border-teal-300 shadow-teal-500/50', activeColor: 'bg-teal-200 scale-105' },
    { id: 1, label: 'Saturn V', color: 'bg-amber-400 border-amber-300 shadow-amber-500/50', activeColor: 'bg-amber-200 scale-105' },
    { id: 2, label: 'Space Shuttle', color: 'bg-sky-500 border-sky-400 shadow-sky-500/50', activeColor: 'bg-sky-200 scale-105' },
    { id: 3, label: 'Cocoa Sunset', color: 'bg-rose-500 border-rose-400 shadow-rose-500/50', activeColor: 'bg-rose-200 scale-105' }
  ];

  const startGame = () => {
    setSequence([]);
    setUserStep(0);
    setScore(0);
    setIsPlaying(true);
    setStatusText('Watch the sequence...');
    addNewStep([]);
  };

  const addNewStep = (currentSeq) => {
    const nextPad = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextPad];
    setSequence(newSeq);
    setUserStep(0);
    playSequence(newSeq);
  };

  const playSequence = (seq) => {
    setStatusText('Memorize the pattern!');
    seq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        setTimeout(() => setActivePad(null), 350);
      }, (index + 1) * 600);
    });

    setTimeout(() => {
      setStatusText('Your turn! Tap pads in order.');
    }, (seq.length + 1) * 600);
  };

  const handlePadClick = (padId) => {
    if (!isPlaying || sequence.length === 0) return;

    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    if (padId === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        const newScore = sequence.length;
        setScore(newScore);
        setHighScore((prev) => {
          const h = Math.max(prev, newScore);
          setStorageItem('orlando_memory_high_score', h);
          return h;
        });

        setStatusText('Correct! Leveling up...');
        setTimeout(() => addNewStep(sequence), 1000);
      }
    } else {
      setIsPlaying(false);
      setStatusText(`Game Over! Sequence length reached: ${score}`);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Coaster Launch Memory Sequence
          </h3>
          <span className="text-[10px] text-slate-400">Test your memory on long-haul flights!</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> High: {highScore}
          </span>
          <span className="text-xs font-black text-sky-300">Level: {score}</span>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs font-bold text-sky-300">{statusText}</span>
      </div>

      {/* 4 Glowing Color Pads Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto my-4">
        {PADS.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={!isPlaying}
              className={`h-28 rounded-3xl border-2 font-black text-xs text-slate-950 flex flex-col items-center justify-center p-3 shadow-xl transition-all duration-150 active:scale-95 ${
                isActive ? pad.activeColor : pad.color
              } ${!isPlaying ? 'opacity-80' : ''}`}
            >
              <span>{pad.label}</span>
            </button>
          );
        })}
      </div>

      {/* Start / Retry Button */}
      <div className="text-center">
        {!isPlaying && (
          <button
            onClick={startGame}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" /> {score > 0 ? 'Try Again' : 'Start Memory Rush'}
          </button>
        )}
      </div>
    </div>
  );
}
