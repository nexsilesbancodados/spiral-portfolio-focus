import { useEffect, useRef, useState, useCallback, memo } from 'react';

type Platform = { x: number; y: number; width: number; height: number };
type Coin = { x: number; y: number; collected: boolean };
type Enemy = { x: number; y: number; width: number; height: number; direction: number; speed: number };

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 28;
const PLAYER_HEIGHT = 36;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const MOVE_SPEED = 4.5;
const COIN_SIZE = 16;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 137.5) % CANVAS_WIDTH,
  y: (i * 73.3) % CANVAS_HEIGHT,
  size: Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.4 + 0.2,
}));

const PLATFORMS: Platform[] = [
  { x: 0, y: 350, width: 2200, height: 50 },
  { x: 200, y: 280, width: 120, height: 18 },
  { x: 400, y: 220, width: 100, height: 18 },
  { x: 570, y: 170, width: 130, height: 18 },
  { x: 780, y: 240, width: 150, height: 18 },
  { x: 980, y: 180, width: 100, height: 18 },
  { x: 1150, y: 270, width: 120, height: 18 },
  { x: 1320, y: 200, width: 110, height: 18 },
  { x: 1500, y: 290, width: 200, height: 18 },
  { x: 1750, y: 240, width: 120, height: 18 },
  { x: 1950, y: 300, width: 100, height: 18 },
];

const INITIAL_COINS: Coin[] = [
  { x: 220, y: 250, collected: false },
  { x: 255, y: 250, collected: false },
  { x: 290, y: 250, collected: false },
  { x: 420, y: 190, collected: false },
  { x: 455, y: 190, collected: false },
  { x: 590, y: 140, collected: false },
  { x: 625, y: 140, collected: false },
  { x: 800, y: 210, collected: false },
  { x: 835, y: 210, collected: false },
  { x: 870, y: 210, collected: false },
  { x: 1000, y: 150, collected: false },
  { x: 1035, y: 150, collected: false },
  { x: 1170, y: 240, collected: false },
  { x: 1205, y: 240, collected: false },
  { x: 1340, y: 170, collected: false },
  { x: 1520, y: 260, collected: false },
  { x: 1560, y: 260, collected: false },
  { x: 1600, y: 260, collected: false },
  { x: 1770, y: 210, collected: false },
  { x: 1810, y: 210, collected: false },
];

const INITIAL_ENEMIES: Enemy[] = [
  { x: 250, y: 258, width: 22, height: 22, direction: 1, speed: 1.2 },
  { x: 450, y: 198, width: 22, height: 22, direction: -1, speed: 1.6 },
  { x: 610, y: 148, width: 22, height: 22, direction: 1, speed: 1.3 },
  { x: 840, y: 218, width: 22, height: 22, direction: -1, speed: 1.4 },
  { x: 1190, y: 248, width: 22, height: 22, direction: 1, speed: 1.5 },
  { x: 1550, y: 268, width: 22, height: 22, direction: -1, speed: 1.2 },
];

