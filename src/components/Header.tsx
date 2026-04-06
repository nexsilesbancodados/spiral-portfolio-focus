import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoMedallion from "@/assets/logo-medallion.webp";

const leftLinks = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Serviços", href: "#services" },
];

const rightLinks = [
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

const allLinks = [...leftLinks, ...rightLinks, { label: "Contato", href: "#contact" }];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-foreground/10 shadow-lg shadow-background/20"
          : "border-b border-transparent"
      }`}
    >
      <div className="sky-header absolute inset-0 z-0" />
      <div
        className={`absolute inset-0 z-0 backdrop-blur-md transition-colors duration-500 ${
          scrolled ? "bg-background/20" : "bg-transparent"
        }`}
      />

      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        {/* Left nav */}
        <nav className="hidden flex-1 basis-0 items-center gap-7 md:flex lg:gap-9">
          {leftLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Center logo */}
        <a
          href="#hero"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 shrink-0 md:static md:translate-x-0"
        >
          <img
            src={logoMedallion}
            alt="FOCUSS DEV"
            className="h-8 w-8 opacity-80 lg:h-9 lg:w-9"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-primary glow-text lg:text-xl">
              FOCUSS
            </span>
            <span className="text-lg font-light tracking-tight text-foreground/80 lg:text-xl">
              DEV
            </span>
          </div>
        </a>

        {/* Right nav */}
        <nav className="hidden flex-1 basis-0 items-center justify-end gap-7 md:flex lg:gap-9">
          {rightLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-[13px] font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(160_100%_45%/0.3)]"
          >
            Contato
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border border-foreground/10 bg-background/10 p-2 text-foreground backdrop-blur-sm md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-foreground/10 bg-background/90 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-3">
              {allLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-foreground/80 transition-colors hover:text-primary text-sm"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
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
