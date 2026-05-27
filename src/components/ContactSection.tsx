import { motion } from "framer-motion";
import { Mail, Instagram, ArrowUpRight, Sparkles } from "lucide-react";

const channels = [
  {
    label: "WhatsApp",
    value: "+55 33 98412-3591",
    description: "Resposta em minutos",
    href: "https://wa.me/5533984123591",
    icon: (props: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.09 1.09 0 0 0-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.747.461 3.45 1.337 4.95L2 22l5.25-1.378a9.86 9.86 0 0 0 4.79 1.22h.005c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.031-5.14-2.903-7.01A9.847 9.847 0 0 0 12.04 2Zm0 18.13h-.004a8.23 8.23 0 0 1-4.196-1.15l-.301-.179-3.116.818.832-3.036-.196-.312a8.214 8.214 0 0 1-1.258-4.36c0-4.54 3.696-8.236 8.243-8.236 2.2 0 4.27.857 5.825 2.414a8.18 8.18 0 0 1 2.412 5.83c-.002 4.54-3.698 8.21-8.241 8.21Z" />
      </svg>
    ),
    accent: "from-emerald-400/30 to-primary/20",
  },
  {
    label: "Instagram",
    value: "@Focussdev",
    description: "Bastidores & projetos",
    href: "https://instagram.com/Focussdev",
    icon: ({ className }: { className?: string }) => <Instagram className={className} />,
    accent: "from-fuchsia-400/25 to-primary/10",
  },
  {
    label: "E-mail",
    value: "contato@focussdev.art",
    description: "Proposta detalhada",
    href: "mailto:contato@focussdev.art",
    icon: ({ className }: { className?: string }) => <Mail className={className} />,
    accent: "from-sky-400/25 to-primary/10",
  },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 md:py-36 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(160_100%_45%/0.10)_0%,transparent_60%)]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-primary text-xs font-medium tracking-[0.25em] uppercase">
            <Sparkles size={14} className="animate-pulse" />
            Próximo Passo
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-6 leading-[1.05] tracking-tight">
            Vamos transformar sua ideia em{" "}
            <span className="relative inline-block">
              <span className="text-primary glow-text">realidade</span>
              <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full h-3 text-primary/60" preserveAspectRatio="none">
                <path d="M2 8 Q 50 2, 100 6 T 198 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="mt-8 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Escolha o canal que preferir. Respondemos rápido e já saímos do
            primeiro contato com um plano para o seu projeto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16"
        >
          {channels.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col p-6 rounded-3xl border border-border bg-card/40 backdrop-blur-md overflow-hidden hover:border-primary/50 transition-colors duration-300"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${channel.accent}`} />
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <channel.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
              </div>

              <div className="relative mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {channel.description}
                </p>
                <h3 className="text-xl font-bold mt-2 text-foreground">
                  {channel.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {channel.value}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-14 flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground/70"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Disponível para novos projetos
        </motion.div>
      </div>
    </section>
  );
};
