import React, { useState } from 'react';

const menuItems = [
  { id: 'focuss-dev', label: 'FOCUSS DEV', index: 0 },
  { id: 'web-design', label: 'WEB DESIGN', index: 1 },
  { id: 'desenvolvimento', label: 'DESENVOLVIMENTO', index: 2 },
  { id: 'servicos', label: 'SERVIÇOS', index: 3 },
  { id: 'inovacao-ia', label: 'INOVAÇÃO E IA', index: 4 },
  { id: 'mobile-web', label: 'MOBILE E WEB', index: 5 },
  { id: 'skills', label: 'SKILLS', index: 6 },
];

export function HamburgerMenu({ onNavigate }: { onNavigate: (index: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (index: number) => {
    setIsOpen(false);
    onNavigate(index);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed z-[60] flex flex-col items-center justify-center group"
        style={{ top: 'clamp(1rem, 2vw, 1.5rem)', right: 'clamp(1rem, 2vw, 1.5rem)', width: 'clamp(2rem, 3vw, 2.5rem)', height: 'clamp(2rem, 3vw, 2.5rem)' }}
        aria-label="Menu"
      >
        <span className={`block h-[2px] bg-foreground/80 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : 'group-hover:bg-vice-sunset'}`} style={{ width: 'clamp(1.2rem, 2vw, 1.75rem)', marginBottom: isOpen ? 0 : 'clamp(4px, 0.4vw, 6px)' }} />
        <span className={`block h-[2px] bg-foreground/80 transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'group-hover:bg-vice-sunset'}`} style={{ width: 'clamp(1.2rem, 2vw, 1.75rem)', marginBottom: isOpen ? 0 : 'clamp(4px, 0.4vw, 6px)' }} />
        <span className={`block h-[2px] bg-foreground/80 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : 'group-hover:bg-vice-sunset'}`} style={{ width: 'clamp(1.2rem, 2vw, 1.75rem)' }} />
      </button>

      <div className={`fixed inset-0 z-[55] bg-background/95 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 vice-overlay-sunset opacity-40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 20%, hsl(var(--vice-sunset) / 0.08), transparent 60%)' }} />

        <nav className="relative z-10 flex flex-col gap-2 items-start" style={{ padding: `0 clamp(2rem, 4vw, 4rem)` }}>
          <span className="font-[family-name:var(--font-display)] tracking-[0.3em] uppercase text-vice-sunset/60 mb-6" style={{ fontSize: 'clamp(8px, 0.7vw, 10px)' }}>NAVEGAÇÃO</span>
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.index)}
              className="group flex items-center gap-4 py-2 animate-fade-in"
              style={{ animationDelay: `${80 + i * 50}ms` }}
            >
              <span className="font-[family-name:var(--font-display)] tracking-widest text-vice-sunset/30 group-hover:text-vice-sunset transition-colors duration-300" style={{ fontSize: 'clamp(8px, 0.7vw, 10px)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-[family-name:var(--font-display)] font-bold text-foreground/80 tracking-tight uppercase group-hover:text-foreground transition-all duration-300 group-hover:translate-x-2" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 3rem)' }}>
                {item.label}
              </span>
              <div className="h-[1px] w-0 group-hover:w-12 bg-vice-sunset transition-all duration-500" />
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
