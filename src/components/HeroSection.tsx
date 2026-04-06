import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import heroStatue from "@/assets/hero-statue.webp";

export const HERO_IMAGE_SRC = heroStatue;

export const HeroSection = () => {
  const statueRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !statueRef.current) return;

    let ctx: gsap.Context;
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.to(statueRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="primary-aura absolute inset-0 z-[1]" />
      <div className="absolute left-1/2 top-1/2 z-[1] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 md:pt-36 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="order-2 mx-auto max-w-2xl text-center lg:order-1 lg:mx-0 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-6 inline-block rounded-full border border-primary/30 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
                Desenvolvimento & Design
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Código que <span className="text-primary glow-text">eleva</span>,
              <br />
              design que <span className="text-primary glow-text">conquista</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/75 lg:mx-0"
            >
              Estruturas digitais profissionais que posicionam seu negócio e convertem visitantes em resultados reais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <a
                href="#projects"
                className="rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Ver Projetos
              </a>
              <a
                href="#about"
                className="rounded-full border border-foreground/25 px-8 py-3.5 font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary"
              >
                Saiba Mais
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div className="relative w-full max-w-[34rem] sm:max-w-[40rem] lg:max-w-[50rem] xl:max-w-[56rem]">
              <div className="primary-aura-bottom absolute inset-0 blur-2xl" />
              <img
                ref={statueRef}
                src={heroStatue}
                alt="Estátua grega com óculos usando laptop — representação artística da FOCUSS DEV"
                width={800}
                height={1000}
                className="relative z-10 w-full rounded-3xl text-xs will-change-transform"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="text-foreground/60" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
