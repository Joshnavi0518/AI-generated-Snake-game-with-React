import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted || gameOver || isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver, isPaused]);

  useEffect(() => {
    if (!hasStarted || gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 100);
    return () => clearInterval(intervalId);
  }, [hasStarted, gameOver, isPaused, food, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Draw Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    // Glitch offset for food occasionally
    const foodOffset = Math.random() > 0.9 ? (Math.random() > 0.5 ? 2 : -2) : 0;
    ctx.fillRect(
      food.x * CELL_SIZE + foodOffset,
      food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    // Draw Snake (Cyan)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      const isGlitching = Math.random() > 0.95;
      const xOffset = isGlitching ? (Math.random() > 0.5 ? 4 : -4) : 0;
      
      ctx.fillRect(
        segment.x * CELL_SIZE + xOffset,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full max-w-[400px] mb-4 px-2 border-b-2 border-cyan-400 pb-2">
        <div className="flex items-center gap-2 text-fuchsia-500">
          <span className="text-2xl font-bold uppercase">&gt; BIOMASS:</span>
          <span className="text-3xl font-bold text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-cyan-400 text-xl uppercase tracking-widest">
          {isPaused ? '[ HALTED ]' : hasStarted ? '[ EXEC ]' : '[ IDLE ]'}
        </div>
      </div>

      <div className="relative border-4 border-fuchsia-500 bg-black p-1">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block bg-black"
        />
        
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center border-2 border-cyan-400 m-2">
            {gameOver ? (
              <>
                <h3 className="text-5xl font-black text-fuchsia-500 mb-2 glitch-text uppercase" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                <p className="text-cyan-400 mb-8 text-2xl uppercase">&gt; DATA_LOST: {score}</p>
                <button 
                  onClick={resetGame}
                  className="bg-cyan-400 text-black px-6 py-2 text-2xl font-bold uppercase hover:bg-fuchsia-500 hover:text-white transition-colors brutal-border cursor-pointer"
                >
                  [ REBOOT_SYS ]
                </button>
              </>
            ) : !hasStarted ? (
              <>
                <h3 className="text-4xl font-black text-cyan-400 mb-8 uppercase glitch-text" data-text="AWAITING_CMD">AWAITING_CMD</h3>
                <button 
                  onClick={resetGame}
                  className="bg-fuchsia-500 text-black px-6 py-2 text-2xl font-bold uppercase hover:bg-cyan-400 hover:text-black transition-colors brutal-border cursor-pointer"
                >
                  [ INIT_SEQ ]
                </button>
              </>
            ) : isPaused ? (
              <>
                <h3 className="text-4xl font-black text-white mb-8 uppercase glitch-text" data-text="EXEC_HALTED">EXEC_HALTED</h3>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="bg-cyan-400 text-black px-6 py-2 text-2xl font-bold uppercase hover:bg-white hover:text-black transition-colors brutal-border cursor-pointer"
                >
                  [ RESUME_EXEC ]
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
