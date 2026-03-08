import { SpiralAnimation } from '@/components/ui/spiral-animation'
import { useState, useEffect } from 'react'

const SpiralDemo = () => {
  const [startVisible, setStartVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStartVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Spiral Animation */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* Overlay text */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-end pb-24 z-10 transition-opacity duration-1000 ${
          startVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          className="px-10 py-3 text-lg tracking-[0.3em] uppercase font-light border border-primary/40 text-primary bg-background/20 backdrop-blur-sm rounded-none hover:bg-primary hover:text-primary-foreground transition-all duration-500 animate-pulse"
          style={{ fontFamily: 'var(--font-display)' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          Enter
        </button>
      </div>
    </div>
  )
}

export default SpiralDemo
