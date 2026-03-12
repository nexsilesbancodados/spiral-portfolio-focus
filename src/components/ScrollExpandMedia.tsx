import React, { useEffect, useRef, useCallback } from 'react';

interface ScrollExpandMediaProps {
  mediaSrc: string;
  bgImageSrc: string;
  title: string;
  subtitle: string;
  details: string[];
  children?: React.ReactNode;
}

export function ScrollExpandMedia({
  mediaSrc,
  bgImageSrc,
  title,
  subtitle,
  details,
  children,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const contentOverlayRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const showContentRef = useRef(false);
  const touchStartRef = useRef(0);
  const isMobileRef = useRef(false);
  const rafRef = useRef(0);

  // Reset on media change
  useEffect(() => {
    progressRef.current = 0;
    expandedRef.current = false;
    showContentRef.current = false;
    applyProgress(0);
  }, [mediaSrc]);

  // Mobile detection
  useEffect(() => {
    const check = () => { isMobileRef.current = window.innerWidth < 768; };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Apply visual changes directly to DOM (no re-render)
  const applyProgress = useCallback((p: number) => {
    const mobile = isMobileRef.current;
    const mediaWidth = 260 + p * (mobile ? 600 : 1300);
    const mediaHeight = 300 + p * (mobile ? 300 : 500);
    const textX = p * (mobile ? 120 : 100);
    const bgScale = 1.1 - p * 0.1;
    const textOpacity = p > 0.8 ? 0 : 1;
    const hintOpacity = p > 0.3 ? 0 : 1;
    const darkOp = 0.5 - p * 0.4;
    const bgOp = 0.7 + p * 0.2;
    const borderR = 20 - p * 20;

    if (mediaBoxRef.current) {
      const s = mediaBoxRef.current.style;
      s.width = `${mediaWidth}px`;
      s.height = `${mediaHeight}px`;
      s.borderRadius = `${borderR}px`;
    }
    if (bgImgRef.current) {
      bgImgRef.current.style.transform = `scale(${bgScale})`;
    }
    if (bgOverlayRef.current) {
      bgOverlayRef.current.style.opacity = String(bgOp);
    }
    if (titleTopRef.current) {
      titleTopRef.current.style.transform = `translateX(-${textX}vw)`;
      titleTopRef.current.style.opacity = String(textOpacity);
    }
    if (titleBottomRef.current) {
      titleBottomRef.current.style.transform = `translateX(${textX}vw)`;
      titleBottomRef.current.style.opacity = String(textOpacity);
    }
    if (hintRef.current) {
      hintRef.current.style.opacity = String(hintOpacity);
    }
    if (darkOverlayRef.current) {
      darkOverlayRef.current.style.opacity = String(darkOp);
    }
    if (contentOverlayRef.current) {
      const show = showContentRef.current;
      contentOverlayRef.current.style.opacity = show ? '1' : '0';
      contentOverlayRef.current.style.pointerEvents = show ? 'auto' : 'none';
    }
  }, []);

  // Single effect for all event listeners — no state deps
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateProgress = (delta: number) => {
      const next = Math.min(Math.max(progressRef.current + delta, 0), 1);
      progressRef.current = next;

      if (next >= 1) {
        expandedRef.current = true;
        showContentRef.current = true;
      } else if (next < 0.75) {
        showContentRef.current = false;
      }

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyProgress(next));
    };

    const handleWheel = (e: WheelEvent) => {
      if (expandedRef.current && e.deltaY > 0) return;

      if (expandedRef.current && e.deltaY < 0) {
        const contentEl = contentRef.current;
        if (contentEl && contentEl.scrollTop <= 5) {
          expandedRef.current = false;
          showContentRef.current = false;
          e.preventDefault();
          applyProgress(progressRef.current);
          return;
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      updateProgress(e.deltaY * 0.0012);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartRef.current - touchY;

      if (expandedRef.current && deltaY < -20) {
        const contentEl = contentRef.current;
        if (contentEl && contentEl.scrollTop <= 5) {
          expandedRef.current = false;
          showContentRef.current = false;
          e.preventDefault();
          applyProgress(progressRef.current);
          return;
        }
        return;
      }

      if (!expandedRef.current) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        updateProgress(deltaY * factor);
        touchStartRef.current = touchY;
      }
    };

    const handleTouchEnd = () => { touchStartRef.current = 0; };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyProgress]);

  const firstWord = title.split(' ')[0] || '';
  const restOfTitle = title.split(' ').slice(1).join(' ');

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          ref={bgImgRef}
          src={bgImageSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ transform: 'scale(1.1)', willChange: 'transform' }}
        />
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 bg-background"
          style={{ opacity: 0.7 }}
        />
      </div>

      {/* Main expanding area */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Title that splits apart */}
        <div className="flex flex-col items-center gap-2 w-full relative z-10 pointer-events-none">
          <h2
            ref={titleTopRef}
            className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight"
            style={{ willChange: 'transform, opacity', transition: 'none' }}
          >
            {firstWord}
          </h2>
          <h2
            ref={titleBottomRef}
            className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight"
            style={{ willChange: 'transform, opacity', transition: 'none' }}
          >
            {restOfTitle}
          </h2>
        </div>

        {/* Subtitle + scroll hint */}
        <div
          ref={hintRef}
          className="flex flex-col items-center gap-3 mt-4 relative z-10"
          style={{ willChange: 'opacity', transition: 'none' }}
        >
          <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-accent">
            {subtitle}
          </span>
          <div className="flex flex-col items-center gap-1 text-muted-foreground/50 mt-2">
            <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase">
              Role para expandir
            </span>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1" className="animate-bounce opacity-60">
              <rect x="3" y="1" width="8" height="14" rx="4" />
              <line x1="7" y1="4" x2="7" y2="7" />
              <path d="M3 17l4 2 4-2" />
            </svg>
          </div>
        </div>

        {/* Expanding media box */}
        <div
          ref={mediaBoxRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden shadow-2xl"
          style={{
            width: '260px',
            height: '300px',
            maxWidth: '96vw',
            maxHeight: '94vh',
            borderRadius: '20px',
            willChange: 'width, height, border-radius',
          }}
        >
          <img
            src={mediaSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div
            ref={darkOverlayRef}
            className="absolute inset-0 bg-black/40"
            style={{ opacity: 0.5 }}
          />
        </div>

        {/* Revealed content after full expansion */}
        <div
          ref={contentOverlayRef}
          className="absolute inset-0 z-30 overflow-y-auto"
          style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity 0.6s ease' }}
        >
          <div className="min-h-screen flex flex-col justify-end">
            <div className="bg-gradient-to-t from-background via-background/90 to-transparent px-6 md:px-16 lg:px-24 pt-32 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="h-[2px] w-16 mb-6 bg-accent" />
                <span className="block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent">
                  {subtitle}
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight tracking-tight">
                  {title}
                </h2>
                <ul className="space-y-3 mb-8">
                  {details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                      <span className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
