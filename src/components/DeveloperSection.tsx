import { motion } from "framer-motion";
import gustavoPortrait from "@/assets/gustavo-portrait.jpg";

export const DeveloperSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* Subtle aura */}
      <div className="pointer-events-none absolute inset-0 primary-aura-soft" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Large name text behind portrait */}
          <div className="relative flex items-center justify-center w-full">
            {/* Background name */}
            <h2
              className="select-none text-center font-bold uppercase leading-[0.85] tracking-tight text-primary"
              style={{
                fontSize: "clamp(4rem, 15vw, 14rem)",
                lineHeight: 0.85,
              }}
            >
              <span className="block">GUSTAVO</span>
              <span className="block">LOPES</span>
            </h2>

            {/* Portrait overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src={gustavoPortrait}
                alt="Gustavo Lopes — Desenvolvedor Full-Stack"
                className="relative z-10 h-[60%] w-auto max-w-[50%] rounded-md object-cover object-top shadow-2xl sm:h-[70%] sm:max-w-[40%] md:h-[80%] md:max-w-[35%]"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Info below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 max-w-2xl text-center"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Fundador &amp; Desenvolvedor
            </p>
            <p className="mt-4 text-lg leading-relaxed text-foreground/70">
              Especialista em React, TypeScript e soluções digitais de alta
              performance. Transformando ideias em experiências digitais que
              convertem e impressionam.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
