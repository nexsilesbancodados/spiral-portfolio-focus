import { motion } from "framer-motion";
import gustavoPortrait from "@/assets/gustavo-portrait.webp";

export const DeveloperSection = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(5rem, 10vw, 10rem)",
        paddingBottom: "clamp(6rem, 12vw, 12rem)",
      }}
    >
      {/* Gradient transition to white at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, white 100%)",
        }}
      />

      {/* Ambient glow behind portrait */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] h-[50%] w-[40%] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center">
          {/* Name + Portrait composition */}
          <div
            className="relative flex items-center justify-center w-full"
            style={{ minHeight: "clamp(18rem, 45vw, 40rem)" }}
          >
            {/* Giant name text — behind */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center select-none font-bold uppercase tracking-tighter"
              aria-hidden="true"
              style={{
                fontSize: "clamp(5rem, 18vw, 18rem)",
                lineHeight: 0.82,
                color: "hsl(var(--primary) / 0.35)",
                textShadow: "0 0 60px hsl(var(--primary) / 0.2)",
              }}
            >
              <span className="block">GUSTAVO</span>
              <span className="block">LOPES</span>
            </motion.h2>

            {/* Portrait — in front */}
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
                loading="lazy"
                decoding="async"
                className="w-auto object-cover object-top"
                style={{
                  height: "clamp(16rem, 40vw, 34rem)",
                  maskImage:
                    "linear-gradient(to bottom, black 65%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 65%, transparent 100%)",
                }}
              />
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-20 -mt-4 max-w-xl text-center"
          >
            <p
              className="font-semibold uppercase tracking-[0.4em]"
              style={{
                fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
                color: "hsl(var(--primary))",
              }}
            >
              Fundador &amp; Desenvolvedor Full-Stack
            </p>
            <p
              className="mt-4 leading-relaxed"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1.125rem)",
                color: "hsl(210 20% 30% / 0.7)",
              }}
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
