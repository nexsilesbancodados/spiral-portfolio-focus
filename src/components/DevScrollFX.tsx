import React, { useEffect, useRef, useState } from 'react';

declare const gsap: any;

const devSections = [
  {
    title: 'Arquitetura',
    subtitle: 'Clean Code',
    description: 'Construímos sistemas com arquitetura limpa, separação de responsabilidades e código manutenível que escala com seu negócio.',
    stats: [
      { value: '100%', label: 'Type-Safe' },
      { value: 'SOLID', label: 'Principles' },
      { value: 'TDD', label: 'Approach' },
    ],
    bg: '/images/slide-03.jpg',
  },
  {
    title: 'APIs',
    subtitle: 'REST & GraphQL',
    description: 'APIs performáticas e bem documentadas. REST para simplicidade, GraphQL para flexibilidade — sempre com segurança e cache otimizado.',
    stats: [
      { value: '<50ms', label: 'Response' },
      { value: '99.9%', label: 'Uptime' },
      { value: 'OAuth2', label: 'Security' },
    ],
    bg: '/images/slide-01.jpg',
  },
  {
    title: 'DevOps',
    subtitle: 'CI/CD Pipeline',
    description: 'Deploy automatizado com pipelines robustos. Do commit ao production em minutos, com testes, linting e monitoramento integrados.',
    stats: [
      { value: '5min', label: 'Deploy' },
      { value: '100%', label: 'Automated' },
      { value: '24/7', label: 'Monitoring' },
    ],
    bg: '/images/slide-05.jpg',
  },
  {
    title: 'Database',
    subtitle: 'PostgreSQL',
    description: 'Bancos de dados otimizados com queries performáticas, migrations versionadas, backups automáticos e replicação para alta disponibilidade.',
    stats: [
      { value: '<10ms', label: 'Query Time' },
      { value: 'ACID', label: 'Compliant' },
      { value: 'Auto', label: 'Backups' },
    ],
    bg: '/images/slide-06.jpg',
  },
];

interface DevScrollFXProps {
  onBack: () => void;
}

export function DevScrollFX({ onBack }: DevScrollFXProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    // Animate in first section
    const els = container.querySelectorAll('.dev-section-0 .dev-anim');
    gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
  }, []);

  const goTo = (nextIndex: number) => {
    if (isAnimating.current || nextIndex < 0 || nextIndex >= devSections.length || nextIndex === activeIndex) return;
    isAnimating.current = true;
    const container = containerRef.current;
    if (!container || typeof gsap === 'undefined') return;

    const down = nextIndex > activeIndex;
    const currentEls = container.querySelectorAll(`.dev-section-${activeIndex} .dev-anim`);
    const nextEls = container.querySelectorAll(`.dev-section-${nextIndex} .dev-anim`);
    const currentBg = container.querySelector(`.dev-bg-${activeIndex}`);
    const nextBg = container.querySelector(`.dev-bg-${nextIndex}`);

    // Animate out current
    gsap.to(currentEls, {
      y: down ? -60 : 60,
      opacity: 0,
      duration: 0.5,
      stagger: down ? 0.03 : -0.03,
      ease: 'power3.in',
    });

    // Background transition
    if (currentBg) {
      gsap.to(currentBg, { opacity: 0, scale: 1.05, duration: 0.8, ease: 'power2.inOut' });
    }
    if (nextBg) {
      gsap.set(nextBg, { opacity: 0, scale: 1.08 });
      gsap.to(nextBg, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.inOut' });
    }

    // Animate in next
    gsap.set(nextEls, { y: down ? 60 : -60, opacity: 0 });
    gsap.to(nextEls, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: down ? 0.06 : -0.06,
      ease: 'power3.out',
      delay: 0.2,
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    setActiveIndex(nextIndex);
  };

  // Wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accum = 0;
    const threshold = 60;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      accum += e.deltaY;
      if (Math.abs(accum) > threshold) {
        goTo(activeIndex + (accum > 0 ? 1 : -1));
        accum = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating.current) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        goTo(activeIndex + (diff > 0 ? 1 : -1));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(activeIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'Escape') onBack();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onBack]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden select-none" tabIndex={0}>
      {/* Backgrounds */}
      {devSections.map((s, i) => (
        <div
          key={i}
          className={`dev-bg-${i} absolute inset-0 transition-none`}
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img src={s.bg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/85" />
        </div>
      ))}

      {/* Accent gradient overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-15" style={{ background: 'linear-gradient(135deg, hsl(45, 100%, 55%, 0.3) 0%, transparent 50%)' }} />

      {/* Back button */}
      <button
        className="absolute top-6 left-6 z-30 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase"
        onClick={onBack}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7" /></svg>
        Voltar
      </button>

      {/* Section counter */}
      <div className="absolute top-6 right-6 z-30 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] text-accent">
        {String(activeIndex + 1).padStart(2, '0')} <span className="text-foreground/30">/ {String(devSections.length).padStart(2, '0')}</span>
      </div>

      {/* Content sections */}
      {devSections.map((s, i) => (
        <div
          key={i}
          className={`dev-section-${i} absolute inset-0 flex items-center px-6 md:px-16 lg:px-24 ${i === activeIndex ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12">
            {/* Left: Text */}
            <div className="flex-1">
              <div className="dev-anim h-[2px] w-16 mb-6 origin-left bg-accent" style={{ opacity: i === 0 ? 1 : 0 }} />
              <span className="dev-anim block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent" style={{ opacity: i === 0 ? 1 : 0 }}>
                {s.subtitle}
              </span>
              <h2 className="dev-anim font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-light text-foreground mb-6 leading-none tracking-tighter" style={{ opacity: i === 0 ? 1 : 0 }}>
                {s.title}
              </h2>
              <p className="dev-anim text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl" style={{ opacity: i === 0 ? 1 : 0 }}>
                {s.description}
              </p>
            </div>

            {/* Right: Stats */}
            <div className="flex-shrink-0 flex flex-col gap-6 lg:gap-8">
              {s.stats.map((stat, si) => (
                <div key={si} className="dev-anim flex items-center gap-4" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light text-accent tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-[family-name:var(--font-display)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        {devSections.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === activeIndex ? 'bg-accent scale-150' : 'bg-foreground/20 hover:bg-foreground/40'}`}
            aria-label={`Ir para seção ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom scroll hint */}
      {activeIndex < devSections.length - 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-foreground/30">
          <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <svg className="animate-bounce" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14m-7-7l7 7 7-7" />
          </svg>
        </div>
      )}
    </div>
  );
}
