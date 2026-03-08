import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const waitForGsap = () => {
      if (typeof gsap === 'undefined') {
        setTimeout(waitForGsap, 200);
        return;
      }

      // Load ScrollTrigger plugin
      const loadScrollTrigger = () => new Promise<void>((res) => {
        if ((window as any).ScrollTrigger) { gsap.registerPlugin((window as any).ScrollTrigger); res(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        s.onload = () => { setTimeout(() => { gsap.registerPlugin((window as any).ScrollTrigger); res(); }, 100); };
        document.head.appendChild(s);
      });

      loadScrollTrigger().then(() => {
        const ScrollTrigger = (window as any).ScrollTrigger;
        if (!containerRef.current) return;

        const sectionEls = containerRef.current.querySelectorAll('.detail-section');
        sectionEls.forEach((section) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          });

          tl.from(section.querySelector('.section-line'), { scaleX: 0, duration: 0.8, ease: 'power3.out' })
            .from(section.querySelector('.section-subtitle'), { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
            .from(section.querySelector('.section-title'), { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .from(section.querySelector('.section-desc'), { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
            .from(section.querySelectorAll('.detail-item'), { y: 25, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
            .from(section.querySelector('.section-image'), { scale: 1.1, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
        });
      });
    };

    waitForGsap();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 bg-background">
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="detail-section min-h-screen flex items-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
        >
          <div className={`max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
            {/* Text Content */}
            <div className={index % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
              <div
                className="section-line h-[2px] w-16 mb-6 origin-left"
                style={{ background: section.accent }}
              />
              <span
                className="section-subtitle block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase mb-3"
                style={{ color: section.accent }}
              >
                {section.subtitle}
              </span>
              <h2 className="section-title font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight tracking-tight">
                {section.title}
              </h2>
              <p className="section-desc text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                {section.description}
              </p>
              <ul className="space-y-3">
                {section.details.map((detail, i) => (
                  <li
                    key={i}
                    className="detail-item flex items-start gap-3 text-muted-foreground text-sm md:text-base"
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

            {/* Image */}
            <div className={`section-image relative overflow-hidden rounded-sm ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
              <div className="aspect-[4/3] relative">
                <img
                  src={section.image}
                  alt={section.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${section.accent}22 0%, transparent 60%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
