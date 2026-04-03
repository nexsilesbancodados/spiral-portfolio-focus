import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { GlassDiscs } from "./GlassDiscs";
import "./SkillsSection.css";

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

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const gridPositions = [
  { top: "5%",  left: "8%" },  { top: "5%",  left: "30%" }, { top: "5%",  left: "55%" },
  { top: "5%",  left: "78%" }, { top: "28%", left: "5%" },  { top: "28%", left: "25%" },
  { top: "28%", left: "50%" }, { top: "28%", left: "72%" }, { top: "28%", left: "90%" },
  { top: "55%", left: "8%" },  { top: "55%", left: "30%" }, { top: "55%", left: "55%" },
  { top: "55%", left: "78%" }, { top: "78%", left: "5%" },  { top: "78%", left: "25%" },
  { top: "78%", left: "48%" }, { top: "78%", left: "70%" }, { top: "78%", left: "90%" },
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="relative pt-0 pb-20 md:pt-0 md:pb-32 -mt-60">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Tecnologias
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-white">
            Stack <span className="text-primary">técnico</span>
          </h2>
        </motion.div>

        {/* Canvas 3D + Skills sobrepostas */}
        <div className="relative w-full h-[600px] md:h-[700px]">
          {/* Three.js Canvas como fundo */}
          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 18], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 5, 10]} intensity={5} color="#0055ff" distance={50} />
              <pointLight position={[-10, -10, 10]} intensity={4} color="#cc00ff" distance={50} />
              <directionalLight position={[0, 0, 10]} intensity={1} />
              <Suspense fallback={null}>
                <GlassDiscs />
              </Suspense>
            </Canvas>
          </div>

          {/* Skill labels flutuantes por cima */}
          {allSkills.map((skill, i) => {
            const floatDuration = 3 + seededRandom(i * 7) * 3;
            const floatY = 6 + seededRandom(i * 11) * 8;
            const delay = seededRandom(i * 3 + 3) * 0.6;
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
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white text-xs sm:text-sm font-semibold shadow-lg border border-white/20 cursor-default select-none whitespace-nowrap`}
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