import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const INTRO_DURATION = 3200;

const Intro = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate logo entrance
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }

    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / INTRO_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= INTRO_DURATION) {
        setFadeOut(true);
        setTimeout(() => navigate('/home'), 500);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/slide-01.jpg"
        alt="Intro Focuss Dev"
        loading="eager"
        decoding="async"
        style={{ filter: 'brightness(0.35) saturate(1.2)' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 80%)' }} />

      {/* Logo / Brand */}
      <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-6 mb-12" style={{ opacity: 0 }}>
        <img
          src="/images/focuss-dev-logo.png"
          alt="FOCUSS DEV"
          className="w-auto object-contain"
          style={{ height: 'clamp(40px, 6vw, 80px)' }}
        />
        <div className="flex items-center gap-3">
          <div className="h-[1px] bg-primary/40" style={{ width: 'clamp(1.5rem, 3vw, 3rem)' }} />
          <span
            className="font-[family-name:var(--font-display)] tracking-[0.5em] uppercase text-muted-foreground"
            style={{ fontSize: 'clamp(8px, 0.7vw, 11px)' }}
          >
            Studio Digital
          </span>
          <div className="h-[1px] bg-primary/40" style={{ width: 'clamp(1.5rem, 3vw, 3rem)' }} />
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 w-full" style={{ maxWidth: 'clamp(200px, 30vw, 400px)', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div className="flex items-center justify-between mb-3">
          <span
            className="tracking-[0.3em] uppercase font-[family-name:var(--font-display)]"
            style={{
              color: 'hsl(var(--foreground) / 0.5)',
              fontSize: 'clamp(8px, 0.7vw, 11px)',
            }}
          >
            Carregando
          </span>
          <span className="font-[family-name:var(--font-display)] tracking-wider" style={{ color: 'hsl(var(--primary))', fontSize: 'clamp(9px, 0.8vw, 12px)' }}>
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>

        <div className="relative w-full rounded-full overflow-hidden bg-secondary/40 border border-border/20" style={{ height: 'clamp(3px, 0.35vw, 5px)' }}>
          <div
            ref={barRef}
            className="h-full rounded-full"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, hsl(var(--vice-teal)), hsl(var(--vice-sunset)), hsl(var(--vice-pink)))',
              boxShadow: '0 0 12px hsl(var(--vice-sunset) / 0.4)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
