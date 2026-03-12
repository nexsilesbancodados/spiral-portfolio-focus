import React, { useEffect, useRef, useState, useCallback, lazy, Suspense, memo } from 'react';

const ScrollExpandMedia = lazy(() => import('@/components/ScrollExpandMedia').then(m => ({ default: m.ScrollExpandMedia })));

const FocussChat = lazy(() => import('@/components/FocussChat').then(m => ({ default: m.FocussChat })));
const TechLogosMarquee = lazy(() => import('@/components/TechLogosMarquee'));
const MultiOrbitSemiCircle = lazy(() => import('@/components/ui/multi-orbit-semi-circle'));

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
    id: 'servicos',
    subtitle: 'Nossos Serviços',
    title: 'Serviços',
    description: 'Soluções digitais completas para impulsionar seu negócio. Do tráfego pago à criação de sistemas complexos, oferecemos tudo o que você precisa para dominar o digital.',
    details: [
      '📈 Tráfego Pago — Campanhas estratégicas no Google Ads, Meta Ads e TikTok Ads com ROI maximizado',
      '🌐 Criação de Sites — Sites modernos, responsivos e otimizados para SEO com tecnologias de ponta',
      '📱 Criação de Apps — Aplicativos nativos e multiplataforma para iOS, Android e PWA',
      '⚙️ Sistemas & SaaS — Plataformas escaláveis sob medida, ERPs, CRMs e dashboards',
      '🚀 Landing Pages — Páginas de alta conversão com design persuasivo e funis otimizados',
      '🎨 Design — Identidade visual completa, UI/UX premium e prototipagem interativa',
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
      { src: '/images/automacao-hero.png', label: 'Automação' },
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
  'servicos': {
    layout: 'asymmetric',
    images: [
      { src: '/images/servicos-detail-01.jpg', label: 'Marketing Digital' },
      { src: '/images/servicos-detail-02.jpg', label: 'Desenvolvimento' },
    ],
  },
  'skills': {
    layout: 'panoramic-duo',
    images: [
      { src: '/images/skills-detail-01.jpg', label: 'Conferência' },
    ],
  },
};

// Per-section GSAP scroll animation type
type ScrollEffectType = 'fade-slide' | 'scale-reveal' | 'horizontal-wipe' | 'stagger-cascade' | 'clip-expand';
const sectionScrollEffect: Record<string, ScrollEffectType> = {
  'web-design': 'fade-slide',
  'desenvolvimento': 'scale-reveal',
  'servicos': 'horizontal-wipe',
  'inovacao-ia': 'clip-expand',
  'mobile-web': 'stagger-cascade',
  'skills': 'horizontal-wipe',
};

