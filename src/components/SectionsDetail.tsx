import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { WebDesignPortfolio } from '@/components/WebDesignPortfolio';
import { ScrollExpandMedia } from '@/components/ScrollExpandMedia';
import { PlatformerGame } from '@/components/PlatformerGame';

declare const gsap: any;

const sections = [
  {
    id: 'focuss-dev',
    subtitle: 'Quem Somos',
    title: 'FOCUSS DEV',
    description: 'Somos uma equipe apaixonada por tecnologia e inovação. Na FOCUSS DEV, transformamos ideias em experiências digitais extraordinárias, combinando design de alto impacto com código robusto e escalável.',
    details: [
      'Mais de 5 anos de experiência em desenvolvimento web',
      'Projetos entregues para startups e grandes empresas',
      'Foco em performance, acessibilidade e experiência do usuário',
      'Metodologias ágeis e entrega contínua',
    ],
    image: '/images/slide-01.jpg',
  },
  {
    id: 'web-design',
    subtitle: 'Criação Visual',
    title: 'Web Design',
    description: 'Interfaces modernas e elegantes que conectam marcas ao futuro digital. Nosso processo de design combina pesquisa de usuário, prototipagem rápida e uma estética visual impactante.',
    details: [
      'Design responsivo e mobile-first',
      'Prototipagem interativa no Figma',
      'Criação de Design Systems consistentes',
      'Testes de usabilidade e iteração contínua',
    ],
    image: '/images/slide-02.jpg',
  },
  {
    id: 'desenvolvimento',
    subtitle: 'Código & Performance',
    title: 'Desenvolvimento',
    description: 'Código limpo, performance máxima e arquitetura escalável. Utilizamos as melhores práticas e tecnologias modernas para construir aplicações robustas e de alta qualidade.',
    details: [
      'Arquitetura limpa e código manutenível',
      'APIs REST e GraphQL performáticas',
      'Integração contínua e deploy automatizado',
      'Banco de dados otimizados com PostgreSQL',
    ],
    image: '/images/slide-03.jpg',
  },
  {
    id: 'design-interface',
    subtitle: 'UI/UX Premium',
    title: 'Design de Interface',
    description: 'Design centrado no usuário com estética cinematográfica e animações fluidas. Cada pixel é pensado para criar experiências memoráveis e intuitivas.',
    details: [
      'Animações fluidas com GSAP e Framer Motion',
      'Interfaces 3D interativas com Three.js',
      'Estilização avançada com Tailwind CSS',
      'Micro-interações que encantam o usuário',
    ],
    image: '/images/slide-04.jpg',
  },
  {
    id: 'inovacao-ia',
    subtitle: 'Futuro Digital',
    title: 'Inovação e IA',
    description: 'Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença. Integramos IA nos nossos projetos para criar experiências inteligentes e personalizadas.',
    details: [
      'Integração com modelos de Machine Learning',
      'Automação inteligente de processos',
      'Infraestrutura cloud escalável na AWS',
      'Chatbots e assistentes virtuais customizados',
    ],
    image: '/images/slide-05.jpg',
  },
  {
    id: 'mobile-web',
    subtitle: 'Multiplataforma',
    title: 'Mobile e Web',
    description: 'Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo. Do mobile ao desktop, garantimos consistência e performance.',
    details: [
      'Apps nativos com React Native',
      'Progressive Web Apps (PWA)',
      'Layouts 100% responsivos',
      'Deploy containerizado com Docker',
    ],
    image: '/images/slide-06.jpg',
  },
  {
    id: 'skills',
    subtitle: 'Competências Técnicas',
    title: 'Skills',
    description: 'Domínio completo do ecossistema de desenvolvimento moderno. Das linguagens de programação aos frameworks mais avançados, cada skill é refinada com prática e projetos reais.',
    details: [
      'React, Next.js, TypeScript — Front-end de alta performance',
      'Node.js, Python, Go — Back-end escalável e robusto',
      'PostgreSQL, MongoDB, Redis — Dados otimizados e resilientes',
      'AWS, Docker, CI/CD — Infraestrutura cloud automatizada',
      'Figma, GSAP, Three.js — Design e animações cinematográficas',
      'Git, Scrum, TDD — Processos ágeis e código confiável',
    ],
    image: '/images/slide-07.jpg',
  },
];

