import React, { useEffect, useRef, useState } from 'react';

declare const gsap: any;

const sections = [
  {
    id: 'focuss-dev',
    title: 'FOCUSS DEV',
    subtitle: 'Quem Somos',
    description: 'Somos uma equipe apaixonada por tecnologia e inovação. Na FOCUSS DEV, transformamos ideias em experiências digitais extraordinárias, combinando design de alto impacto com código robusto e escalável.',
    details: [
      'Mais de 5 anos de experiência em desenvolvimento web',
      'Projetos entregues para startups e grandes empresas',
      'Foco em performance, acessibilidade e experiência do usuário',
      'Metodologias ágeis e entrega contínua',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-01.jpg',
  },
  {
    id: 'web-design',
    title: 'Web Design',
    subtitle: 'Criação Visual',
    description: 'Interfaces modernas e elegantes que conectam marcas ao futuro digital. Nosso processo de design combina pesquisa de usuário, prototipagem rápida e uma estética visual impactante.',
    details: [
      'Design responsivo e mobile-first',
      'Prototipagem interativa no Figma',
      'Criação de Design Systems consistentes',
      'Testes de usabilidade e iteração contínua',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-02.jpg',
  },
  {
    id: 'desenvolvimento',
    title: 'Desenvolvimento',
    subtitle: 'Código & Performance',
    description: 'Código limpo, performance máxima e arquitetura escalável. Utilizamos as melhores práticas e tecnologias modernas para construir aplicações robustas e de alta qualidade.',
    details: [
      'Arquitetura limpa e código manutenível',
      'APIs REST e GraphQL performáticas',
      'Integração contínua e deploy automatizado',
      'Banco de dados otimizados com PostgreSQL',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-03.jpg',
  },
  {
    id: 'design-interface',
    title: 'Design de Interface',
    subtitle: 'UI/UX Premium',
    description: 'Design centrado no usuário com estética cinematográfica e animações fluidas. Cada pixel é pensado para criar experiências memoráveis e intuitivas.',
    details: [
      'Animações fluidas com GSAP e Framer Motion',
      'Interfaces 3D interativas com Three.js',
      'Estilização avançada com Tailwind CSS',
      'Micro-interações que encantam o usuário',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-04.jpg',
  },
  {
    id: 'inovacao-ia',
    title: 'Inovação e IA',
    subtitle: 'Futuro Digital',
    description: 'Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença. Integramos IA nos nossos projetos para criar experiências inteligentes e personalizadas.',
    details: [
      'Integração com modelos de Machine Learning',
      'Automação inteligente de processos',
      'Infraestrutura cloud escalável na AWS',
      'Chatbots e assistentes virtuais customizados',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-05.jpg',
  },
  {
    id: 'mobile-web',
    title: 'Mobile e Web',
    subtitle: 'Multiplataforma',
    description: 'Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo. Do mobile ao desktop, garantimos consistência e performance.',
    details: [
      'Apps nativos com React Native',
      'Progressive Web Apps (PWA)',
      'Layouts 100% responsivos',
      'Deploy containerizado com Docker',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-06.jpg',
  },
];

export function SectionsDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const isTransitioning = useRef(false);
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    const handleExplore = (e: CustomEvent) => {
      setInitialSlide(e.detail.slideIndex);
    };
    window.addEventListener('explore-slide', handleExplore as EventListener);
    return () => window.removeEventListener('explore-slide', handleExplore as EventListener);
  }, []);

  useEffect(() => {
    const waitForGsap = () => {
      if (typeof gsap === 'undefined') {
        setTimeout(waitForGsap, 200);
        return;
      }
      initSlider();
    };

    const initSlider = () => {
      if (!containerRef.current) return;

      const panels = containerRef.current.querySelectorAll('.detail-panel');
      const navItems = containerRef.current.querySelectorAll('.detail-nav-item');

      const idx = initialSlide;
      currentIndex.current = idx;

      panels.forEach((panel, i) => {
        if (i === idx) {
          gsap.set(panel, { x: '0%', opacity: 1, visibility: 'visible' });
        } else {
          gsap.set(panel, { x: '100%', opacity: 0, visibility: 'hidden' });
        }
      });

      navItems.forEach((item, i) => item.classList.toggle('active', i === idx));

      const navigateTo = (targetIndex: number) => {
        if (isTransitioning.current || targetIndex === currentIndex.current) return;
        isTransitioning.current = true;

        const currentPanel = panels[currentIndex.current];
        const targetPanel = panels[targetIndex];
        const direction = targetIndex > currentIndex.current ? 1 : -1;

        navItems.forEach((item, i) => item.classList.toggle('active', i === targetIndex));

        gsap.to(currentPanel, {
          x: `${-direction * 100}%`,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(currentPanel, { visibility: 'hidden' });
          },
        });

        gsap.set(targetPanel, { x: `${direction * 100}%`, visibility: 'visible', opacity: 0 });
        gsap.to(targetPanel, {
          x: '0%',
          opacity: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            currentIndex.current = targetIndex;
            isTransitioning.current = false;
          },
        });

        const innerEls = targetPanel.querySelectorAll('.anim-el');
        gsap.fromTo(innerEls,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
        );
      };

      navItems.forEach((item, i) => {
        item.addEventListener('click', () => navigateTo(i));
      });

      const prevBtn = containerRef.current!.querySelector('.detail-prev');
      const nextBtn = containerRef.current!.querySelector('.detail-next');
      prevBtn?.addEventListener('click', () => {
        if (currentIndex.current > 0) navigateTo(currentIndex.current - 1);
      });
      nextBtn?.addEventListener('click', () => {
        if (currentIndex.current < sections.length - 1) navigateTo(currentIndex.current + 1);
      });

      const firstInner = panels[idx]?.querySelectorAll('.anim-el');
      if (firstInner) {
        gsap.fromTo(firstInner,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
        );
      }
    };

    waitForGsap();
  }, [initialSlide]);

  return (
    <div ref={containerRef} id="detail-section" className="fixed inset-0 z-20 bg-background" style={{ transform: 'translateY(100%)', opacity: 0 }}>
      <div className="relative h-screen overflow-hidden">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19V5m7 7l-7-7-7 7"/></svg>
          Voltar
        </button>

        {/* Panels */}
        {sections.map((section) => (
          <div
            key={section.id}
            className="detail-panel absolute inset-0 flex items-center px-6 md:px-16 lg:px-24"
          >
            <div className="absolute inset-0">
              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${section.accent}33 0%, transparent 60%)` }} />
            </div>

            <div className="relative max-w-4xl mx-auto w-full">
              <div className="anim-el h-[2px] w-16 mb-6 origin-left" style={{ background: section.accent }} />
              <span className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3" style={{ color: section.accent }}>
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
                    <span className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: section.accent }} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <button className="detail-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/50 transition-all duration-300 backdrop-blur-md bg-background/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button className="detail-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/50 transition-all duration-300 backdrop-blur-md bg-background/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
        </button>

        {/* Bottom navigation dots */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {sections.map((section, i) => (
            <button
              key={section.id}
              className={`detail-nav-item group flex flex-col items-center gap-2 cursor-pointer ${i === initialSlide ? 'active' : ''}`}
            >
              <span className="block w-8 h-[2px] rounded-full transition-all duration-500 bg-foreground/20 group-[.active]:bg-accent group-[.active]:w-12" />
              <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/30 group-[.active]:text-foreground/70 transition-colors duration-300 font-[family-name:var(--font-display)]">
                {section.subtitle}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
