import React, { useRef, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { Trophy, Play, RotateCcw, Zap, Compass } from 'lucide-react';

export default function JetpackRunner() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getStorageItem('orlando_runner_high_score', 0));

  const stateRef = useRef({
    runnerY: 280,
    vy: 0,
    jumpCount: 0,
    gravity: 0.6,
    obstacles: [],
    coins: [],
    score: 0,
    tick: 0,
    isEnded: false
  });

  const startGame = () => {
    const canvas = canvasRef.current;
    const h = canvas ? canvas.height : 360;

    stateRef.current = {
      runnerY: h - 60,
      vy: 0,
      jumpCount: 0,
      gravity: 0.6,
      obstacles: [],
      coins: [],
      score: 0,
      tick: 0,
      isEnded: false
    };

    setScore(0);
    setGameState('playing');
  };

  const handleJump = () => {
    const st = stateRef.current;
    if (gameState === 'playing' && st.jumpCount < 2) {
      st.vy = -10.5;
      st.jumpCount++;
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const groundY = canvas.height - 50;

    const loop = () => {
      const st = stateRef.current;
      st.tick++;

      if (!st.isEnded) {
        // Physics update
        st.vy += st.gravity;
        st.runnerY += st.vy;

        if (st.runnerY >= groundY) {
          st.runnerY = groundY;
          st.vy = 0;
          st.jumpCount = 0;
        }

        const speedMultiplier = 1 + (st.score / 500); // Speed scales up with score
        
        // Spawn obstacles
        if (st.tick % Math.max(40, Math.floor(80 / speedMultiplier)) === 0) {
          st.obstacles.push({
            x: canvas.width + 20,
            w: 18 + Math.random() * 10,
            h: 30 + Math.random() * 20,
            speed: (4.5 + Math.random() * 2) * speedMultiplier
          });
        }

        // Spawn coins
        if (st.tick % 110 === 0) {
          st.coins.push({
            x: canvas.width + 20,
            y: groundY - 40 - Math.random() * 80,
            r: 8,
            speed: 4 * speedMultiplier
          });
        }

        // Move & Check Obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= obs.speed;

          // Check collision with runner (at X=40)
          const runnerX = 40;
          const runnerW = 20;
          const runnerH = 30;

          if (
            runnerX + runnerW >= obs.x &&
            runnerX <= obs.x + obs.w &&
            st.runnerY + runnerH >= groundY - obs.h
          ) {
            st.isEnded = true;
            setGameState('gameover');
            setHighScore((prev) => {
              const h = Math.max(prev, st.score);
              setStorageItem('orlando_runner_high_score', h);
              return h;
            });
          }

          if (obs.x < -30) {
            st.obstacles.splice(i, 1);
            st.score += 10;
            setScore(st.score);
          }
        }

        // Move & Check Coins
        for (let i = st.coins.length - 1; i >= 0; i--) {
          const coin = st.coins[i];
          coin.x -= coin.speed;

          const dist = Math.hypot(40 - coin.x, st.runnerY - coin.y);
          if (dist < 20) {
            st.coins.splice(i, 1);
            st.score += 30;
            setScore(st.score);
          } else if (coin.x < -20) {
            st.coins.splice(i, 1);
          }
        }
      }

      // Render Graphics
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Sky
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#000000'); // Obsidian
      bgGrad.addColorStop(1, '#1A1A1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Ground
      ctx.fillStyle = '#262626';
      ctx.fillRect(0, groundY + 20, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#D4AF37'; // Gold accent
      ctx.fillRect(0, groundY + 20, canvas.width, 3);

      // Draw Obstacles
      st.obstacles.forEach((obs) => {
        ctx.fillStyle = '#F43F5E';
        ctx.fillRect(obs.x, groundY + 20 - obs.h, obs.w, obs.h);
      });

      // Draw Coins
      st.coins.forEach((coin) => {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Runner Player
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.roundRect(30, st.runnerY - 10, 20, 30, 6);
      ctx.fill();

      // Jetpack flame visual when jumping
      if (st.jumpCount > 0 && st.runnerY < groundY) {
        ctx.fillStyle = st.jumpCount === 2 ? '#EC4899' : '#F97316'; // Pink for double jump
        ctx.beginPath();
        ctx.moveTo(35, st.runnerY + 20);
        ctx.lineTo(40, st.runnerY + 35 + Math.random() * 10);
        ctx.lineTo(45, st.runnerY + 20);
        ctx.fill();
      }

      if (!st.isEnded) {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center animate-fadeIn" onClick={handleJump}>
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Sky Dash: Jetpack Runner
          </h3>
          <span className="text-[10px] text-slate-400">Tap anywhere on screen to jetpack jump!</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Best: {highScore}
          </span>
          <span className="text-xs font-black text-sky-300">Distance: {score}m</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 touch-none">
        <canvas ref={canvasRef} width={320} height={360} className="block cursor-pointer" />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Zap className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black text-white mb-1">Jetpack Runner Arcade</h4>
            <p className="text-xs text-slate-300 mb-4 max-w-[220px]">
              Tap screen to jump over obstacles and collect altitude coins!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Runner
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <h4 className="text-lg font-black text-white mb-1">Obstacle Collision!</h4>
            <p className="text-xs text-slate-300 mb-4">Distance Survived: {score}m</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-500 mt-2 text-center">
        Tip: Tap anywhere on your phone screen to trigger jetpack boost jump.
      </p>
    </div>
  );
}
