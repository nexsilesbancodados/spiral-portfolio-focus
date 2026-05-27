import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "top-3" : "top-0"
      }`}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <div
          className={`relative flex items-center justify-between gap-4 transition-all duration-500 ${
            scrolled
              ? "h-14 rounded-full border border-foreground/10 bg-background/60 px-3 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "h-16 rounded-full border border-transparent px-4 lg:h-[4.5rem]"
          }`}
        >
          {/* Subtle gradient sheen when scrolled */}
          {scrolled && (
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-foreground/[0.04] to-transparent" />
          )}

          {/* Left nav */}
          <nav className="relative hidden flex-1 basis-0 items-center gap-1 md:flex">
            {leftLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
              >
                <span className="absolute inset-0 rounded-full bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/[0.06]" />
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Center logo */}
          <a
            href="#hero"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 shrink-0 md:static md:translate-x-0 group"
          >
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={logoMedallion}
                alt="FOCUSS DEV"
                width={36}
                height={36}
                className="relative h-8 w-8 opacity-90 transition-transform duration-500 group-hover:rotate-[8deg] lg:h-9 lg:w-9"
              />
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight text-primary glow-text lg:text-xl">
                FOCUSS
              </span>
              <span className="text-lg font-light tracking-[0.15em] text-foreground/70 lg:text-xl">
                DEV
              </span>
            </div>
          </a>

          {/* Right nav */}
          <nav className="relative hidden flex-1 basis-0 items-center justify-end gap-1 md:flex">
            {rightLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-3.5 py-1.5 text-[13px] font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
              >
                <span className="absolute inset-0 rounded-full bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/[0.06]" />
                <span className="relative">{link.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="group ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_0_0_0_hsl(160_100%_45%/0.4)] transition-all duration-300 hover:shadow-[0_0_24px_2px_hsl(160_100%_45%/0.4)] hover:-translate-y-0.5"
            >
              Contato
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative rounded-full border border-foreground/15 bg-background/30 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background/50 md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mx-3 mt-2 overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {allLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl px-3 py-2.5 text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-primary text-sm font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-[0_0_24px_-4px_hsl(160_100%_45%/0.5)]"
              >
                Fale Conosco
                <ArrowUpRight size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
