import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

/* ── Glitch text effect ── */
const GlitchText = ({ children, active, className = '', style = {} }: { children: React.ReactNode; active: boolean; className?: string; style?: React.CSSProperties }) => {
  const [glitch, setGlitch] = useState(false)
  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 100 + Math.random() * 150)
    }, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [active])

  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {children}
      {glitch && (
        <>
          <span className="absolute inset-0" style={{ ...style, color: 'hsl(175 70% 55%)', clipPath: 'inset(20% 0 50% 0)', transform: 'translateX(2px)' }}>{children}</span>
          <span className="absolute inset-0" style={{ ...style, color: 'hsl(335 75% 55%)', clipPath: 'inset(50% 0 20% 0)', transform: 'translateX(-2px)' }}>{children}</span>
        </>
      )}
    </span>
  )
}

/* ── Skyline silhouette ── */
const Skyline = () => (
  <motion.div
    className="absolute bottom-[18%] left-0 right-0 z-[3] pointer-events-none"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 0.12, y: 0 }}
    transition={{ duration: 3, delay: 1 }}
  >
    <svg viewBox="0 0 1200 200" className="w-full h-auto" preserveAspectRatio="none">
      <path d="M0,200 L0,160 L30,160 L30,130 L45,130 L45,100 L55,100 L55,80 L65,80 L65,100 L80,100 L80,140 L100,140 L100,90 L108,90 L108,60 L115,55 L122,60 L122,90 L140,90 L140,110 L160,110 L160,70 L175,65 L175,40 L185,35 L195,40 L195,65 L210,70 L210,110 L230,110 L230,100 L250,100 L250,130 L280,130 L280,80 L290,75 L300,80 L300,50 L310,45 L320,50 L320,80 L340,85 L340,120 L370,120 L370,90 L385,85 L400,90 L400,60 L410,55 L415,30 L420,55 L430,60 L430,90 L450,95 L450,130 L480,130 L480,110 L500,110 L500,75 L510,70 L520,65 L530,70 L530,100 L550,105 L550,130 L580,130 L580,95 L600,90 L600,55 L610,50 L615,25 L620,50 L630,55 L630,90 L650,95 L650,120 L680,120 L680,100 L700,95 L710,90 L720,60 L730,55 L735,30 L740,55 L750,60 L760,90 L770,95 L790,100 L790,130 L810,130 L810,110 L830,105 L840,100 L850,70 L860,65 L870,70 L870,100 L890,105 L890,130 L920,130 L920,90 L935,85 L950,80 L960,50 L970,45 L975,20 L980,45 L990,50 L1000,80 L1010,85 L1030,90 L1030,130 L1060,130 L1060,110 L1080,110 L1080,140 L1100,140 L1100,100 L1120,95 L1130,90 L1140,100 L1140,130 L1160,130 L1160,150 L1180,150 L1180,160 L1200,160 L1200,200 Z"
        fill="hsl(220 30% 8%)" />
    </svg>
  </motion.div>
)

