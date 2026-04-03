import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CloudDivider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1 = useRef<HTMLDivElement>(null);
  const layer2 = useRef<HTMLDivElement>(null);
  const layer3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Each cloud layer moves at different speed for depth
      gsap.fromTo(layer1.current, { x: "-5%" }, {
        x: "5%",
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(layer2.current, { x: "5%" }, {
        x: "-5%",
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
      gsap.fromTo(layer3.current, { y: "20%" }, {
        y: "-20%",
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 2 },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cloudLayerBase = "absolute inset-0 w-[120%] -left-[10%] will-change-transform";

  return (
    <div
      ref={containerRef}
      className="relative z-20 h-[200px] -mt-16 overflow-hidden pointer-events-none select-none"
    >
      {/* Cloud layer 1 — dense bottom fog */}
      <div
        ref={layer1}
        className={cloudLayerBase}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(255,255,255,0.9) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 60% 90%, rgba(255,255,255,0.85) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 85% 85%, rgba(255,255,255,0.8) 0%, transparent 65%)
          `,
        }}
      />
      {/* Cloud layer 2 — mid wisps */}
      <div
        ref={layer2}
        className={cloudLayerBase}
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 30% 60%, rgba(255,255,255,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 70% 50%, rgba(255,255,255,0.6) 0%, transparent 65%),
            radial-gradient(ellipse 60% 45% at 50% 70%, rgba(255,255,255,0.65) 0%, transparent 60%)
          `,
        }}
      />
      {/* Cloud layer 3 — top thin haze */}
      <div
        ref={layer3}
        className={cloudLayerBase}
        style={{
          background: `
            radial-gradient(ellipse 90% 30% at 40% 40%, rgba(255,255,255,0.4) 0%, transparent 70%),
            radial-gradient(ellipse 70% 25% at 75% 35%, rgba(255,255,255,0.35) 0%, transparent 65%)
          `,
        }}
      />
      {/* Bottom fade to dark background */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
};
