import React, { useState } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { HelpCircle, CheckCircle, RotateCcw, Award, Lightbulb } from 'lucide-react';

export default function WordSearch() {
  const WORD_SETS = [
    {
      category: "NASA & Space Exploration",
      scrambled: "N U T S A R V",
      solution: "SATURNV",
      hint: "The 363-foot Moon rocket at Kennedy Space Center"
    },
    {
      category: "Universal Theme Parks",
      scrambled: "C O V E L I C O S T A R E",
      solution: "VELOCICOASTER",
      hint: "70mph apex predator coaster at Islands of Adventure"
    },
    {
      category: "Space Shuttle Missions",
      scrambled: "A T T I S N A L",
      solution: "ATLANTIS",
      hint: "Real NASA Space Shuttle orbiter suspended at KSC"
    },
    {
      category: "Florida Travel",
      scrambled: "C A O O C  C H E A B",
      solution: "COCOABEACH",
      hint: "Florida's famous Space Coast ocean beach town"
    },
    {
      category: "Wizarding World",
      scrambled: "H G O R A W T S",
      solution: "HOGWARTS",
      hint: "Famous castle at Islands of Adventure theme park"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const currentPuzzle = WORD_SETS[currentIndex];

  const handleCheck = (e) => {
    e.preventDefault();
    const cleanGuess = userGuess.replaceAll(' ', '').toUpperCase();
    if (cleanGuess === currentPuzzle.solution) {
      setIsSolved(true);
      setSolvedCount((prev) => prev + 1);
    } else {
      alert("Not quite right! Check your spelling and try again.");
    }
  };

  const handleNext = () => {
    if (currentIndex < WORD_SETS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserGuess('');
      setIsSolved(false);
      setShowHint(false);
    } else {
      alert("🎉 You solved all Florida Word Puzzles!");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserGuess('');
    setIsSolved(false);
    setShowHint(false);
    setSolvedCount(0);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            Florida Anagrams & Word Puzzles
          </h3>
          <span className="text-[10px] text-slate-400">Puzzle {currentIndex + 1} of {WORD_SETS.length}</span>
        </div>
        <span className="text-xs font-bold text-amber-400">
          Solved: {solvedCount} / {WORD_SETS.length}
        </span>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <span className="text-[10px] font-black text-sky-400 bg-sky-950 border border-sky-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {currentPuzzle.category}
        </span>

        {/* Scrambled Word Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center my-2">
          <span className="text-xs font-bold text-slate-400 block mb-1">UNSCRAMBLE THE LETTERS:</span>
          <span className="text-2xl font-black text-amber-400 tracking-widest font-mono">
            {currentPuzzle.scrambled}
          </span>
        </div>

        {/* Hint button */}
        {!showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Show Hint
          </button>
        )}

        {showHint && (
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-3 text-xs text-amber-200">
            <strong>Hint:</strong> {currentPuzzle.hint}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleCheck} className="space-y-3">
          <input
            type="text"
            placeholder="Type your answer..."
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            disabled={isSolved}
            className="w-full bg-slate-950 border border-slate-700 text-sm font-bold uppercase tracking-widest rounded-2xl p-3.5 text-white focus:outline-none focus:border-sky-500"
          />

          {!isSolved ? (
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-lg transition active:scale-95"
            >
              Submit Answer
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-2xl text-xs font-bold text-emerald-300 text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                CORRECT! Answer: {currentPuzzle.solution}
              </div>

              {currentIndex < WORD_SETS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-lg transition"
                >
                  Next Puzzle →
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="text-center">
        <button
          onClick={handleRestart}
          className="text-[11px] text-slate-500 hover:text-slate-400 underline"
        >
          Restart all word puzzles
        </button>
      </div>
    </div>
  );
}
