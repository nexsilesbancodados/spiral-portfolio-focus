import React, { useEffect, useRef, useState, useCallback } from 'react';

declare const gsap: any;

const PROJECTS = [
  {
    client: 'STUDIO NOIR',
    project: 'BRAND IDENTITY & WEBSITE',
    category: 'UI/UX DESIGN',
    tools: 'FIGMA + FRAMER',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80',
  },
  {
    client: 'VORTEX LABS',
    project: 'ANALYTICS DASHBOARD',
    category: 'WEB APPLICATION',
    tools: 'REACT + TAILWIND',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
  },
  {
    client: 'AURORA TECH',
    project: 'SAAS LANDING PAGE',
    category: 'WEBSITE',
    tools: 'NEXT.JS + GSAP',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&q=80',
  },
  {
    client: 'MERIDIAN BANK',
    project: 'INTERNET BANKING',
    category: 'FINTECH APP',
    tools: 'REACT + NODE.JS',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=900&q=80',
  },
  {
    client: 'ZENITH CO.',
    project: 'E-COMMERCE PREMIUM',
    category: 'PLATAFORMA',
    tools: 'TYPESCRIPT + STRIPE',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
  },
  {
    client: 'PRISM DIGITAL',
    project: 'DESIGN SYSTEM',
    category: 'UI LIBRARY',
    tools: 'STORYBOOK + FIGMA',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80',
  },
  {
    client: 'WELLNESS APP',
    project: 'HEALTH TRACKER',
    category: 'MOBILE WEB APP',
    tools: 'REACT NATIVE',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
  },
  {
    client: 'NEON STUDIO',
    project: 'PORTFOLIO 3D',
    category: 'WEBSITE IMERSIVO',
    tools: 'THREE.JS + GSAP',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=80',
  },
  {
    client: 'ORBIT MEDIA',
    project: 'STREAMING PLATFORM',
    category: 'WEB APPLICATION',
    tools: 'NEXT.JS + AWS',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80',
  },
  {
    client: 'CARGO LOGISTICS',
    project: 'FLEET MANAGEMENT',
    category: 'DASHBOARD',
    tools: 'REACT + MAPBOX',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=900&q=80',
  },
  {
    client: 'FLAVOR HOUSE',
    project: 'RESTAURANT ORDERING',
    category: 'E-COMMERCE',
    tools: 'NEXT.JS + SUPABASE',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
  },
  {
    client: 'EDUCA+',
    project: 'LMS PLATFORM',
    category: 'PLATAFORMA EAD',
    tools: 'REACT + POSTGRESQL',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=900&q=80',
  },
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function scrambleText(el: HTMLElement, target: string, duration = 600) {
  const len = target.length;
  const start = performance.now();
  let frame: number;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    let result = '';
    for (let i = 0; i < len; i++) {
      const charProgress = Math.max(0, (progress - i / len / 2) * 2);
      if (charProgress >= 1) {
        result += target[i];
      } else {
        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    el.textContent = result;
    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    }
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function WebDesignPortfolio() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const bgRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleAnimRef = useRef<any>(null);
  const scrambleCancels = useRef<(() => void)[]>([]);

  // Lazy preload images on hover
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    
    const timeout = setTimeout(() => {
      PROJECTS.slice(0, 3).forEach(p => preloadImage(p.image));
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const startIdleAnimation = useCallback(() => {
    if (typeof gsap === 'undefined' || idleAnimRef.current) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    rowRefs.current.forEach((item, i) => {
      if (!item) return;
      tl.to(item, { opacity: 0.08, duration: 0.12, ease: 'power2.inOut' }, i * 0.06);
      tl.to(item, { opacity: 1, duration: 0.12, ease: 'power2.inOut' }, (PROJECTS.length * 0.06 * 0.5) + i * 0.06);
    });
    idleAnimRef.current = tl;
  }, []);

  const stopIdleAnimation = useCallback(() => {
    if (idleAnimRef.current) {
      idleAnimRef.current.kill();
      idleAnimRef.current = null;
      rowRefs.current.forEach((item) => {
        if (item && typeof gsap !== 'undefined') gsap.set(item, { opacity: 1 });
      });
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) startIdleAnimation();
    }, 4000);
  }, [activeIndex, startIdleAnimation]);

  useEffect(() => {
    startIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleAnimation]);

  const handleEnter = useCallback((index: number) => {
    stopIdleAnimation();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setActiveIndex(index);

    // Scramble text in the row
    scrambleCancels.current.forEach((c) => c());
    scrambleCancels.current = [];
    const row = rowRefs.current[index];
    if (row) {
      const cells = row.querySelectorAll<HTMLSpanElement>('[data-field]');
      cells.forEach((cell) => {
        const original = cell.getAttribute('data-original') || '';
        const cancel = scrambleText(cell, original, 500);
        scrambleCancels.current.push(cancel);
      });
    }

    // Background image
    const bg = bgRef.current;
    if (bg && typeof gsap !== 'undefined') {
      bg.style.backgroundImage = `url(${PROJECTS[index].image})`;
      gsap.to(bg, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
    }
  }, [stopIdleAnimation]);

  const handleLeave = useCallback(() => {
    setActiveIndex(-1);
    scrambleCancels.current.forEach((c) => c());
    scrambleCancels.current = [];
    const bg = bgRef.current;
    if (bg && typeof gsap !== 'undefined') {
      gsap.to(bg, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    }
    startIdleTimer();
  }, [startIdleTimer]);

  return (
    <div className="anim-el w-full mt-10">
      {/* Hover background */}
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center"
        style={{ opacity: 0, transform: 'scale(1.05)', filter: 'brightness(0.3) saturate(1.2)' }}
      />

      {/* Header row */}
      <div className="relative z-10 grid grid-cols-5 gap-2 px-2 py-3 border-b border-accent/20 font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-accent/60">
        <span>Cliente</span>
        <span>Projeto</span>
        <span>Categoria</span>
        <span>Ferramentas</span>
        <span className="text-right">Ano</span>
      </div>

      {/* Project rows */}
      <div onMouseLeave={handleLeave} className="relative z-10">
        {PROJECTS.map((project, i) => (
          <div
            key={i}
            ref={(el) => { rowRefs.current[i] = el; }}
            onMouseEnter={() => handleEnter(i)}
            className={`grid grid-cols-5 gap-2 px-2 py-4 cursor-pointer border-b transition-colors duration-300 ${
              activeIndex === i
                ? 'border-accent/40 bg-accent/5'
                : 'border-border/30 hover:border-accent/20'
            }`}
          >
            <span
              data-field="client"
              data-original={project.client}
              className={`font-[family-name:var(--font-display)] text-xs md:text-sm tracking-wider transition-all duration-300 ${
                activeIndex === i ? 'text-accent' : activeIndex === -1 ? 'text-foreground/80' : 'text-foreground/25'
              }`}
            >
              {project.client}
            </span>
            <span
              data-field="project"
              data-original={project.project}
              className={`font-[family-name:var(--font-display)] text-xs md:text-sm tracking-wider transition-all duration-300 ${
                activeIndex === i ? 'text-foreground' : activeIndex === -1 ? 'text-foreground/70' : 'text-foreground/20'
              }`}
            >
              {project.project}
            </span>
            <span
              data-field="category"
              data-original={project.category}
              className={`text-[10px] md:text-xs tracking-wider transition-all duration-300 ${
                activeIndex === i ? 'text-foreground/80' : activeIndex === -1 ? 'text-muted-foreground' : 'text-foreground/15'
              }`}
            >
              {project.category}
            </span>
            <span
              data-field="tools"
              data-original={project.tools}
              className={`text-[10px] md:text-xs tracking-wider transition-all duration-300 ${
                activeIndex === i ? 'text-foreground/80' : activeIndex === -1 ? 'text-muted-foreground' : 'text-foreground/15'
              }`}
            >
              {project.tools}
            </span>
            <span
              data-field="year"
              data-original={project.year}
              className={`text-[10px] md:text-xs tracking-wider text-right transition-all duration-300 ${
                activeIndex === i ? 'text-accent/80' : activeIndex === -1 ? 'text-muted-foreground' : 'text-foreground/15'
              }`}
            >
              {project.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
