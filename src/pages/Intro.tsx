import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const TOTAL_DURATION = 10000; // 10s total intro

const textCards = [
  { text: 'FOCUSS DEV', type: 'brand' as const, delay: 0.8 },
  { text: 'PRESENTS', type: 'subtitle' as const, delay: 2.4 },
  { text: 'DIGITAL\nEXPERIENCES', type: 'hero' as const, delay: 4.2 },
  { text: 'REDEFINED', type: 'accent' as const, delay: 6.5 },
];

const Intro = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [canSkip, setCanSkip] = useState(false);
  const hasNavigated = useRef(false);

  const goHome = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => navigate('/home'),
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Allow skip after 2s
    const skipTimer = setTimeout(() => setCanSkip(true), 2000);

    // Auto-navigate after total duration
    const navTimer = setTimeout(goHome, TOTAL_DURATION);

    // Play video
    video.play().catch(() => {});

    // ── Master GSAP Timeline ──────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timelineRef.current = tl;

    // Scanlines flicker entrance
    tl.fromTo('.intro-scanlines', { opacity: 0 }, { opacity: 0.04, duration: 0.3 }, 0);

    // Vignette
    tl.fromTo('.intro-vignette', { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0);

    // ── Text Card 1: "FOCUSS DEV" ─────────────────────────────
    tl.fromTo('.card-brand',
      { opacity: 0, scale: 1.3, filter: 'blur(20px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' },
      0.8
    );
    tl.to('.card-brand', {
      opacity: 0, scale: 0.95, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in',
    }, 2.2);

    // ── Text Card 2: "PRESENTS" ───────────────────────────────
    tl.fromTo('.card-subtitle',
      { opacity: 0, letterSpacing: '2em', y: 0 },
      { opacity: 1, letterSpacing: '0.6em', duration: 1, ease: 'power2.out' },
      2.5
    );
    tl.to('.card-subtitle', {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
    }, 3.8);

    // ── Neon line sweep ───────────────────────────────────────
    tl.fromTo('.neon-line',
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.8, ease: 'power3.inOut' },
      4.0
    );
    tl.to('.neon-line', { scaleX: 0, transformOrigin: 'right center', duration: 0.5 }, 5.2);

    // ── Text Card 3: "DIGITAL EXPERIENCES" ────────────────────
    tl.fromTo('.card-hero-line',
      { opacity: 0, y: 60, skewY: 3, filter: 'blur(8px)' },
      { opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.15, ease: 'power4.out' },
      4.3
    );
    tl.to('.card-hero-line', {
      opacity: 0, y: -30, duration: 0.5, stagger: 0.08, ease: 'power2.in',
    }, 6.0);

    // ── Text Card 4: "REDEFINED" ──────────────────────────────
    tl.fromTo('.card-accent',
      { opacity: 0, scale: 0.5, rotationX: 40 },
      { opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: 'back.out(1.4)' },
      6.5
    );
    // Glow pulse on accent
    tl.fromTo('.card-accent-glow',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, yoyo: true, repeat: 2, ease: 'power1.inOut' },
      6.8
    );
    tl.to('.card-accent', {
      opacity: 0, scale: 1.1, filter: 'blur(12px)', duration: 0.6, ease: 'power2.in',
    }, 8.5);

    // ── Logo reveal at end ────────────────────────────────────
    tl.fromTo('.intro-logo-final',
      { opacity: 0, y: 20, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      8.8
    );

    // ── Skip hint ─────────────────────────────────────────────
    tl.fromTo('.skip-hint',
      { opacity: 0 },
      { opacity: 0.5, duration: 0.4 },
      2.2
    );

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(navTimer);
      tl.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    if (canSkip) goHome();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background overflow-hidden cursor-pointer"
      onClick={handleSkip}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro-gta.mp4"
        muted
        playsInline
        preload="auto"
        style={{ filter: 'brightness(0.55) saturate(1.35) contrast(1.1)' }}
      />

      {/* Dark overlays */}
      <div className="intro-vignette absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, hsl(var(--background) / 0.6) 60%, hsl(var(--background)) 90%)',
        zIndex: 2,
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 40%, transparent 60%, hsl(var(--background) / 0.5) 100%)',
        zIndex: 2,
      }} />

      {/* Scanlines overlay */}
      <div className="intro-scanlines absolute inset-0 pointer-events-none" style={{
        zIndex: 5,
        opacity: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.15) 2px, hsl(0 0% 0% / 0.15) 4px)',
        backgroundSize: '100% 4px',
        mixBlendMode: 'overlay',
      }} />

      {/* Vice color ambient glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 3,
        background: 'radial-gradient(circle at 20% 80%, hsl(var(--vice-pink) / 0.12), transparent 50%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 3,
        background: 'radial-gradient(circle at 80% 20%, hsl(var(--vice-teal) / 0.1), transparent 50%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 3,
        background: 'radial-gradient(circle at 50% 50%, hsl(var(--vice-sunset) / 0.06), transparent 60%)',
      }} />

      {/* ── Text Cards Layer ─────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>

        {/* Card 1: FOCUSS DEV */}
        <div className="card-brand absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight text-center"
            style={{
              fontSize: 'clamp(3rem, 10vw, 10rem)',
              lineHeight: 0.9,
              background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(var(--vice-sunset)) 50%, hsl(var(--vice-pink)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 60px hsl(var(--vice-sunset) / 0.4))',
            }}
          >
            FOCUSS<br />DEV
          </h1>
        </div>

        {/* Card 2: PRESENTS */}
        <div className="card-subtitle absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
          <span
            className="font-[family-name:var(--font-display)] uppercase tracking-[0.6em] text-center"
            style={{
              fontSize: 'clamp(0.8rem, 1.8vw, 1.6rem)',
              color: 'hsl(var(--foreground) / 0.7)',
              textShadow: '0 0 30px hsl(var(--vice-teal) / 0.3)',
            }}
          >
            Presents
          </span>
        </div>

        {/* Neon horizontal line */}
        <div
          className="neon-line absolute left-[10%] right-[10%] h-[2px]"
          style={{
            top: '50%',
            transform: 'scaleX(0)',
            zIndex: 11,
            background: 'linear-gradient(90deg, transparent, hsl(var(--vice-teal)), hsl(var(--vice-sunset)), hsl(var(--vice-pink)), transparent)',
            boxShadow: '0 0 20px hsl(var(--vice-sunset) / 0.5), 0 0 60px hsl(var(--vice-pink) / 0.3)',
          }}
        />

        {/* Card 3: DIGITAL EXPERIENCES */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0" style={{ opacity: 1 }}>
          <div className="card-hero-line" style={{ opacity: 0 }}>
            <span
              className="font-[family-name:var(--font-display)] font-bold tracking-tight block text-center"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                lineHeight: 1,
                color: 'hsl(var(--foreground))',
                textShadow: '0 4px 60px hsl(0 0% 0% / 0.5)',
              }}
            >
              DIGITAL
            </span>
          </div>
          <div className="card-hero-line" style={{ opacity: 0 }}>
            <span
              className="font-[family-name:var(--font-display)] font-bold tracking-tight block text-center italic"
              style={{
                fontSize: 'clamp(2rem, 6vw, 6rem)',
                lineHeight: 1.1,
                background: 'linear-gradient(90deg, hsl(var(--vice-teal)), hsl(var(--vice-sunset)), hsl(var(--vice-pink)))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 40px hsl(var(--vice-sunset) / 0.3))',
              }}
            >
              EXPERIENCES
            </span>
          </div>
        </div>

        {/* Card 4: REDEFINED */}
        <div className="card-accent absolute inset-0 flex items-center justify-center" style={{ opacity: 0, perspective: '800px' }}>
          <div className="relative">
            <span
              className="font-[family-name:var(--font-display)] font-bold tracking-[0.15em] uppercase block text-center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                color: 'hsl(var(--foreground))',
                textShadow: '0 0 80px hsl(var(--vice-sunset) / 0.4)',
              }}
            >
              REDEFINED
            </span>
            <div className="card-accent-glow absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
              <span
                className="font-[family-name:var(--font-display)] font-bold tracking-[0.15em] uppercase block text-center"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                  background: 'linear-gradient(90deg, hsl(var(--vice-pink)), hsl(var(--vice-sunset)), hsl(var(--vice-teal)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'blur(8px)',
                }}
              >
                REDEFINED
              </span>
            </div>
          </div>
        </div>

        {/* Final logo */}
        <div className="intro-logo-final absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ opacity: 0 }}>
          <img
            src="/images/focuss-dev-logo.png"
            alt="FOCUSS DEV"
            className="w-auto object-contain"
            style={{ height: 'clamp(36px, 5vw, 72px)' }}
          />
          <div className="flex items-center gap-3">
            <div className="h-[1px]" style={{ width: 'clamp(2rem, 4vw, 4rem)', background: 'linear-gradient(90deg, transparent, hsl(var(--vice-sunset)))' }} />
            <span
              className="font-[family-name:var(--font-display)] tracking-[0.5em] uppercase"
              style={{ fontSize: 'clamp(7px, 0.6vw, 10px)', color: 'hsl(var(--foreground) / 0.5)' }}
            >
              Studio Digital
            </span>
            <div className="h-[1px]" style={{ width: 'clamp(2rem, 4vw, 4rem)', background: 'linear-gradient(90deg, hsl(var(--vice-sunset)), transparent)' }} />
          </div>
        </div>
      </div>

      {/* Skip hint */}
      <div
        className="skip-hint absolute z-20 font-[family-name:var(--font-display)] tracking-[0.3em] uppercase"
        style={{
          bottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(8px, 0.7vw, 11px)',
          color: 'hsl(var(--foreground) / 0.4)',
          opacity: 0,
        }}
      >
        Toque para pular
      </div>

      {/* Bottom neon accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
        zIndex: 20,
        background: 'linear-gradient(90deg, transparent 5%, hsl(var(--vice-teal)) 20%, hsl(var(--vice-sunset)) 50%, hsl(var(--vice-pink)) 80%, transparent 95%)',
        boxShadow: '0 0 15px hsl(var(--vice-sunset) / 0.4)',
        opacity: 0.6,
      }} />
    </div>
  );
};

export default Intro;
