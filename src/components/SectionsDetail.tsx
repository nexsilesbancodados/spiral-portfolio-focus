import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
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
];

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

  return (
    <div ref={containerRef} id="detail-section" className="fixed inset-0 z-20 bg-background" style={{ transform: 'translateY(100%)', opacity: 0 }}>
      <div className="relative h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {section.id === 'inovacao-ia' ? (
            <>
              <WebGLShader />
              <div className="absolute inset-0 bg-background/60" />
            </>
          ) : (
            <>
              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(45, 100%, 55%, 0.2) 0%, transparent 60%)` }} />
            </>
          )}
        </div>

        {/* Back button */}
        <button
          className="absolute top-6 left-6 z-30 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors duration-300 font-[family-name:var(--font-display)] text-xs tracking-[0.15em] uppercase"
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

        {/* Content */}
        <div className="relative flex items-center h-full px-6 md:px-16 lg:px-24">
          <div className={`w-full ${(section.id === 'desenvolvimento' || section.id === 'inovacao-ia') ? 'flex flex-col lg:flex-row items-center gap-8' : 'max-w-4xl mx-auto'}`}>
            <div className={(section.id === 'desenvolvimento' || section.id === 'inovacao-ia') ? 'flex-1' : ''}>
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
            {section.id === 'desenvolvimento' && (
              <div className="anim-el flex-1 flex justify-center">
                <InteractiveGlobe
                  size={400}
                  dotColor="rgba(200, 170, 80, ALPHA)"
                  arcColor="rgba(200, 170, 80, 0.4)"
                  markerColor="rgba(230, 200, 100, 1)"
                  autoRotateSpeed={0.003}
                />
              </div>
            )}
            {section.id === 'inovacao-ia' && (
              <div className="anim-el flex-1 flex flex-col items-center gap-6">
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  {[
                    { value: '99.7%', label: 'Precisão IA' },
                    { value: '<200ms', label: 'Latência' },
                    { value: '24/7', label: 'Disponibilidade' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-lg border border-accent/20 bg-background/30 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-accent">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
