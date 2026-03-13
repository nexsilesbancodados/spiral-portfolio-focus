import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INTRO_DURATION = 3000; // 3 seconds

const Intro = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / INTRO_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= INTRO_DURATION) {
        setFadeOut(true);
        setTimeout(() => navigate('/home'), 400);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-end transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/slide-01.jpg"
        alt="Intro Focuss Dev"
        loading="eager"
        decoding="async"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      <div className="relative z-10 w-full space-y-4" style={{ padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(2rem, 3vw, 4rem)' }}>
        <div className="flex items-center justify-between">
          <span
            className="tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'hsl(var(--foreground) / 0.6)',
              fontSize: 'clamp(9px, 0.8vw, 14px)',
            }}
          >
            Carregando...
          </span>
          <span className="font-mono" style={{ color: 'hsl(var(--primary))', fontSize: 'clamp(9px, 0.8vw, 14px)' }}>
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>

        <div className="relative w-full rounded-full overflow-hidden bg-secondary/60 border border-border/30" style={{ height: 'clamp(4px, 0.4vw, 6px)' }}>
          <div
            className="h-full rounded-full transition-[width] duration-200 ease-linear"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, hsl(var(--vice-teal)), hsl(var(--vice-sunset)), hsl(var(--vice-pink)))',
            }}
          />
        </div>

        <p
          className="text-center tracking-[0.5em] uppercase"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'hsl(var(--muted-foreground))',
            fontSize: 'clamp(8px, 0.7vw, 12px)',
          }}
        >
          Focuss Dev Studio
        </p>
      </div>
    </div>
  );
};

export default Intro;
