import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for video metadata to get duration, then sync loading bar
    const startLoading = () => {
      const duration = (video.duration || 6) * 1000; // video duration in ms
      const interval = 40;
      const step = (100 / duration) * interval;
      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + step;
          if (next >= 100) {
            clearInterval(timer);
            setTimeout(() => setFadeOut(true), 400);
            setTimeout(() => navigate('/home'), 1200);
            return 100;
          }
          return next;
        });
      }, interval);
      return timer;
    };

    let timer: ReturnType<typeof setInterval>;
    if (video.readyState >= 1) {
      timer = startLoading();
    } else {
      video.addEventListener('loadedmetadata', () => { timer = startLoading(); }, { once: true });
    }

    return () => { if (timer) clearInterval(timer); };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-end transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/intro.mp4"
        autoPlay
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Bottom loading section */}
      <div className="relative z-10 w-full space-y-4" style={{ padding: `0 clamp(1.5rem, 4vw, 3rem) clamp(2rem, 3vw, 4rem)` }}>
        {/* Loading text */}
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
          <span
            className="font-mono"
            style={{ color: 'hsl(var(--primary))', fontSize: 'clamp(9px, 0.8vw, 14px)' }}
          >
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>

        {/* GTA-style loading bar */}
        <div className="relative w-full rounded-full overflow-hidden bg-secondary/60 border border-border/30" style={{ height: 'clamp(4px, 0.4vw, 6px)' }}>
          <div
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, hsl(var(--vice-teal)), hsl(var(--vice-sunset)), hsl(var(--vice-pink)))`,
              boxShadow: '0 0 12px hsl(var(--vice-pink) / 0.5), 0 0 24px hsl(var(--vice-teal) / 0.3)',
            }}
          />
        </div>

        {/* Brand */}
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
