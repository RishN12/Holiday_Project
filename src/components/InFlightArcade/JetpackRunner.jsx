import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { Trophy, RotateCcw, Zap } from 'lucide-react';

const W = 320, H = 400;
const GROUND = H - 48;

export default function JetpackRunner() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const frameRef  = useRef(null);
  const [phase,    setPhase]    = useState('start'); // start | playing | dead
  const [score,    setScore]    = useState(0);
  const [best,     setBest]     = useState(() => getStorageItem('runner_best', 0));
  const [combo,    setCombo]    = useState(0);

  const initState = () => ({
    y: GROUND, vy: 0, jumps: 0,
    obs: [], coins: [], particles: [],
    tick: 0, score: 0, combo: 0, dead: false,
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.dead) return;
    if (s.jumps < 2) { s.vy = -13; s.jumps++; }
  }, []);

  const start = () => {
    stateRef.current = initState();
    setScore(0); setCombo(0);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const s = stateRef.current;
      if (!s || s.dead) return;
      s.tick++;

      // ── Physics ──────────────────────────────────────────
      s.vy = Math.min(s.vy + 0.65, 18);
      s.y  = Math.min(s.y + s.vy, GROUND);
      if (s.y >= GROUND) { s.y = GROUND; s.vy = 0; s.jumps = 0; }

      const spd = 4.5 + s.score / 600;

      // ── Spawn ─────────────────────────────────────────────
      const gap = Math.max(38, Math.floor(80 / (1 + s.score / 800)));
      if (s.tick % gap === 0) {
        s.obs.push({ x: W + 16, w: 14 + Math.random() * 12, h: 28 + Math.random() * 28 });
      }
      if (s.tick % 120 === 0) {
        s.coins.push({ x: W + 16, y: GROUND - 55 - Math.random() * 90, r: 9 });
      }

      // ── Obstacles ─────────────────────────────────────────
      for (let i = s.obs.length - 1; i >= 0; i--) {
        s.obs[i].x -= spd;
        const o = s.obs[i];
        const px = 44, ph = 32, py = s.y - ph;
        if (px + 20 > o.x && px < o.x + o.w && py + ph > GROUND - o.h) {
          s.dead = true;
          setBest(prev => { const v = Math.max(prev, s.score); setStorageItem('runner_best', v); return v; });
          setPhase('dead');
          return;
        }
        if (o.x < -20) { s.obs.splice(i, 1); s.score += 12; setScore(s.score); }
      }

      // ── Coins ─────────────────────────────────────────────
      for (let i = s.coins.length - 1; i >= 0; i--) {
        s.coins[i].x -= spd;
        const c = s.coins[i];
        if (Math.hypot(44 - c.x, s.y - 14 - c.y) < 24) {
          s.combo++;
          s.score += 30 * s.combo;
          setScore(s.score);
          setCombo(s.combo);
          s.particles.push(...Array.from({length: 6}, () => ({
            x: c.x, y: c.y, vx: (Math.random()-0.5)*4, vy: -Math.random()*4,
            life: 1, col: '#d4af37'
          })));
          s.coins.splice(i, 1);
        } else if (c.x < -20) { s.combo = 0; setCombo(0); s.coins.splice(i, 1); }
      }

      // ── Particles ─────────────────────────────────────────
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.06;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // ── Draw ──────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#09090b');
      sky.addColorStop(1, '#141417');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars (static seed for performance)
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 28; i++) {
        const sx = ((i * 73 + s.tick * 0.4) % W);
        const sy = ((i * 47) % (GROUND - 20));
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Ground
      ctx.fillStyle = '#1c1c21';
      ctx.fillRect(0, GROUND + 4, W, H);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(0, GROUND + 4, W, 2);

      // Obstacles
      s.obs.forEach(o => {
        const grd = ctx.createLinearGradient(o.x, 0, o.x + o.w, 0);
        grd.addColorStop(0, '#f43f5e');
        grd.addColorStop(1, '#e11d48');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.roundRect(o.x, GROUND + 4 - o.h, o.w, o.h, [4, 4, 0, 0]);
        ctx.fill();
      });

      // Coins
      s.coins.forEach(c => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('$', c.x, c.y + 3);
      });

      // Particles
      s.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Player
      const px = 44, py = s.y - 32;
      // Flame
      if (s.jumps > 0 && s.y < GROUND) {
        ctx.fillStyle = s.jumps === 2 ? '#ec4899' : '#f97316';
        ctx.beginPath();
        ctx.moveTo(px - 7, py + 30);
        ctx.lineTo(px, py + 44 + Math.random() * 8);
        ctx.lineTo(px + 7, py + 30);
        ctx.fill();
      }
      // Body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(px - 11, py, 22, 32, 6);
      ctx.fill();
      // Visor
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.roundRect(px - 6, py + 6, 12, 8, 3); ctx.fill();
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath(); ctx.roundRect(px - 5, py + 7, 10, 6, 2); ctx.fill();

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [phase]);

  const overlayBase = "absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md rounded-2xl p-6 text-center gap-3";

  return (
    <div className="flex flex-col gap-3 animate-fadeIn" onClick={jump}>
      {/* HUD */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Jetpack Dash
          </p>
          <p className="text-[10px] text-[var(--ink2)]">Tap anywhere to jetpack jump · Double-tap for boost</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white">{score}</p>
          <p className="text-[10px] text-amber-400 flex items-center gap-1 justify-end"><Trophy className="w-3 h-3"/> {best}</p>
        </div>
      </div>

      {/* Combo badge */}
      {combo > 1 && (
        <div className="mx-auto px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-black animate-fadeIn">
          x{combo} COMBO!
        </div>
      )}

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] shadow-2xl">
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{maxHeight: '380px'}} />

        {phase === 'start' && (
          <div className={overlayBase}>
            <Zap className="w-12 h-12 text-amber-400 animate-bounce" />
            <h3 className="text-xl font-black text-white">Jetpack Dash</h3>
            <p className="text-xs text-[var(--ink2)] max-w-[200px]">Tap to jump, tap again mid-air for a double jump! Grab coins to build combos.</p>
            <button onClick={e => { e.stopPropagation(); start(); }}
              className="btn-accent mt-1 px-8 py-3 text-sm">
              Launch 🚀
            </button>
          </div>
        )}

        {phase === 'dead' && (
          <div className={overlayBase}>
            <p className="text-4xl font-black text-white">{score}</p>
            <p className="text-xs text-[var(--ink2)]">Best: {best}</p>
            <button onClick={e => { e.stopPropagation(); start(); }}
              className="btn-accent flex items-center gap-2 px-6 py-2.5">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-[10px] text-[var(--ink2)]">🟠 Orange flame = 1st jump · 🟣 Pink = double jump</p>
    </div>
  );
}
