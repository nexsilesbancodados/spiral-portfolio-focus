import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cloudImg from "@/assets/cloud-divider.png";

gsap.registerPlugin(ScrollTrigger);

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
      className="relative w-full z-[12] pointer-events-none select-none"
      style={{ marginTop: "-18vw" }}
      aria-hidden="true"
    >
      {/* Sky gradient behind the cloud — connects hero sky to dark bg */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, #a8d4f0 0%, #8cc3e6 25%, hsl(240 10% 4%) 55%)",
        }}
      />

      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        className="relative z-[2] w-full h-auto will-change-transform drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
