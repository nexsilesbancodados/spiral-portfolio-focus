import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroStatue from "@/assets/hero-statue.png";

export const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Unified sky gradient — pure CSS, no image */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a6fc4] via-[#5ba3d9] to-[#a8d4f0]" />
      <div className="absolute inset-0 z-0 bg-black/30" />
      {/* Radial glow */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,hsl(160_100%_45%/0.08)_0%,transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium tracking-widest uppercase mb-6">
                Desenvolvimento & Design
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white"
            >
              Criamos{" "}
              <span className="text-primary glow-text">experiências</span>
              <br />
              digitais que{" "}
              <span className="text-primary glow-text">transformam</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-white/70 text-lg max-w-lg leading-relaxed"
            >
              Estruturas digitais profissionais que posicionam seu negócio e convertem visitantes em resultados reais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Ver Projetos
              </a>
              <a
                href="#about"
                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-medium hover:border-primary/50 hover:text-primary transition-all"
              >
                Saiba Mais
              </a>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(160_100%_45%/0.2)_0%,transparent_60%)] blur-2xl" />
              <img
                src={heroStatue}
                alt="Estátua grega com óculos usando laptop — representação artística da FOCUSS DEV"
                className="relative z-10 w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="text-white/60" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
