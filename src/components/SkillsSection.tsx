import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Supabase", "PostgreSQL", "Edge Functions", "REST APIs", "Python"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Git", "Docker", "Vercel", "AWS", "CI/CD", "Figma"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-20 md:py-32">
      <div className="absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4">
            Stack <span className="text-primary">técnico</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {skillCategories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <h3 className="text-lg font-semibold text-primary mb-6">{cat.title}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-sm text-white hover:border-primary/40 hover:text-primary transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