/* ── Animated neon sign ── */
const NeonSign = ({ text, color, delay, className = '' }: { text: string; color: string; delay: number; className?: string }) => (
  <motion.span
    className={`inline-block ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.6, 1, 0.8, 1] }}
    transition={{ duration: 1.2, delay, times: [0, 0.15, 0.25, 0.4, 0.6, 1] }}
    style={{
      color,
      textShadow: `0 0 7px ${color}, 0 0 21px ${color}, 0 0 42px ${color}, 0 0 82px ${color}`,
    }}
  >
    {text}
  </motion.span>
)

/* ── Horizontal VHS tracking line ── */
const VHSLine = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] z-[13] pointer-events-none"
    style={{ background: 'linear-gradient(90deg, transparent 5%, hsl(0 0% 100% / 0.06) 20%, hsl(0 0% 100% / 0.03) 80%, transparent 95%)' }}
    initial={{ top: '-5%' }}
    animate={{ top: ['0%', '105%'] }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: 'linear' }}
  />
)

/* ── Floating particles (embers/fireflies) ── */
const FloatingEmber = ({ i }: { i: number }) => {
  const x = useMemo(() => `${8 + Math.random() * 84}%`, [])
  const y = useMemo(() => `${15 + Math.random() * 70}%`, [])
  const size = useMemo(() => 1.5 + Math.random() * 2.5, [])
  const dur = useMemo(() => 5 + Math.random() * 7, [])
  const del = useMemo(() => Math.random() * 8, [])
  const isGold = i % 3 === 0
  const isPink = i % 3 === 1

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: isGold ? 'hsl(40 100% 60%)' : isPink ? 'hsl(335 75% 60%)' : 'hsl(175 70% 55%)',
        boxShadow: isGold ? '0 0 6px hsl(40 100% 55%)' : isPink ? '0 0 6px hsl(335 75% 50%)' : '0 0 6px hsl(175 70% 45%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.4, 0.7, 0],
        scale: [0, 1, 0.7, 1, 0],
        y: [0, -20, -35, -55, -80],
        x: [0, 8 * (i % 2 === 0 ? 1 : -1), -5, 12 * (i % 2 === 0 ? -1 : 1), 3],
      }}
      transition={{ duration: dur, delay: del, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ── Palm tree ── */
const PalmTree = ({ side, delay: d }: { side: 'left' | 'right'; delay: number }) => (
  <motion.div
    className={`absolute bottom-0 ${side === 'left' ? '-left-4' : '-right-4'} z-[4] pointer-events-none`}
    initial={{ opacity: 0, y: 80, scale: 0.9 }}
    animate={{ opacity: 0.2, y: 0, scale: 1 }}
    transition={{ duration: 2.5, delay: d, ease: [0.22, 1, 0.36, 1] }}
  >
    <svg
      width={side === 'left' ? '260' : '300'}
      height="550"
      viewBox="0 0 260 550"
      fill="none"
      className={side === 'right' ? 'scale-x-[-1]' : ''}
    >
      {/* Trunk */}
      <path d="M130 550 Q125 450 128 380 Q132 310 126 250 Q120 200 125 160" stroke="hsl(30 25% 18%)" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* Fronds */}
      <path d="M125 160 Q80 130 20 140 Q70 110 125 155" fill="hsl(145 45% 16%)" />
      <path d="M125 160 Q60 100 10 80 Q65 85 125 150" fill="hsl(145 50% 14%)" />
      <path d="M125 160 Q90 70 70 20 Q100 65 128 145" fill="hsl(145 40% 18%)" />
      <path d="M125 160 Q140 60 170 10 Q155 70 130 145" fill="hsl(145 45% 15%)" />
      <path d="M125 160 Q180 90 240 70 Q185 100 128 155" fill="hsl(145 50% 13%)" />
      <path d="M125 160 Q185 120 250 130 Q180 130 125 158" fill="hsl(145 40% 17%)" />
      {/* Coconuts */}
      <circle cx="118" cy="165" r="5" fill="hsl(30 40% 22%)" />
      <circle cx="132" cy="162" r="4.5" fill="hsl(30 35% 20%)" />
    </svg>
  </motion.div>
)

/* ══════════════════════════════════════════════════ */
const IntroPage = () => {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)
  const navigate = useNavigate()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [3, -3])
  const bgY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [3, -3])

  useEffect(() => {
    const h = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [mouseX, mouseY])

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3000),
      setTimeout(() => setPhase(5), 3800),
      setTimeout(() => setPhase(6), 4600),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  const handleEnter = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(() => navigate('/home'), 1400)
  }, [navigate, exiting])

  const embers = useMemo(() => Array.from({ length: 30 }, (_, i) => i), [])

  return (
    <AnimatePresence mode="wait">
      {!exiting ? (
        <motion.div
          key="intro"
          className="fixed inset-0 w-full h-full overflow-hidden select-none"
          style={{ background: 'hsl(220 40% 4%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* ── CINEMATIC LETTERBOX REVEAL ── */}
          <motion.div className="absolute top-0 left-0 right-0 z-[20] pointer-events-none" style={{ background: 'hsl(220 40% 4%)' }}
            initial={{ height: '50%' }} animate={{ height: '6%' }}
            transition={{ duration: 2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="absolute bottom-0 left-0 right-0 z-[20] pointer-events-none" style={{ background: 'hsl(220 40% 4%)' }}
            initial={{ height: '50%' }} animate={{ height: '6%' }}
            transition={{ duration: 2, delay: 0.1, ease: [0.76, 0, 0.24, 1] }} />

          {/* ── SUNSET SKY ── */}
          <motion.div className="absolute inset-0 z-[0]" style={{ x: bgX, y: bgY }}
            initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4, ease: 'easeOut' }}>
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(ellipse 100% 90% at 50% 95%, hsl(25 100% 40% / 0.5) 0%, transparent 50%),
                radial-gradient(ellipse 80% 70% at 50% 85%, hsl(335 80% 40% / 0.35) 0%, transparent 45%),
                radial-gradient(ellipse 60% 50% at 35% 75%, hsl(40 100% 50% / 0.25) 0%, transparent 40%),
                radial-gradient(ellipse 50% 35% at 65% 25%, hsl(250 50% 30% / 0.3) 0%, transparent 45%),
                radial-gradient(ellipse 120% 50% at 50% 55%, hsl(280 35% 18% / 0.4) 0%, transparent 55%),
                linear-gradient(180deg, 
                  hsl(230 45% 6%) 0%, 
                  hsl(250 40% 12%) 15%,
                  hsl(280 35% 18%) 30%, 
                  hsl(320 45% 22%) 45%,
                  hsl(345 55% 30%) 55%,
                  hsl(15 75% 38%) 65%,
                  hsl(25 90% 42%) 75%, 
                  hsl(35 95% 48%) 85%,
                  hsl(40 100% 55%) 95%
                )
              `
            }} />
          </motion.div>

          {/* ── SUN ── */}
          <motion.div className="absolute z-[1] pointer-events-none"
            style={{ bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: 360, height: 360, borderRadius: '50%' }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            {/* Sun body */}
            <div className="absolute inset-0 rounded-full" style={{
              background: `radial-gradient(circle, hsl(45 100% 70% / 0.9) 0%, hsl(35 100% 55% / 0.6) 35%, hsl(25 95% 50% / 0.3) 55%, hsl(335 75% 45% / 0.1) 75%, transparent 100%)`,
            }} />
            {/* Sun horizontal lines (retro) */}
            {[30, 38, 45, 51, 56, 60, 63, 66, 68, 70].map((top, i) => (
              <motion.div key={i} className="absolute left-[10%] right-[10%]" style={{ top: `${top}%`, height: `${2 + i * 0.5}%`, background: 'hsl(220 40% 4% / 0.6)' }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
            ))}
            {/* Lens flare */}
            <motion.div className="absolute -inset-[50%] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(40 100% 60% / 0.08), transparent 50%)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>

          {/* ── WATER REFLECTION ── */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-[22%] z-[2]"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
            transition={{ duration: 3, delay: 1 }}>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, hsl(200 50% 12% / 0.3) 0%, hsl(220 45% 8% / 0.8) 100%)',
            }} />
            {/* Shimmer ripples */}
            <motion.div className="absolute inset-0"
              style={{ background: 'repeating-linear-gradient(90deg, transparent 0%, hsl(40 100% 55% / 0.04) 8%, transparent 16%)' }}
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute inset-0"
              style={{ background: 'repeating-linear-gradient(0deg, transparent 0%, hsl(335 75% 55% / 0.02) 4px, transparent 8px)' }}
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
            {/* Sun reflection column */}
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-full"
              style={{ background: 'linear-gradient(180deg, hsl(40 100% 55% / 0.2), transparent 80%)', filter: 'blur(20px)' }}
              animate={{ opacity: [0.4, 0.7, 0.4], scaleX: [0.8, 1.2, 0.8] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>

          {/* ── SKYLINE ── */}
          <Skyline />

          {/* ── PALM TREES ── */}
          <PalmTree side="left" delay={1.2} />
          <PalmTree side="right" delay={1.5} />

          {/* ── VHS SCAN LINES ── */}
          <VHSLine delay={0} />
          <VHSLine delay={3} />

          {/* ── EMBERS / FIREFLIES ── */}
          {embers.map(i => <FloatingEmber key={i} i={i} />)}

          {/* ── FILM GRAIN ── */}
          <div className="absolute inset-0 z-[12] pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

          {/* ── VIGNETTE ── */}
          <div className="absolute inset-0 z-[11] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 65% 55% at center, transparent 10%, hsl(220 40% 4% / 0.7) 100%)' }} />

          {/* ══════ MAIN CONTENT ══════ */}
          <div className="absolute inset-0 z-[14] flex flex-col items-center justify-center">

            {/* ── PRE-TITLE LABEL ── */}
            <motion.div className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={phase >= 3 ? { opacity: 0.5, scaleX: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
              <div className="h-[1px] w-16" style={{ background: 'linear-gradient(90deg, transparent, hsl(40 100% 55%))' }} />
              <span className="font-[family-name:var(--font-display)] text-[8px] sm:text-[9px] tracking-[0.7em] uppercase" style={{ color: 'hsl(40 100% 60%)' }}>
                Digital Studio
              </span>
              <div className="h-[1px] w-16" style={{ background: 'linear-gradient(270deg, transparent, hsl(40 100% 55%))' }} />
            </motion.div>

            {/* ── FOCUSS TITLE ── */}
            <div className="relative flex items-center justify-center mb-1" style={{ perspective: '800px' }}>
              {'FOCUSS'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block font-[family-name:var(--font-display)] text-7xl sm:text-8xl md:text-[10rem] lg:text-[13rem] xl:text-[15rem] font-black uppercase leading-none"
                  initial={{ opacity: 0, y: 120, rotateX: -60, scale: 0.5 }}
                  animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: `linear-gradient(180deg, 
                      hsl(0 0% 100%) 0%, 
                      hsl(45 100% 80%) 15%,
                      hsl(40 100% 65%) 30%, 
                      hsl(25 95% 55%) 50%,
                      hsl(335 75% 50%) 70%, 
                      hsl(335 75% 40%) 85%,
                      hsl(280 50% 30%) 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 50px hsl(335 75% 55% / 0.4)) drop-shadow(0 0 100px hsl(25 95% 50% / 0.2)) drop-shadow(0 6px 30px hsl(0 0% 0% / 0.6))',
                    letterSpacing: '-0.01em',
                  }}
                >
                  <GlitchText active={phase >= 4} style={{
                    background: `linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(40 100% 65%) 30%, hsl(335 75% 50%) 70%, hsl(280 50% 30%) 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {char}
                  </GlitchText>
                </motion.span>
              ))}

              {/* Glow behind */}
              <motion.div className="absolute inset-0 -z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 3, delay: 0.5 }}
                style={{ background: 'radial-gradient(ellipse 70% 50% at center, hsl(335 75% 50% / 0.2), hsl(25 95% 50% / 0.1) 40%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            {/* ── DEV ── neon sign */}
            <motion.div className="flex items-center gap-5 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div className="h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(175 70% 50%))' }}
                initial={{ width: 0 }}
                animate={phase >= 4 ? { width: 70 } : {}}
                transition={{ duration: 1.4, delay: 0.3 }} />
              <NeonSign text="DEV" color="hsl(175, 70%, 55%)" delay={3.2}
                className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-6xl tracking-[0.6em] uppercase font-extralight" />
              <motion.div className="h-[2px]"
                style={{ background: 'linear-gradient(270deg, transparent, hsl(175 70% 50%))' }}
                initial={{ width: 0 }}
                animate={phase >= 4 ? { width: 70 } : {}}
                transition={{ duration: 1.4, delay: 0.3 }} />
            </motion.div>

            {/* ── Tagline ── */}
            <motion.div className="flex items-center gap-1 mb-14"
              initial={{ opacity: 0 }}
              animate={phase >= 5 ? { opacity: 0.5 } : {}}
              transition={{ duration: 1.5 }}>
              {'DESENVOLVIMENTO WEB & DESIGN DIGITAL'.split('').map((c, i) => (
                <motion.span key={i}
                  className="font-[family-name:var(--font-body)] text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: 'hsl(0 0% 65%)' }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={phase >= 5 ? { opacity: 0.7, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: i * 0.015 }}>
                  {c === ' ' ? '\u00A0\u00A0' : c}
                </motion.span>
              ))}
            </motion.div>

            {/* ── CTA BUTTON ── */}
            <motion.div className="flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={phase >= 6 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
              <button onClick={handleEnter}
                className="group relative font-[family-name:var(--font-display)] text-xs sm:text-sm tracking-[0.5em] uppercase font-light px-16 py-6 overflow-hidden transition-all duration-700 hover:tracking-[0.65em]"
                style={{
                  color: 'hsl(40 100% 65%)',
                  border: '1px solid hsl(40 100% 50% / 0.25)',
                  background: 'hsl(40 100% 50% / 0.03)',
                  clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                }}>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: 'linear-gradient(135deg, hsl(335 75% 50% / 0.12), hsl(25 95% 50% / 0.08), hsl(175 70% 45% / 0.06))' }} />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ boxShadow: 'inset 0 0 40px hsl(335 75% 55% / 0.08), 0 0 60px hsl(335 75% 55% / 0.08), 0 0 100px hsl(40 100% 50% / 0.05)' }} />
                <span className="absolute top-0 left-0 w-0 group-hover:w-full h-[1px] transition-all duration-1000"
                  style={{ background: 'linear-gradient(90deg, hsl(175 70% 55% / 0.6), hsl(40 100% 55% / 0.4), transparent)' }} />
                <span className="absolute bottom-0 right-0 w-0 group-hover:w-full h-[1px] transition-all duration-1000"
                  style={{ background: 'linear-gradient(270deg, hsl(335 75% 55% / 0.6), hsl(25 95% 55% / 0.4), transparent)' }} />
                <span className="relative z-10">Explorar</span>
              </button>

              <motion.div className="mt-10"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                <svg width="14" height="22" viewBox="0 0 14 22" fill="none" style={{ opacity: 0.35 }}>
                  <path d="M7 0L7 20M7 20L1 14M7 20L13 14" stroke="hsl(40, 100%, 55%)" strokeWidth="1.5" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* ── CORNER MARKERS ── */}
          {[
            { cls: 'top-[6%] left-5', d: 1.5 },
            { cls: 'top-[6%] right-5', d: 1.7 },
            { cls: 'bottom-[6%] left-5', d: 4 },
            { cls: 'bottom-[6%] right-5', d: 4.2 },
          ].map((c, idx) => (
            <motion.div key={idx} className={`absolute ${c.cls} z-[21]`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
              transition={{ duration: 2, delay: c.d }}>
              <div className={`w-8 h-[1px] ${idx % 2 === 1 ? 'ml-auto' : ''}`} style={{ background: 'hsl(335, 75%, 55%)' }} />
              <div className={`w-[1px] h-8 ${idx % 2 === 1 ? 'ml-auto' : ''}`} style={{ background: 'hsl(335, 75%, 55%)' }} />
            </motion.div>
          ))}

          {/* ── BOTTOM INFO ── */}
          <motion.div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-[21] flex items-center gap-5 py-2"
            initial={{ opacity: 0 }}
            animate={phase >= 6 ? { opacity: 0.25 } : {}}
            transition={{ duration: 2 }}>
            <span className="font-[family-name:var(--font-display)] text-[7px] tracking-[0.5em] uppercase text-muted-foreground">© 2025</span>
            <div className="w-5 h-[1px]" style={{ background: 'hsl(335, 75%, 55%, 0.3)' }} />
            <span className="font-[family-name:var(--font-display)] text-[7px] tracking-[0.5em] uppercase text-muted-foreground">Brasil</span>
            <div className="w-5 h-[1px]" style={{ background: 'hsl(335, 75%, 55%, 0.3)' }} />
            <span className="font-[family-name:var(--font-display)] text-[7px] tracking-[0.5em] uppercase text-muted-foreground">FOCUSS</span>
          </motion.div>

        </motion.div>
      ) : (
        /* ── EXIT TRANSITION ── */
        <motion.div key="exit" className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Cinematic flash + fade */}
          <motion.div className="absolute inset-0"
            style={{ background: 'hsl(40 100% 55%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.4 }} />
          <motion.div className="absolute inset-0"
            style={{ background: 'hsl(220 40% 4%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }} />
          {/* Letterbox close */}
          <motion.div className="absolute top-0 left-0 right-0" style={{ background: 'hsl(220 40% 4%)' }}
            initial={{ height: '6%' }} animate={{ height: '50%' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="absolute bottom-0 left-0 right-0" style={{ background: 'hsl(220 40% 4%)' }}
            initial={{ height: '6%' }} animate={{ height: '50%' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroPage
