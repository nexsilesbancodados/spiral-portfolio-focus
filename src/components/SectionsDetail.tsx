import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from 'react';
import { WebDesignPortfolio } from '@/components/WebDesignPortfolio';
import { ScrollExpandMedia } from '@/components/ScrollExpandMedia';
import { PlatformerGame } from '@/components/PlatformerGame';
import { motion, AnimatePresence } from 'framer-motion';

declare const gsap: any;

const InteractiveGlobe = lazy(() => import('@/components/ui/interactive-globe').then(m => ({ default: m.InteractiveGlobe })));
const WebGLShader = lazy(() => import('@/components/ui/web-gl-shader').then(m => ({ default: m.WebGLShader })));

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

// ─── GTA VI-inspired cinematic section layout ─────────────────────────
function GtaViSection({ section, isVisible }: { section: typeof sections[0]; isVisible: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;
  const heroOpacity = Math.max(0, 1 - scrollY / 500);
  const titleScale = 1 + scrollY * 0.0005;

  const isWebDesign = section.id === 'web-design';
  const isDesenvolvimento = section.id === 'desenvolvimento';
  const isInovacao = section.id === 'inovacao-ia';

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-y-auto gta-vi-scroll">
      {/* ── HERO: Full-viewport cinematic image ── */}
      <div className="relative h-screen w-full overflow-hidden flex items-end">
        {/* Background with parallax */}
        <div className="absolute inset-0" style={{ transform: `translateY(${parallaxOffset}px)` }}>
          {isInovacao && isVisible ? (
            <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
              <WebGLShader />
            </Suspense>
          ) : (
            <img
              src={section.image}
              alt={section.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${titleScale})` }}
            />
          )}
          {/* Cinematic gradient overlays — GTA VI style */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ 
            background: 'linear-gradient(180deg, transparent 40%, hsl(var(--background)) 95%)',
            opacity: 0.9 
          }} />
          {/* Warm cinematic color wash */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{
            background: 'linear-gradient(135deg, hsl(45 100% 55% / 0.08), transparent 60%, hsl(200 80% 40% / 0.05))'
          }} />
        </div>

        {/* Hero content — large dramatic title at bottom */}
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            style={{ opacity: heroOpacity }}
          >
            {/* Subtitle badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="font-[family-name:var(--font-display)] text-[11px] md:text-xs tracking-[0.3em] uppercase text-accent">
                {section.subtitle}
              </span>
            </div>

            {/* Massive title — GTA VI style */}
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] xl:text-[11rem] font-bold text-foreground leading-[0.85] tracking-tighter uppercase">
              {section.title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  className="block"
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 + i * 0.15 }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 right-6 md:right-16 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: heroOpacity * 0.7 }}
            transition={{ delay: 1.5 }}
          >
            <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.25em] uppercase text-accent/60 [writing-mode:vertical-lr]">
              Role para baixo
            </span>
            <motion.div
              className="w-[1px] h-12 bg-accent/40"
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT: Below the hero ── */}
      <div className="relative z-10 bg-background">
        {/* Cinematic thin accent line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        {/* Description block — wide cinematic layout */}
        <motion.div
          className="px-6 md:px-16 lg:px-24 py-16 md:py-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl">
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 leading-relaxed font-light tracking-tight">
              {section.description}
            </p>
          </div>
        </motion.div>

        {/* Full-width image strip — cinematic break */}
        <motion.div
          className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1 }}
        >
          <img
            src={section.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) saturate(1.3) contrast(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </motion.div>

        {/* Details grid — GTA VI character bio style */}
        <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl">
            {section.details.map((detail, i) => (
              <motion.div
                key={i}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <span className="font-[family-name:var(--font-display)] text-accent/40 text-sm tracking-widest mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="h-[1px] w-8 bg-accent/30 mb-4 group-hover:w-16 group-hover:bg-accent/60 transition-all duration-500" />
                    <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                      {detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section-specific interactive content */}
        {isWebDesign && isVisible && (
          <motion.div
            className="px-6 md:px-16 lg:px-24 pb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <WebDesignPortfolio />
          </motion.div>
        )}

        {isDesenvolvimento && isVisible && (
          <motion.div
            className="px-6 md:px-16 lg:px-24 pb-24 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <PlatformerGame />
          </motion.div>
        )}

        {/* Bottom spacer with cinematic fade */}
        <div className="h-16 md:h-24 bg-gradient-to-b from-background to-background/80" />
      </div>
    </div>
  );
}

export function SectionsDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  const section = sections[activeSlide];
  const isFocussDev = section.id === 'focuss-dev';
  const isDesignInterface = section.id === 'design-interface';

  return (
    <div ref={containerRef} id="detail-section" className="fixed inset-0 z-20 bg-background" style={{ transform: 'translateY(100%)', opacity: 0 }}>
      <div className="relative h-screen overflow-hidden">
        {/* Back button — always on top */}
        <button
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase backdrop-blur-sm bg-background/20 px-3 py-2 rounded-sm border border-border/20 hover:border-accent/30"
          onClick={() => {
            if (typeof gsap !== 'undefined') {
              const slider = document.querySelector('.slider-wrapper');
              gsap.to(containerRef.current, { y: '100%', opacity: 0, duration: 1.4, ease: 'power3.inOut' });
              gsap.to(slider, { y: '0%', opacity: 1, duration: 1.4, ease: 'power3.inOut' });
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7" /></svg>
          Voltar
        </button>

        {/* ── FOCUSS DEV: Original layout (unchanged) ── */}
        {isFocussDev && (
          <>
            <div className="absolute inset-0">
              <img
                src={section.image}
                alt={section.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(45, 100%, 55%, 0.2) 0%, transparent 60%)` }} />
            </div>
            <div className="relative flex items-center h-full px-6 md:px-16 lg:px-24">
              <div className="w-full max-w-4xl mx-auto">
                <div className="anim-el h-[2px] w-16 mb-6 origin-left bg-accent" />
                <span className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3 text-accent">
                  {section.subtitle}
                </span>
                <h2 className="anim-el font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-tight tracking-tight">
                  {section.title}
                </h2>
                <p className="anim-el text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                  {section.description}
                </p>
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

        {/* ── Design de Interface: ScrollExpandMedia (unchanged) ── */}
        {isDesignInterface && isVisible && (
          <ScrollExpandMedia
            mediaSrc="/images/slide-04.jpg"
            bgImageSrc="/images/slide-04.jpg"
            title={section.title}
            subtitle={section.subtitle}
            details={section.details}
          />
        )}

        {/* ── All other sections: GTA VI cinematic style ── */}
        {!isFocussDev && !isDesignInterface && (
          <GtaViSection section={section} isVisible={isVisible} />
        )}
      </div>
    </div>
  );
}
