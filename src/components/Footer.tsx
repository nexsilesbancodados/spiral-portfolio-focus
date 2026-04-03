import { motion } from "framer-motion";
import logoMedallion from "@/assets/logo-medallion.png";

const footerLinks = [
  {
    title: "Navegação",
    links: [
      { label: "Início", href: "#hero" },
      { label: "Sobre", href: "#about" },
      { label: "Projetos", href: "#projects" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { label: "Landing Pages", href: "#services" },
      { label: "Sistemas SaaS", href: "#services" },
      { label: "UI/UX Design", href: "#services" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Skills", href: "#skills" },
      { label: "Tecnologias", href: "#skills" },
      { label: "Portfólio", href: "#projects" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/5 bg-background pt-16 sm:pt-24">
      {/* Logo + Navigation Links */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 pb-12">
        <div className="mx-auto max-w-7xl flex flex-col items-center gap-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3"
          >
            <img
              src={logoMedallion}
              alt="FOCUSS DEV logo"
              className="w-16 h-16 sm:w-20 sm:h-20 opacity-60"
            />
          </motion.div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {footerLinks.map((group) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4"
            >
              <h4 className="text-foreground text-xs font-bold uppercase tracking-widest opacity-30">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none mt-8 sm:mt-12">
        <p
          className="text-[20vw] leading-none font-bold text-foreground/[0.03] text-center -mb-[3vw] tracking-tighter uppercase"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          aria-hidden="true"
        >
          FOCUSS
        </p>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Copyright */}
      <div className="relative pb-6 sm:pb-8 w-full flex justify-center z-30 px-4 sm:px-6 text-center">
        <p className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em]">
          © {new Date().getFullYear()} FOCUSS DEV, TODOS OS DIREITOS RESERVADOS
        </p>
      </div>
    </footer>
  );
};
