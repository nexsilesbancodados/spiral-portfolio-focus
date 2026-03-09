import { useEffect, useRef, useState, useCallback } from 'react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const snake = snakeRef.current;
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    foodRef.current = newFood;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  }, [generateFood]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(240, 10%, 3.9%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'hsl(240, 5%, 15%)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food with glow
    const food = foodRef.current;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'hsl(45, 100%, 55%)';
    ctx.fillStyle = 'hsl(45, 100%, 55%)';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === snake.length - 1;
      const opacity = 0.3 + (index / snake.length) * 0.7;
      
      if (isHead) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'hsl(142, 76%, 36%)';
      }
      
      ctx.fillStyle = `hsl(142, 76%, 36%, ${opacity})`;
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      if (isHead) {
        ctx.shadowBlur = 0;
      }
    });

    // Draw eyes on snake head
    const head = snake[snake.length - 1];
    ctx.fillStyle = 'hsl(240, 10%, 3.9%)';
    const eyeSize = 3;
    const eyeOffset = 5;
    
    if (directionRef.current === 'RIGHT') {
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeOffset, head.y * CELL_SIZE + 5, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeOffset, head.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize);
    } else if (directionRef.current === 'LEFT') {
      ctx.fillRect(head.x * CELL_SIZE + eyeOffset - eyeSize, head.y * CELL_SIZE + 5, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + eyeOffset - eyeSize, head.y * CELL_SIZE + CELL_SIZE - 8, eyeSize, eyeSize);
    } else if (directionRef.current === 'UP') {
      ctx.fillRect(head.x * CELL_SIZE + 5, head.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - 8, head.y * CELL_SIZE + eyeOffset - eyeSize, eyeSize, eyeSize);
    } else if (directionRef.current === 'DOWN') {
      ctx.fillRect(head.x * CELL_SIZE + 5, head.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - 8, head.y * CELL_SIZE + CELL_SIZE - eyeOffset, eyeSize, eyeSize);
    }
  }, []);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    const snake = snakeRef.current;
    directionRef.current = nextDirectionRef.current;
    const head = snake[snake.length - 1];
    const newHead = { ...head };

    // Move snake
    switch (directionRef.current) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    snake.push(newHead);

    // Check food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        return newScore;
      });
      generateFood();
    } else {
      snake.shift();
    }

    drawGame();
  }, [gameOver, isPaused, highScore, generateFood, drawGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGame();
        }
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      const direction = directionRef.current;
      const next = nextDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (direction !== 'DOWN' && next !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (direction !== 'UP' && next !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (direction !== 'RIGHT' && next !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (direction !== 'LEFT' && next !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, resetGame]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameLoop, gameOver, isPaused]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="text-sm font-[family-name:var(--font-display)] tracking-wider">
          <span className="text-muted-foreground">PONTOS: </span>
          <span className="text-accent font-semibold">{score}</span>
        </div>
        <div className="text-sm font-[family-name:var(--font-display)] tracking-wider">
          <span className="text-muted-foreground">RECORDE: </span>
          <span className="text-accent font-semibold">{highScore}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-border/50 rounded"
        />
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rounded">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-foreground mb-2">
              GAME OVER
            </h3>
            <p className="text-muted-foreground mb-4">Pontuação: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-accent text-background font-[family-name:var(--font-display)] text-sm tracking-wider rounded hover:bg-accent/90 transition-colors"
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-accent">
              PAUSADO
            </h3>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center max-w-[400px] space-y-1">
        <p>Use as <span className="text-accent">setas</span> ou <span className="text-accent">WASD</span> para controlar</p>
        <p>Pressione <span className="text-accent">ESPAÇO</span> para pausar</p>
      </div>
    </div>
  );
}
