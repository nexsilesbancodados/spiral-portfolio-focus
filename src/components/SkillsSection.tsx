import { motion } from "framer-motion";
import skillsStatue from "@/assets/skills-statue.webp";

const allSkills = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui",
  "Node.js", "Supabase", "PostgreSQL", "Edge Functions", "REST APIs", "Python",
  "Git", "Docker", "Vercel", "AWS", "CI/CD", "Figma",
];

const skillColors: Record<string, string> = {
  React: "from-cyan-400 to-blue-500",
  "Next.js": "from-gray-600 to-gray-800",
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
  Vercel: "from-gray-500 to-gray-700",
  AWS: "from-amber-500 to-orange-600",
  "CI/CD": "from-violet-500 to-purple-600",
  Figma: "from-pink-400 to-rose-500",
};

export const SkillsSection = () => {
  return (
    <section id="skills" className="relative pt-10 pb-20 md:pt-12 md:pb-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-foreground">
            Domínio <span className="text-primary">absoluto</span>
          </h2>
        </motion.div>

        {/* Orbit container — responsive height */}
        <div
          className="relative flex items-center justify-center mx-auto"
          style={{ height: "clamp(400px, 70vw, 620px)" }}
        >
          {/* Center statue */}
          <motion.img
            src={skillsStatue}
            alt="Estátua clássica representando sabedoria tecnológica"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute z-10 h-[220px] sm:h-[280px] md:h-[340px] lg:h-[420px] object-contain drop-shadow-[0_0_40px_rgba(0,255,150,0.15)] translate-y-6 sm:translate-y-10 md:translate-y-14"
            loading="lazy"
            sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, (max-width: 1024px) 272px, 336px"
          />

          {/* Orbiting skills — static positions, no infinite animations */}
          {allSkills.map((skill, i) => {
            const angle = (i / allSkills.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const gradient = skillColors[skill] || "from-primary to-primary";

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                className="absolute z-20"
                style={{
                  left: `calc(50% + ${Math.cos(rad)} * clamp(120px, 22vw, 280px))`,
                  top: `calc(50% + ${Math.sin(rad)} * clamp(120px, 22vw, 280px))`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.15, y: -6 }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r ${gradient} text-white text-[10px] sm:text-xs md:text-sm font-semibold shadow-lg border border-white/20 cursor-default select-none whitespace-nowrap`}
                >
                  {skill}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
