import { motion } from "framer-motion";

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
    <section id="skills" className="relative pt-0 pb-20 md:pt-0 md:pb-32 -mt-60">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-white">
            Stack <span className="text-primary">técnico</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-wrap justify-center gap-3"
        >
          {allSkills.map((skill) => {
            const gradient = skillColors[skill] || "from-primary to-primary";
            return (
              <motion.div
                key={skill}
                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg border border-white/20 cursor-default select-none`}
              >
                {skill}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};