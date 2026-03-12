import { useMemo } from "react";
import {
  FaReact, FaAws, FaDocker, FaNodeJs, FaGithub, FaPython, FaFigma
} from "react-icons/fa";
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPostgresql, SiMongodb, SiRedis, SiGraphql, SiThreedotjs
} from "react-icons/si";

const iconConfigs = [
  { Icon: FaReact, color: "#61DAFB", label: "React" },
  { Icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  { Icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  { Icon: FaNodeJs, color: "#339933", label: "Node.js" },
  { Icon: FaPython, color: "#3776AB", label: "Python" },
  { Icon: SiPostgresql, color: "#4169E1", label: "PostgreSQL" },
  { Icon: SiMongodb, color: "#47A248", label: "MongoDB" },
  { Icon: SiRedis, color: "#DC382D", label: "Redis" },
  { Icon: FaAws, color: "#FF9900", label: "AWS" },
  { Icon: FaDocker, color: "#2496ED", label: "Docker" },
  { Icon: FaFigma, color: "#F24E1E", label: "Figma" },
  { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind" },
  { Icon: SiGraphql, color: "#E10098", label: "GraphQL" },
  { Icon: SiThreedotjs, color: "#ffffff", label: "Three.js" },
  { Icon: FaGithub, color: "#ffffff", label: "GitHub" },
];

export default function SkillsOrbit() {
  const orbitCount = 3;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  const orbits = useMemo(() => {
    return [...Array(orbitCount)].map((_, orbitIdx) => {
      const sizeRem = 14 + 10 * (orbitIdx + 1);
      const icons = iconConfigs.slice(
        orbitIdx * iconsPerOrbit,
        orbitIdx * iconsPerOrbit + iconsPerOrbit
      );
      const angleStep = (2 * Math.PI) / icons.length;
      return { sizeRem, icons, angleStep, duration: 20 + orbitIdx * 10 };
    });
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: 'clamp(20rem, 40vw, 32rem)' }}>
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, hsl(var(--vice-sunset) / 0.08), transparent 60%)',
      }} />

      {/* Center icon */}
      <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
        style={{
          background: 'hsl(var(--card) / 0.8)',
          border: '1px solid hsl(var(--vice-sunset) / 0.3)',
          boxShadow: '0 0 30px hsl(var(--vice-sunset) / 0.15)',
        }}>
        <FaReact className="w-8 h-8 md:w-10 md:h-10" style={{ color: '#61DAFB' }} />
      </div>

      {/* Orbits */}
      {orbits.map((orbit, orbitIdx) => (
        <div
          key={orbitIdx}
          className="absolute rounded-full"
          style={{
            width: `${orbit.sizeRem}rem`,
            height: `${orbit.sizeRem}rem`,
            border: '1px solid hsl(var(--border) / 0.15)',
            animation: `orbit-spin ${orbit.duration}s linear infinite${orbitIdx % 2 === 1 ? ' reverse' : ''}`,
          }}
        >
          {orbit.icons.map((cfg, iconIdx) => {
            const angle = iconIdx * orbit.angleStep;
            const x = 50 + 50 * Math.cos(angle);
            const y = 50 + 50 * Math.sin(angle);

            return (
              <div
                key={iconIdx}
                className="absolute rounded-full p-2 md:p-2.5 transition-transform duration-300 hover:scale-125"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'hsl(var(--card) / 0.7)',
                  border: '1px solid hsl(var(--border) / 0.2)',
                  boxShadow: `0 0 12px ${cfg.color}20`,
                  animation: `orbit-counter-spin ${orbit.duration}s linear infinite${orbitIdx % 2 === 1 ? ' reverse' : ''}`,
                }}
                title={cfg.label}
              >
                <cfg.Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: cfg.color }} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}