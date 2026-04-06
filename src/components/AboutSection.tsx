import { motion } from "framer-motion";
import aboutStatues from "@/assets/about-statues.webp";

const stats = [
  { value: "50+", label: "Projetos Entregues" },
  { value: "3+", label: "Anos de Experiência" },
  { value: "100%", label: "Clientes Satisfeitos" },
];

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
            <img
              src={aboutStatues}
              alt="Estátuas gregas com óculos neon — FOCUSS DEV"
              width={671}
              height={840}
              className="w-full max-w-[28rem]"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-sm font-medium tracking-widest uppercase"
            >
              Quem Somos
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Onde <span className="text-primary">visão</span> encontra{" "}
              <span className="text-primary">execução</span>
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
                  className="rounded-2xl border border-foreground/10 bg-background/10 p-4 text-center lg:border-0 lg:bg-transparent lg:p-0 lg:text-left"
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
