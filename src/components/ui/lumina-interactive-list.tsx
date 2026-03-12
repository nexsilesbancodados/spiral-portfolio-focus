import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

interface Slide {
  title: string;
  description: string;
  media: string;
  video?: string;
  skills: string[];
}

const slides: Slide[] = [
  { title: 'FOCUSS DEV', description: 'Transformando ideias em experiências digitais extraordinárias. Desenvolvimento web de alto nível.', media: '/images/slide-01.jpg', skills: ['React', 'TypeScript', 'Node.js', 'Next.js'] },
  { title: 'Web Design', description: 'Interfaces modernas e elegantes que conectam marcas ao futuro digital com impacto visual.', media: '/images/hero-webdesign.jpg', video: '/videos/slide-02.mp4', skills: ['Figma', 'UI/UX', 'Prototipagem', 'Design System'] },
  { title: 'Desenvolvimento', description: 'Código limpo, performance máxima e arquitetura escalável para projetos robustos.', media: '/images/hero-dev.jpg', video: '/videos/slide-03.mp4', skills: ['JavaScript', 'Python', 'APIs REST', 'PostgreSQL'] },
  { title: 'Serviços', description: 'Soluções digitais completas — tráfego pago, sites, apps, SaaS e design premium.', media: '/images/hero-servicos.jpg', video: '/videos/slide-04.mp4', skills: ['Tráfego Pago', 'Sites', 'Apps', 'SaaS'] },
  { title: 'Inovação e IA', description: 'Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença.', media: '/images/hero-ia.jpg', skills: ['IA', 'Automação', 'Chatbots', 'Cloud'] },
  { title: 'Mobile e Web', description: 'Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo.', media: '/images/hero-mobile.jpg', skills: ['React Native', 'PWA', 'Responsivo', 'Docker'] },
  { title: 'Skills', description: 'Domínio completo do ecossistema moderno — front-end, back-end, cloud e design em um só lugar.', media: '/images/hero-skills.jpg', skills: ['React', 'Node.js', 'Python', 'AWS'] },
];

function SlideMedia({ slide, isActive, eager, style }: { slide: Slide; isActive: boolean; eager?: boolean; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  const filter = 'saturate(1.08) contrast(1.03)';

  if (slide.video) {
    return (
      <div className="absolute inset-0" style={style}>
        <img
          src={slide.media}
          alt={slide.title}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter }}
        />
        <video
          ref={videoRef}
          src={slide.video}
          muted
          loop
          playsInline
          preload={eager ? 'auto' : 'none'}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter }}
        />
      </div>
    );
  }

  return (
    <img
      src={slide.media}
      alt={slide.title}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter, ...style }}
    />
  );
}

export function LuminaSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(() => new Set([0]));

  const current = useMemo(() => slides[currentSlide], [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    const bounded = (index + slides.length) % slides.length;
    if (bounded === currentSlide || isTransitioning) return;

    setLoadedSlides(prev => {
      if (prev.has(bounded)) return prev;
      const next = new Set(prev);
      next.add(bounded);
      return next;
    });

    setIsTransitioning(true);
    setPrevSlide(currentSlide);
    setCurrentSlide(bounded);

    setTimeout(() => {
      setPrevSlide(null);
      setIsTransitioning(false);
    }, 600);
  }, [currentSlide, isTransitioning]);

  const triggerExplore = useCallback(() => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: currentSlide } }));
  }, [currentSlide]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelAccum = 0;
    let wheelCooldown = false;

    const handleWheel = (e: WheelEvent) => {
      if (wheelCooldown) return;
      wheelAccum += e.deltaY;

      if (wheelAccum > 120) {
        wheelCooldown = true;
        triggerExplore();
        wheelAccum = 0;
        window.setTimeout(() => { wheelCooldown = false; }, 900);
      }
      if (wheelAccum < 0) { wheelAccum = 0; }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [triggerExplore]);

  // Preload adjacent slides after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedSlides(prev => {
        const next = new Set(prev);
        next.add((currentSlide + 1) % slides.length);
        if (currentSlide > 0) next.add(currentSlide - 1);
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <main className="slider-wrapper loaded" ref={containerRef}>
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          if (!loadedSlides.has(index)) return null;
          const isActive = index === currentSlide;
          const isLeaving = index === prevSlide;
          return (
            <SlideMedia
              key={slide.title}
              slide={slide}
              isActive={isActive || isLeaving}
              eager={index === 0}
              style={{
                opacity: isActive ? 1 : isLeaving ? 0 : 0,
                transform: isActive ? 'scale(1)' : isLeaving ? 'scale(1.08)' : 'scale(1)',
                transition: 'opacity 0.6s ease, transform 0.8s ease',
                zIndex: isActive ? 2 : isLeaving ? 1 : 0,
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" style={{ zIndex: 3 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-transparent" style={{ zIndex: 3 }} />
      </div>

      {/* Ambient glow that follows slide accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none" style={{ 
        zIndex: 4,
        background: 'radial-gradient(ellipse at 90% 10%, hsl(var(--primary) / 0.06), transparent 60%)',
        transition: 'opacity 0.8s ease',
      }} />

      {/* Slide counter - vertical style */}
      <div className="absolute z-10 flex items-center gap-3" style={{ top: 'clamp(1rem, 2vw, 2rem)', left: 'clamp(1.25rem, 2.5vw, 2.5rem)' }}>
        <span className="font-[family-name:var(--font-display)] text-primary tracking-wider" style={{ fontSize: 'clamp(11px, 1vw, 16px)' }}>
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <div className="h-[1px] bg-foreground/20" style={{ width: 'clamp(1.5rem, 2vw, 3rem)' }} />
        <span className="font-[family-name:var(--font-display)] text-foreground/30 tracking-wider" style={{ fontSize: 'clamp(9px, 0.8vw, 12px)' }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Side navigation arrows */}
      <button
        onClick={() => goToSlide(currentSlide - 1)}
        className="absolute z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-background/20 text-foreground/50 hover:text-foreground hover:border-foreground/30 hover:bg-background/40 transition-all duration-300 backdrop-blur-sm"
        style={{ left: 'clamp(1.25rem, 2.5vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)' }}
        aria-label="Slide anterior"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 bg-background/20 text-foreground/50 hover:text-foreground hover:border-foreground/30 hover:bg-background/40 transition-all duration-300 backdrop-blur-sm"
        style={{ right: 'clamp(1.25rem, 2.5vw, 2.5rem)', top: '50%', transform: 'translateY(-50%)' }}
        aria-label="Próximo slide"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      <div className="slide-content" key={currentSlide}>
        <h1 className="slide-title slide-transition-title">{current.title}</h1>
        <p className="slide-description slide-transition-desc">{current.description}</p>
        <div className="slide-skills slide-transition-skills">
          {current.skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      {/* Bottom navigation with animated progress */}
      <nav className="slides-navigation" aria-label="Navegação de seções">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => goToSlide(index)}
            className={`slide-nav-item ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Ir para ${slide.title}`}
          >
            <div className="slide-progress-line">
              <div className="slide-progress-fill" style={{ 
                width: index === currentSlide ? '100%' : '0%',
                transition: index === currentSlide ? 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)' : 'width 0.2s ease',
              }} />
            </div>
            <div className="slide-nav-title">{slide.title}</div>
          </button>
        ))}
      </nav>

      <button className="explore-btn" onClick={triggerExplore} aria-label="Explorar seção atual">
        <span className="explore-btn-text">Explorar</span>
        <svg className="explore-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 5v14m-7-7l7 7 7-7" />
        </svg>
      </button>
    </main>
  );
}