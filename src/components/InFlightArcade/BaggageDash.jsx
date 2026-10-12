import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, Check, RotateCcw, Star } from 'lucide-react';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const LEVELS = [
  ['Warm-up', 5, 'Collect five bags before boarding.'],
  ['Terminal sprint', 7, 'A little faster now.'],
  ['Crowded gate', 9, 'Watch the moving bags.'],
  ['Tight connection', 11, 'Keep your streak alive.'],
  ['Storm delay', 13, 'The carousel is getting wild.'],
  ['Red-eye run', 15, 'Fast hands, sharp eyes.'],
  ['Final call', 18, 'One last push to the gate.'],
  ['Captain', 22, 'The ultimate baggage challenge.'],
];

export default function BaggageDash() {
  const [level, setLevel] = useState(() => getStorageItem('baggage_level', 0));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getStorageItem('baggage_best', 0));
  const [bags, setBags] = useState([]);
  const [message, setMessage] = useState('Pick a level, then collect every bag.');
  const target = LEVELS[level][1];

  const makeRound = () => {
    setScore(0);
    setMessage('Find them all before the carousel stops.');
    setBags(Array.from({ length: target }, (_, index) => ({
      id: index,
      x: 8 + ((index * 37 + level * 13) % 78),
      y: 8 + ((index * 53 + level * 17) % 68),
      tone: index % 3,
    })));
  };

  const collect = (id) => {
    const next = bags.filter((bag) => bag.id !== id);
    const nextScore = score + 1;
    setScore(nextScore);
    setBags(next);
    if (!next.length) {
      const nextLevel = Math.min(LEVELS.length - 1, level + 1);
      const nextBest = Math.max(best, nextScore);
      setBest(nextBest);
      setStorageItem('baggage_best', nextBest);
      setLevel(nextLevel);
      setStorageItem('baggage_level', nextLevel);
      setMessage(nextLevel === level ? 'Perfect run. You cleared every level.' : `Gate cleared. Level ${nextLevel + 1} unlocked.`);
    }
  };

  const colors = useMemo(() => ['bg-sky-400', 'bg-amber-400', 'bg-fuchsia-400'], []);
  return (
    <div className="flex flex-col gap-3 animate-fadeIn">
      <div className="flex items-start justify-between px-1">
        <div><p className="text-sm font-extrabold text-white flex items-center gap-1.5"><BriefcaseBusiness className="w-4 h-4 text-amber-400" /> Baggage Dash</p><p className="text-[10px] text-[var(--ink2)]">Tap every bag before the carousel stops.</p></div>
        <div className="text-right text-[10px] text-amber-400 font-bold"><span className="flex items-center gap-1 justify-end"><Star className="w-3 h-3" /> {best} best</span><span className="text-[var(--ink2)]">{score}/{target}</span></div>
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1" aria-label="Baggage dash levels">
        {LEVELS.map((item, index) => <button key={item[0]} disabled={index > level} onClick={() => { setLevel(index); setBags([]); setScore(0); }} className={`level-chip ${index === level ? 'level-chip-active' : ''} ${index > level ? 'level-chip-locked' : ''}`}><span>{index + 1}</span>{index < level && <Check size={11} />}</button>)}
      </div>
      <div className="arcade-card relative h-[320px] overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.14),transparent_32%),linear-gradient(145deg,#111827,#09090b)]" role="application" aria-label="Baggage Dash game">
        {bags.length ? bags.map((bag) => <button key={bag.id} onClick={() => collect(bag.id)} aria-label="Collect bag" className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl ${colors[bag.tone]} text-slate-950 shadow-lg transition-transform hover:scale-110 active:scale-90`} style={{ left: `${bag.x}%`, top: `${bag.y}%` }}><BriefcaseBusiness className="h-6 w-6" /></button>) : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"><BriefcaseBusiness className="h-12 w-12 text-amber-400" /><p className="text-sm font-bold text-white">{message}</p><button className="btn-accent px-6 py-3 text-sm" onClick={makeRound}><RotateCcw className="mr-2 inline h-4 w-4" />{score ? 'Play again' : 'Start round'}</button></div>}
      </div>
      <p className="text-center text-[10px] text-[var(--ink2)]">{LEVELS[level][0]} · {LEVELS[level][2]} · Everything runs offline.</p>
    </div>
  );
}
