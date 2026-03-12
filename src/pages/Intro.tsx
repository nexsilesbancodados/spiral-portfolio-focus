import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let navigated = false;

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const pct = Math.min((video.currentTime / video.duration) * 100, 100);
      setProgress(pct);
    };

    const onEnded = () => {
      if (navigated) return;
      navigated = true;
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => navigate('/home'), 400);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    // Fallback: if video fails to load, skip after 1.5s
    const fallback = setTimeout(() => {
      if (!navigated) {
        navigated = true;
        setFadeOut(true);
        setTimeout(() => navigate('/home'), 300);
      }
    }, 8000);

    video.play().catch(() => {
      // Autoplay blocked — skip intro
      if (!navigated) {
        navigated = true;
        setFadeOut(true);
        setTimeout(() => navigate('/home'), 300);
      }
    });

    return () => {
      clearTimeout(fallback);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-end transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro.mp4"
        muted
        playsInline
        preload="auto"
      />

      {/* Fallback image */}
      <img
        className="absolute inset-0 w-full h-full object-cover -z-10"
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