import { motion } from "framer-motion";
import { useState } from "react";
import statueCard from "@/assets/statue-card.png";

const stats = [
  { value: "50+", label: "Projetos Entregues" },
  { value: "3+", label: "Anos de Experiência" },
  { value: "100%", label: "Clientes Satisfeitos" },
];

const FlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative mx-auto aspect-[3/4] w-full max-w-[22rem] cursor-pointer sm:max-w-[24rem] lg:mx-0"
      style={{ perspective: "1200px" }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((current) => !current);
        }
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden glow-border"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={statueCard}
            alt="Estátua grega com olhos neon — FOCUSS DEV"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-center sm:text-left">
            <p className="text-sm text-primary font-medium tracking-widest uppercase">Passe o mouse</p>
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-card/90 p-8 text-center glow-border"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="primary-aura-soft absolute inset-0" />
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
              <span className="text-primary text-2xl font-bold">F</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">FOCUSS DEV</h3>
            <p className="text-muted-foreground leading-relaxed">
              Transformamos ideias em experiências digitais de alto impacto. Design premium, código limpo, resultados reais.
            </p>
            <div className="flex gap-4 justify-center pt-2">
              {["React", "TypeScript", "Supabase"].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="relative -mt-[9vw] overflow-hidden bg-transparent pb-20 pt-4 md:-mt-[7vw] md:pb-28 lg:-mt-[5vw]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center lg:justify-start"
          >
            <FlipCard />
          </motion.div>

          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-medium tracking-widest uppercase"
            >
              Sobre Nós
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Unindo <span className="text-primary">arte</span> e{" "}
              <span className="text-primary">tecnologia</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-foreground/75"
            >
              Na FOCUSS DEV, acreditamos que cada projeto digital é uma obra de arte funcional.
              Combinamos design de alto impacto com código limpo e performático para criar
              soluções que não apenas impressionam — convertem.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 leading-relaxed text-foreground/75"
            >
              Especializados em React, TypeScript e Supabase, entregamos desde landing pages
              de alta conversão até sistemas SaaS complexos com a mesma obsessão por qualidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-foreground/10 bg-background/10 p-4 text-center backdrop-blur-[2px] lg:border-0 lg:bg-transparent lg:p-0 lg:text-left lg:backdrop-blur-0"
                >
                  <div className="text-3xl font-bold text-primary glow-text">{stat.value}</div>
                  <div className="mt-1 text-sm text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
