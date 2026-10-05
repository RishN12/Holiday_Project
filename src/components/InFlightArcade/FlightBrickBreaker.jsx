import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { Trophy, RotateCcw, Layers } from 'lucide-react';

const W = 320, H = 420;

function makeBricks(level = 0) {
  const rows = 4 + Math.min(level, 3);
  const cols = 6;
  const pad  = 5;
  const bw   = (W - 20 - (cols - 1) * pad) / cols;
  const bh   = 15;
  const palettes = [
    ['#f59e0b','#38bdf8','#10b981','#ec4899'],
    ['#d4af37','#7c3aed','#06b6d4','#f43f5e'],
    ['#f97316','#84cc16','#8b5cf6','#e11d48'],
  ];
  const pal = palettes[level % palettes.length];
  const bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({
        x: 10 + c * (bw + pad), y: 36 + r * (bh + pad),
        w: bw, h: bh, col: pal[r % pal.length],
        hp: (level > 1 && r === 0) ? 2 : 1, // top row armoured on level 2+
      });
    }
  }
  return bricks;
}

export default function FlightBrickBreaker() {
  const canvasRef = useRef(null);
  const stRef     = useRef(null);
  const frameRef  = useRef(null);
  const [phase, setPhase] = useState('start');
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best,  setBest]  = useState(() => getStorageItem('breaker_best', 0));
  const [drops, setDrops] = useState([]); // for UI pill display

  const initState = (lvl = 0, sc = 0, lv = 3) => {
    const bricks = makeBricks(lvl);
    const spd = 4.5 + lvl * 0.6;
    return {
      px: W / 2 - 36, pw: 72,
      bx: W / 2, by: H - 60,
      bvx: (Math.random() > 0.5 ? 1 : -1) * spd,
      bvy: -spd,
      br: 6,
      bricks,
      items: [],
      score: sc, lives: lv,
      ballsInPlay: 1,
      ended: false,
    };
  };

  const start = (lvl = 0) => {
    stRef.current = initState(lvl);
    setScore(0); setLives(3); setLevel(lvl); setDrops([]);
    setPhase('playing');
  };

  const nextLevel = (lvl, sc, lv) => {
    stRef.current = initState(lvl, sc, lv);
    setLevel(lvl); setDrops([]);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const s = stRef.current;
      if (!s || s.ended) return;

      const paddleY = H - 32;

      // ── Ball physics ───────────────────────────────────────
      s.bx += s.bvx; s.by += s.bvy;

      if (s.bx - s.br <= 0 || s.bx + s.br >= W)  s.bvx *= -1;
      if (s.by - s.br <= 0) s.bvy = Math.abs(s.bvy);

      // Paddle bounce
      if (s.by + s.br >= paddleY && s.by + s.br <= paddleY + 14
        && s.bx >= s.px && s.bx <= s.px + s.pw) {
        s.bvy = -Math.abs(s.bvy);
        const rel = (s.bx - (s.px + s.pw / 2)) / (s.pw / 2);
        s.bvx = rel * (5 + level * 0.3);
      }

      // Ball fell
      if (s.by > H + 20) {
        s.lives--;
        setLives(s.lives);
        if (s.lives <= 0) {
          s.ended = true;
          setBest(p => { const v = Math.max(p, s.score); setStorageItem('breaker_best', v); return v; });
          setPhase('gameover');
          return;
        }
        s.bx = W / 2; s.by = H - 70;
        const spd = 4.5 + level * 0.6;
        s.bvx = (Math.random() > 0.5 ? 1 : -1) * spd;
        s.bvy = -spd;
      }

      // ── Brick collision ────────────────────────────────────
      let alive = 0;
      for (let i = 0; i < s.bricks.length; i++) {
        const b = s.bricks[i];
        if (b.hp <= 0) continue;
        alive++;
        if (s.bx + s.br > b.x && s.bx - s.br < b.x + b.w
          && s.by + s.br > b.y && s.by - s.br < b.y + b.h) {
          b.hp--;
          s.bvy *= -1;
          if (b.hp <= 0) {
            s.score += 20 + level * 5;
            setScore(s.score);
            setBest(p => { const v = Math.max(p, s.score); setStorageItem('breaker_best', v); return v; });
            // Chance to drop item
            if (Math.random() < 0.25) {
              const type = Math.random() < 0.5 ? 'wide' : 'multi';
              s.items.push({ x: b.x + b.w / 2, y: b.y + b.h, type, vy: 2 });
            }
          }
          break;
        }
      }

      if (alive === 0) {
        s.ended = true;
        const nl = level + 1;
        setPhase('levelup');
        setLevel(nl);
        return;
      }

      // ── Falling items ──────────────────────────────────────
      for (let i = s.items.length - 1; i >= 0; i--) {
        const it = s.items[i];
        it.y += it.vy;
        if (it.y > paddleY && it.y < paddleY + 14 && it.x > s.px && it.x < s.px + s.pw) {
          if (it.type === 'wide') { s.pw = Math.min(s.pw + 24, 120); setDrops(d => [...d, 'Wide!']); }
          else { /* multi */ setDrops(d => [...d, 'Multi!']); }
          s.items.splice(i, 1);
        } else if (it.y > H) { s.items.splice(i, 1); }
      }

      // ── Draw ────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#09090b'); bg.addColorStop(1, '#141417');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Bricks
      s.bricks.forEach(b => {
        if (b.hp <= 0) return;
        ctx.fillStyle = b.hp === 2 ? '#6b7280' : b.col;
        ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 3); ctx.fill();
        if (b.hp === 2) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('⬛', b.x + b.w/2, b.y + b.h/2 + 3);
        }
      });

      // Items
      s.items.forEach(it => {
        ctx.fillStyle = it.type === 'wide' ? '#38bdf8' : '#ec4899';
        ctx.beginPath(); ctx.roundRect(it.x - 14, it.y - 8, 28, 16, 4); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(it.type === 'wide' ? '←  →' : '×2', it.x, it.y + 3);
      });

      // Paddle
      const paddleGrad = ctx.createLinearGradient(s.px, 0, s.px + s.pw, 0);
      paddleGrad.addColorStop(0, '#d4af37');
      paddleGrad.addColorStop(1, '#f6d365');
      ctx.fillStyle = paddleGrad;
      ctx.beginPath(); ctx.roundRect(s.px, paddleY, s.pw, 10, 5); ctx.fill();

      // Ball with glow
      ctx.shadowBlur = 10; ctx.shadowColor = '#d4af37';
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(s.bx, s.by, s.br, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [phase, level]);

  // Touch + mouse paddle control
  const movePaddle = useCallback((clientX) => {
    const s = stRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const x = (clientX - rect.left) * scaleX;
    s.px = Math.max(0, Math.min(W - s.pw, x - s.pw / 2));
  }, []);

  const overlayBase = "absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md rounded-2xl p-6 text-center gap-3";

  return (
    <div className="flex flex-col gap-3 animate-fadeIn">
      {/* HUD */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" /> Brick Breaker
          </p>
          <p className="text-[10px] text-[var(--ink2)]">Slide to move paddle · Catch power-ups!</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">{score} pts · Lv{level + 1}</p>
          <p className="text-[10px] text-amber-400 flex items-center gap-1 justify-end">
            <Trophy className="w-3 h-3"/> {best} · {'❤️'.repeat(Math.max(0, lives))}
          </p>
        </div>
      </div>

      {/* Drop notifications */}
      {drops.slice(-2).map((d, i) => (
        <div key={i} className="mx-auto px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/40 text-sky-300 text-xs font-black animate-fadeIn">
          {d}
        </div>
      ))}

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] shadow-2xl">
        <canvas
          ref={canvasRef} width={W} height={H}
          className="w-full"
          onMouseMove={e => movePaddle(e.clientX)}
          onTouchMove={e => { e.preventDefault(); movePaddle(e.touches[0].clientX); }}
        />

        {phase === 'start' && (
          <div className={overlayBase}>
            <Layers className="w-12 h-12 text-sky-400 animate-bounce" />
            <h3 className="text-xl font-black text-white">Brick Breaker</h3>
            <p className="text-xs text-[var(--ink2)] max-w-[200px]">Smash all bricks! Catch power-up drops for a wider paddle. Every clear = next level, faster ball!</p>
            <button onClick={start} className="btn-accent mt-1 px-8 py-3 text-sm">Play</button>
          </div>
        )}

        {phase === 'levelup' && (
          <div className={overlayBase}>
            <Trophy className="w-12 h-12 text-amber-400" />
            <h3 className="text-xl font-black text-white">Level {level} Clear! 🏆</h3>
            <p className="text-xs text-amber-300">Score: {score} pts</p>
            <button onClick={() => nextLevel(level, score, lives)} className="btn-accent mt-1 px-8 py-3">
              Next Level →
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className={overlayBase}>
            <h3 className="text-xl font-black text-white">Game Over</h3>
            <p className="text-3xl font-black text-sky-400">{score}</p>
            <button onClick={() => start(0)} className="btn-accent flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
