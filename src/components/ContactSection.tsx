import { motion } from "framer-motion";
import { Mail, MessageSquare, ArrowRight } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_100%_45%/0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Próximo Passo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
            Pronto para <span className="text-primary glow-text">decolar</span>?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Sua ideia merece virar realidade. Fale com a gente e vamos construir algo extraordinário juntos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageSquare size={20} />
            WhatsApp
            <ArrowRight size={16} />
          </a>
          <a
            href="mailto:contato@focussdev.com"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-border text-foreground font-medium hover:border-primary/50 hover:text-primary transition-all"
          >
            <Mail size={20} />
            E-mail
          </a>
        </motion.div>
      </div>
    </section>
  );
};