// Per-section detail images
const sectionGallery: Record<string, { images: { src: string; label: string }[]; layout: 'panoramic-duo' | 'trio' | 'asymmetric' | 'stacked' }> = {
  'web-design': {
    layout: 'panoramic-duo',
    images: [
      { src: '/images/webdesign-detail-03.jpg', label: 'Studio' },
      { src: '/images/webdesign-detail-01.jpg', label: 'Prototipagem' },
      { src: '/images/webdesign-detail-02.jpg', label: 'Criação' },
    ],
  },
  'desenvolvimento': {
    layout: 'asymmetric',
    images: [
      { src: '/images/dev-detail-01.jpg', label: 'Infraestrutura' },
      { src: '/images/dev-detail-02.jpg', label: 'Código' },
    ],
  },
  'inovacao-ia': {
    layout: 'trio',
    images: [
      { src: '/images/ia-detail-01.jpg', label: 'Laboratório IA' },
      { src: '/images/ia-detail-02.jpg', label: 'Automação' },
      { src: '/images/slide-05.jpg', label: 'Futuro' },
    ],
  },
  'mobile-web': {
    layout: 'stacked',
    images: [
      { src: '/images/mobile-detail-01.jpg', label: 'Multiplataforma' },
      { src: '/images/mobile-detail-02.jpg', label: 'Lifestyle' },
    ],
  },
  'skills': {
    layout: 'panoramic-duo',
    images: [
      { src: '/images/skills-detail-01.jpg', label: 'Conferência' },
      { src: '/images/skills-detail-02.jpg', label: 'Workspace' },
      { src: '/images/slide-07.jpg', label: 'Ecossistema' },
    ],
  },
};

// Per-section GSAP scroll animation type
type ScrollEffectType = 'fade-slide' | 'scale-reveal' | 'horizontal-wipe' | 'stagger-cascade' | 'clip-expand';
const sectionScrollEffect: Record<string, ScrollEffectType> = {
  'web-design': 'fade-slide',
  'desenvolvimento': 'scale-reveal',
  'design-interface': 'horizontal-wipe',
  'inovacao-ia': 'clip-expand',
  'mobile-web': 'stagger-cascade',
  'skills': 'horizontal-wipe',
};