export const PlatformerGame = memo(function PlatformerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore] = useState(() => {
    const saved = localStorage.getItem('platformerHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const highScoreRef = useRef(highScore);
  const [currentHighScore, setCurrentHighScore] = useState(highScore);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);

  const playerRef = useRef({ x: 50, y: 100, vx: 0, vy: 0, isJumping: false, direction: 1 });
  const keysRef = useRef<Record<string, boolean>>({});
  const coinsRef = useRef<Coin[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const cameraXRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameActiveRef = useRef(true);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const initLevel = useCallback(() => {
    coinsRef.current = INITIAL_COINS.map(c => ({ ...c, collected: false }));
    enemiesRef.current = INITIAL_ENEMIES.map(e => ({ ...e }));
  }, []);

  const resetPlayer = useCallback(() => {
    playerRef.current = { x: 50, y: 100, vx: 0, vy: 0, isJumping: false, direction: 1 };
    cameraXRef.current = 0;
  }, []);

  const drawGame = useCallback((theScore: number, theLives: number, theHighScore: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const player = playerRef.current;
    const cameraX = cameraXRef.current;
    const W = CANVAS_WIDTH, H = CANVAS_HEIGHT;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'hsl(230, 50%, 18%)');
    grad.addColorStop(1, 'hsl(240, 40%, 8%)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars (static, no recalculation per frame)
    ctx.save();
    for (const star of STARS) {
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Platforms
    for (const platform of PLATFORMS) {
      const screenX = platform.x - cameraX;
      if (screenX > W + 50 || screenX + platform.width < -50) continue;

      ctx.fillStyle = 'hsl(145, 60%, 30%)';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      ctx.fillStyle = 'hsl(145, 60%, 42%)';
      ctx.fillRect(platform.x, platform.y, platform.width, 3);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(platform.x, platform.y + platform.height, platform.width, 4);
    }

    // Coins with simple glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'hsl(45, 100%, 55%)';
    for (const coin of coinsRef.current) {
      if (coin.collected) continue;
      const screenX = coin.x - cameraX;
      if (screenX > W + 30 || screenX < -30) continue;
      ctx.fillStyle = 'hsl(45, 100%, 55%)';
      ctx.beginPath();
      ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'hsl(45, 100%, 75%)';
      ctx.beginPath();
      ctx.arc(coin.x + COIN_SIZE / 2 - 2, coin.y + COIN_SIZE / 2 - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Enemies
    for (const enemy of enemiesRef.current) {
      if (enemy.x < -100) continue;
      const screenX = enemy.x - cameraX;
      if (screenX > W + 50 || screenX < -50) continue;

      ctx.shadowBlur = 6;
      ctx.shadowColor = 'hsl(0, 80%, 50%)';
      // Body
      ctx.fillStyle = 'hsl(0, 80%, 45%)';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      // Top detail (mushroom cap)
      ctx.fillStyle = 'hsl(0, 70%, 35%)';
      ctx.fillRect(enemy.x - 2, enemy.y, enemy.width + 4, 8);
      // Eyes
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      const eyeOffX = enemy.direction > 0 ? enemy.width - 8 : 2;
      ctx.fillRect(enemy.x + eyeOffX, enemy.y + 7, 5, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(enemy.x + eyeOffX + 1, enemy.y + 8, 3, 3);
    }
    ctx.shadowBlur = 0;

    // Player
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'hsl(200, 80%, 55%)';
    // Body
    ctx.fillStyle = 'hsl(200, 80%, 55%)';
    ctx.fillRect(player.x, player.y + 8, PLAYER_WIDTH, PLAYER_HEIGHT - 8);
    // Hat
    ctx.fillStyle = 'hsl(0, 80%, 50%)';
    ctx.fillRect(player.x - 2, player.y, PLAYER_WIDTH + 4, 10);
    ctx.fillRect(player.x + 4, player.y - 10, PLAYER_WIDTH - 8, 12);
    // Face
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'hsl(30, 90%, 75%)';
    ctx.fillRect(player.x + 4, player.y + 10, PLAYER_WIDTH - 8, 10);
    ctx.fillStyle = '#000';
    const faceDir = player.direction > 0 ? PLAYER_WIDTH - 10 : 4;
    ctx.fillRect(player.x + faceDir, player.y + 12, 4, 4);
    // Overalls
    ctx.fillStyle = 'hsl(220, 80%, 50%)';
    ctx.fillRect(player.x + 2, player.y + 22, PLAYER_WIDTH - 4, 10);
    ctx.fillStyle = 'hsl(200, 80%, 55%)';
    ctx.fillRect(player.x, player.y + 32, 8, PLAYER_HEIGHT - 32);
    ctx.fillRect(player.x + PLAYER_WIDTH - 8, player.y + 32, 8, PLAYER_HEIGHT - 32);

    ctx.restore();

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, W, 52);
    ctx.fillStyle = 'hsl(45, 100%, 55%)';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`★ ${theScore}`, 14, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(`❤ ${theLives}`, W / 2 - 24, 22);
    ctx.fillStyle = 'hsl(45, 80%, 70%)';
    ctx.fillText(`⚑ ${theHighScore}`, W - 100, 22);

    // Progress bar
    const progress = Math.min(1, player.x / 2000);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(14, 32, W - 28, 8);
    ctx.fillStyle = 'hsl(45, 100%, 55%)';
    ctx.fillRect(14, 32, (W - 28) * progress, 8);

    const collected = coinsRef.current.filter(c => c.collected).length;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px monospace';
    ctx.fillText(`${collected}/${INITIAL_COINS.length} moedas`, 14, 50);
  }, []);

  const runGameLoop = useCallback(() => {
    if (!gameActiveRef.current) return;

    const player = playerRef.current;
    const keys = keysRef.current;
    const paused = isPaused || gameOver || won;

    if (!paused) {
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) { player.vx = -MOVE_SPEED; player.direction = -1; }
      else if (keys['ArrowRight'] || keys['d'] || keys['D']) { player.vx = MOVE_SPEED; player.direction = 1; }
      else { player.vx *= 0.75; }

      if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && !player.isJumping) {
        player.vy = JUMP_FORCE;
        player.isJumping = true;
      }

      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;
      if (player.x < 0) player.x = 0;

      // Fall death
      if (player.y > CANVAS_HEIGHT + 30) {
        livesRef.current = Math.max(0, livesRef.current - 1);
        setLives(livesRef.current);
        if (livesRef.current <= 0) { setGameOver(true); return; }
        resetPlayer();
      }

      // Platform collision
      player.isJumping = true;
      for (const plat of PLATFORMS) {
        if (player.x + PLAYER_WIDTH > plat.x && player.x < plat.x + plat.width &&
            player.y + PLAYER_HEIGHT > plat.y && player.y + PLAYER_HEIGHT - player.vy <= plat.y + 5 && player.vy >= 0) {
          player.y = plat.y - PLAYER_HEIGHT;
          player.vy = 0;
          player.isJumping = false;
        }
      }

      // Coins
      for (const coin of coinsRef.current) {
        if (coin.collected) continue;
        if (player.x + PLAYER_WIDTH > coin.x && player.x < coin.x + COIN_SIZE &&
            player.y + PLAYER_HEIGHT > coin.y && player.y < coin.y + COIN_SIZE) {
          coin.collected = true;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            setCurrentHighScore(scoreRef.current);
            localStorage.setItem('platformerHighScore', scoreRef.current.toString());
          }
        }
      }

      // Enemies
      for (const enemy of enemiesRef.current) {
        if (enemy.x < -100) continue;
        enemy.x += enemy.direction * enemy.speed;
        const ep = PLATFORMS.find(p => enemy.y + enemy.height >= p.y && enemy.y + enemy.height <= p.y + p.height + 4);
        if (ep && (enemy.x < ep.x || enemy.x + enemy.width > ep.x + ep.width)) enemy.direction *= -1;

        if (player.x + PLAYER_WIDTH > enemy.x && player.x < enemy.x + enemy.width &&
            player.y + PLAYER_HEIGHT > enemy.y && player.y < enemy.y + enemy.height) {
          if (player.vy > 0 && player.y + PLAYER_HEIGHT - 12 < enemy.y + 12) {
            enemy.x = -9999;
            player.vy = JUMP_FORCE * 0.55;
            scoreRef.current += 20;
            setScore(scoreRef.current);
          } else {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            if (livesRef.current <= 0) { setGameOver(true); return; }
            resetPlayer();
          }
        }
      }

      // Camera
      const targetCam = Math.max(0, player.x - CANVAS_WIDTH / 3);
      cameraXRef.current = lerp(cameraXRef.current, targetCam, 0.12);

      // Win
      if (player.x > 2050) { scoreRef.current += 100; setScore(scoreRef.current); setWon(true); return; }
    }

    drawGame(scoreRef.current, livesRef.current, highScoreRef.current);
    animFrameRef.current = requestAnimationFrame(runGameLoop);
  }, [gameOver, isPaused, won, resetPlayer, drawGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d', { alpha: false });
    initLevel();
  }, [initLevel]);

  useEffect(() => {
    if (gameOver || won) return;
    gameActiveRef.current = true;
    animFrameRef.current = requestAnimationFrame(runGameLoop);
    return () => {
      gameActiveRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [runGameLoop, gameOver, won]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameOver || won) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleReset(); } return; }
      if (e.key === 'Escape') { e.preventDefault(); setIsPaused(p => !p); return; }
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [gameOver, won]);

  const handleReset = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPaused(false);
    setWon(false);
    resetPlayer();
    initLevel();
  }, [resetPlayer, initLevel]);

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="relative overflow-hidden rounded" style={{ width: CANVAS_WIDTH, maxWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block border border-border/50 rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rounded">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-foreground mb-2">
              {won ? '🎉 VOCÊ VENCEU!' : '💀 GAME OVER'}
            </h3>
            <p className="text-muted-foreground mb-1">Pontuação: <span className="text-accent font-bold">{score}</span></p>
            <p className="text-muted-foreground mb-4">Recorde: <span className="text-accent font-bold">{currentHighScore}</span></p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-accent text-background font-[family-name:var(--font-display)] text-sm tracking-wider rounded hover:bg-accent/90 transition-colors"
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        )}

        {isPaused && !gameOver && !won && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded">
            <h3 className="text-2xl font-[family-name:var(--font-display)] text-accent">⏸ PAUSADO</h3>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        <span className="text-accent">← → / WASD</span> mover · <span className="text-accent">↑ / W / ESPAÇO</span> pular · pule nos inimigos para eliminá-los · <span className="text-accent">ESC</span> pausar
      </p>
    </div>
  );
});
