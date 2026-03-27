import { ArrowRight } from 'lucide-react'

const images = [
  '/images/vibe-01.jpg',
  '/images/vibe-02.jpg',
  '/images/vibe-03.jpg',
  '/images/vibe-04.jpg',
  '/images/vibe-05.jpg',
  '/images/vibe-06.jpg',
]

const MarqueeRow = ({ offset = 0 }: { offset?: number }) => {
  const doubled = [...images, ...images, ...images, ...images]
  return (
    <div className="flex gap-5 flex-shrink-0">
      {doubled.map((src, i) => (
        <div
          key={`${offset}-${i}`}
          className="rounded-2xl overflow-hidden flex-shrink-0 border border-border/30"
          style={{
            background: 'hsl(var(--foreground) / 0.03)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <img
            src={src}
            alt={`Projeto ${(i % images.length) + 1}`}
            loading="lazy"
            className="h-36 w-56 object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export const VibeCodesSection = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Radiais de luz glassmorphism */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] rounded-full pointer-events-none -translate-y-1/2 z-0"
        style={{ background: 'hsl(var(--foreground) / 0.05)', filter: 'blur(160px)' }}
      />
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 z-0"
        style={{ background: 'hsl(45 75% 50% / 0.06)', filter: 'blur(140px)' }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-4xl text-center px-6">
        {/* Badge dourada */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em]"
          style={{
            background: 'hsl(45 75% 50% / 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid hsl(45 75% 50% / 0.4)',
            color: '#D49D2F',
            boxShadow: '0 0 20px hsl(45 75% 50% / 0.1)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#D49D2F', boxShadow: '0 0 10px #D49D2F' }}
          />
          Vibe Codes
        </span>

        <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tighter font-bold leading-[1.05]">
          Seção feita para os{' '}
          <span className="text-foreground">alunos da Vibe Codes</span>
        </h2>
        <p className="mt-6 text-base sm:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Conecte-se com a nova geração de desenvolvedores que estão dominando o mercado com
          soluções inovadoras e design de alto nível.
        </p>

        {/* Botão premium dourado */}
        <div className="mt-14 flex justify-center">
          <a
            href="#contato"
            className="group relative inline-flex items-center gap-4 rounded-full bg-foreground py-5 px-14 overflow-hidden transition-all duration-500 hover:-translate-y-[3px] active:scale-[0.96]"
            style={{
              isolation: 'isolate',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            }}
          >
            {/* Círculo expansível */}
            <div
              className="absolute left-6 z-0 h-6 w-6 rounded-full transition-all duration-[1200ms] group-hover:scale-[90]"
              style={{
                background: '#D49D2F',
                transitionTimingFunction: 'cubic-bezier(0.8,0,0.1,1)',
              }}
            />
            {/* Shimmer */}
            <div className="vibe-shimmer absolute top-[-50%] h-[200%] w-[120px] -skew-x-[25deg] pointer-events-none select-none z-[5] opacity-0 mix-blend-overlay bg-gradient-to-r from-white/80 to-transparent" />

            <span className="relative z-10 text-lg font-black tracking-[0.15em] text-background uppercase transition-colors duration-300 group-hover:text-foreground">
              Entrar agora
            </span>
            <div className="relative z-10 flex w-0 translate-x-4 items-center justify-center overflow-hidden opacity-0 transition-all duration-500 group-hover:w-10 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ transitionTimingFunction: 'cubic-bezier(0.8,0,0.1,1)' }}
            >
              <ArrowRight className="w-6 h-6 text-foreground" />
            </div>
          </a>
        </div>
      </div>

      {/* Marquee carousel - 3 rows */}
      <div className="relative mt-24 sm:mt-40 z-10">
        {/* Gradient fade na base */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/30 to-transparent z-30 pointer-events-none" />

        <div
          className="mx-auto overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {/* Row 1 */}
          <div className="mb-5 overflow-hidden">
            <div className="flex w-max animate-marquee-vibe">
              <MarqueeRow offset={0} />
              <div className="w-5 flex-shrink-0" />
              <MarqueeRow offset={10} />
            </div>
          </div>
          {/* Row 2 */}
          <div className="mb-5 overflow-hidden">
            <div className="flex w-max animate-marquee-vibe-reverse">
              <MarqueeRow offset={20} />
              <div className="w-5 flex-shrink-0" />
              <MarqueeRow offset={30} />
            </div>
          </div>
          {/* Row 3 */}
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee-vibe">
              <MarqueeRow offset={40} />
              <div className="w-5 flex-shrink-0" />
              <MarqueeRow offset={50} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