// ─── Lightweight cinematic section layout ─────────────────────────
function CinematicSection({ section, isVisible, onScrollUpAtTop }: { section: typeof sections[0]; isVisible: boolean; onScrollUpAtTop: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const isWebDesign = section.id === 'web-design';
  const isDesenvolvimento = section.id === 'desenvolvimento';
  const effect = sectionScrollEffect[section.id] || 'fade-slide';
  const gallery = sectionGallery[section.id];

  // Unique GSAP scroll-triggered effects per section
  useEffect(() => {
    if (typeof gsap === 'undefined' || !sectionRef.current) return;
    const el = sectionRef.current;
    
    // Hero title entrance animation
    const titleWords = el.querySelectorAll('.title-word');
    const subtitle = el.querySelector('.cin-subtitle');
    const desc = el.querySelector('.cin-desc');
    const galleryEls = el.querySelectorAll('.gallery-item');
    const detailEls = el.querySelectorAll('.detail-item');

    // Different hero entrance per effect type
    switch (effect) {
      case 'fade-slide':
        gsap.fromTo(titleWords, { y: 80, opacity: 0, rotationX: 15 }, { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo(subtitle, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 });
        break;
      case 'scale-reveal':
        gsap.fromTo(titleWords, { scale: 1.4, opacity: 0, filter: 'blur(8px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
        gsap.fromTo(subtitle, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.5 });
        break;
      case 'horizontal-wipe':
        gsap.fromTo(titleWords, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.3 });
        gsap.fromTo(subtitle, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 });
        break;
      case 'clip-expand':
        gsap.fromTo(titleWords, { y: 60, opacity: 0, skewY: 5 }, { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.4 });
        gsap.fromTo(subtitle, { scaleX: 0, opacity: 0, transformOrigin: 'left' }, { scaleX: 1, opacity: 1, duration: 0.8, delay: 0.3 });
        break;
      case 'stagger-cascade':
        gsap.fromTo(titleWords, { y: 100, opacity: 0, rotationZ: -3 }, { y: 0, opacity: 1, rotationZ: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.2)', delay: 0.3 });
        gsap.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2 });
        break;
    }

    // Description fade
    gsap.fromTo(desc, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 });

    // Scroll-triggered gallery animations
    const scrollHandler = () => {
      const scrollTop = el.scrollTop;
      const vh = window.innerHeight;

      galleryEls.forEach((item, i) => {
        const rect = (item as HTMLElement).getBoundingClientRect();
        const visible = rect.top < vh * 0.85;
        if (!visible) return;
        if ((item as HTMLElement).dataset.animated) return;
        (item as HTMLElement).dataset.animated = 'true';

        switch (effect) {
          case 'fade-slide':
            gsap.fromTo(item, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power2.out' });
            break;
          case 'scale-reveal':
            gsap.fromTo(item, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, delay: i * 0.12, ease: 'power2.out' });
            break;
          case 'horizontal-wipe':
            gsap.fromTo(item, { x: i % 2 === 0 ? -80 : 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, delay: i * 0.1, ease: 'power3.out' });
            break;
          case 'clip-expand':
            gsap.fromTo(item, { clipPath: 'inset(20% 20% 20% 20%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.2, delay: i * 0.15, ease: 'power2.out' });
            break;
          case 'stagger-cascade':
            gsap.fromTo(item, { y: 80, opacity: 0, rotationZ: -2 }, { y: 0, opacity: 1, rotationZ: 0, duration: 0.9, delay: i * 0.18, ease: 'back.out(1.1)' });
            break;
        }
      });

      // Detail items scroll reveal
      detailEls.forEach((item, i) => {
        const rect = (item as HTMLElement).getBoundingClientRect();
        if (rect.top > vh * 0.9 || (item as HTMLElement).dataset.animated) return;
        (item as HTMLElement).dataset.animated = 'true';
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out' });
      });
    };

    el.addEventListener('scroll', scrollHandler, { passive: true });
    return () => el.removeEventListener('scroll', scrollHandler);
  }, [section.id, effect]);

  // Scroll-up at top → go back to slider
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let accum = 0;
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollTop <= 5 && e.deltaY < 0) {
        accum += Math.abs(e.deltaY);
        if (accum > 100) { accum = 0; onScrollUpAtTop(); }
      } else { accum = 0; }
    };
    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [onScrollUpAtTop]);

  // Render gallery based on layout type
  const renderGallery = () => {
    if (!gallery) {
      return (
        <div className="gallery-item relative w-full h-[40vh] md:h-[50vh] overflow-hidden" style={{ opacity: 0 }}>
          <img src={section.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>
      );
    }

    const imgs = gallery.images;
    const imgStyle = { filter: 'brightness(0.75) saturate(1.25) contrast(1.08)' };
    const labelCls = "font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-sunset/80";

    switch (gallery.layout) {
      case 'panoramic-duo':
        return (
          <div className="space-y-0">
            <div className="gallery-item relative w-full h-[40vh] md:h-[50vh] overflow-hidden" style={{ opacity: 0 }}>
              <img src={imgs[0].src} alt={imgs[0].label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
              {imgs.slice(1).map((img, i) => (
                <div key={i} className="gallery-item relative h-[35vh] md:h-[45vh] overflow-hidden" style={{ opacity: 0 }}>
                  <img src={img.src} alt={img.label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.15)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6"><span className={labelCls}>{img.label}</span></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'asymmetric':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            <div className="gallery-item md:col-span-2 relative h-[45vh] md:h-[60vh] overflow-hidden" style={{ opacity: 0 }}>
              <img src={imgs[0].src} alt={imgs[0].label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6"><span className={labelCls}>{imgs[0].label}</span></div>
            </div>
            <div className="gallery-item relative h-[45vh] md:h-[60vh] overflow-hidden" style={{ opacity: 0 }}>
              <img src={imgs[1].src} alt={imgs[1].label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6"><span className={labelCls}>{imgs[1].label}</span></div>
            </div>
          </div>
        );
      case 'trio':
        return (
          <div className="space-y-[2px]">
            <div className="gallery-item relative w-full h-[35vh] md:h-[45vh] overflow-hidden" style={{ opacity: 0 }}>
              <img src={imgs[0].src} alt={imgs[0].label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={imgStyle} />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
              <div className="absolute bottom-6 left-6"><span className={labelCls}>{imgs[0].label}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-[2px]">
              {imgs.slice(1).map((img, i) => (
                <div key={i} className="gallery-item relative h-[30vh] md:h-[40vh] overflow-hidden" style={{ opacity: 0 }}>
                  <img src={img.src} alt={img.label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.15)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6"><span className={labelCls}>{img.label}</span></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stacked':
        return (
          <div className="space-y-[2px]">
            {imgs.map((img, i) => (
              <div key={i} className="gallery-item relative w-full h-[40vh] md:h-[50vh] overflow-hidden" style={{ opacity: 0 }}>
                <img src={img.src} alt={img.label} loading="lazy" decoding="async" className="w-full h-full object-cover" style={imgStyle} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
                <div className="absolute bottom-6 left-6"><span className={labelCls}>{img.label}</span></div>
              </div>
            ))}
          </div>
        );
    }
  };

  // Per-section Vice City color overlay
  const viceOverlay = (() => {
    switch (section.id) {
      case 'web-design': return 'linear-gradient(135deg, hsl(25 95% 55% / 0.12), hsl(335 75% 55% / 0.08), transparent 70%)';
      case 'desenvolvimento': return 'linear-gradient(225deg, hsl(175 70% 45% / 0.12), hsl(200 60% 50% / 0.08), transparent 60%)';
      case 'inovacao-ia': return 'linear-gradient(180deg, hsl(335 75% 55% / 0.1), hsl(25 95% 55% / 0.08), transparent)';
      case 'mobile-web': return 'linear-gradient(135deg, hsl(40 100% 50% / 0.1), hsl(175 70% 45% / 0.06), transparent 70%)';
      case 'skills': return 'linear-gradient(225deg, hsl(25 95% 55% / 0.1), hsl(335 75% 55% / 0.06), transparent 60%)';
      default: return 'none';
    }
  })();

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-y-auto gta-vi-scroll">
      {/* ── HERO ── */}
      <div className="relative h-screen w-full overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img src={section.image} alt={section.title} loading="eager" decoding="async" className="w-full h-full object-cover" style={{ filter: 'saturate(1.15) contrast(1.05)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, hsl(var(--background)) 100%)' }} />
          {/* Vice City color wash */}
          <div className="absolute inset-0" style={{ background: viceOverlay }} />
        </div>

        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
          <div className="cin-subtitle flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
            <div className="h-[1px] w-12" style={{ background: 'linear-gradient(90deg, hsl(25 95% 55%), hsl(335 75% 55%))' }} />
            <span className="font-[family-name:var(--font-display)] text-[11px] md:text-xs tracking-[0.3em] uppercase text-vice-sunset">{section.subtitle}</span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] font-bold text-foreground leading-[0.85] tracking-tighter uppercase">
            {section.title.split(' ').map((word, i) => (
              <span key={i} className="title-word block" style={{ opacity: 0 }}>{word}</span>
            ))}
          </h2>
          <div className="absolute bottom-8 right-6 md:right-16 flex flex-col items-center gap-2 opacity-50">
            <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.25em] uppercase text-vice-sunset/60 [writing-mode:vertical-lr]">Role para baixo</span>
            <div className="w-[1px] h-12 bg-vice-sunset/40 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 bg-background">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="cin-desc px-6 md:px-16 lg:px-24 py-16 md:py-24" style={{ opacity: 0 }}>
          <div className="max-w-5xl">
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 leading-relaxed font-light tracking-tight">{section.description}</p>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef}>{renderGallery()}</div>

        {/* Details grid */}
        <div ref={detailsRef} className="px-6 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl">
            {section.details.map((detail, i) => (
              <div key={i} className="detail-item group flex items-start gap-4" style={{ opacity: 0 }}>
                <span className="font-[family-name:var(--font-display)] text-accent/40 text-sm tracking-widest mt-1">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="h-[1px] w-8 bg-accent/30 mb-4 group-hover:w-16 group-hover:bg-accent/60 transition-all duration-500" />
                  <p className="text-foreground/80 text-base md:text-lg leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section-specific content */}
        {isWebDesign && isVisible && (
          <div className="px-6 md:px-16 lg:px-24 pb-24"><WebDesignPortfolio /></div>
        )}
        {isDesenvolvimento && isVisible && (
          <div className="px-6 md:px-16 lg:px-24 pb-24 flex justify-center"><PlatformerGame /></div>
        )}

        <div className="h-16 md:h-24" />
      </div>
    </div>
  );
}

export function SectionsDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const goBack = useCallback(() => {
    if (typeof gsap !== 'undefined') {
      const slider = document.querySelector('.slider-wrapper');
      gsap.to(containerRef.current, { y: '100%', opacity: 0, duration: 1.4, ease: 'power3.inOut' });
      gsap.to(slider, { y: '0%', opacity: 1, duration: 1.4, ease: 'power3.inOut' });
    }
  }, []);

  useEffect(() => {
    const handleExplore = (e: CustomEvent) => {
      setActiveSlide(e.detail.slideIndex);
      setIsVisible(true);
    };
    window.addEventListener('explore-slide', handleExplore as EventListener);
    return () => window.removeEventListener('explore-slide', handleExplore as EventListener);
  }, []);

  useEffect(() => {
    if (typeof gsap === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;
    const innerEls = container.querySelectorAll('.anim-el');
    gsap.set(innerEls, { y: 40, opacity: 0 });
  }, [activeSlide]);

  // Scroll-up at top for focuss-dev section → go back
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let accum = 0;
    const handleWheel = (e: WheelEvent) => {
      // Only for focuss-dev (non-scrollable section)
      if (sections[activeSlide].id !== 'focuss-dev') return;
      if (e.deltaY < 0) {
        accum += Math.abs(e.deltaY);
        if (accum > 100) { accum = 0; goBack(); }
      } else { accum = 0; }
    };
    container.addEventListener('wheel', handleWheel, { passive: true });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeSlide, goBack]);

  const section = sections[activeSlide];
  const isFocussDev = section.id === 'focuss-dev';
  const isDesignInterface = section.id === 'design-interface';

  return (
    <div ref={containerRef} id="detail-section" className="fixed inset-0 z-20 bg-background" style={{ transform: 'translateY(100%)', opacity: 0 }}>
      <div className="relative h-screen overflow-hidden">
        {/* Back button */}
        <button
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase backdrop-blur-sm bg-background/20 px-3 py-2 rounded-sm border border-border/20 hover:border-accent/30"
          onClick={goBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7" /></svg>
          Voltar
        </button>

        {/* FOCUSS DEV: Original layout (unchanged) */}
        {isFocussDev && (
          <>
            <div className="absolute inset-0">
              <img src={section.image} alt={section.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(45, 100%, 55%, 0.2) 0%, transparent 60%)` }} />
            </div>
            <div className="relative flex items-center h-full px-6 md:px-16 lg:px-24">
              <div className="w-full max-w-4xl mx-auto">
                <div className="anim-el h-[2px] w-16 mb-6 origin-left bg-accent" />
                <span className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent">{section.subtitle}</span>
                <h2 className="anim-el font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-tight tracking-tight">{section.title}</h2>
                <p className="anim-el text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl">{section.description}</p>
                <ul className="space-y-3">
                  {section.details.map((detail, i) => (
                    <li key={i} className="anim-el flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                      <span className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Design de Interface: ScrollExpandMedia */}
        {isDesignInterface && isVisible && (
          <ScrollExpandMedia
            mediaSrc="/images/slide-04.jpg"
            bgImageSrc="/images/slide-04.jpg"
            title={section.title}
            subtitle={section.subtitle}
            details={section.details}
          />
        )}

        {/* All other sections: Lightweight cinematic style */}
        {!isFocussDev && !isDesignInterface && (
          <CinematicSection section={section} isVisible={isVisible} onScrollUpAtTop={goBack} />
        )}
      </div>
    </div>
  );
}