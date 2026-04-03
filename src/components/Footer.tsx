import logoMedallion from "@/assets/logo-medallion.png";

const allLinks = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Serviços", href: "#services" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contato", href: "#contact" },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-black/5 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <img src={logoMedallion} alt="FOCUSS DEV" className="h-8 w-8 opacity-60" />
          <span className="text-lg font-bold tracking-tight text-primary glow-text">FOCUSS</span>
          <span className="text-lg font-light tracking-tight text-foreground/80">DEV</span>
        </a>

        {/* Links inline */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {allLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider + Copyright */}
        <div className="w-full max-w-xs h-px bg-foreground/5" />
        <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} FOCUSS DEV
        </p>
      </div>
    </footer>
  );
};
