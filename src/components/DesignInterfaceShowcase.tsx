import React, { useEffect, useRef } from 'react';

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
      setTimeout(() => { clearInterval(check); rej(new Error(`Timeout`)); }, 10000);
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

    let cancelled = false;
    const cleanups: (() => void)[] = [];

    const init = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', 'ScrollTrigger');
      } catch { return; }
      if (cancelled) return;

      const g = (window as any).gsap;
      const ST = (window as any).ScrollTrigger;
      if (!g || !ST) return;
      g.registerPlugin(ST);

      // Wait for layout
      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;

      SHOWCASE_ITEMS.forEach((_, i) => {
        const wrapper = boxRefs.current[i]?.parentElement;
        const box = boxRefs.current[i];
        const overlay = overlayRefs.current[i];
        const content = overlayContentRefs.current[i];
        const caption = captionRefs.current[i];
        if (!wrapper || !box || !overlay || !content) return;

        g.set(box, { width: 280, height: 280, borderRadius: 20, overflow: 'hidden' });
        g.set(overlay, { clipPath: 'inset(100% 0 0 0)' });
        g.set(content, { filter: 'blur(8px)', scale: 1.05, y: 30 });
        if (caption) g.set(caption, { y: 20, opacity: 0 });

        // Pin each card in the center while it expands
        const tl = g.timeline({
          scrollTrigger: {
            trigger: wrapper,
            scroller: scroller,
            start: 'top top',
            end: '+=150%',
            scrub: 1,
            pin: box,
            pinSpacing: true,
          },
        });

        tl.to(box, { width: '92vw', height: '88vh', borderRadius: 0, ease: 'expo.out', duration: 1 }, 0)
          .to(overlay, { clipPath: 'inset(0% 0 0 0)', ease: 'expo.out', duration: 1 }, 0.2)
          .to(content, { y: 0, filter: 'blur(0px)', scale: 1, ease: 'expo.out', duration: 1 }, 0.25)
          .to(caption, { y: 0, opacity: 1, ease: 'power3.out', duration: 0.8 }, 0.2)
          // Hold fully expanded
          .to({}, { duration: 0.5 })
          // Shrink and fade out
          .to(box, { scale: 0.9, opacity: 0, duration: 0.5, ease: 'power2.in' });

        cleanups.push(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn());
    };
  }, [scrollerRef]);

  return (
    <div ref={rootRef} className="anim-el w-full mt-16 space-y-[20vh]">
      {SHOWCASE_ITEMS.map((item, i) => (
        <div key={i} className="flex flex-col items-center min-h-[100vh]" style={{ perspective: '900px' }}>
          <div
            ref={(el) => { boxRefs.current[i] = el; }}
            className="relative mx-auto shadow-2xl"
            style={{ width: 280, height: 280, borderRadius: 20, overflow: 'hidden' }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 z-[1]" />

            <div
              ref={(el) => { overlayRefs.current[i] = el; }}
              className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center"
              style={{
                background: 'rgba(0,0,0,0.55)',
                clipPath: 'inset(100% 0 0 0)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                ref={(el) => { captionRefs.current[i] = el; }}
                className="absolute top-4 md:top-6 left-0 w-full text-center font-[family-name:var(--font-display)] text-[10px] md:text-xs tracking-[0.2em] uppercase text-accent/80"
              >
                {item.label}
              </div>

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
      <div className="h-[20vh]" />
    </div>
  );
}
