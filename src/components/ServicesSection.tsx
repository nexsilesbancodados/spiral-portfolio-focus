import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Brain, Globe, Smartphone } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Desenvolvimento Web",
    description: "Aplicações modernas com React, TypeScript e arquitetura escalável.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Interfaces elegantes que encantam o usuário e convertem.",
  },
  {
    icon: Rocket,
    title: "Landing Pages",
    description: "Páginas de alta conversão com design premium e performance otimizada.",
  },
  {
    icon: Brain,
    title: "Soluções com IA",
    description: "Integração inteligente de IA para automatizar e potencializar.",
  },
  {
    icon: Globe,
    title: "Sistemas SaaS",
    description: "Plataformas completas com autenticação, dashboard e APIs.",
  },
  {
    icon: Smartphone,
    title: "Design Responsivo",
    description: "Experiências perfeitas em qualquer dispositivo, de mobile a desktop.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const ServicesSection = () => {
  return (
    <section id="services" className="relative py-20 md:py-32 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
            O que <span className="text-primary">fazemos</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Soluções completas de ponta a ponta para elevar sua presença digital.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
              className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 glow-border"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
