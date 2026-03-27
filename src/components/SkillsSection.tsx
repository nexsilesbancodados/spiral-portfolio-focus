import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SiReact, SiTypescript, SiNodedotjs, SiTailwindcss,
  SiPostgresql, SiDocker, SiFigma, SiGit,
  SiNextdotjs, SiSupabase, SiPython, SiAmazon
} from 'react-icons/si'

gsap.registerPlugin(ScrollTrigger)

interface Skill {
  name: string
  icon: React.ReactNode
  level: number // 0-100
  category: string
}

const skills: Skill[] = [
  { name: 'React', icon: <SiReact />, level: 95, category: 'Frontend' },
  { name: 'TypeScript', icon: <SiTypescript />, level: 90, category: 'Frontend' },
  { name: 'Next.js', icon: <SiNextdotjs />, level: 85, category: 'Frontend' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 95, category: 'Frontend' },
  { name: 'Node.js', icon: <SiNodedotjs />, level: 88, category: 'Backend' },
  { name: 'PostgreSQL', icon: <SiPostgresql />, level: 82, category: 'Backend' },
  { name: 'Supabase', icon: <SiSupabase />, level: 90, category: 'Backend' },
  { name: 'Python', icon: <SiPython />, level: 75, category: 'Backend' },
  { name: 'Docker', icon: <SiDocker />, level: 70, category: 'DevOps' },
  { name: 'AWS', icon: <SiAmazonwebservices />, level: 72, category: 'DevOps' },
  { name: 'Figma', icon: <SiFigma />, level: 85, category: 'Design' },
  { name: 'Git', icon: <SiGit />, level: 90, category: 'DevOps' },
]

const categories = ['Frontend', 'Backend', 'DevOps', 'Design']

export const SkillsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const items = section.querySelectorAll('.skill-item')
    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      }
    )

    // Animate bars
    const bars = section.querySelectorAll('.skill-bar-fill')
    bars.forEach((bar) => {
      const target = (bar as HTMLElement).dataset.level || '0'
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: `${target}%`,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
            Tecnologias & Ferramentas
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Skills &{' '}
            <span className="text-muted-foreground">Expertise</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Domínio das principais tecnologias do mercado para entregar produtos de alta qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="text-sm uppercase tracking-[0.15em] text-primary font-bold mb-6 border-b border-border/50 pb-2">
                {cat}
              </h3>
              <div className="space-y-5">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name} className="skill-item" style={{ opacity: 0 }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-primary text-lg">{skill.icon}</span>
                          <span className="text-sm font-semibold text-foreground">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="skill-bar-fill h-full rounded-full"
                          data-level={skill.level}
                          style={{
                            background:
                              'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))',
                            width: '0%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
