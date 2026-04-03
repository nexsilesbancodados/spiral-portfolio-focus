import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cloudImg from "@/assets/cloud-divider.png";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal cloud bank divider between Hero and next section.
 * Uses a realistic cloud PNG that floats up with parallax on scroll.
 */
export const CloudDivider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !wrapperRef.current || !cloudRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle idle float
      gsap.to(cloudRef.current, {
        y: "random(-8, 8)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax on scroll — cloud rises slightly
      gsap.to(cloudRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full -mt-[8vw] z-[5] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Gradient fade from sky to dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[1]" />

      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        className="relative z-[2] w-full h-auto object-cover will-change-transform"
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
