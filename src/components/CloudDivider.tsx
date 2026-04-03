import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cloudImg from "@/assets/cloud-divider.png";

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal cloud bank divider between Hero and next section.
 * Cloud PNG blends into the sky gradient using mix-blend-mode.
 */
export const CloudDivider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !wrapperRef.current || !cloudRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(cloudRef.current, {
        y: "random(-6, 6)",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(cloudRef.current, {
        y: -30,
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
      className="relative w-full -mt-[12vw] z-[5] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Sky-to-dark gradient behind cloud */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, #a8d4f0 0%, #7ab8de 30%, hsl(240 10% 4%) 70%)",
        }}
      />

      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        className="relative z-[2] w-full h-auto will-change-transform"
        style={{ mixBlendMode: "screen" }}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
