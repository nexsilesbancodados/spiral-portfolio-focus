import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import skillsStatue from "@/assets/skills-statue.png";
import "./SkillsSection.css";

const allSkills = [
  { label: "React", category: "Frontend" },
  { label: "Next.js", category: "Frontend" },
  { label: "TypeScript", category: "Frontend" },
  { label: "Tailwind CSS", category: "Frontend" },
  { label: "Framer Motion", category: "Frontend" },
  { label: "shadcn/ui", category: "Frontend" },
  { label: "Node.js", category: "Backend" },
  { label: "Supabase", category: "Backend" },
  { label: "PostgreSQL", category: "Backend" },
  { label: "Edge Functions", category: "Backend" },
  { label: "REST APIs", category: "Backend" },
  { label: "Python", category: "Backend" },
  { label: "Git", category: "DevOps" },
  { label: "Docker", category: "DevOps" },
  { label: "Vercel", category: "DevOps" },
  { label: "AWS", category: "DevOps" },
  { label: "CI/CD", category: "DevOps" },
  { label: "Figma", category: "DevOps" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const SkillsSection = () => {
  const statueRef = useRef<HTMLImageElement>(null);

  const positions = useMemo(() => {
    return allSkills.map((_, i) => ({
      top: `${8 + seededRandom(i * 3 + 1) * 78}%`,
      left: `${45 + seededRandom(i * 3 + 2) * 50}%`,
      delay: seededRandom(i * 3 + 3) * 0.8,
      floatDuration: 3 + seededRandom(i * 7) * 3,
      floatY: 8 + seededRandom(i * 11) * 12,
    }));
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !statueRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(statueRef.current, {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="relative pt-0 pb-20 md:pt-0 md:pb-32 -mt-60">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-white">
            Stack <span className="text-primary">técnico</span>
          </h2>
        </motion.div>

        {/* Área com estátua + skills flutuantes */}
        <div className="relative min-h-[600px] md:min-h-[700px]">
          {/* Estátua centralizada */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          >
            <div className="relative w-[16rem] sm:w-[20rem] md:w-[24rem]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-3xl rounded-full" />
              <img
                ref={statueRef}
                src={skillsStatue}
                alt="Estátua grega — representação artística do domínio técnico"
                className="relative z-10 w-full drop-shadow-2xl will-change-transform"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Skills flutuantes */}
          {allSkills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: positions[i].delay }}
              className="absolute z-20"
              style={{
                top: positions[i].top,
                left: positions[i].left,
              }}
            >
              <motion.div
                animate={{ y: [-positions[i].floatY / 2, positions[i].floatY / 2] }}
                transition={{
                  duration: positions[i].floatDuration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <button className="skill-bloom-button">
                  <div className="bloom-container">
                    <div className="button-container-main">
                      <div className="button-inner">
                        <div className="back" />
                        <div className="front" />
                        <div className="content-wrapper">
                          <span className="text-content">{skill.label}</span>
                        </div>
                      </div>
                      <div className="button-glass" />
                    </div>
                    <div className="bloom bloom1" />
                    <div className="bloom bloom2" />
                  </div>
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};