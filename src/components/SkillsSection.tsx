import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import skillsStatue from "@/assets/skills-statue.png";
import "./SkillsSection.css";

const skillColors: Record<string, string> = {
  React: "from-cyan-400 to-blue-500",
  "Next.js": "from-gray-700 to-gray-900",
  TypeScript: "from-blue-500 to-blue-700",
  "Tailwind CSS": "from-teal-400 to-cyan-500",
  "Framer Motion": "from-purple-500 to-pink-500",
  "shadcn/ui": "from-zinc-400 to-zinc-600",
  "Node.js": "from-green-500 to-emerald-600",
  Supabase: "from-emerald-400 to-green-600",
  PostgreSQL: "from-blue-600 to-indigo-700",
  "Edge Functions": "from-orange-400 to-amber-500",
  "REST APIs": "from-rose-400 to-red-500",
  Python: "from-yellow-400 to-amber-500",
  Git: "from-orange-500 to-red-600",
  Docker: "from-blue-400 to-cyan-600",
  Vercel: "from-gray-600 to-black",
  AWS: "from-amber-500 to-orange-600",
  "CI/CD": "from-violet-500 to-purple-600",
  Figma: "from-pink-400 to-rose-500",
};

const allSkills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui",
  "Node.js", "Supabase", "PostgreSQL", "Edge Functions", "REST APIs", "Python",
  "Git", "Docker", "Vercel", "AWS", "CI/CD", "Figma",
];

const gridPositions = [
  { top: "2%",  left: "46%" }, { top: "2%",  left: "68%" }, { top: "2%",  left: "88%" },
  { top: "18%", left: "50%" }, { top: "18%", left: "72%" }, { top: "18%", left: "92%" },
  { top: "34%", left: "46%" }, { top: "34%", left: "66%" }, { top: "34%", left: "86%" },
  { top: "50%", left: "52%" }, { top: "50%", left: "74%" }, { top: "50%", left: "90%" },
  { top: "66%", left: "48%" }, { top: "66%", left: "70%" }, { top: "66%", left: "88%" },
  { top: "82%", left: "46%" }, { top: "82%", left: "68%" }, { top: "82%", left: "90%" },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const SkillsSection = () => {
  const statueRef = useRef<HTMLImageElement>(null);

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
          {/* Estátua à esquerda */}
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

          {/* Skills flutuantes com cores */}
          {allSkills.map((skill, i) => {
            const floatDuration = 3 + seededRandom(i * 7) * 3;
            const floatY = 8 + seededRandom(i * 11) * 12;
            const delay = seededRandom(i * 3 + 3) * 0.8;
            const gradient = skillColors[skill] || "from-primary to-primary";

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay }}
                className="absolute z-20"
                style={{
                  top: gridPositions[i].top,
                  left: gridPositions[i].left,
                }}
              >
                <motion.div
                  animate={{ y: [-floatY / 2, floatY / 2] }}
                  transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20 cursor-default select-none whitespace-nowrap`}
                  >
                    {skill}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};