import { motion } from "framer-motion";
import aboutStatue from "@/assets/about-statue.jpg";

const stats = [
  { value: "50+", label: "Projetos Entregues" },
  { value: "3+", label: "Anos de Experiência" },
  { value: "100%", label: "Clientes Satisfeitos" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden glow-border">
              <img
                src={aboutStatue}
                alt="Arte neoclássica representando a fusão entre tradição e tecnologia"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
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
