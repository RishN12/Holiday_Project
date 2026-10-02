import React, { useRef, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { Trophy, Play, RotateCcw, Zap, Layers } from 'lucide-react';

export default function FlightBrickBreaker({ level = 1 }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover', 'won'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(() => getStorageItem('orlando_breaker_high_score', 0));

  const stateRef = useRef({
    paddleX: 120,
    paddleW: 70,
    ballX: 160,
    ballY: 300,
    ballVX: 3,
    ballVY: -4,
    ballR: 6,
    lives: 3,
    score: 0,
    bricks: [],
    isEnded: false
  });

  const initBricks = () => {
    const rows = Math.min(7, 3 + level);
    const cols = 6;
    const padding = 6;
    const brickWidth = (320 - 20 - (cols - 1) * padding) / cols;
    const brickHeight = 16;
    const bricks = [];

    const colors = ['#F59E0B', '#38BDF8', '#10B981', '#EC4899'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: 10 + c * (brickWidth + padding),
          y: 40 + r * (brickHeight + padding),
          w: brickWidth,
          h: brickHeight,
          color: colors[r % colors.length],
          status: 1
        });
      }
    }
    return bricks;
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 320;
    const h = canvas ? canvas.height : 360;

    stateRef.current = {
      paddleX: w / 2 - 35,
      paddleW: 70,
      ballX: w / 2,
      ballY: h - 50,
      ballVX: (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() + level * 0.35),
      ballVY: -(4 + level * 0.3),
      ballR: 6,
      lives: 3,
      score: 0,
      bricks: initBricks(),
      isEnded: false
    };

    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    canvasRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const loop = () => {
      const st = stateRef.current;

      if (!st.isEnded) {
        // Move Ball
        st.ballX += st.ballVX;
        st.ballY += st.ballVY;

        // Bounce Off Left / Right Walls
        if (st.ballX - st.ballR <= 0 || st.ballX + st.ballR >= canvas.width) {
          st.ballVX *= -1;
        }

        // Bounce Off Ceiling
        if (st.ballY - st.ballR <= 0) {
          st.ballVY *= -1;
        }

        // Bounce Off Paddle
        const paddleY = canvas.height - 25;
        if (
          st.ballY + st.ballR >= paddleY &&
          st.ballY - st.ballR <= paddleY + 10 &&
          st.ballX >= st.paddleX &&
          st.ballX <= st.paddleX + st.paddleW
        ) {
          st.ballVY = -Math.abs(st.ballVY);
          // Angle bounce based on where it hit paddle
          const hitPos = (st.ballX - (st.paddleX + st.paddleW / 2)) / (st.paddleW / 2);
          st.ballVX = hitPos * 4.5;
        }

        // Check Brick Collision
        let activeBricks = 0;
        st.bricks.forEach((b) => {
          if (b.status === 1) {
            activeBricks++;
            if (
              st.ballX + st.ballR >= b.x &&
              st.ballX - st.ballR <= b.x + b.w &&
              st.ballY + st.ballR >= b.y &&
              st.ballY - st.ballR <= b.y + b.h
            ) {
              b.status = 0;
              st.ballVY *= -1;
              st.score += 20;
              setScore(st.score);

              setHighScore((prev) => {
                const h = Math.max(prev, st.score);
                setStorageItem('orlando_breaker_high_score', h);
                return h;
              });
            }
          }
        });

        // Won check
        if (activeBricks === 0) {
          st.isEnded = true;
          setGameState('won');
        }

        // Ball Fell Below Bottom
        if (st.ballY >= canvas.height) {
          st.lives -= 1;
          setLives(st.lives);

          if (st.lives <= 0) {
            st.isEnded = true;
            setGameState('gameover');
          } else {
            // Reset ball position
            st.ballX = canvas.width / 2;
            st.ballY = canvas.height - 50;
            st.ballVX = (Math.random() > 0.5 ? 1 : -1) * 3;
            st.ballVY = -4;
          }
        }
      }

      // Render Graphics
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(1, '#1E1B4B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      st.bricks.forEach((b) => {
        if (b.status === 1) {
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, b.w, b.h, 4);
          ctx.fill();
        }
      });

      // Draw Paddle
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.roundRect(st.paddleX, canvas.height - 25, st.paddleW, 10, 5);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(st.ballX, st.ballY, st.ballR, 0, Math.PI * 2);
      ctx.fill();

      if (!st.isEnded) {
        frameId = requestAnimationFrame(loop);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = previousOverflow;
    };
  }, [gameState]);

  const handleTouchMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, x - stateRef.current.paddleW / 2));
  };

  const handleMouseMove = (e) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.paddleX = Math.max(0, Math.min(canvas.width - stateRef.current.paddleW, x - stateRef.current.paddleW / 2));
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Flight Brick Breaker
          </h3>
          <span className="text-[10px] text-slate-400">Classic addictive arcade brick breaker!</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> High: {highScore}
          </span>
          <span className="text-xs font-black text-sky-300">Lives: {'❤️'.repeat(lives)}</span>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 touch-none">
        <canvas
          ref={canvasRef}
          width={320}
          height={360}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          className="block h-auto w-full max-w-[320px] cursor-pointer"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Layers className="w-10 h-10 text-sky-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-black text-white mb-1">Brick Breaker Arcade</h4>
            <p className="text-xs text-slate-300 mb-4 max-w-[220px]">
              Slide your finger left and right to bounce the ball and smash all target bricks!
            </p>
            <button
              onClick={startGame}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Game
            </button>
          </div>
        )}

        {/* Won Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <Trophy className="w-10 h-10 text-amber-400 mb-2" />
            <h4 className="text-lg font-black text-white mb-1">STAGE CLEARED! 🏆</h4>
            <p className="text-xs text-amber-300 mb-4">Final Score: {score} pts</p>
            <button
              onClick={startGame}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition"
            >
              Play Next Level
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <h4 className="text-lg font-black text-white mb-1">Game Over!</h4>
            <p className="text-xs text-slate-300 mb-4">Score: {score} pts</p>
            <button
              onClick={startGame}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-500 mt-2 text-center">
        Tip: Touch and slide left/right on screen to control paddle.
      </p>
    </div>
  );
}
