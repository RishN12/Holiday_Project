import React, { useState } from 'react';
import { TRIVIA_QUESTIONS } from '../../data/triviaData';
import { getStorageItem, setStorageItem, KEYS } from '../../utils/storage';
import { HelpCircle, Award, CheckCircle2, XCircle, RotateCcw, Flame } from 'lucide-react';

export default function TriviaQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => getStorageItem(KEYS.TRIVIA_SCORE, 0));

  const currentQ = TRIVIA_QUESTIONS[currentIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));

      setHighScore((prev) => {
        const h = Math.max(prev, newScore);
        setStorageItem(KEYS.TRIVIA_SCORE, h);
        return h;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < TRIVIA_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished all questions!
      setIsAnswered(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
  };

  const isFinished = currentIndex === TRIVIA_QUESTIONS.length - 1 && isAnswered;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            Florida & NASA Trivia Quiz
          </h3>
          <span className="text-[10px] text-slate-400">
            Question {currentIndex + 1} of {TRIVIA_QUESTIONS.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streak}
          </span>
          <span className="text-xs font-black text-sky-300">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h4 className="text-base font-bold text-white leading-relaxed">
          {currentQ.question}
        </h4>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-2xl text-xs border transition flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation */}
        {isAnswered && (
          <div className="bg-sky-950/40 border border-sky-800/40 rounded-2xl p-3.5 text-xs text-sky-200 leading-relaxed animate-fadeIn">
            <strong>Fact:</strong> {currentQ.explanation}
          </div>
        )}
      </div>

      {/* Next Button */}
      {isAnswered && !isFinished && (
        <button
          onClick={handleNext}
          className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-lg transition active:scale-98"
        >
          Next Question →
        </button>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-amber-500/40 rounded-3xl p-5 text-center space-y-3 animate-fadeIn">
          <Award className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-lg font-black text-white">Quiz Completed!</h4>
          <p className="text-xs text-slate-300">
            Final Score: <strong className="text-amber-400 text-base">{score} pts</strong> | Best Streak: <strong className="text-sky-300 text-base">{bestStreak}</strong>
          </p>
          <button
            onClick={handleRestart}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Quiz Again
          </button>
        </div>
      )}
    </div>
  );
}
