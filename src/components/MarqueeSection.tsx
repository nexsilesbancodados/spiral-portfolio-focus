import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT =
  "SITES • APLICATIVOS • DESIGN • SISTEMAS • LANDING PAGES • SAAS • UI/UX • BRANDING • E-COMMERCE • DASHBOARDS • SITES • APLICATIVOS • DESIGN • SISTEMAS • LANDING PAGES • SAAS • UI/UX • BRANDING • E-COMMERCE • DASHBOARDS • ";

export const MarqueeSection = () => {
  const textPathRef = useRef<SVGTextPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !textPathRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(textPathRef.current, {
        attr: { startOffset: "-40%" },
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full flex items-center justify-center my-5"
      style={{ height: "clamp(250px, 40vw, 500px)" }}
      aria-hidden="true"
    >
      <svg
        className="overflow-visible my-0 py-0 pb-0"
        style={{ width: "130%", height: "100%" }}
        viewBox="0 0 1600 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path
            id="masterPath"
            d="M-300,300 C50,50 450,550 800,300 C1150,50 1550,550 1900,300"
          />
        </defs>

        {/* Faixa primária de fundo */}
        <use
          href="#masterPath"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={130}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Texto ondulado */}
        <text
          dy="18"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "50px",
            fill: "white",
            textTransform: "uppercase",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <textPath ref={textPathRef} href="#masterPath" startOffset="10%">
            {MARQUEE_TEXT}
          </textPath>
        </text>
      </svg>
    </section>
  );
};
