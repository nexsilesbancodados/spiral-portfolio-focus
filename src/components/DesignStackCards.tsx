import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CardData {
  image: string
  title: string
  description: string
}

const designCards: CardData[] = [
  {
    image: '/images/design-ui-ux.jpg',
    title: 'UI/UX Design de Alto Impacto',
    description: 'Interfaces intuitivas projetadas no Figma com foco em usabilidade, hierarquia visual e experiência do usuário.',
  },
  {
    image: '/images/design-branding.jpg',
    title: 'Identidade Visual & Branding',
    description: 'Logos, paletas de cores, tipografia e guidelines completos que constroem marcas memoráveis.',
  },
  {
    image: '/images/design-responsive.jpg',
    title: 'Design Responsivo & Multi-Plataforma',
    description: 'Layouts que se adaptam perfeitamente a qualquer tela — desktop, tablet e mobile.',
  },
  {
    image: '/images/design-process.jpg',
    title: 'Processo Criativo Estratégico',
    description: 'Do wireframe ao protótipo interativo. Discovery, pesquisa e validação antes de cada pixel.',
  },
  {
    image: '/images/design-motion.jpg',
    title: 'Motion Design & Micro-Interações',
    description: 'Animações fluidas e transições que elevam a experiência e guiam o usuário com elegância.',
  },
]

export const DesignStackCards = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    if (!section || !container) return

    const cards = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('.design-card'))
    if (cards.length === 0) return

    // Set initial position for all cards except first
    gsap.set(cards.slice(1), { yPercent: 120 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${cards.length * 150}vh`,
        scrub: 2.5,
        pin: true,
      },
    })

    cards.forEach((card, index) => {
      if (index === 0) return

      tl.to(card, {
        yPercent: 0,
        duration: 1,
        ease: 'power3.inOut',
      }, index)

      cards.slice(0, index).forEach((prevCard, prevIndex) => {
        const depth = index - prevIndex
        const overlay = prevCard.querySelector('.design-card__overlay') as HTMLElement

        tl.to(prevCard, {
          scale: 1 - 0.05 * depth,
          y: -(20 * depth),
          duration: 1,
          ease: 'power3.inOut',
        }, index)

        if (overlay) {
          tl.to(overlay, {
            opacity: 0.3 * depth,
            duration: 1,
            ease: 'power3.inOut',
          }, index)
        }
      })
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full h-screen flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-[90vw] max-w-[1000px] h-[75vh] max-h-[750px]"
        style={{ perspective: '1000px' }}
      >
        {designCards.map((card, i) => (
          <div
            key={i}
            className="design-card absolute top-0 left-0 w-full h-full rounded-2xl border border-border overflow-hidden bg-card"
            style={{
              transformOrigin: 'top center',
              willChange: 'transform',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)',
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              width={1920}
              height={1080}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="design-card__overlay absolute inset-0 bg-background opacity-0 pointer-events-none" />
            <div
              className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.3) 50%, transparent 100%)',
              }}
            >
              <div className="max-w-[85%] pointer-events-auto">
                <h3
                  className="text-foreground font-display leading-[1.1] font-light mb-4 tracking-tight"
                  style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
                >
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
