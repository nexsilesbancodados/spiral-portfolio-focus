import { useEffect, useRef } from "react";
const cloudImg = "/images/cloud-divider.webp";

export const CloudDivider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !wrapperRef.current || !cloudRef.current) return;

    let ctx: { revert: () => void } | undefined;
    let rafId: number;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        if (!wrapperRef.current || !cloudRef.current) return;

        rafId = requestAnimationFrame(() => {
          ctx = gsap.context(() => {
            gsap.to(cloudRef.current, {
              y: -8,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              force3D: true,
            });

            gsap.to(wrapperRef.current, {
              y: -30,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
                fastScrollEnd: true,
              },
            });
          });
        });
      }
    );

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
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
        width={1880}
        height={1058}
        className="relative z-[2] h-auto w-[130%] max-w-none will-change-transform sm:w-[126%] lg:w-[121%] xl:w-[116%]"
        style={{
          aspectRatio: "1880 / 1058",
          maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 100%)",
        }}
        loading="eager"
        fetchPriority="high"
        draggable={false}
      />
    </div>
  );
};
