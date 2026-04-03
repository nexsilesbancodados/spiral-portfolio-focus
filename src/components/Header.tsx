import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import statueCard from "@/assets/statue-card.png";


const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Serviços", href: "#services" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contato", href: "#contact" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-foreground/10"
    >
      <div className="sky-header absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 bg-background/10 backdrop-blur-md" />
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <nav className="hidden flex-1 basis-0 items-center gap-6 md:flex lg:gap-8">
          {navLinks.slice(0, 3).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#hero" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 shrink-0 md:static md:translate-x-0">
          <span className="text-xl font-bold tracking-tight text-primary glow-text">FOCUSS</span>
          <img
            src={statueCard}
            alt="FOCUSS DEV"
            className="h-10 w-auto object-contain drop-shadow-[0_0_8px_hsl(160_100%_45%/0.4)]"
          />
          <span className="text-xl font-light tracking-tight text-foreground/90">DEV</span>
        </a>

        <nav className="hidden flex-1 basis-0 items-center justify-end gap-6 md:flex lg:gap-8">
          {navLinks.slice(3).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border border-foreground/10 bg-background/10 p-2 text-foreground backdrop-blur-sm md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-foreground/10 bg-background/80 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium"
              >
                Fale Conosco
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
