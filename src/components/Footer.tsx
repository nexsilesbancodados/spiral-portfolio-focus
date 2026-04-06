import logoMedallion from "@/assets/logo-medallion.webp";
import { Instagram, Mail, MessageCircle } from "lucide-react";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Serviços", href: "#services" },
  { label: "Projetos", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

const socialLinks = [
  {
    icon: MessageCircle,
    href: "https://wa.me/5533984123591",
    label: "WhatsApp",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/Focussdev",
    label: "Instagram",
  },
  {
    icon: Mail,
    href: "mailto:contato@focussdev.art",
    label: "Email",
  },
];

export const Footer = () => {
  return (
    <footer className="relative bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <img
            src={logoMedallion}
            alt="FOCUSS DEV"
            width={32}
            height={32}
            className="h-8 w-8 opacity-70"
          />
          <span className="text-lg font-bold tracking-tight text-primary">
            FOCUSS
          </span>
          <span className="text-lg font-light tracking-tight text-black/60">
            DEV
          </span>
        </a>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-black/40 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/40 transition-all hover:border-primary hover:text-primary hover:scale-105"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Divider + Copyright */}
        <div className="w-full max-w-xs h-px bg-black/[0.08]" />
        <p className="text-[10px] text-black/25 font-mono uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} FOCUSS DEV
        </p>
      </div>
    </footer>
  );
};
