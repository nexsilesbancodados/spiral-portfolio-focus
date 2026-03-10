import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

const NeonFlicker = ({ children, color, delay = 0 }: { children: React.ReactNode; color: string; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.7, 1, 0.85, 1] }}
    transition={{ duration: 0.8, delay, times: [0, 0.2, 0.3, 0.5, 0.7, 1] }}
    style={{ 
      color, 
      textShadow: `0 0 7px ${color}, 0 0 20px ${color}, 0 0 42px ${color}`,
      filter: 'brightness(1.3)'
    }}
  >
    {children}
  </motion.span>
)

const PalmSilhouette = ({ side, delay }: { side: 'left' | 'right'; delay: number }) => (
  <motion.div
    className={`absolute bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} z-[2] pointer-events-none`}
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 0.15, y: 0 }}
    transition={{ duration: 2, delay }}
  >
    <svg 
      width={side === 'left' ? '280' : '320'} 
      height="500" 
      viewBox="0 0 300 500" 
      fill="none"
      className={side === 'right' ? 'scale-x-[-1]' : ''}
    >
      <path d="M150 500 L145 350 Q100 300 30 250 Q80 280 140 340 L135 280 Q60 220 10 180 Q70 210 130 270 L125 200 Q50 150 20 100 Q80 140 120 190 L115 120 Q70 60 90 10 Q100 70 110 110 L110 80 Q130 20 160 0 Q145 50 115 90 L120 130 Q170 60 230 30 Q180 80 130 140 L135 200 Q210 150 270 130 Q210 170 140 210 L140 270 Q220 220 280 200 Q220 240 145 280 L148 340 Q220 290 280 270 Q220 310 152 350 Z" 
        fill="hsl(145 50% 15%)" 
      />
    </svg>
  </motion.div>
)

