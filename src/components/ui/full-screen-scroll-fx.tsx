import React, {
  CSSProperties,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Section = {
  id?: string;
  background: string;
  leftLabel?: ReactNode;
  title: string | ReactNode;
  rightLabel?: ReactNode;
  renderBackground?: (active: boolean, previous: boolean) => ReactNode;
};

type Colors = Partial<{
  text: string;
  overlay: string;
  pageBg: string;
  stageBg: string;
}>;

type Durations = Partial<{
  change: number;
  snap: number;
}>;

export type FullScreenFXAPI = {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  getIndex: () => number;
  refresh: () => void;
};

export type FullScreenFXProps = {
  sections: Section[];
  className?: string;
  style?: CSSProperties;
  fontFamily?: string;
  header?: ReactNode;
  footer?: ReactNode;
  gap?: number;
  gridPaddingX?: number;
  showProgress?: boolean;
  debug?: boolean;
  durations?: Durations;
  reduceMotion?: boolean;
  smoothScroll?: boolean;
  bgTransition?: "fade" | "wipe";
  parallaxAmount?: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  colors?: Colors;
  apiRef?: React.Ref<FullScreenFXAPI>;
  ariaLabel?: string;
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,
      fontFamily = '"Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      header,
      footer,
      gap = 1,
      gridPaddingX = 2,
      showProgress = true,
      debug = false,
      durations = { change: 0.7, snap: 800 },
      reduceMotion,
      smoothScroll = false,
      bgTransition = "fade",
      parallaxAmount = 4,
      currentIndex,
      onIndexChange,
      initialIndex = 0,
      colors = {
        text: "rgba(245,245,245,0.92)",
        overlay: "rgba(0,0,0,0.35)",
        pageBg: "#050505",
        stageBg: "#000000",
      },
      apiRef,
      ariaLabel = "Full screen scroll slideshow",
    },
    ref
  ) => {
    const total = sections.length;
    const [localIndex, setLocalIndex] = useState(clamp(initialIndex, 0, Math.max(0, total - 1)));
    const isControlled = typeof currentIndex === "number";
    const index = isControlled ? clamp(currentIndex!, 0, Math.max(0, total - 1)) : localIndex;

    const rootRef = useRef<HTMLDivElement>(null);
    const fixedRef = useRef<HTMLDivElement>(null);
    const fixedSectionRef = useRef<HTMLDivElement>(null);

    const bgRefs = useRef<HTMLImageElement[]>([]);
    const wordRefs = useRef<HTMLSpanElement[][]>([]);

    const leftTrackRef = useRef<HTMLDivElement>(null);
    const rightTrackRef = useRef<HTMLDivElement>(null);
    const leftItemRefs = useRef<HTMLDivElement[]>([]);
    const rightItemRefs = useRef<HTMLDivElement[]>([]);

    const progressFillRef = useRef<HTMLDivElement>(null);
    const currentNumberRef = useRef<HTMLSpanElement>(null);

    const stRef = useRef<ScrollTrigger | null>(null);
    const lastIndexRef = useRef(index);
    const isAnimatingRef = useRef(false);
    const isSnappingRef = useRef(false);
    const sectionTopRef = useRef<number[]>([]);

    const prefersReduced = useMemo(() => {
      if (typeof window === "undefined") return false;
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);
    const motionOff = reduceMotion ?? prefersReduced;

    // Split words for center title
    const tempWordBucket = useRef<HTMLSpanElement[]>([]);
    const splitWords = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean);
      return words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <span
            style={{ display: "inline-block" }}
            ref={(el) => el && tempWordBucket.current.push(el)}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ));
    };

    const WordsCollector = ({ onReady }: { onReady: () => void }) => {
      useEffect(() => onReady(), []); // eslint-disable-line
      return null;
    };

    const computePositions = () => {
      const el = fixedSectionRef.current;
      if (!el) return;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const arr: number[] = [];
      for (let i = 0; i < total; i++) arr.push(top + (h * i) / total);
      sectionTopRef.current = arr;
    };

    const measureRAF = (fn: () => void) => {
      if (typeof window === "undefined") return;
      requestAnimationFrame(() => requestAnimationFrame(fn));
    };

    const measureAndCenterLists = (toIndex = index, animate = true) => {
      const centerTrack = (
        container: HTMLDivElement | null,
        items: HTMLDivElement[],
        isRight: boolean
      ) => {
        if (!container || items.length === 0) return;
        const first = items[0];
        const second = items[1];
        const contRect = container.getBoundingClientRect();
        let rowH = first.getBoundingClientRect().height;
        if (second) {
          rowH = second.getBoundingClientRect().top - first.getBoundingClientRect().top;
        }
        const targetY = contRect.height / 2 - rowH / 2 - toIndex * rowH;
        const prop = isRight ? rightTrackRef : leftTrackRef;
        if (!prop.current) return;
        if (animate) {
          gsap.to(prop.current, {
            y: targetY,
            duration: (durations.change ?? 0.7) * 0.9,
            ease: "power3.out",
          });
        } else {
          gsap.set(prop.current, { y: targetY });
        }
      };

      measureRAF(() => {
        measureRAF(() => {
          centerTrack(leftTrackRef.current, leftItemRefs.current, false);
          centerTrack(rightTrackRef.current, rightItemRefs.current, true);
        });
      });
    };

    // Section change visuals
    const changeSection = (to: number) => {
      if (to === lastIndexRef.current || isAnimatingRef.current) return;
      const from = lastIndexRef.current;
      const down = to > from;
      isAnimatingRef.current = true;

      if (!isControlled) setLocalIndex(to);
      onIndexChange?.(to);

      if (currentNumberRef.current) {
        currentNumberRef.current.textContent = String(to + 1).padStart(2, "0");
      }
      if (progressFillRef.current) {
        const p = (to / (total - 1 || 1)) * 100;
        progressFillRef.current.style.width = `${p}%`;
      }

      const D = durations.change ?? 0.7;

      // center title word animation
      const outWords = wordRefs.current[from] || [];
      const inWords = wordRefs.current[to] || [];
      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: down ? -100 : 100,
          opacity: 0,
          duration: D * 0.6,
          stagger: down ? 0.03 : -0.03,
          ease: "power3.out",
        });
      }
      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 });
        gsap.to(inWords, {
          yPercent: 0,
          opacity: 1,
          duration: D,
          stagger: down ? 0.05 : -0.05,
          ease: "power3.out",
        });
      }

      // backgrounds
      const prevBg = bgRefs.current[from];
      const newBg = bgRefs.current[to];
      if (bgTransition === "fade") {
        if (newBg) {
          gsap.set(newBg, { opacity: 0, scale: 1.04, yPercent: down ? 1 : -1 });
          gsap.to(newBg, { opacity: 1, scale: 1, yPercent: 0, duration: D, ease: "power2.out" });
        }
        if (prevBg) {
          gsap.to(prevBg, {
            opacity: 0,
            yPercent: down ? -parallaxAmount : parallaxAmount,
            duration: D,
            ease: "power2.out",
          });
        }
      } else {
        if (newBg) {
          gsap.set(newBg, {
            opacity: 1,
            clipPath: down ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
            scale: 1,
            yPercent: 0,
          });
          gsap.to(newBg, { clipPath: "inset(0 0 0 0)", duration: D, ease: "power3.out" });
        }
        if (prevBg) {
          gsap.to(prevBg, { opacity: 0, duration: D * 0.8, ease: "power2.out" });
        }
      }

      // lists
      measureAndCenterLists(to, true);

      leftItemRefs.current.forEach((el, i) => {
        el.classList.toggle("active", i === to);
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? 10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });
      rightItemRefs.current.forEach((el, i) => {
        el.classList.toggle("active", i === to);
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? -10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });

      gsap.delayedCall(D, () => {
        lastIndexRef.current = to;
        isAnimatingRef.current = false;
      });
    };

    const goTo = (to: number, withScroll = true) => {
      const clamped = clamp(to, 0, total - 1);
      isSnappingRef.current = true;
      changeSection(clamped);

      const pos = sectionTopRef.current[clamped];
      const snapMs = durations.snap ?? 800;

      if (withScroll && typeof window !== "undefined") {
        window.scrollTo({ top: pos, behavior: "smooth" });
        setTimeout(() => (isSnappingRef.current = false), snapMs);
      } else {
        setTimeout(() => (isSnappingRef.current = false), 10);
      }
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    useImperativeHandle(apiRef, () => ({
      next,
      prev,
      goTo,
      getIndex: () => index,
      refresh: () => ScrollTrigger.refresh(),
    }));

    const handleJump = (i: number) => goTo(i);

    const handleLoadedStagger = () => {
      leftItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: i * 0.06, ease: "power3.out" }
        );
      });
      rightItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: i === index ? 1 : 0.35, y: 0, duration: 0.5, delay: 0.2 + i * 0.06, ease: "power3.out" }
        );
      });
    };

    // Initialize word visibility after refs are populated
    const initWordsRef = useRef(false);
    useEffect(() => {
      if (initWordsRef.current) return;
      // Small delay to ensure WordsCollector has fired
      const timer = setTimeout(() => {
        wordRefs.current.forEach((words, sIdx) => {
          words.forEach((w) => {
            gsap.set(w, {
              yPercent: sIdx === index ? 0 : 100,
              opacity: sIdx === index ? 1 : 0,
            });
          });
        });
        initWordsRef.current = true;
      }, 50);
      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ScrollTrigger setup
    useLayoutEffect(() => {
      if (typeof window === "undefined") return;
      const fixed = fixedRef.current;
      const fs = fixedSectionRef.current;
      if (!fixed || !fs || total === 0) return;

      gsap.set(bgRefs.current, { opacity: 0, scale: 1.04, yPercent: 0 });
      if (bgRefs.current[0]) gsap.set(bgRefs.current[0], { opacity: 1, scale: 1 });

      computePositions();
      measureAndCenterLists(index, false);

      const st = ScrollTrigger.create({
        trigger: fs,
        start: "top top",
        end: "bottom bottom",
        pin: fixed,
        pinSpacing: true,
        onUpdate: (self: any) => {
          if (motionOff || isSnappingRef.current) return;
          const prog = self.progress;
          const target = Math.min(total - 1, Math.floor(prog * total));
          if (target !== lastIndexRef.current && !isAnimatingRef.current) {
            const nextIdx = lastIndexRef.current + (target > lastIndexRef.current ? 1 : -1);
            goTo(nextIdx, false);
          }
          if (progressFillRef.current) {
            const p = (lastIndexRef.current / (total - 1 || 1)) * 100;
            progressFillRef.current.style.width = `${p}%`;
          }
        },
      });

      stRef.current = st;

      if (initialIndex && initialIndex > 0 && initialIndex < total) {
        requestAnimationFrame(() => goTo(initialIndex, false));
      }

      const ro = new ResizeObserver(() => {
        computePositions();
        measureAndCenterLists(lastIndexRef.current, false);
        ScrollTrigger.refresh();
      });
      ro.observe(fs);

      return () => {
        ro.disconnect();
        st.kill();
        stRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, initialIndex, motionOff, bgTransition, parallaxAmount]);

    // mount entrance
    useEffect(() => {
      handleLoadedStagger();
      measureAndCenterLists(index, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cssVars: CSSProperties = {
      ["--fx-font" as any]: fontFamily,
      ["--fx-text" as any]: colors.text ?? "rgba(245,245,245,0.92)",
      ["--fx-overlay" as any]: colors.overlay ?? "rgba(0,0,0,0.35)",
      ["--fx-page-bg" as any]: colors.pageBg ?? "#050505",
      ["--fx-stage-bg" as any]: colors.stageBg ?? "#000",
      ["--fx-gap" as any]: `${gap}rem`,
      ["--fx-grid-px" as any]: `${gridPaddingX}rem`,
      ["--fx-row-gap" as any]: "10px",
    };

    return (
      <div
        ref={(node) => {
          (rootRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={["fx", className].filter(Boolean).join(" ")}
        style={{ ...cssVars, ...style }}
        aria-label={ariaLabel}
      >
        {debug && <p style={{ position: "fixed", top: 10, left: 10, zIndex: 999, color: "#fff" }}>Section: {index}</p>}

        <div className="fx-scroll-area">
          <div ref={fixedSectionRef} className="fx-fixed-section">
            <div ref={fixedRef} className="fx-fixed">
              {/* Backgrounds */}
              <div className="fx-bg-stack">
                {sections.map((s, i) => (
                  <div key={s.id ?? i} className="fx-bg-layer">
                    {s.renderBackground ? (
                      s.renderBackground(index === i, lastIndexRef.current === i)
                    ) : (
                      <>
                        <img
                          ref={(el) => el && (bgRefs.current[i] = el)}
                          src={s.background}
                          alt=""
                          className="fx-bg-img"
                        />
                        <div className="fx-bg-overlay" />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="fx-grid">
                {header && <div className="fx-header">{header}</div>}

                <div className="fx-content">
                  {/* Left list */}
                  <div className="fx-left">
                    <div ref={leftTrackRef} className="fx-track">
                      {sections.map((s, i) => (
                        <div
                          key={i}
                          className={`fx-list-item ${i === index ? "active" : ""}`}
                          ref={(el) => el && (leftItemRefs.current[i] = el)}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.leftLabel}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center title */}
                  <div className="fx-center">
                    {sections.map((s, sIdx) => {
                      tempWordBucket.current = [];
                      const isString = typeof s.title === "string";
                      return (
                        <div key={sIdx} className="fx-title-layer">
                          <div className="fx-title-inner">
                            {isString ? splitWords(s.title as string) : s.title}
                          </div>
                          <WordsCollector
                            onReady={() => {
                              if (tempWordBucket.current.length) {
                                wordRefs.current[sIdx] = [...tempWordBucket.current];
                              }
                              tempWordBucket.current = [];
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right list */}
                  <div className="fx-right">
                    <div ref={rightTrackRef} className="fx-track">
                      {sections.map((s, i) => (
                        <div
                          key={i}
                          className={`fx-list-item ${i === index ? "active" : ""}`}
                          ref={(el) => el && (rightItemRefs.current[i] = el)}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {s.rightLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer + progress */}
                <div className="fx-footer-row">
                  {footer && <div className="fx-footer">{footer}</div>}
                  {showProgress && (
                    <div className="fx-progress">
                      <div className="fx-progress-numbers">
                        <span ref={currentNumberRef}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{String(total).padStart(2, "0")}</span>
                      </div>
                      <div className="fx-progress-bar">
                        <div ref={progressFillRef} className="fx-progress-fill" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* End spacer */}
          <div className="fx-end">
            <p>fin</p>
          </div>
        </div>

        <style>{`
          .fx {
            font-family: var(--fx-font);
            color: var(--fx-text);
            background: var(--fx-page-bg);
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          .fx-scroll-area {
            position: relative;
          }
          .fx-fixed-section {
            height: ${total * 100}vh;
            position: relative;
          }
          .fx-fixed {
            width: 100%;
            height: 100vh;
            position: relative;
            overflow: hidden;
            background: var(--fx-stage-bg);
          }

          /* Backgrounds */
          .fx-bg-stack {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .fx-bg-layer {
            position: absolute;
            inset: 0;
          }
          .fx-bg-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .fx-bg-overlay {
            position: absolute;
            inset: 0;
            background: var(--fx-overlay);
          }

          /* Grid */
          .fx-grid {
            position: absolute;
            inset: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            padding: var(--fx-gap) var(--fx-grid-px);
          }
          .fx-header {
            padding: 1.5rem 0;
            text-align: center;
            flex-shrink: 0;
          }
          .fx-content {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 1rem;
            align-items: center;
            min-height: 0;
          }

          /* Lists */
          .fx-left, .fx-right {
            height: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            position: relative;
          }
          .fx-track {
            display: flex;
            flex-direction: column;
            gap: var(--fx-row-gap);
            will-change: transform;
          }
          .fx-list-item {
            font-family: var(--fx-font);
            font-size: clamp(0.65rem, 1.1vw, 0.85rem);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            padding: 0.4rem 0;
            transition: color 0.3s ease;
            white-space: nowrap;
            opacity: 0.35;
            color: var(--fx-text);
          }
          .fx-list-item.active {
            opacity: 1;
          }
          .fx-list-item:hover {
            opacity: 0.8;
          }
          .fx-right .fx-list-item {
            text-align: right;
          }

          /* Center */
          .fx-center {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }
          .fx-title-layer {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .fx-title-layer .fx-title-inner span > span {
            display: inline-block;
          }
          .fx-title-layer:not(:first-child) {
            opacity: 0;
          }
          .fx-title-inner {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(2.5rem, 6vw, 5.5rem);
            font-weight: 300;
            text-align: center;
            line-height: 1.1;
            letter-spacing: -0.02em;
            text-shadow: 0 4px 30px rgba(0,0,0,0.4);
          }

          /* Footer */
          .fx-footer-row {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 0;
            gap: 2rem;
          }
          .fx-footer {
            flex-shrink: 0;
          }
          .fx-progress {
            flex: 1;
            max-width: 300px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-left: auto;
          }
          .fx-progress-numbers {
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            letter-spacing: 0.15em;
            opacity: 0.6;
          }
          .fx-progress-bar {
            width: 100%;
            height: 1px;
            background: rgba(255,255,255,0.15);
            border-radius: 1px;
            overflow: hidden;
          }
          .fx-progress-fill {
            height: 100%;
            width: 0%;
            background: hsl(45, 100%, 55%);
            transition: width 0.5s ease;
          }

          /* End */
          .fx-end {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--fx-page-bg);
            color: var(--fx-text);
            opacity: 0.3;
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          @media (max-width: 900px) {
            .fx-content {
              grid-template-columns: 1fr;
              row-gap: 3vh;
              place-items: center;
            }
            .fx-left, .fx-right, .fx-center {
              height: auto;
            }
            .fx-left, .fx-right {
              justify-content: center;
            }
            .fx-track {
              transform: none !important;
            }
            .fx-right .fx-list-item {
              text-align: center;
            }
          }
        `}</style>
      </div>
    );
  }
);

FullScreenScrollFX.displayName = "FullScreenScrollFX";
