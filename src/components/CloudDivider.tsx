import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cloudImg from "@/assets/cloud-divider.png";

gsap.registerPlugin(ScrollTrigger);

const LIGHTNING_BOLTS = [
  // Each bolt is an SVG path representing a lightning shape
  "M50,0 L45,28 L55,30 L42,58 L54,60 L38,100",
  "M50,0 L53,22 L44,25 L52,50 L43,53 L48,100",
  "M50,0 L47,20 L56,23 L44,55 L53,57 L40,100",
  "M50,0 L55,18 L46,22 L58,48 L47,52 L50,100",
];

interface LightningStrike {
  id: number;
  x: number;
  pathIndex: number;
  scale: number;
  opacity: number;
}

export const CloudDivider = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);
  const [strikes, setStrikes] = useState<LightningStrike[]>([]);
  const idRef = useRef(0);

  const spawnLightning = useCallback(() => {
    const id = ++idRef.current;
    const strike: LightningStrike = {
      id,
      x: 15 + Math.random() * 70, // 15%–85% horizontal
      pathIndex: Math.floor(Math.random() * LIGHTNING_BOLTS.length),
      scale: 0.6 + Math.random() * 0.8,
      opacity: 0.7 + Math.random() * 0.3,
    };

    setStrikes((prev) => [...prev, strike]);

    // Remove after flash
    setTimeout(() => {
      setStrikes((prev) => prev.filter((s) => s.id !== id));
    }, 200 + Math.random() * 150);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const scheduleNext = () => {
      const delay = 1500 + Math.random() * 4000; // 1.5s–5.5s
      return setTimeout(() => {
        spawnLightning();
        // Sometimes double-strike
        if (Math.random() > 0.6) {
          setTimeout(spawnLightning, 80 + Math.random() * 120);
        }
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [spawnLightning]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !wrapperRef.current || !cloudRef.current) return;

    const ctx = gsap.context(() => {
      // Smooth infinite float using a single repeating tween
      gsap.to(cloudRef.current, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax on scroll applied to the wrapper to avoid conflicting with the float
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
        className="relative z-[2] h-auto w-[130%] max-w-none will-change-transform mix-blend-screen drop-shadow-2xl sm:w-[126%] lg:w-[121%] xl:w-[116%]"
        loading="eager"
        draggable={false}
      />

      {/* Lightning bolts */}
      <div className="absolute inset-0 z-[1] flex items-end justify-center">
        <div className="relative w-[130%] sm:w-[126%] lg:w-[121%] xl:w-[116%]" style={{ aspectRatio: "auto" }}>
          {strikes.map((strike) => (
            <svg
              key={strike.id}
              className="absolute animate-[lightning-flash_0.15s_ease-out]"
              style={{
                left: `${strike.x}%`,
                top: "55%",
                width: `${2 + strike.scale * 2}%`,
                height: "50%",
                opacity: strike.opacity,
                filter: "drop-shadow(0 0 8px hsl(210 80% 85%)) drop-shadow(0 0 20px hsl(210 90% 75%))",
                transform: `translateX(-50%) scaleX(${Math.random() > 0.5 ? 1 : -1})`,
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d={LIGHTNING_BOLTS[strike.pathIndex]}
                stroke="hsl(210 95% 92%)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={LIGHTNING_BOLTS[strike.pathIndex]}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Glow flash when lightning strikes */}
      {strikes.length > 0 && (
        <div
          className="absolute inset-0 z-[0] animate-[lightning-flash_0.2s_ease-out]"
          style={{
            background: "radial-gradient(ellipse at 50% 80%, hsl(210 80% 90% / 0.15), transparent 60%)",
          }}
        />
      )}
    </div>
  );
};