const HeatWave = () => (
  <motion.div
    className="absolute inset-0 z-[1] pointer-events-none"
    style={{
      background: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          hsl(25 95% 55% / 0.015) 2px,
          hsl(25 95% 55% / 0.015) 4px
        )
      `,
    }}
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  />
)

const IntroPage = () => {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)
  const navigate = useNavigate()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useTransform(mouseX, [0, window.innerWidth], [2, -2])
  const bgY = useTransform(mouseY, [0, window.innerHeight], [2, -2])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(() => navigate('/home'), 1200)
  }, [navigate])

  const titleChars = 'FOCUSS'.split('')
  const subtitleChars = 'DIGITAL STUDIO'.split('')

  return (
    <AnimatePresence mode="wait">
      {!exiting ? (
        <motion.div
          key="intro"
          className="fixed inset-0 w-full h-full overflow-hidden cursor-pointer select-none"
          style={{ background: 'hsl(0 0% 2%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={phase >= 5 ? handleEnter : undefined}
        >
          {/* Sunset gradient background */}
          <motion.div
            className="absolute inset-0 z-[0]"
            style={{ x: bgX, y: bgY }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
          >
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(ellipse 120% 80% at 50% 100%, hsl(25 95% 45% / 0.35) 0%, transparent 55%),
                radial-gradient(ellipse 100% 60% at 50% 90%, hsl(335 75% 45% / 0.25) 0%, transparent 50%),
                radial-gradient(ellipse 80% 50% at 30% 80%, hsl(40 100% 50% / 0.15) 0%, transparent 45%),
                radial-gradient(ellipse 60% 40% at 70% 20%, hsl(200 60% 50% / 0.08) 0%, transparent 40%),
                radial-gradient(ellipse 140% 60% at 50% 60%, hsl(270 40% 20% / 0.3) 0%, transparent 60%),
                linear-gradient(180deg, hsl(220 50% 8%) 0%, hsl(260 40% 12%) 30%, hsl(320 50% 18%) 60%, hsl(25 80% 30%) 85%, hsl(40 90% 45%) 100%)
              `
            }} />
          </motion.div>

          {/* Ocean/water reflection at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[25%] z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 3, delay: 0.5 }}
            style={{
              background: `
                linear-gradient(180deg, transparent 0%, hsl(200 60% 15% / 0.4) 30%, hsl(200 70% 10% / 0.6) 100%)
              `,
            }}
          >
            {/* Water shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(90deg, transparent 0%, hsl(40 100% 50% / 0.03) 10%, transparent 20%)
                `,
              }}
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <HeatWave />

          {/* Palm silhouettes */}
          <PalmSilhouette side="left" delay={1.5} />
          <PalmSilhouette side="right" delay={1.8} />

          {/* Sun glow */}
          <motion.div
            className="absolute z-[1] pointer-events-none"
            style={{
              bottom: '22%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, hsl(40 100% 55% / 0.4) 0%, hsl(25 95% 50% / 0.2) 30%, hsl(335 75% 45% / 0.1) 60%, transparent 80%)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0.6, 0.8], scale: 1 }}
            transition={{ duration: 3, delay: 0.5 }}
          />

          {/* Horizontal chrome lines */}
          <motion.div
            className="absolute left-0 right-0 z-[5] pointer-events-none"
            style={{ top: '38%' }}
            initial={{ scaleX: 0 }}
            animate={phase >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-[1px] mx-auto" style={{ 
              maxWidth: '700px',
              background: 'linear-gradient(90deg, transparent, hsl(40 100% 55% / 0.5), hsl(335 75% 55% / 0.3), transparent)' 
            }} />
          </motion.div>

          <motion.div
            className="absolute left-0 right-0 z-[5] pointer-events-none"
            style={{ top: '62%' }}
            initial={{ scaleX: 0 }}
            animate={phase >= 2 ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-[1px] mx-auto" style={{ 
              maxWidth: '700px',
              background: 'linear-gradient(90deg, transparent, hsl(335 75% 55% / 0.3), hsl(40 100% 55% / 0.5), transparent)' 
            }} />
          </motion.div>

          {/* Main title */}
          <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center">
            
            {/* FOCUSS - main title with dramatic reveal */}
            <div className="relative flex items-center justify-center overflow-visible mb-2">
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block font-[family-name:var(--font-display)] text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black uppercase leading-none"
                  initial={{ opacity: 0, y: 100, rotateX: -45, scale: 0.6 }}
                  animate={phase >= 1 ? { 
                    opacity: 1, y: 0, rotateX: 0, scale: 1,
                  } : {}}
                  transition={{ 
                    duration: 1, 
                    delay: i * 0.1, 
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    background: `linear-gradient(
                      180deg, 
                      hsl(0 0% 100%) 0%,
                      hsl(40 100% 70%) 25%,
                      hsl(335 75% 60%) 50%,
                      hsl(25 95% 55%) 75%,
                      hsl(40 100% 50%) 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 40px hsl(335 75% 55% / 0.3)) drop-shadow(0 4px 20px hsl(0 0% 0% / 0.5))',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {char}
                </motion.span>
              ))}

              {/* Glow behind title */}
              <motion.div
                className="absolute inset-0 -z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ duration: 2, delay: 0.5 }}
                style={{
                  background: 'radial-gradient(ellipse 60% 40% at center, hsl(335 75% 50% / 0.15), transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
            </div>

            {/* DEV subtitle with neon effect */}
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(175 70% 45%))' }}
                initial={{ width: 0 }}
                animate={phase >= 3 ? { width: 60 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
              <NeonFlicker color="hsl(175, 70%, 55%)" delay={2.4}>
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-5xl tracking-[0.5em] uppercase font-light">
                  DEV
                </span>
              </NeonFlicker>
              <motion.div
                className="h-[2px]"
                style={{ background: 'linear-gradient(270deg, transparent, hsl(175 70% 45%))' }}
                initial={{ width: 0 }}
                animate={phase >= 3 ? { width: 60 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </motion.div>

            {/* Subtitle characters */}
            <div className="flex items-center justify-center gap-[2px] mb-12">
              {subtitleChars.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block font-[family-name:var(--font-body)] text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] uppercase"
                  style={{ color: 'hsl(0 0% 60%)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={phase >= 4 ? { opacity: 0.6, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                >
                  {char === ' ' ? '\u00A0\u00A0' : char}
                </motion.span>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <button
                onClick={handleEnter}
                className="group relative font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-[0.5em] uppercase font-light px-14 py-5 overflow-hidden transition-all duration-500"
                style={{
                  color: 'hsl(40 100% 65%)',
                  border: '1px solid hsl(40 100% 50% / 0.3)',
                  background: 'hsl(40 100% 50% / 0.03)',
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                }}
              >
                {/* Hover fill */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, hsl(335 75% 50% / 0.15), hsl(25 95% 50% / 0.1))' }}
                />
                {/* Neon glow on hover */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ boxShadow: 'inset 0 0 30px hsl(335 75% 55% / 0.1), 0 0 50px hsl(335 75% 55% / 0.1)' }}
                />
                <span className="relative z-10">Entrar</span>
              </button>

              {/* Pulsing arrow */}
              <motion.div
                className="mt-8"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ opacity: 0.4 }}>
                  <path d="M8 0L8 22M8 22L2 16M8 22L14 16" stroke="hsl(40, 100%, 55%)" strokeWidth="1.5" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Corner markers */}
          {[
            { pos: 'top-4 left-4', delay: 1 },
            { pos: 'top-4 right-4', delay: 1.2 },
            { pos: 'bottom-4 left-4', delay: 3.5 },
            { pos: 'bottom-4 right-4', delay: 3.7 },
          ].map((corner, idx) => (
            <motion.div
              key={idx}
              className={`absolute ${corner.pos} z-[12]`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 1.5, delay: corner.delay }}
            >
              <div className={`w-6 h-[1px] ${idx % 2 === 1 ? 'ml-auto' : ''}`} style={{ background: 'hsl(335, 75%, 55%)' }} />
              <div className={`w-[1px] h-6 ${idx % 2 === 1 ? 'ml-auto' : ''}`} style={{ background: 'hsl(335, 75%, 55%)' }} />
            </motion.div>
          ))}

          {/* Bottom info */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[12] flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={phase >= 5 ? { opacity: 0.3 } : {}}
            transition={{ duration: 1.5 }}
          >
            <span className="font-[family-name:var(--font-display)] text-[8px] tracking-[0.4em] uppercase text-muted-foreground">
              © 2025
            </span>
            <div className="w-4 h-[1px]" style={{ background: 'hsl(335, 75%, 55%, 0.4)' }} />
            <span className="font-[family-name:var(--font-display)] text-[8px] tracking-[0.4em] uppercase text-muted-foreground">
              Brasil
            </span>
          </motion.div>

          {/* Film grain overlay */}
          <div 
            className="absolute inset-0 z-[11] pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Cinematic bars */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-[15] pointer-events-none"
            style={{ background: 'hsl(0 0% 2%)' }}
            initial={{ height: '50%' }}
            animate={{ height: '0%' }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-[15] pointer-events-none"
            style={{ background: 'hsl(0 0% 2%)' }}
            initial={{ height: '50%' }}
            animate={{ height: '0%' }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Exit with cinematic wipe */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'hsl(0 0% 2%)' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroPage
