import { useEffect, useMemo, useRef, useState } from 'react';

const slides = [
  { title: 'FOCUSS DEV', description: 'Transformando ideias em experiências digitais extraordinárias. Desenvolvimento web de alto nível.', media: '/images/slide-01.jpg', skills: ['React', 'TypeScript', 'Node.js', 'Next.js'] },
  { title: 'Web Design', description: 'Interfaces modernas e elegantes que conectam marcas ao futuro digital com impacto visual.', media: '/images/hero-webdesign.jpg', skills: ['Figma', 'UI/UX', 'Prototipagem', 'Design System'] },
  { title: 'Desenvolvimento', description: 'Código limpo, performance máxima e arquitetura escalável para projetos robustos.', media: '/images/hero-dev.jpg', skills: ['JavaScript', 'Python', 'APIs REST', 'PostgreSQL'] },
  { title: 'Serviços', description: 'Soluções digitais completas — tráfego pago, sites, apps, SaaS e design premium.', media: '/images/hero-servicos.jpg', skills: ['Tráfego Pago', 'Sites', 'Apps', 'SaaS'] },
  { title: 'Inovação e IA', description: 'Tecnologias de ponta e inteligência artificial para soluções que fazem a diferença.', media: '/images/hero-ia.jpg', skills: ['IA', 'Automação', 'Chatbots', 'Cloud'] },
  { title: 'Mobile e Web', description: 'Aplicações responsivas e multiplataforma que funcionam perfeitamente em qualquer dispositivo.', media: '/images/hero-mobile.jpg', skills: ['React Native', 'PWA', 'Responsivo', 'Docker'] },
  { title: 'Skills', description: 'Domínio completo do ecossistema moderno — front-end, back-end, cloud e design em um só lugar.', media: '/images/hero-skills.jpg', skills: ['React', 'Node.js', 'Python', 'AWS'] },
];

export function LuminaSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const current = useMemo(() => slides[currentSlide], [currentSlide]);

  const goToSlide = (index: number) => {
    const bounded = (index + slides.length) % slides.length;
    setCurrentSlide(bounded);
  };

  const triggerExplore = () => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: currentSlide } }));
  };

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
        window.setTimeout(() => {
          wheelCooldown = false;
        }, 900);
      }

      if (wheelAccum < 0) {
        wheelAccum = 0;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [currentSlide]);

  return (
    <main className="slider-wrapper loaded" ref={containerRef}>
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.title}
            src={slide.media}
            alt={slide.title}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              filter: 'saturate(1.08) contrast(1.03)',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-transparent to-transparent" />
      </div>

      <span className="slide-number">{String(currentSlide + 1).padStart(2, '0')}</span>
      <span className="slide-total">{String(slides.length).padStart(2, '0')}</span>

      <div className="slide-content animate-fade-in">
        <h1 className="slide-title">{current.title}</h1>
        <p className="slide-description">{current.description}</p>
        <div className="slide-skills">
          {current.skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <nav className="slides-navigation" aria-label="Navegação de seções">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => goToSlide(index)}
            className={`slide-nav-item ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Ir para ${slide.title}`}
          >
            <div className="slide-progress-line">
              <div className="slide-progress-fill" style={{ width: index === currentSlide ? '100%' : '0%' }} />
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
