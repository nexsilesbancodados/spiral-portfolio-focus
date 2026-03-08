import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset on mount
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaSrc]);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Wheel + touch handlers scoped to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If fully expanded and scrolling down, let content scroll
      if (mediaFullyExpanded && e.deltaY > 0) return;

      // If fully expanded and scrolling up, check if content is at top
      if (mediaFullyExpanded && e.deltaY < 0) {
        const contentEl = contentRef.current;
        if (contentEl && contentEl.scrollTop <= 5) {
          setMediaFullyExpanded(false);
          setShowContent(false);
          e.preventDefault();
          return;
        }
        return;
      }

      // Not yet expanded — hijack scroll
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY * 0.0012;
      const next = Math.min(Math.max(scrollProgress + delta, 0), 1);
      setScrollProgress(next);

      if (next >= 1) {
        setMediaFullyExpanded(true);
        setShowContent(true);
      } else if (next < 0.75) {
        setShowContent(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20) {
        const contentEl = contentRef.current;
        if (contentEl && contentEl.scrollTop <= 5) {
          setMediaFullyExpanded(false);
          setShowContent(false);
          e.preventDefault();
          return;
        }
        return;
      }

      if (!mediaFullyExpanded) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
        setScrollProgress(next);

        if (next >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (next < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => setTouchStartY(0);

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const mediaWidth = 260 + scrollProgress * (isMobile ? 600 : 1300);
  const mediaHeight = 300 + scrollProgress * (isMobile ? 300 : 500);
  const textTranslateX = scrollProgress * (isMobile ? 120 : 100);
  const bgScale = 1.1 - scrollProgress * 0.1;
  const bgOpacity = 0.6 - scrollProgress * 0.4;

  const firstWord = title.split(' ')[0] || '';
  const restOfTitle = title.split(' ').slice(1).join(' ');

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImageSrc}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: `scale(${bgScale})` }}
        />
        <div
          className="absolute inset-0 bg-background transition-opacity duration-500"
          style={{ opacity: 0.7 + scrollProgress * 0.2 }}
        />
      </div>

      {/* Main expanding area */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Title that splits apart */}
        <div className="flex flex-col items-center gap-2 w-full relative z-10 pointer-events-none">
          <motion.h2
            className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight"
            style={{ transform: `translateX(-${textTranslateX}vw)` }}
            animate={{ opacity: scrollProgress > 0.8 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {firstWord}
          </motion.h2>
          <motion.h2
            className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight"
            style={{ transform: `translateX(${textTranslateX}vw)` }}
            animate={{ opacity: scrollProgress > 0.8 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Subtitle + scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-3 mt-4 relative z-10"
          animate={{ opacity: scrollProgress > 0.3 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
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
        </motion.div>

        {/* Expanding media box */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden shadow-2xl"
          style={{
            width: `${mediaWidth}px`,
            height: `${mediaHeight}px`,
            maxWidth: '96vw',
            maxHeight: '94vh',
            borderRadius: `${20 - scrollProgress * 20}px`,
            transition: 'border-radius 0.2s ease',
          }}
        >
          <img
            src={mediaSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay that fades */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            animate={{ opacity: 0.5 - scrollProgress * 0.4 }}
            transition={{ duration: 0.15 }}
          />
        </div>

        {/* Revealed content after full expansion */}
        <motion.div
          ref={contentRef}
          className="absolute inset-0 z-30 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ pointerEvents: showContent ? 'auto' : 'none' }}
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
        </motion.div>
      </div>
    </div>
  );
}
