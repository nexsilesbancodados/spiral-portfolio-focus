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
    id: 'focuss-missao',
    title: 'Nossa Missão',
    subtitle: 'Propósito',
    description: 'Impulsionar negócios através da tecnologia, entregando soluções digitais que geram resultados reais. Acreditamos que cada projeto é uma oportunidade de criar algo que transforma a forma como as pessoas interagem com o mundo digital.',
    details: [
      'Compromisso com qualidade e prazos',
      'Relacionamento transparente com nossos clientes',
      'Evolução contínua das nossas habilidades técnicas',
      'Impacto positivo em cada projeto entregue',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-03.jpg',
  },
  {
    id: 'focuss-valores',
    title: 'Nossos Valores',
    subtitle: 'O que nos Move',
    description: 'Nossos valores são o alicerce de tudo que fazemos. Inovação, excelência e colaboração guiam cada decisão, cada linha de código e cada interação com nossos parceiros e clientes.',
    details: [
      'Inovação constante em cada solução',
      'Excelência técnica sem concessões',
      'Colaboração genuína com nossos clientes',
      'Responsabilidade e ética em cada entrega',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-04.jpg',
  },
  {
    id: 'focuss-equipe',
    title: 'Nossa Equipe',
    subtitle: 'Talentos',
    description: 'Uma equipe multidisciplinar de designers, desenvolvedores e estrategistas digitais. Cada membro traz uma perspectiva única, criando sinergia para entregar projetos que superam expectativas.',
    details: [
      'Designers UI/UX com olhar cinematográfico',
      'Desenvolvedores full-stack especializados',
      'Gestores de projeto com foco em resultados',
      'Especialistas em performance e SEO',
    ],
    accent: 'hsl(45, 100%, 55%)',
    image: '/images/slide-05.jpg',
  },
];

export function SectionsDetail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const isTransitioning = useRef(false);

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

      // Set initial state: first panel visible, rest hidden to right
      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { x: '0%', opacity: 1, visibility: 'visible' });
        } else {
          gsap.set(panel, { x: '100%', opacity: 0, visibility: 'hidden' });
        }
      });

      const navigateTo = (targetIndex: number) => {
        if (isTransitioning.current || targetIndex === currentIndex.current) return;
        isTransitioning.current = true;

        const currentPanel = panels[currentIndex.current];
        const targetPanel = panels[targetIndex];
        const direction = targetIndex > currentIndex.current ? 1 : -1;

        // Update nav
        navItems.forEach((item, i) => item.classList.toggle('active', i === targetIndex));

        // Animate out current
        gsap.to(currentPanel, {
          x: `${-direction * 100}%`,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(currentPanel, { visibility: 'hidden' });
          },
        });

        // Animate in target
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

        // Stagger animate inner elements
        const innerEls = targetPanel.querySelectorAll('.anim-el');
        gsap.fromTo(innerEls,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
        );
      };

      // Click nav
      navItems.forEach((item, i) => {
        item.addEventListener('click', () => navigateTo(i));
      });

      // Arrow buttons
      const prevBtn = containerRef.current!.querySelector('.detail-prev');
      const nextBtn = containerRef.current!.querySelector('.detail-next');
      prevBtn?.addEventListener('click', () => {
        if (currentIndex.current > 0) navigateTo(currentIndex.current - 1);
      });
      nextBtn?.addEventListener('click', () => {
        if (currentIndex.current < sections.length - 1) navigateTo(currentIndex.current + 1);
      });

      // Initial animation for first panel
      const firstInner = panels[0].querySelectorAll('.anim-el');
      gsap.fromTo(firstInner,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
      );
    };

    waitForGsap();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 bg-background">
      <div className="relative h-screen overflow-hidden">
        {/* Panels */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="detail-panel absolute inset-0 flex items-center px-6 md:px-16 lg:px-24"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${section.accent}33 0%, transparent 60%)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="relative max-w-4xl mx-auto w-full">
              <div
                className="anim-el h-[2px] w-16 mb-6 origin-left"
                style={{ background: section.accent }}
              />
              <span
                className="anim-el block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3"
                style={{ color: section.accent }}
              >
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
                  <li
                    key={i}
                    className="anim-el flex items-start gap-3 text-muted-foreground text-sm md:text-base"
                  >
                    <span
                      className="mt-2 block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: section.accent }}
                    />
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
              className={`detail-nav-item group flex flex-col items-center gap-2 cursor-pointer ${i === 0 ? 'active' : ''}`}
            >
              <span className="block w-8 h-[2px] rounded-full transition-all duration-500 bg-foreground/20 group-[.active]:bg-[var(--accent-color)] group-[.active]:w-12"
                style={{ '--accent-color': section.accent } as React.CSSProperties}
              />
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
