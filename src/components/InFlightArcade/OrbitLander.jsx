import React, { useRef, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, KEYS } from '../../utils/storage';
import { Rocket, Trophy, RotateCcw, ArrowDown, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function OrbitLander() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'landed', 'crashed'
  const [altitude, setAltitude] = useState(300);
  const [velocity, setVelocity] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getStorageItem('orlando_lander_high_score', 0));

  const stateRef = useRef({
    x: 160,
    y: 40,
    vx: 0,
    vy: 0.5,
    fuel: 100,
    thrusting: false,
    thrustLeft: false,
    thrustRight: false,
    padX: 120,
    padW: 80,
    score: 0,
    isEnded: false
  });

  const startGame = () => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 320;
    const padW = 70;
    const padX = Math.random() * (w - padW - 40) + 20;

    stateRef.current = {
      x: w / 2,
      y: 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0.3,
      fuel: 100,
      thrusting: false,
      thrustLeft: false,
      thrustRight: false,
      padX,
      padW,
      score: 0,
      isEnded: false
    };

    setAltitude(300);
    setVelocity(0.3);
    setFuel(100);
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const loop = () => {
      const st = stateRef.current;
      const gravity = 0.04;

      // Update physics
      if (!st.isEnded) {
        st.vy += gravity;
        
        // Horizontal wind physics (changes over time)
        const wind = Math.sin(Date.now() / 1500) * 0.015;
        st.vx += wind;

        if (st.thrusting && st.fuel > 0) {
          st.vy -= 0.09;
          st.fuel = Math.max(0, st.fuel - 0.4);
        }
        if (st.thrustLeft && st.fuel > 0) {
          st.vx += 0.06;
          st.fuel = Math.max(0, st.fuel - 0.2);
        }
        if (st.thrustRight && st.fuel > 0) {
          st.vx -= 0.06;
          st.fuel = Math.max(0, st.fuel - 0.2);
        }

        st.x += st.vx;
        st.y += st.vy;

        // Keep inside bounds horizontally
        if (st.x < 15) { st.x = 15; st.vx = 0; }
        if (st.x > canvas.width - 15) { st.x = canvas.width - 15; st.vx = 0; }

        setAltitude(Math.max(0, Math.round(canvas.height - 40 - st.y)));
        setVelocity(st.vy);
        setFuel(Math.round(st.fuel));

        // Landing / Crash check at ground level
        const groundY = canvas.height - 35;
        if (st.y >= groundY) {
          st.y = groundY;
          st.isEnded = true;

          const isOnPad = st.x >= st.padX && st.x <= st.padX + st.padW;
          const isSoftLanding = st.vy <= 2.2 && Math.abs(st.vx) <= 1.2;

          if (isOnPad && isSoftLanding) {
            const landingScore = Math.round(100 + st.fuel * 2 + (2.5 - st.vy) * 50);
            st.score = landingScore;
            setScore(landingScore);
            setGameState('landed');
            setHighScore((prev) => {
              const h = Math.max(prev, landingScore);
              setStorageItem('orlando_lander_high_score', h);
              return h;
            });
          } else {
            setGameState('crashed');
          }
        }
      }

      // Render graphics
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Night sky gradient (Obsidian premium)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#000000');
      bgGrad.addColorStop(1, '#1A1A1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ground & Ocean
      ctx.fillStyle = '#262626';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

      // Draw KSC Landing Pad
      ctx.fillStyle = '#D4AF37'; // Gold
      ctx.fillRect(st.padX, canvas.height - 32, st.padW, 6);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('KSC PAD 39A', st.padX + 5, canvas.height - 25);

      // Draw Shuttle Lander
      ctx.save();
      ctx.translate(st.x, st.y);

      // Thrust flame graphics
      if (st.thrusting && st.fuel > 0) {
        ctx.fillStyle = '#F97316';
        ctx.beginPath();
        ctx.moveTo(-5, 12);
        ctx.lineTo(0, 24 + Math.random() * 6);
        ctx.lineTo(5, 12);
        ctx.fill();
      }
      if (st.thrustLeft && st.fuel > 0) {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(-14, 2, 6, 3);
      }
      if (st.thrustRight && st.fuel > 0) {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(8, 2, 6, 3);
      }

      // Lander Capsule Body
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 8);
      ctx.lineTo(12, 14);
      ctx.lineTo(-12, 14);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();

      // Cockpit Window
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(0, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Landing Legs
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(-14, 18);
      ctx.moveTo(10, 10);
      ctx.lineTo(14, 18);
      ctx.stroke();

      ctx.restore();

      if (!st.isEnded) {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-sky-400" />
            Orbit Lander: KSC Touchdown
          </h3>
          <span className="text-[10px] text-slate-400">Control thrusters for a soft touchdown!</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Best: {highScore}
          </span>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-2.5 mb-2 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[9px] text-slate-500 block">ALTITUDE</span>
          <span className="font-extrabold text-white">{altitude}m</span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[9px] text-slate-500 block">SPEED</span>
          <span className={`font-extrabold ${velocity > 2.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {velocity.toFixed(1)} m/s
          </span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex flex-col justify-center">
          <span className="text-[9px] text-slate-500 block mb-1">FUEL {fuel}%</span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${fuel < 20 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-amber-300'}`} 
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 touch-none">
        <canvas ref={canvasRef} width={320} height={320} className="block" />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Rocket className="w-10 h-10 text-sky-400 mb-2 animate-pulse" />
            <h4 className="text-lg font-black text-white mb-1">NASA KSC Shuttle Landing</h4>
            <p className="text-xs text-slate-300 mb-4 max-w-[220px]">
              Use side thrusters to align over Launch Pad 39A and main engine to slow descent under 2.2 m/s!
            </p>
            <button
              onClick={startGame}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95"
            >
              Start Mission
            </button>
          </div>
        )}

        {/* Landed Success Overlay */}
        {gameState === 'landed' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <h4 className="text-lg font-black text-white mb-1">Perfect Touchdown! 🚀</h4>
            <p className="text-xs text-emerald-300 mb-3">Landed safely on Kennedy Space Center Pad 39A!</p>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 w-full max-w-[180px] mb-4">
              <span className="text-[10px] text-slate-400 block font-bold">MISSION SCORE</span>
              <span className="text-2xl font-black text-amber-400">{score} pts</span>
            </div>
            <button
              onClick={startGame}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition"
            >
              Next Flight
            </button>
          </div>
        )}

        {/* Crashed Overlay */}
        {gameState === 'crashed' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <ShieldAlert className="w-10 h-10 text-rose-400 mb-2" />
            <h4 className="text-lg font-black text-white mb-1">Hard Landing Crash!</h4>
            <p className="text-xs text-slate-300 mb-4">
              {velocity > 2.2 ? 'Descent speed was too fast (>2.2 m/s)!' : 'Missed the landing pad!'}
            </p>
            <button
              onClick={startGame}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons for Mobile Touch */}
      {gameState === 'playing' && (
        <div className="w-full max-w-[320px] grid grid-cols-3 gap-2 mt-3 select-none">
          <button
            onMouseDown={() => (stateRef.current.thrustRight = true)}
            onMouseUp={() => (stateRef.current.thrustRight = false)}
            onTouchStart={() => (stateRef.current.thrustRight = true)}
            onTouchEnd={() => (stateRef.current.thrustRight = false)}
            className="bg-slate-900 border border-slate-700 active:bg-sky-500 active:text-slate-950 text-sky-400 font-black py-4 rounded-2xl text-xs shadow-md"
          >
            ← Left
          </button>
          <button
            onMouseDown={() => (stateRef.current.thrusting = true)}
            onMouseUp={() => (stateRef.current.thrusting = false)}
            onTouchStart={() => (stateRef.current.thrusting = true)}
            onTouchEnd={() => (stateRef.current.thrusting = false)}
            className="bg-sky-500 hover:bg-sky-400 active:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl text-xs shadow-lg"
          >
            🔥 BURN
          </button>
          <button
            onMouseDown={() => (stateRef.current.thrustLeft = true)}
            onMouseUp={() => (stateRef.current.thrustLeft = false)}
            onTouchStart={() => (stateRef.current.thrustLeft = true)}
            onTouchEnd={() => (stateRef.current.thrustLeft = false)}
            className="bg-slate-900 border border-slate-700 active:bg-sky-500 active:text-slate-950 text-sky-400 font-black py-4 rounded-2xl text-xs shadow-md"
          >
            Right →
          </button>
        </div>
      )}
    </div>
  );
}
