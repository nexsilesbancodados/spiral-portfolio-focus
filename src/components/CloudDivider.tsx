import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cloudImg from "@/assets/cloud-divider.png";

gsap.registerPlugin(ScrollTrigger);

export const CloudDivider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !containerRef.current || !cloudRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cloudRef.current,
        { y: 60, scale: 1.15 },
        {
          y: -40,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-20 -mt-24 -mb-24 h-[280px] overflow-hidden pointer-events-none select-none"
    >
      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover will-change-transform"
        loading="lazy"
        width={1920}
        height={512}
      />
    </div>
  );
};
