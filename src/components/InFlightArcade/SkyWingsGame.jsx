import React, { useRef, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, KEYS } from '../../utils/storage';
import { Trophy, Play, RotateCcw, Zap, Cloud, Plane } from 'lucide-react';

export default function SkyWingsGame({ level = 1, onLevelComplete }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getStorageItem(KEYS.GAME_HIGH_SCORE, 0));

  const gameLoopRef = useRef(null);

  // Game entity variables in ref to avoid re-renders inside frame loop
  const stateRef = useRef({
    planeX: 150,
    planeY: 300,
    speed: 3,
    score: 0,
    combo: 0,
    shieldTimer: 0,
    obstacles: [],
    stars: [],
    powerups: [],
    particles: [],
    isGameOver: false,
    levelCleared: false
  });

  const startGame = () => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 300;
    const height = canvas ? canvas.height : 450;

    stateRef.current = {
      planeX: width / 2,
      planeY: height - 80,
      speed: 3 + (level - 1) * 0.55,
      score: 0,
      combo: 0,
      shieldTimer: 0,
      obstacles: [],
      stars: [],
      powerups: [],
      particles: [],
      isGameOver: false
    };

    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const spawnObstacle = () => {
      const x = Math.random() * (canvas.width - 40) + 20;
      stateRef.current.obstacles.push({
        x,
        y: -30,
        radius: 18 + Math.random() * 12,
        speed: 2 + Math.random() * 2
      });
    };

    const spawnStar = () => {
      const x = Math.random() * (canvas.width - 40) + 20;
      stateRef.current.stars.push({
        x,
        y: -20,
        radius: 10,
        speed: 2.5
      });
    };

    const spawnPowerup = () => {
      const x = Math.random() * (canvas.width - 40) + 20;
      stateRef.current.powerups.push({
        x,
        y: -20,
        radius: 12,
        speed: 2.5
      });
    };

    let tickCount = 0;

    const loop = () => {
      tickCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#000000'); // Obsidian
      grad.addColorStop(1, '#1A1A1A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars background dots
      ctx.fillStyle = '#ffffff40';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37 + tickCount * 0.5) % canvas.width;
        const sy = (i * 53 + tickCount * 1.5) % canvas.height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Spawning
      if (tickCount % 45 === 0) spawnObstacle();
      if (tickCount % 60 === 0) spawnStar();
      if (tickCount % 350 === 0) spawnPowerup();

      const st = stateRef.current;
      if (st.shieldTimer > 0) st.shieldTimer--;

      // Update & Draw Stars
      for (let i = st.stars.length - 1; i >= 0; i--) {
        const star = st.stars[i];
        star.y += star.speed;

        // Draw Star Badge
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius - 4, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with plane
        const dist = Math.hypot(st.planeX - star.x, st.planeY - star.y);
        if (dist < star.radius + 20) {
          st.combo++;
          st.score += 50 * st.combo;
          setScore(st.score);
          st.stars.splice(i, 1);
        } else if (star.y > canvas.height + 30) {
          st.combo = 0; // Reset combo if missed
          st.stars.splice(i, 1);
        }
      }

      // Update & Draw Powerups
      for (let i = st.powerups.length - 1; i >= 0; i--) {
        const p = st.powerups[i];
        p.y += p.speed;

        ctx.fillStyle = '#10B981'; // Emerald shield item
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', p.x, p.y + 4);

        const dist = Math.hypot(st.planeX - p.x, st.planeY - p.y);
        if (dist < p.radius + 20) {
          st.shieldTimer = 300; // ~5 seconds of shield
          st.powerups.splice(i, 1);
        } else if (p.y > canvas.height + 30) {
          st.powerups.splice(i, 1);
        }
      }

      // Update & Draw Storm Cloud Obstacles
      for (let i = st.obstacles.length - 1; i >= 0; i--) {
        const obs = st.obstacles[i];
        obs.y += obs.speed;

        // Draw Cloud
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
        ctx.arc(obs.x - obs.radius * 0.6, obs.y + 4, obs.radius * 0.7, 0, Math.PI * 2);
        ctx.arc(obs.x + obs.radius * 0.6, obs.y + 4, obs.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with plane
        const dist = Math.hypot(st.planeX - obs.x, st.planeY - obs.y);
        if (dist < obs.radius + 14) {
          if (st.shieldTimer > 0) {
            // Smash obstacle
            st.obstacles.splice(i, 1);
            st.score += 20;
            setScore(st.score);
          } else {
            st.isGameOver = true;
          }
        } else if (obs.y > canvas.height + 40) {
          st.obstacles.splice(i, 1);
          st.score += 10;
          setScore(st.score);
        }
      }

      // Draw Plane / Shuttle
      ctx.save();
      ctx.translate(st.planeX, st.planeY);

      // Plane Wing Trail
      ctx.fillStyle = '#38BDF860';
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(0, 30);
      ctx.lineTo(10, 15);
      ctx.fill();

      // Shuttle Body
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(0, -22); // nose
      ctx.lineTo(16, 12);
      ctx.lineTo(8, 18);
      ctx.lineTo(-8, 18);
      ctx.lineTo(-16, 12);
      ctx.closePath();
      ctx.fill();

      // Wing Accents (Gold premium)
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(-14, 8, 8, 4);
      ctx.fillRect(6, 8, 8, 4);

      // Cockpit Window
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Shield active visual
      if (st.shieldTimer > 0) {
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      if (!st.levelCleared && st.score >= level * 250) {
        st.levelCleared = true;
        st.isGameOver = true;
        onLevelComplete?.(level);
      }

      // Game Over Check
      if (st.isGameOver) {
        setGameState('gameover');
        setHighScore((prev) => {
          const newHigh = Math.max(prev, st.score);
          setStorageItem(KEYS.GAME_HIGH_SCORE, newHigh);
          return newHigh;
        });
        cancelAnimationFrame(frameId);
        return;
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  // Touch / Drag / Mouse plane movement
  const handleTouchMove = (e) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    stateRef.current.planeX = Math.max(20, Math.min(canvas.width - 20, x));
  };

  const handleMouseMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.planeX = Math.max(20, Math.min(canvas.width - 20, x));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Game Title & Scores */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-sky-400" />
            Sky Wings: Atlantic Dodge
          </h3>
          <span className="text-[10px] text-slate-400">Dodge storm clouds & gather flight stars!</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> High: {highScore}
          </span>
          <span className="text-xs font-black text-sky-300">Score: {score}</span>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="relative border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={420}
          onTouchMove={handleTouchMove}
          onTouchStart={(e) => e.preventDefault()}
          onMouseMove={handleMouseMove}
          className="block w-full h-[min(58vh,420px)] max-w-[320px] cursor-crosshair touch-none"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-sky-500/20 p-4 rounded-full border border-sky-500/40 text-sky-400 mb-3 animate-bounce">
              <Plane className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white mb-1">Atlantic Sky Wings</h4>
            <p className="text-xs text-slate-300 mb-4 max-w-[220px]">
              Drag or touch your phone screen to pilot your shuttle safely past storm clouds to Orlando!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Flight
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="bg-rose-500/20 p-3.5 rounded-full border border-rose-500/40 text-rose-400 mb-2">
              <Cloud className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-white mb-1">Turbulence Collision!</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 w-full max-w-[200px] my-3 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">FLIGHT SCORE</span>
              <span className="text-2xl font-black text-sky-400">{score}</span>
              {score >= highScore && score > 0 && (
                <span className="block text-[10px] font-bold text-amber-400 mt-0.5">NEW HIGH SCORE! 🏆</span>
              )}
            </div>
            <button
              onClick={startGame}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-500 mt-2 text-center">
        Tip: Touch and slide left/right on the canvas area to move your aircraft.
      </p>
    </div>
  );
}
