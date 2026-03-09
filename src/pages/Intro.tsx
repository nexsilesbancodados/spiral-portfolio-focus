import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Floating particle component
const Particle = ({ delay, x, y, size, color, duration }: { delay: number; x: string; y: string; size: number; color: string; duration: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: color }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 0.6, 0.3, 0.6, 0],
      scale: [0, 1, 0.8, 1.1, 0],
      y: [0, -30, -15, -40, -60],
      x: [0, 10, -8, 15, 5],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
)

// Horizontal scanning line
const ScanLine = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute left-0 right-0 h-[1px] pointer-events-none z-[2]"
    style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-gold) / 0.15), transparent)' }}
    initial={{ top: '0%', opacity: 0 }}
    animate={{ top: ['0%', '100%'], opacity: [0, 0.4, 0.4, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'linear' }}
  />
)

const IntroPage = () => {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(() => navigate('/home'), 1000)
  }, [navigate])

  // Generate particles
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${10 + Math.random() * 80}%`,
    size: 1 + Math.random() * 3,
    color: i % 3 === 0 
      ? 'hsl(var(--vice-gold) / 0.4)' 
      : i % 3 === 1 
        ? 'hsl(var(--vice-sunset) / 0.3)' 
        : 'hsl(var(--foreground) / 0.15)',
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 5,
  }))

  const letterVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }
    }),
    exit: (i: number) => ({
      opacity: 0, y: -40, scale: 0.8, filter: 'blur(8px)',
      transition: { duration: 0.5, delay: 0.04 * i }
    })
  }

  const titleLetters = 'FOCUSS'.split('')

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          ref={containerRef}
          key="intro"
          className="fixed inset-0 w-full h-full overflow-hidden bg-background"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient gradient background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% 50%, hsl(var(--vice-gold) / 0.04) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 30% 70%, hsl(var(--vice-sunset) / 0.03) 0%, transparent 50%),
                radial-gradient(ellipse 50% 60% at 75% 30%, hsl(var(--vice-pink) / 0.02) 0%, transparent 50%)
              `
            }}
          />

          {/* Scan lines */}
          <ScanLine delay={0} />
          <ScanLine delay={4} />

          {/* Floating particles */}
          {particles.map(p => (
            <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} color={p.color} duration={p.duration} />
          ))}

          {/* Cinematic vignette */}
          <div className="absolute inset-0 z-[3] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at center, transparent 20%, hsl(var(--background)) 100%)' }} />

          {/* Corner accents */}
          <motion.div className="absolute top-6 left-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 0.3 : 0 }} transition={{ duration: 1.5 }}>
            <div className="w-8 h-[1px]" style={{ background: 'hsl(var(--vice-gold))' }} />
            <div className="w-[1px] h-8" style={{ background: 'hsl(var(--vice-gold))' }} />
          </motion.div>
          <motion.div className="absolute top-6 right-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 0.3 : 0 }} transition={{ duration: 1.5 }}>
            <div className="w-8 h-[1px] ml-auto" style={{ background: 'hsl(var(--vice-gold))' }} />
            <div className="w-[1px] h-8 ml-auto" style={{ background: 'hsl(var(--vice-gold))' }} />
          </motion.div>
          <motion.div className="absolute bottom-6 left-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 0.3 : 0 }} transition={{ duration: 1.5 }}>
            <div className="w-[1px] h-8" style={{ background: 'hsl(var(--vice-gold))' }} />
            <div className="w-8 h-[1px]" style={{ background: 'hsl(var(--vice-gold))' }} />
          </motion.div>
          <motion.div className="absolute bottom-6 right-6 z-10" initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 0.3 : 0 }} transition={{ duration: 1.5 }}>
            <div className="w-[1px] h-8 ml-auto" style={{ background: 'hsl(var(--vice-gold))' }} />
            <div className="w-8 h-[1px] ml-auto" style={{ background: 'hsl(var(--vice-gold))' }} />
          </motion.div>

          {/* Main content */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">

            {/* Pre-title label */}
            <motion.div
              initial={{ opacity: 0, y: 10, scaleX: 0 }}
              animate={phase >= 2 ? { opacity: 0.5, y: 0, scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12" style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-gold)))' }} />
              <span className="font-[family-name:var(--font-display)] text-[9px] sm:text-[10px] tracking-[0.6em] uppercase" style={{ color: 'hsl(var(--vice-gold))' }}>
                Digital Studio
              </span>
              <div className="h-[1px] w-12" style={{ background: 'linear-gradient(270deg, transparent, hsl(var(--vice-gold)))' }} />
            </motion.div>

            {/* Title — letter by letter */}
            <div className="flex items-center justify-center overflow-hidden" style={{ perspective: '600px' }}>
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate={phase >= 1 ? 'visible' : 'hidden'}
                  className="inline-block font-[family-name:var(--font-display)] text-6xl sm:text-7xl md:text-9xl font-bold tracking-[0.08em] uppercase"
                  style={{
                    background: 'linear-gradient(180deg, hsl(var(--foreground)) 20%, hsl(var(--vice-gold)) 50%, hsl(var(--vice-sunset)) 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 30px hsl(var(--vice-gold) / 0.2))',
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* DEV subtitle with expanding lines */}
            <motion.div
              className="flex items-center gap-5 mt-3"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              <motion.div
                className="h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--vice-sunset) / 0.7))' }}
                initial={{ width: 0 }}
                animate={phase >= 2 ? { width: 80 } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="font-[family-name:var(--font-display)] text-xl sm:text-2xl md:text-3xl tracking-[0.5em] uppercase font-extralight"
                style={{ color: 'hsl(var(--vice-sunset))' }}
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={phase >= 2 ? { opacity: 0.8, letterSpacing: '0.5em' } : {}}
                transition={{ duration: 1.5, delay: 0.4 }}
              >
                DEV
              </motion.span>
              <motion.div
                className="h-[1px]"
                style={{ background: 'linear-gradient(270deg, transparent, hsl(var(--vice-sunset) / 0.7))' }}
                initial={{ width: 0 }}
                animate={phase >= 2 ? { width: 80 } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="font-[family-name:var(--font-body)] text-muted-foreground text-[10px] sm:text-xs tracking-[0.25em] uppercase mt-8 text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={phase >= 3 ? { opacity: 0.45, y: 0 } : {}}
              transition={{ duration: 1.2 }}
            >
              Desenvolvimento Web & Design Digital
            </motion.p>

            {/* Enter button */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={handleEnter}
                className="group relative font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-[0.4em] uppercase font-light px-12 py-5 rounded-sm transition-all duration-600 hover:tracking-[0.55em] overflow-hidden"
                style={{
                  color: 'hsl(var(--vice-gold))',
                  border: '1px solid hsl(var(--vice-gold) / 0.2)',
                  background: 'hsl(var(--vice-gold) / 0.02)',
                }}
              >
                {/* Animated border glow */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    boxShadow: 'inset 0 0 30px hsl(var(--vice-gold) / 0.08), 0 0 40px hsl(var(--vice-gold) / 0.1)',
                  }} />
                {/* Top line sweep */}
                <span className="absolute top-0 left-0 w-0 group-hover:w-full h-[1px] transition-all duration-700"
                  style={{ background: 'linear-gradient(90deg, hsl(var(--vice-gold) / 0.6), transparent)' }} />
                {/* Bottom line sweep */}
                <span className="absolute bottom-0 right-0 w-0 group-hover:w-full h-[1px] transition-all duration-700"
                  style={{ background: 'linear-gradient(270deg, hsl(var(--vice-sunset) / 0.6), transparent)' }} />
                <span className="relative z-10">Explorar</span>
              </button>

              {/* Animated arrow */}
              <motion.div
                className="flex justify-center mt-8"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M6 0L6 18M6 18L1 13M6 18L11 13" stroke="hsl(var(--vice-gold))" strokeWidth="1" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom info bar */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 0.25 } : {}}
            transition={{ duration: 1.5 }}
          >
            <span className="font-[family-name:var(--font-display)] text-[8px] tracking-[0.4em] uppercase text-muted-foreground">
              © 2025
            </span>
            <div className="w-[1px] h-3 bg-border" />
            <span className="font-[family-name:var(--font-display)] text-[8px] tracking-[0.4em] uppercase text-muted-foreground">
              Brasil
            </span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          className="fixed inset-0 bg-background z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
    </AnimatePresence>
  )
}

export default IntroPage
