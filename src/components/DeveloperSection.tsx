import { motion } from "framer-motion";
import gustavoPortrait from "@/assets/gustavo-portrait.jpg";

export const DeveloperSection = () => {
  return (
    <section className="relative overflow-hidden bg-background"
      style={{ paddingTop: "clamp(5rem, 10vw, 10rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)" }}
    >
      {/* Ambient glow behind portrait */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-[60%] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.4) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero composition */}
        <div className="relative flex flex-col items-center">
          
          {/* Name + Portrait composition */}
          <div className="relative flex items-center justify-center w-full"
            style={{ minHeight: "clamp(16rem, 40vw, 36rem)" }}
          >
            {/* Giant name text — behind */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center select-none font-bold uppercase tracking-tighter text-primary/90 glow-text"
              aria-hidden="true"
              style={{
                fontSize: "clamp(4.5rem, 16vw, 16rem)",
                lineHeight: 0.82,
              }}
            >
              <span className="block">GUSTAVO</span>
              <span className="block">LOPES</span>
            </motion.h2>

            {/* Portrait — in front, overlapping the text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative z-10"
            >
              <img
                src={gustavoPortrait}
                alt="Gustavo Lopes — Desenvolvedor Full-Stack & Fundador da FOCUSS DEV"
                className="w-auto object-cover object-top rounded-lg"
                style={{
                  height: "clamp(14rem, 35vw, 30rem)",
                  maskImage: "linear-gradient(to bottom, black 60%, transparent 98%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 98%)",
                }}
              />
              {/* Glow ring under portrait */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-[80%] rounded-full blur-2xl opacity-40"
                style={{ background: "hsl(var(--primary))" }}
              />
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/80"
              style={{ fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)" }}
            >
              Fundador &amp; Desenvolvedor Full-Stack
            </p>
            <p className="mt-4 leading-relaxed text-foreground/60"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.125rem)" }}
            >
              Especialista em React, TypeScript e soluções digitais de alta
              performance. Transformando visão em código que converte.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
