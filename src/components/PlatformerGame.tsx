import { useEffect, useRef, useState, useCallback } from 'react';

type Position = { x: number; y: number };
type Platform = { x: number; y: number; width: number; height: number };
type Coin = { x: number; y: number; collected: boolean };
type Enemy = { x: number; y: number; width: number; height: number; direction: number; speed: number };

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 32;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const COIN_SIZE = 16;

export function PlatformerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('platformerHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(3);

  const playerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    isJumping: boolean;
    direction: number;
  }>({
    x: 50,
    y: 100,
    vx: 0,
    vy: 0,
    isJumping: false,
    direction: 1,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const platformsRef = useRef<Platform[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const cameraXRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const generateLevel = useCallback(() => {
    const platforms: Platform[] = [
      // Ground
      { x: 0, y: 350, width: 2000, height: 50 },
      // Floating platforms
      { x: 200, y: 280, width: 120, height: 20 },
      { x: 400, y: 220, width: 100, height: 20 },
      { x: 600, y: 180, width: 120, height: 20 },
      { x: 350, y: 300, width: 80, height: 20 },
      { x: 800, y: 260, width: 150, height: 20 },
      { x: 1000, y: 200, width: 100, height: 20 },
      { x: 1200, y: 280, width: 120, height: 20 },
      { x: 1400, y: 220, width: 100, height: 20 },
      { x: 1600, y: 300, width: 200, height: 20 },
    ];

    const coins: Coin[] = [
      { x: 220, y: 250, collected: false },
      { x: 260, y: 250, collected: false },
      { x: 300, y: 250, collected: false },
      { x: 420, y: 190, collected: false },
      { x: 460, y: 190, collected: false },
      { x: 620, y: 150, collected: false },
      { x: 660, y: 150, collected: false },
      { x: 820, y: 230, collected: false },
      { x: 860, y: 230, collected: false },
      { x: 900, y: 230, collected: false },
      { x: 1020, y: 170, collected: false },
      { x: 1220, y: 250, collected: false },
      { x: 1260, y: 250, collected: false },
      { x: 1420, y: 190, collected: false },
      { x: 1650, y: 270, collected: false },
      { x: 1700, y: 270, collected: false },
      { x: 1750, y: 270, collected: false },
    ];

    const enemies: Enemy[] = [
      { x: 250, y: 250, width: 20, height: 20, direction: 1, speed: 1 },
      { x: 450, y: 190, width: 20, height: 20, direction: -1, speed: 1.5 },
      { x: 850, y: 230, width: 20, height: 20, direction: 1, speed: 1 },
      { x: 1250, y: 250, width: 20, height: 20, direction: -1, speed: 1.2 },
    ];

    platformsRef.current = platforms;
    coinsRef.current = coins;
    enemiesRef.current = enemies;
  }, []);

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 50,
      y: 100,
      vx: 0,
      vy: 0,
      isJumping: false,
      direction: 1,
    };
    cameraXRef.current = 0;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPaused(false);
    generateLevel();
  }, [generateLevel]);

  const checkCollision = useCallback((rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const player = playerRef.current;
    const cameraX = cameraXRef.current;

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'hsl(220, 40%, 25%)');
    gradient.addColorStop(1, 'hsl(240, 30%, 15%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars in background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 123 % CANVAS_WIDTH);
      const y = (i * 456 % CANVAS_HEIGHT);
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Draw platforms
    platformsRef.current.forEach(platform => {
      ctx.fillStyle = 'hsl(142, 76%, 36%)';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Platform shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(platform.x, platform.y + platform.height, platform.width, 4);
      
      // Platform details
      ctx.strokeStyle = 'hsl(142, 76%, 26%)';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw coins
    coinsRef.current.forEach(coin => {
      if (!coin.collected) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'hsl(45, 100%, 55%)';
        ctx.fillStyle = 'hsl(45, 100%, 55%)';
        ctx.beginPath();
        ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin center
        ctx.fillStyle = 'hsl(45, 100%, 70%)';
        ctx.beginPath();
        ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw enemies
    enemiesRef.current.forEach(enemy => {
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'hsl(0, 76%, 46%)';
      ctx.fillStyle = 'hsl(0, 76%, 46%)';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      
      // Enemy eyes
      ctx.fillStyle = 'hsl(240, 10%, 3.9%)';
      ctx.fillRect(enemy.x + 4, enemy.y + 5, 4, 4);
      ctx.fillRect(enemy.x + 12, enemy.y + 5, 4, 4);
      ctx.shadowBlur = 0;
    });

    // Draw player
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'hsl(200, 76%, 56%)';
    ctx.fillStyle = 'hsl(200, 76%, 56%)';
    ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    
    // Player face
    ctx.fillStyle = 'hsl(240, 10%, 3.9%)';
    const eyeY = player.y + 10;
    if (player.direction > 0) {
      ctx.fillRect(player.x + 14, eyeY, 5, 5);
    } else {
      ctx.fillRect(player.x + 5, eyeY, 5, 5);
    }
    ctx.fillRect(player.x + 8, player.y + 20, 8, 3);
    
    ctx.shadowBlur = 0;
    ctx.restore();

    // Draw UI
    ctx.fillStyle = 'hsl(240, 5%, 96%)';
    ctx.font = '14px monospace';
    ctx.fillText(`PONTOS: ${score}`, 10, 25);
    ctx.fillText(`VIDAS: ${lives}`, 10, 45);
    ctx.fillText(`RECORDE: ${highScore}`, 10, 65);

    // Position indicator
    const progress = Math.min(100, (player.x / 1800) * 100);
    ctx.fillStyle = 'rgba(200, 170, 80, 0.3)';
    ctx.fillRect(10, CANVAS_HEIGHT - 20, 200, 10);
    ctx.fillStyle = 'hsl(45, 100%, 55%)';
    ctx.fillRect(10, CANVAS_HEIGHT - 20, (200 * progress) / 100, 10);
  }, [score, lives, highScore]);

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) {
      drawGame();
      return;
    }

    const player = playerRef.current;
    const keys = keysRef.current;

    // Horizontal movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      player.vx = -MOVE_SPEED;
      player.direction = -1;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      player.vx = MOVE_SPEED;
      player.direction = 1;
    } else {
      player.vx = 0;
    }

    // Jump
    if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && !player.isJumping) {
      player.vy = JUMP_FORCE;
      player.isJumping = true;
    }

    // Apply gravity
    player.vy += GRAVITY;
    
    // Update position
    player.x += player.vx;
    player.y += player.vy;

    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.y > CANVAS_HEIGHT) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      player.x = 50;
      player.y = 100;
      player.vy = 0;
      player.isJumping = false;
      cameraXRef.current = 0;
    }

    // Platform collision
    let onGround = false;
    platformsRef.current.forEach(platform => {
      if (checkCollision(
        { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        platform
      )) {
        if (player.vy > 0 && player.y + PLAYER_HEIGHT - player.vy <= platform.y) {
          player.y = platform.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.isJumping = false;
          onGround = true;
        }
      }
    });

    // Coin collection
    coinsRef.current.forEach(coin => {
      if (!coin.collected && checkCollision(
        { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        { x: coin.x, y: coin.y, width: COIN_SIZE, height: COIN_SIZE }
      )) {
        coin.collected = true;
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('platformerHighScore', newScore.toString());
          }
          return newScore;
        });
      }
    });

    // Enemy movement and collision
    enemiesRef.current.forEach(enemy => {
      enemy.x += enemy.direction * enemy.speed;
      
      // Enemy platform boundaries
      const enemyPlatform = platformsRef.current.find(p => 
        enemy.y + enemy.height >= p.y && enemy.y + enemy.height <= p.y + p.height
      );
      
      if (enemyPlatform) {
        if (enemy.x < enemyPlatform.x || enemy.x + enemy.width > enemyPlatform.x + enemyPlatform.width) {
          enemy.direction *= -1;
        }
      }

      // Enemy collision with player
      if (checkCollision(
        { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
        enemy
      )) {
        if (player.vy > 0 && player.y + PLAYER_HEIGHT - 10 < enemy.y) {
          // Jump on enemy
          enemy.x = -1000; // Remove enemy
          player.vy = JUMP_FORCE / 2;
          setScore(prev => prev + 20);
        } else {
          // Hit by enemy
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
          player.x = 50;
          player.y = 100;
          player.vy = 0;
          player.isJumping = false;
          cameraXRef.current = 0;
        }
      }
    });

    // Camera follow
    const targetCameraX = Math.max(0, player.x - CANVAS_WIDTH / 3);
    cameraXRef.current += (targetCameraX - cameraXRef.current) * 0.1;

    // Win condition
    if (player.x > 1900) {
      setScore(prev => prev + 100);
      setTimeout(() => {
        alert('Você venceu! 🎉');
        resetGame();
      }, 100);
    }

    drawGame();
  }, [gameOver, isPaused, checkCollision, drawGame, highScore, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      keysRef.current[e.key] = true;
      
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, resetGame]);

  useEffect(() => {
    generateLevel();
    
    const animate = () => {
      gameLoop();
      animFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameLoop, generateLevel]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="flex items-center justify-between w-full max-w-[800px]">
        <div className="text-sm font-[family-name:var(--font-display)] tracking-wider">
          <span className="text-muted-foreground">PONTOS: </span>
          <span className="text-accent font-semibold">{score}</span>
        </div>
        <div className="text-sm font-[family-name:var(--font-display)] tracking-wider">
          <span className="text-muted-foreground">VIDAS: </span>
          <span className="text-accent font-semibold">{lives}</span>
        </div>
        <div className="text-sm font-[family-name:var(--font-display)] tracking-wider">
          <span className="text-muted-foreground">RECORDE: </span>
          <span className="text-accent font-semibold">{highScore}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-border/50 rounded"
        />
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rounded">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-foreground mb-2">
              GAME OVER
            </h3>
            <p className="text-muted-foreground mb-1">Pontuação Final: {score}</p>
            <p className="text-muted-foreground mb-4">Recorde: {highScore}</p>
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

      <div className="text-xs text-muted-foreground text-center max-w-[800px] space-y-1">
        <p>Use as <span className="text-accent">setas</span> ou <span className="text-accent">WASD</span> para mover • <span className="text-accent">ESPAÇO</span> ou <span className="text-accent">↑</span> para pular</p>
        <p>Colete moedas e pule nos inimigos! Pressione <span className="text-accent">ESC</span> para pausar</p>
      </div>
    </div>
  );
}
