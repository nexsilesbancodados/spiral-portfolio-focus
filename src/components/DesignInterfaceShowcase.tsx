import React, { useEffect, useRef } from 'react';

declare const gsap: any;

const SHOWCASE_ITEMS = [
  {
    label: 'PROJECT • 01',
    title: 'Clarity in Motion',
    description: 'Interfaces cinematográficas com animações GSAP fluidas e transições que encantam cada interação do usuário.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  },
  {
    label: 'PROJECT • 02',
    title: 'Pixel Perfect',
    description: 'Design systems consistentes com Tailwind CSS, componentes reutilizáveis e tipografia meticulosamente ajustada.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
  },
  {
    label: 'PROJECT • 03',
    title: 'Immersive 3D',
    description: 'Experiências tridimensionais com Three.js e WebGL que transformam interfaces em mundos interativos.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
  },
  {
    label: 'PROJECT • 04',
    title: 'Micro-Interactions',
    description: 'Detalhes que fazem a diferença — hover states, loading animations e feedback visual que tornam o uso intuitivo.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80',
  },
];

function loadScript(src: string, globalName: string): Promise<void> {
  return new Promise((res, rej) => {
    if ((window as any)[globalName]) { res(); return; }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      const check = setInterval(() => {
        if ((window as any)[globalName]) { clearInterval(check); res(); }
      }, 50);
      setTimeout(() => { clearInterval(check); rej(new Error(`Timeout: ${globalName}`)); }, 10000);
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => setTimeout(() => res(), 100);
    s.onerror = () => rej(new Error(`Failed: ${src}`));
    document.head.appendChild(s);
  });
}

export function DesignInterfaceShowcase({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !rootRef.current) return;

    let triggers: any[] = [];
    let timelines: any[] = [];
    let cancelled = false;

    const init = async () => {
      // Ensure GSAP + ScrollTrigger are loaded
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', 'ScrollTrigger');
      if (cancelled) return;

      const g = (window as any).gsap;
      const ST = (window as any).ScrollTrigger;
      if (!g || !ST) return;
      g.registerPlugin(ST);

    const triggers: any[] = [];
    const timelines: any[] = [];

    // Small delay to let layout settle
    const timer = setTimeout(() => {
      SHOWCASE_ITEMS.forEach((_, i) => {
        const box = boxRefs.current[i];
        const overlay = overlayRefs.current[i];
        const content = overlayContentRefs.current[i];
        const caption = captionRefs.current[i];
        if (!box || !overlay || !content) return;

        // Initial states
        gsap.set(box, {
          width: 280,
          height: 280,
          borderRadius: 20,
          overflow: 'hidden',
        });
        gsap.set(overlay, { clipPath: 'inset(100% 0 0 0)' });
        gsap.set(content, { filter: 'blur(8px)', scale: 1.05, y: 30 });
        if (caption) gsap.set(caption, { y: 20, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box,
            scroller: scroller,
            start: 'top 80%',
            end: 'top 10%',
            scrub: 1.2,
          },
        });

        tl.to(box, {
          width: '88vw',
          height: '70vh',
          borderRadius: 8,
          ease: 'expo.out',
        }, 0)
        .to(overlay, {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'expo.out',
        }, 0.3)
        .to(content, {
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
          ease: 'expo.out',
        }, 0.35)
        .to(caption, {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
        }, 0.3);

        timelines.push(tl);
        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      timelines.forEach(tl => tl?.kill?.());
      triggers.forEach(st => st?.kill?.());
    };
  }, [scrollerRef]);

  return (
    <div ref={rootRef} className="anim-el w-full mt-16 space-y-[50vh]">
      {SHOWCASE_ITEMS.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Expanding media box */}
          <div
            ref={(el) => { boxRefs.current[i] = el; }}
            className="relative mx-auto shadow-2xl"
            style={{ width: 280, height: 280, borderRadius: 20, overflow: 'hidden' }}
          >
            {/* Background image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Darken overlay */}
            <div className="absolute inset-0 bg-black/30 z-[1]" />

            {/* Content overlay that reveals */}
            <div
              ref={(el) => { overlayRefs.current[i] = el; }}
              className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center"
              style={{
                background: 'rgba(0,0,0,0.55)',
                clipPath: 'inset(100% 0 0 0)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Caption */}
              <div
                ref={(el) => { captionRefs.current[i] = el; }}
                className="absolute top-4 md:top-6 left-0 w-full text-center font-[family-name:var(--font-display)] text-[10px] md:text-xs tracking-[0.2em] uppercase text-accent/80"
              >
                {item.label}
              </div>

              {/* Content */}
              <div
                ref={(el) => { overlayContentRefs.current[i] = el; }}
                className="max-w-[60ch] px-6 md:px-12 space-y-4"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight tracking-tight">
                  {item.title}
                </h3>
                <div className="mx-auto w-16 h-[2px] bg-accent/60 rounded-full" />
                <p className="text-foreground/80 text-sm md:text-base lg:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom spacer */}
      <div className="h-[20vh]" />
    </div>
  );
}
