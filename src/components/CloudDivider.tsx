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
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(wrapperRef.current, {
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
      className="relative z-[12] -mt-[62vw] flex w-full justify-center overflow-visible pointer-events-none select-none sm:-mt-[56vw] lg:-mt-[47vw] xl:-mt-[41vw]"
      aria-hidden="true"
    >
      <img
        ref={cloudRef}
        src={cloudImg}
        alt=""
        className="relative z-[2] h-auto w-[130%] max-w-none will-change-transform drop-shadow-2xl sm:w-[126%] lg:w-[121%] xl:w-[116%]"
        style={{
          maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 100%)",
        }}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
