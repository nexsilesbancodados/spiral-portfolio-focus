import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpiralAnimation } from '@/components/ui/spiral-animation'

const IntroPage = () => {
  const [phase, setPhase] = useState(0) // 0: loading, 1: title, 2: subtitle, 3: button
  const [exiting, setExiting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => setPhase(3), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(() => navigate('/home'), 900)
  }, [navigate])

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden bg-background transition-all duration-[900ms] ${exiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      {/* Spiral BG */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* Cinematic vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 2% / 0.6) 100%)'
      }} />

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] z-10 transition-all duration-[2000ms] ${phase >= 1 ? 'opacity-60' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-gold) / 0.5), hsl(var(--vice-sunset) / 0.3), transparent)' }} />

      {/* Branding */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Pre-title decorative */}
        <div className={`transition-all duration-[1500ms] ease-out mb-6 ${phase >= 1 ? 'opacity-50 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-gold)))' }} />
            <span className="font-[family-name:var(--font-display)] text-[9px] tracking-[0.5em] uppercase" style={{ color: 'hsl(var(--vice-gold))' }}>
              Digital Studio
            </span>
            <div className="h-[1px] w-8" style={{ background: 'linear-gradient(270deg, transparent, hsl(var(--vice-gold)))' }} />
          </div>
        </div>

        {/* Main title */}
        <div className={`transition-all duration-[1800ms] ease-out ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-8xl font-bold tracking-[0.12em] uppercase text-center leading-none"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--vice-gold)) 45%, hsl(var(--vice-sunset)) 65%, hsl(var(--foreground)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'text-bg-move 8s ease-in-out infinite',
              filter: 'drop-shadow(0 0 40px hsl(var(--vice-gold) / 0.15))',
            }}>
            FOCUSS
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className={`h-[1px] transition-all duration-[2000ms] delay-500 ${phase >= 2 ? 'w-16 sm:w-24' : 'w-0'}`}
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-sunset) / 0.6))' }} />
            <span className={`font-[family-name:var(--font-display)] text-lg sm:text-xl md:text-2xl tracking-[0.4em] uppercase font-extralight transition-all duration-[1500ms] delay-300 ${phase >= 2 ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ color: 'hsl(var(--vice-sunset))' }}>
              DEV
            </span>
            <div className={`h-[1px] transition-all duration-[2000ms] delay-500 ${phase >= 2 ? 'w-16 sm:w-24' : 'w-0'}`}
              style={{ background: 'linear-gradient(270deg, transparent, hsl(var(--vice-sunset) / 0.6))' }} />
          </div>
        </div>

        {/* Tagline */}
        <div className={`mt-8 transition-all duration-[1500ms] ease-out delay-200 ${phase >= 2 ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-[family-name:var(--font-body)] text-muted-foreground text-xs sm:text-sm tracking-[0.2em] uppercase text-center">
            Desenvolvimento Web & Design Digital
          </p>
        </div>

        {/* Enter button */}
        <div className={`mt-14 pointer-events-auto transition-all duration-[1800ms] ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleEnter}
            className="group relative font-[family-name:var(--font-display)] text-sm sm:text-base tracking-[0.35em] uppercase font-light px-10 py-4 rounded-sm transition-all duration-500 hover:tracking-[0.5em] border overflow-hidden"
            style={{
              color: 'hsl(var(--vice-gold))',
              borderColor: 'hsl(var(--vice-gold) / 0.25)',
              background: 'hsl(var(--vice-gold) / 0.03)',
            }}
          >
            {/* Hover glow bg */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: 'radial-gradient(ellipse at center, hsl(var(--vice-gold) / 0.1), transparent 70%)' }} />
            {/* Top line accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[1px] transition-all duration-700"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-gold) / 0.6), transparent)' }} />
            <span className="relative z-10">Explorar</span>
          </button>

          {/* Pulsing dot below button */}
          <div className="flex justify-center mt-6">
            <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: 'hsl(var(--vice-gold) / 0.5)' }} />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] z-10 transition-all duration-[2000ms] delay-1000 ${phase >= 3 ? 'opacity-40' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-sunset) / 0.3), hsl(var(--vice-gold) / 0.5), transparent)' }} />
    </div>
  )
}

export default IntroPage