// ─── Lightweight cinematic section layout ─────────────────────────
const CinematicSection = memo(function CinematicSection({ section, isVisible, onScrollUpAtTop }: { section: typeof sections[0]; isVisible: boolean; onScrollUpAtTop: () => void }) {
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
        gsap.fromTo(titleWords, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo(subtitle, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 });
        break;
      case 'scale-reveal':
        gsap.fromTo(titleWords, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out', delay: 0.3 });
        gsap.fromTo(subtitle, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4 });
        break;
      case 'horizontal-wipe':
        gsap.fromTo(titleWords, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out', delay: 0.3 });
        gsap.fromTo(subtitle, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 });
        break;
      case 'clip-expand':
        gsap.fromTo(titleWords, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.4 });
        gsap.fromTo(subtitle, { scaleX: 0, opacity: 0, transformOrigin: 'left' }, { scaleX: 1, opacity: 1, duration: 0.6, delay: 0.3 });
        break;
      case 'stagger-cascade':
        gsap.fromTo(titleWords, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'back.out(1.1)', delay: 0.3 });
        gsap.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2 });
        break;
    }

    // Description fade
    gsap.fromTo(desc, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 });

    // IntersectionObserver for gallery & detail animations (much lighter than scroll handler)
    const animateItem = (item: Element, i: number, isGallery: boolean) => {
      if (isGallery) {
        switch (effect) {
          case 'fade-slide':
            gsap.fromTo(item, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out' });
            break;
          case 'scale-reveal':
            gsap.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power2.out' });
            break;
          case 'horizontal-wipe':
            gsap.fromTo(item, { x: i % 2 === 0 ? -50 : 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: i * 0.08, ease: 'power3.out' });
            break;
          case 'clip-expand':
            gsap.fromTo(item, { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power2.out' });
            break;
          case 'stagger-cascade':
            gsap.fromTo(item, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.1)' });
            break;
        }
      } else {
        gsap.fromTo(item, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: 'power2.out' });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        if (target.dataset.animated) return;
        target.dataset.animated = 'true';
        const idx = parseInt(target.dataset.animIdx || '0', 10);
        const isGallery = target.classList.contains('gallery-item');
        animateItem(target, idx, isGallery);
        observer.unobserve(target);
      });
    }, { root: el, threshold: 0.15 });

    galleryEls.forEach((item, i) => { (item as HTMLElement).dataset.animIdx = String(i); observer.observe(item); });
    detailEls.forEach((item, i) => { (item as HTMLElement).dataset.animIdx = String(i); observer.observe(item); });

    return () => observer.disconnect();
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

  // Per-section color palette + bg image for title text-fill effect
  const sectionColors: Record<string, { accent: string; accentHsl: string; gradient: string; overlay: string; titleBg: string; titleGradient: string; glowColor: string }> = {
    'focuss-dev':       { accent: 'text-blue-400',      accentHsl: '210 90% 60%',   gradient: 'linear-gradient(90deg, hsl(210 90% 60%), hsl(230 80% 65%))',          overlay: 'none', titleBg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 90% 70%) 40%, hsl(230 80% 60%) 70%, hsl(210 90% 50%) 100%)', glowColor: 'hsl(210 90% 60% / 0.4)' },
    'web-design':       { accent: 'text-orange-400',     accentHsl: '25 95% 55%',    gradient: 'linear-gradient(90deg, hsl(25 95% 55%), hsl(335 75% 55%))',           overlay: 'linear-gradient(135deg, hsl(25 95% 55% / 0.12), hsl(335 75% 55% / 0.08), transparent 70%)', titleBg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(25 95% 65%) 30%, hsl(335 75% 55%) 65%, hsl(25 95% 45%) 100%)', glowColor: 'hsl(25 95% 55% / 0.35)' },
    'desenvolvimento':  { accent: 'text-emerald-400',    accentHsl: '160 70% 50%',   gradient: 'linear-gradient(90deg, hsl(160 70% 50%), hsl(190 80% 55%))',          overlay: 'linear-gradient(225deg, hsl(160 70% 50% / 0.12), hsl(190 80% 55% / 0.08), transparent 60%)', titleBg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(160 70% 60%) 30%, hsl(190 80% 50%) 65%, hsl(160 70% 40%) 100%)', glowColor: 'hsl(160 70% 50% / 0.35)' },
    'servicos':         { accent: 'text-purple-400',     accentHsl: '270 70% 60%',   gradient: 'linear-gradient(90deg, hsl(270 70% 60%), hsl(300 65% 55%))',          overlay: 'linear-gradient(180deg, hsl(270 70% 60% / 0.1), hsl(300 65% 55% / 0.06), transparent)', titleBg: '', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(270 70% 70%) 30%, hsl(300 65% 55%) 65%, hsl(270 70% 50%) 100%)', glowColor: 'hsl(270 70% 60% / 0.35)' },
    'inovacao-ia':      { accent: 'text-pink-400',       accentHsl: '335 75% 55%',   gradient: 'linear-gradient(90deg, hsl(335 75% 55%), hsl(355 85% 60%))',          overlay: 'linear-gradient(180deg, hsl(335 75% 55% / 0.1), hsl(25 95% 55% / 0.08), transparent)', titleBg: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(335 75% 65%) 30%, hsl(355 85% 55%) 65%, hsl(335 75% 45%) 100%)', glowColor: 'hsl(335 75% 55% / 0.35)' },
    'mobile-web':       { accent: 'text-amber-400',      accentHsl: '40 100% 50%',   gradient: 'linear-gradient(90deg, hsl(40 100% 50%), hsl(30 95% 55%))',           overlay: 'linear-gradient(135deg, hsl(40 100% 50% / 0.1), hsl(175 70% 45% / 0.06), transparent 70%)', titleBg: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(40 100% 60%) 30%, hsl(30 95% 50%) 65%, hsl(40 100% 40%) 100%)', glowColor: 'hsl(40 100% 50% / 0.35)' },
    'skills':           { accent: 'text-cyan-400',       accentHsl: '185 80% 55%',   gradient: 'linear-gradient(90deg, hsl(185 80% 55%), hsl(210 75% 60%))',          overlay: 'linear-gradient(225deg, hsl(185 80% 55% / 0.1), hsl(210 75% 60% / 0.06), transparent 60%)', titleBg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=60', titleGradient: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(185 80% 65%) 30%, hsl(210 75% 55%) 65%, hsl(185 80% 45%) 100%)', glowColor: 'hsl(185 80% 55% / 0.35)' },
  };
  const colors = sectionColors[section.id] || sectionColors['focuss-dev'];
  const viceOverlay = colors.overlay;

  // Parallax effect on hero image (RAF-throttled, desktop only)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Skip parallax on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const heroImg = el.querySelector('.parallax-hero img') as HTMLElement;
    if (!heroImg) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = el.scrollTop * 0.2;
        heroImg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.1)`;
        ticking = false;
      });
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [section.id]);

  // Render section-specific content
  const renderSectionContent = () => {
    switch (section.id) {
      case 'web-design':
        return (
          <div className="fluid-section-pad">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { src: '/images/webdesign-detail-01.jpg', title: 'Prototipagem UI', desc: 'Wireframes e protótipos interativos' },
                { src: '/images/webdesign-detail-02.jpg', title: 'Criação Visual', desc: 'Design systems e identidade visual' },
                { src: '/images/webdesign-detail-03.jpg', title: 'Studio Criativo', desc: 'Ambientes de design profissional' },
                { src: '/images/slide-02.jpg', title: 'Web Premium', desc: 'Sites de alto impacto visual' },
                { src: '/images/ui-detail-01.jpg', title: 'Interface 3D', desc: 'Elementos holográficos e futuristas' },
                { src: '/images/ui-detail-02.jpg', title: 'Design Mobile', desc: 'Experiências mobile-first' },
              ].map((item, i) => (
                <div key={i} className="detail-item image-hover-zoom card-hover-glow relative h-[35vh] md:h-[40vh] rounded-sm overflow-hidden border border-border/10 group cursor-pointer" style={{ opacity: 0 }}>
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, hsl(var(--vice-sunset) / 0.15), transparent)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-wide uppercase">{item.title}</h4>
                    <p className="text-muted-foreground text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'desenvolvimento':
        return (
          <div className="fluid-section-pad">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {[
                { icon: '⚡', title: 'APIs REST & GraphQL', desc: 'Endpoints performáticos com autenticação JWT, rate limiting e documentação OpenAPI completa.' },
                { icon: '🏗️', title: 'Arquitetura Escalável', desc: 'Microserviços, clean architecture e patterns SOLID para projetos que crescem.' },
                { icon: '🔄', title: 'CI/CD Automatizado', desc: 'Pipelines de deploy com GitHub Actions, Docker e monitoramento em tempo real.' },
                { icon: '🗄️', title: 'Banco de Dados', desc: 'PostgreSQL otimizado com migrations, índices inteligentes e queries performáticas.' },
              ].map((card, i) => (
                <div key={i} className="detail-item card-hover-glow relative p-8 rounded-sm border border-border/20 backdrop-blur-sm group cursor-pointer" 
                  style={{ opacity: 0, background: 'hsl(var(--card) / 0.5)' }}>
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, hsl(var(--vice-teal) / 0.06), hsl(var(--vice-sunset) / 0.04))' }} />
                  <div className="relative z-10">
                    <span className="text-2xl mb-4 block">{card.icon}</span>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base font-semibold tracking-wide uppercase mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    <div className="h-[1px] w-12 mt-6 bg-vice-teal/30 group-hover:w-full group-hover:bg-vice-teal/60 transition-all duration-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'inovacao-ia':
        return (
          <div className="fluid-section-pad">
            {/* FOCUSS AI Chat */}
            <div className="mb-16">
              <Suspense fallback={null}><FocussChat /></Suspense>
            </div>
            {/* Futuristic grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl">
              <div className="detail-item lg:col-span-7 image-hover-zoom card-hover-glow relative h-[50vh] rounded-sm overflow-hidden border border-vice-pink/10" style={{ opacity: 0 }}>
                <img src="/images/ia-detail-01.jpg" alt="Laboratório IA" loading="lazy" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.3)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(var(--vice-pink) / 0.1), transparent)' }} />
                <div className="absolute bottom-6 left-6">
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase text-vice-pink/80">MACHINE LEARNING</span>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-xl font-bold mt-2">Inteligência que Transforma</h4>
                </div>
              </div>
              <div className="lg:col-span-5 grid grid-rows-2 gap-4">
                <div className="detail-item card-hover-glow relative p-8 rounded-sm border border-vice-pink/10 backdrop-blur-sm" style={{ opacity: 0, background: 'hsl(var(--card) / 0.5)' }}>
                  <div className="text-4xl mb-3">🧠</div>
                  <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-wide uppercase mb-2">Neural Networks</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">Modelos treinados para análise preditiva, processamento de linguagem natural e visão computacional.</p>
                </div>
                <div className="detail-item image-hover-zoom card-hover-glow relative h-full rounded-sm overflow-hidden border border-vice-pink/10" style={{ opacity: 0 }}>
                  <img src="/images/automacao-hero.png" alt="Automação" loading="lazy" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(1.2)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-sunset/80">AUTOMAÇÃO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mobile-web':
        return (
          <div className="fluid-section-pad">
            {/* Mockup showcase */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phone mockup */}
                <div className="detail-item card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[180px] h-[360px] rounded-[24px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-01.jpg" alt="Mobile" loading="lazy" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-b-xl" />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">MOBILE APP</span>
                </div>
                {/* Tablet mockup */}
                <div className="detail-item card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-[260px] h-[340px] rounded-[16px] border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/mobile-detail-02.jpg" alt="Tablet" loading="lazy" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">TABLET</span>
                </div>
                {/* Desktop mockup */}
                <div className="detail-item card-hover-glow flex flex-col items-center p-8 rounded-sm border border-border/10" style={{ opacity: 0, background: 'hsl(var(--card) / 0.3)' }}>
                  <div className="relative w-full h-[220px] rounded-t-lg border-2 border-foreground/20 overflow-hidden shadow-2xl">
                    <img src="/images/slide-06.jpg" alt="Desktop" loading="lazy" className="w-full h-full object-cover" style={{ filter: 'brightness(0.85) saturate(1.2)' }} />
                  </div>
                  <div className="w-24 h-3 bg-foreground/10 rounded-b-lg" />
                  <div className="w-16 h-1 bg-foreground/10 mt-1 rounded" />
                  <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.2em] uppercase text-vice-gold/70 mt-6">DESKTOP</span>
                </div>
              </div>
              {/* PWA + Docker badges */}
              <div className="flex flex-wrap gap-3 justify-center mt-12">
                {['React Native', 'PWA', '100% Responsivo', 'Docker', 'Cloud Deploy'].map((badge, i) => (
                  <span key={i} className="detail-item font-[family-name:var(--font-display)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-sm border border-vice-gold/20 text-vice-gold/80 bg-vice-gold/5 hover:bg-vice-gold/15 hover:border-vice-gold/50 transition-all duration-300 cursor-default" style={{ opacity: 0 }}>{badge}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'skills':
        const skills = [
          { name: 'React / Next.js', level: 95, category: 'Front-end' },
          { name: 'TypeScript', level: 92, category: 'Front-end' },
          { name: 'Tailwind CSS / GSAP', level: 90, category: 'Front-end' },
          { name: 'Node.js', level: 88, category: 'Back-end' },
          { name: 'Python', level: 82, category: 'Back-end' },
          { name: 'PostgreSQL / MongoDB', level: 85, category: 'Back-end' },
          { name: 'AWS / Docker', level: 80, category: 'DevOps' },
          { name: 'Figma / UI Design', level: 88, category: 'Design' },
          { name: 'Three.js / WebGL', level: 75, category: 'Design' },
          { name: 'CI/CD / Git', level: 90, category: 'DevOps' },
        ];
        return (
          <div className="fluid-section-pad">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
              {skills.map((skill, i) => (
                <div key={i} className="detail-item group" style={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-[family-name:var(--font-display)] text-foreground/90 text-sm tracking-wide uppercase">{skill.name}</span>
                    <span className="font-[family-name:var(--font-display)] text-vice-sunset/60 text-[10px] tracking-widest">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mt-1 block">{skill.category}</span>
                </div>
              ))}
            </div>
            {/* Animated tech logos marquee */}
            <Suspense fallback={null}><TechLogosMarquee /></Suspense>
            {/* Tech badges */}
            <div className="max-w-5xl mx-auto mt-16 flex flex-wrap gap-3">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Figma', 'GSAP', 'Three.js', 'Tailwind CSS', 'GraphQL'].map((tech, i) => (
                <span key={i} className="detail-item card-hover-glow font-[family-name:var(--font-display)] text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-sm border border-vice-sunset/20 text-foreground/70 bg-vice-sunset/5 hover:text-vice-sunset hover:border-vice-sunset/50 transition-all duration-300 cursor-default" style={{ opacity: 0 }}>{tech}</span>
              ))}
            </div>
          </div>
        );

      case 'servicos':
        return (
          <div className="fluid-section-pad">
            {/* Cinematic video header */}
            <div className="detail-item relative w-full h-[50vh] md:h-[60vh] overflow-hidden rounded-sm mb-16" style={{ opacity: 0 }}>
              <video src="/videos/servicos.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" style={{ filter: 'brightness(0.75) saturate(1.3) contrast(1.05)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(270 70% 60% / 0.12), transparent 60%)' }} />
              <div className="absolute bottom-8 left-8">
                <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.3em] uppercase text-vice-pink/80">SOLUÇÕES DIGITAIS</span>
                <h4 className="font-[family-name:var(--font-display)] text-foreground text-2xl font-bold mt-2">Serviços Completos</h4>
              </div>
            </div>

            {/* Service cards grid - Vice City neon style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
              {[
                { icon: '📈', title: 'Tráfego Pago', desc: 'Campanhas estratégicas no Google Ads, Meta Ads e TikTok Ads. Maximizamos seu ROI com segmentação precisa e otimização contínua.', accent: 'vice-pink' },
                { icon: '🌐', title: 'Criação de Sites', desc: 'Sites modernos, responsivos e otimizados para SEO. Desenvolvidos com as melhores tecnologias para performance máxima.', accent: 'vice-teal' },
                { icon: '📱', title: 'Criação de Apps', desc: 'Aplicativos nativos e multiplataforma com experiência de usuário premium. iOS, Android e PWA.', accent: 'vice-sunset' },
                { icon: '⚙️', title: 'Sistemas & SaaS', desc: 'Plataformas escaláveis sob medida. Painéis administrativos, ERPs, CRMs e soluções SaaS completas.', accent: 'vice-sky' },
                { icon: '🚀', title: 'Landing Pages', desc: 'Páginas de alta conversão com design persuasivo, copywriting estratégico e integração com funis de vendas.', accent: 'vice-gold' },
                { icon: '🎨', title: 'Design', desc: 'Identidade visual completa, UI/UX premium, design systems e prototipagem interativa no Figma.', accent: 'vice-palm' },
              ].map((card, i) => (
                <div key={i} className="detail-item card-hover-glow relative p-8 rounded-sm overflow-hidden group cursor-pointer" 
                  style={{ opacity: 0, background: 'hsl(var(--card) / 0.4)', border: '1px solid hsl(var(--border) / 0.15)' }}>
                  {/* Neon glow border on hover */}
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(270 70% 60% / 0.1), hsl(335 75% 55% / 0.06), transparent)`,
                      boxShadow: 'inset 0 0 30px hsl(270 70% 60% / 0.05)'
                    }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, hsl(270 70% 60% / 0.6), hsl(335 75% 55% / 0.4), transparent)' }} />
                  <div className="relative z-10">
                    <span className="text-4xl mb-5 block drop-shadow-lg">{card.icon}</span>
                    <h4 className="font-[family-name:var(--font-display)] text-foreground text-base font-semibold tracking-[0.15em] uppercase mb-3">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    <div className="h-[1px] w-12 mt-6 transition-all duration-700 group-hover:w-full"
                      style={{ background: 'linear-gradient(90deg, hsl(270 70% 60% / 0.5), hsl(335 75% 55% / 0.3))' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA area */}
            <div className="mt-20 text-center">
              <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-4">PRONTO PARA COMEÇAR?</p>
              <div className="h-[1px] w-24 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, hsl(270 70% 60% / 0.5), transparent)' }} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-y-auto gta-vi-scroll">
      {/* ── HERO with parallax ── */}
      <div className="relative h-screen w-full overflow-hidden flex items-end parallax-hero">
        <div className="absolute inset-0">
          <img src={section.image} alt={section.title} loading="eager" decoding="async" width={1920} height={1080} className="w-full h-full object-cover" style={{ filter: 'saturate(1.15) contrast(1.05)', transform: 'scale(1.1)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, hsl(var(--background)) 100%)' }} />
          {/* Vice City color wash */}
          <div className="absolute inset-0" style={{ background: viceOverlay }} />
        </div>

        <div className="relative z-10 w-full" style={{ padding: `0 clamp(1.5rem, 4vw, 6rem) clamp(1rem, 3vw, 1.5rem)` }}>
          <div className="cin-subtitle flex items-center gap-3 mb-[clamp(0.5rem,1vw,1.5rem)]">
            <div className="h-[2px]" style={{ width: 'clamp(2rem, 3vw, 4rem)', background: colors.gradient }} />
            <span className={`font-[family-name:var(--font-display)] tracking-[0.4em] uppercase ${colors.accent}`} style={{ fontSize: 'clamp(9px, 0.8vw, 12px)', textShadow: `0 0 20px ${colors.glowColor}` }}>{section.subtitle}</span>
            <div className="h-[2px]" style={{ width: 'clamp(1rem, 1.5vw, 2rem)', background: colors.gradient, opacity: 0.4 }} />
          </div>
          <div className="relative">
            {/* Glow layer behind title */}
            <div className="absolute inset-0 -z-10 pointer-events-none" style={{
              filter: 'blur(60px)',
              background: `radial-gradient(ellipse 80% 60% at 20% 60%, ${colors.glowColor}, transparent 70%)`,
            }} />
            <h2 className="font-[family-name:var(--font-display)] font-black leading-[0.85] tracking-tighter uppercase" style={{ fontSize: 'clamp(2.5rem, 9vw, 11rem)' }}>
              {section.title.split(' ').map((word, i) => (
                <span 
                  key={i} 
                  className="title-word block"
                  style={{
                    background: colors.titleGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 30px ${colors.glowColor}) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.5))`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>
          <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-50" style={{ right: 'clamp(1.5rem, 3vw, 4rem)' }}>
            <span className={`font-[family-name:var(--font-display)] tracking-[0.25em] uppercase ${colors.accent} opacity-60 [writing-mode:vertical-lr]`} style={{ fontSize: 'clamp(7px, 0.6vw, 9px)' }}>Role para baixo</span>
            <div className="w-[1px] animate-pulse" style={{ height: 'clamp(2rem, 3vw, 3rem)', background: `hsl(${colors.accentHsl} / 0.4)` }} />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 bg-background">
        <div className="w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${colors.accentHsl} / 0.3), hsl(${colors.accentHsl} / 0.15), transparent)` }} />
        
        <div className="cin-desc" style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          <div className="max-w-5xl">
            <p className="text-foreground/90 leading-relaxed font-light tracking-tight" style={{ fontSize: 'clamp(1rem, 2vw, 1.875rem)' }}>{section.description}</p>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef}>{renderGallery()}</div>

        {/* Details grid */}
        <div ref={detailsRef} style={{ padding: `clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 6rem)` }}>
          {section.id === 'servicos' ? (
            /* Serviços: Premium card grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl">
              {section.details.map((detail, i) => {
                const emoji = detail.slice(0, 2)
                const rest = detail.slice(3)
                const [title, desc] = rest.split(' — ')
                const cardAccents = [
                  'hsl(335 75% 55%)', 'hsl(185 80% 55%)', 'hsl(25 95% 55%)',
                  'hsl(210 90% 60%)', 'hsl(45 100% 55%)', 'hsl(270 70% 60%)'
                ]
                const accent = cardAccents[i] || cardAccents[0]
                return (
                  <div key={i} className="detail-item group relative p-7 rounded-sm overflow-hidden cursor-pointer transition-all duration-500 hover:translate-y-[-2px]"
                    style={{ opacity: 0, background: 'hsl(var(--card) / 0.35)', border: '1px solid hsl(var(--border) / 0.1)' }}>
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse at top, ${accent}08, transparent 70%)` }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{emoji}</span>
                        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-[0.25em] uppercase opacity-40" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h4 className="font-[family-name:var(--font-display)] text-foreground text-sm font-semibold tracking-[0.12em] uppercase mb-2">{title}</h4>
                      <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                      <div className="h-[1px] w-10 mt-5 group-hover:w-full transition-all duration-700"
                        style={{ background: `linear-gradient(90deg, ${accent}80, transparent)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Default details grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl">
              {section.details.map((detail, i) => (
                <div key={i} className="detail-item group flex items-start gap-4" style={{ opacity: 0 }}>
                  <span className={`font-[family-name:var(--font-display)] ${colors.accent} opacity-40 text-sm tracking-widest mt-1`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="h-[1px] w-8 mb-4 group-hover:w-16 transition-all duration-500" style={{ background: `hsl(${colors.accentHsl} / 0.3)` }} />
                    <p className="text-foreground/80 text-base md:text-lg leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section-specific content */}
        {renderSectionContent()}

        <div className="h-16 md:h-24" />
      </div>
    </div>
  );
});

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
    gsap.fromTo(innerEls, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
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
  const isServicos = section.id === 'servicos';

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

        {/* All other sections: Lightweight cinematic style */}
        {!isFocussDev && (
          <CinematicSection section={section} isVisible={isVisible} onScrollUpAtTop={goBack} />
        )}
      </div>
    </div>
  );
}