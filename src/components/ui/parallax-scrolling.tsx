import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayer {
  src: string;
  speed: number; // yPercent movement amount
  alt?: string;
  className?: string;
}

interface ParallaxHeroProps {
  layers: ParallaxLayer[];
  title: string;
  titleGradient: string;
  glowColor: string;
  accentHsl: string;
  gradient: string;
  subtitle: string;
  accentClass: string;
  overlay?: string;
  scroller?: string | HTMLElement;
}

export function ParallaxHero({
  layers,
  title,
  titleGradient,
  glowColor,
  accentHsl,
  gradient,
  subtitle,
  accentClass,
  overlay,
  scroller,
}: ParallaxHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const scrollerEl = scroller
      ? typeof scroller === 'string'
        ? el.closest(scroller)
        : scroller
      : undefined;

    const ctx = gsap.context(() => {
      // Animate each layer with different parallax speeds
      el.querySelectorAll<HTMLElement>('[data-parallax-layer]').forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallaxLayer || '0');
        gsap.to(layer, {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            scroller: scrollerEl || undefined,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Title layer parallax (slower, creates depth)
      const titleEl = el.querySelector('.parallax-title-layer');
      if (titleEl) {
        gsap.to(titleEl, {
          yPercent: 35,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            scroller: scrollerEl || undefined,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Fade content on scroll
      const contentEl = el.querySelector('.parallax-content-layer');
      if (contentEl) {
        gsap.to(contentEl, {
          opacity: 0,
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            scroller: scrollerEl || undefined,
            start: '30% top',
            end: '80% top',
            scrub: true,
          },
        });
      }

      // Entry line
      const divider = el.querySelector('.section-enter-line');
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, ease: 'power3.inOut', delay: 0.05 }
        );
      }

      // Title words reveal
      const titleWords = el.querySelectorAll('.title-word');
      if (titleWords.length) {
        gsap.fromTo(titleWords,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.15 }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [scroller]);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-end parallax-hero">
      <div className="absolute inset-0">
        {/* Entry line */}
        <div className="section-enter-line absolute top-0 left-0 right-0 h-[2px] origin-left z-20"
          style={{ background: gradient }} />

        {/* Parallax image layers */}
        {layers.map((layer, i) => (
          <div
            key={i}
            data-parallax-layer={layer.speed}
            className="absolute inset-0 will-change-transform"
            style={{ zIndex: i }}
          >
            <img
              src={layer.src}
              alt={layer.alt || ''}
              loading="eager"
              decoding="async"
              width={1920}
              height={1080}
              className={`w-full h-full object-cover ${layer.className || ''}`}
              style={{ filter: 'saturate(1.15) contrast(1.05)' }}
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" style={{ zIndex: layers.length + 1 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" style={{ zIndex: layers.length + 1 }} />
        <div className="absolute inset-0" style={{ zIndex: layers.length + 1, background: 'linear-gradient(180deg, transparent 30%, hsl(var(--background) / 0.6) 70%, hsl(var(--background)) 95%)' }} />
        {overlay && <div className="absolute inset-0" style={{ zIndex: layers.length + 1, background: overlay }} />}
      </div>

      {/* Title content */}
      <div className="parallax-content-layer relative w-full" style={{ zIndex: layers.length + 5, padding: `0 clamp(1.5rem, 4vw, 6rem) clamp(1rem, 3vw, 1.5rem)` }}>
        <div className="cin-subtitle hero-reveal hero-reveal-delay-1 flex items-center gap-3 mb-[clamp(0.5rem,1vw,1.5rem)]">
          <div className="h-[2px]" style={{ width: 'clamp(2rem, 3vw, 4rem)', background: gradient }} />
          <span className={`font-[family-name:var(--font-display)] tracking-[0.4em] uppercase ${accentClass}`} style={{ fontSize: 'clamp(9px, 0.8vw, 12px)', textShadow: `0 0 20px ${glowColor}` }}>{subtitle}</span>
          <div className="h-[2px]" style={{ width: 'clamp(1rem, 1.5vw, 2rem)', background: gradient, opacity: 0.4 }} />
        </div>

        <div className="parallax-title-layer relative">
          <div className="absolute inset-0 -z-10 pointer-events-none" style={{
            filter: 'blur(60px)',
            background: `radial-gradient(ellipse 80% 60% at 20% 60%, ${glowColor}, transparent 70%)`,
          }} />
          <h2 className="hero-reveal hero-reveal-delay-2 font-[family-name:var(--font-display)] font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: 'clamp(2.5rem, 9vw, 11rem)' }}>
            {title.split(' ').map((word, i) => (
              <span key={i} className="title-split-wrapper">
                <span
                  className="title-word"
                  style={{
                    display: 'inline-block',
                    background: titleGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.5))`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        <div className="hero-reveal hero-reveal-delay-3 absolute bottom-8 flex flex-col items-center gap-2 opacity-50" style={{ right: 'clamp(1.5rem, 3vw, 4rem)' }}>
          <span className={`font-[family-name:var(--font-display)] tracking-[0.25em] uppercase ${accentClass} opacity-60 [writing-mode:vertical-lr]`} style={{ fontSize: 'clamp(7px, 0.6vw, 9px)' }}>Role para baixo</span>
          <div className="w-[1px] animate-pulse" style={{ height: 'clamp(2rem, 3vw, 3rem)', background: `hsl(${accentHsl} / 0.4)` }} />
        </div>
      </div>
    </div>
  );
}
