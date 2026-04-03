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
      className="relative w-full z-[12] pointer-events-none select-none overflow-visible"
      style={{ marginTop: "-28vw" }}
      aria-hidden="true"
    >
      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        className="relative left-1/2 z-[2] h-auto w-[140%] max-w-none -translate-x-1/2 will-change-transform mix-blend-screen drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        loading="eager"
        draggable={false}
      />
    </div>
    </div>
  );
};
