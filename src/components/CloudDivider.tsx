import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fixed overlay cloud that scales up on scroll creating an immersive fog transition.
 * Inspired by: radial-gradient cloud + GSAP scrub timeline.
 * The cloud appears between Hero and About, engulfs the screen, then fades away.
 */
export const CloudDivider = () => {
  const cloudRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !cloudRef.current || !containerRef.current) return;

    const cloud = cloudRef.current;

    const ctx = gsap.context(() => {
      // Subtle idle float
      gsap.to(cloud, {
        x: "random(-30, 30)",
        y: "random(-30, 30)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Main scroll timeline — cloud enters, engulfs, exits
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      tl
        // Cloud fades in and grows
        .fromTo(cloud,
          { opacity: 0, scale: 0.1 },
          { opacity: 0.95, scale: 2.5, ease: "power2.inOut", duration: 1 }
        )
        // Peak density — fully immersed
        .to(cloud, {
          scale: 6,
          opacity: 1,
          ease: "none",
          duration: 0.8,
        })
        // Cloud expands and fades out
        .to(cloud, {
          scale: 12,
          opacity: 0,
          ease: "power2.in",
          duration: 1,
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Scroll trigger area — placed in document flow between Hero and About */}
      <div
        ref={containerRef}
        className="relative h-[60vh] -mt-8 pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Fixed cloud overlay */}
      <div className="fixed inset-0 z-[15] flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          ref={cloudRef}
          className="absolute will-change-transform"
          style={{
            width: "100vmax",
            height: "100vmax",
            borderRadius: "50%",
            background: `radial-gradient(circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.85) 15%,
              rgba(255, 255, 255, 0.5) 35%,
              rgba(255, 255, 255, 0) 60%
            )`,
            opacity: 0,
            transform: "scale(0.1)",
          }}
        />
      </div>
    </>
  );
};
