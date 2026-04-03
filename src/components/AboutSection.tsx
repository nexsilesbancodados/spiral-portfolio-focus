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
      className="relative w-full aspect-[3/4] cursor-pointer"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front */}
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
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-sm text-primary font-medium tracking-widest uppercase">Passe o mouse</p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-card border border-border glow-border flex flex-col items-center justify-center p-8 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_100%_45%/0.06)_0%,transparent_70%)]" />
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
    <section id="about" className="relative py-20 md:py-32 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Flip Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-md mx-auto lg:mx-0"
          >
            <FlipCard />
          </motion.div>

          {/* Text */}
          <div>
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
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 leading-tight"
            >
              Unindo <span className="text-primary">arte</span> e{" "}
              <span className="text-primary">tecnologia</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-muted-foreground leading-relaxed text-lg"
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
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              Especializados em React, TypeScript e Supabase, entregamos desde landing pages
              de alta conversão até sistemas SaaS complexos com a mesma obsessão por qualidade.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 mt-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary glow-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
