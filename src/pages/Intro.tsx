import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpiralAnimation } from '@/components/ui/spiral-animation'

const IntroPage = () => {
  const [enterVisible, setEnterVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setEnterVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = useCallback(() => {
    setExiting(true)
    setTimeout(() => navigate('/home'), 800)
  }, [navigate])

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden bg-background transition-opacity duration-700 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* FOCUSS DEV branding */}
      <div className={`absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-10 text-center transition-all duration-[1500ms] ease-out ${enterVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <h1 className="font-[family-name:var(--font-display)] text-foreground text-4xl sm:text-5xl md:text-7xl font-bold tracking-[0.15em] uppercase">
          FOCUSS DEV
        </h1>
        <div className="h-[1px] w-20 mx-auto mt-4 bg-vice-sunset/50" />
      </div>

      {/* Enter button */}
      <div className={`absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-[1500ms] ease-out ${enterVisible ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
        <button 
          onClick={handleEnter}
          className="font-[family-name:var(--font-display)] text-foreground/80 text-lg sm:text-xl tracking-[0.3em] uppercase font-extralight transition-all duration-700 hover:tracking-[0.45em] hover:text-foreground animate-pulse border border-foreground/10 px-8 py-3 rounded-sm backdrop-blur-sm hover:border-foreground/30 hover:bg-foreground/5"
        >
          Explorar
        </button>
      </div>

      {/* Subtitle */}
      <div className={`absolute left-1/2 bottom-12 -translate-x-1/2 z-10 text-center transition-all duration-[2000ms] ease-out delay-500 ${enterVisible ? 'opacity-60' : 'opacity-0'}`}>
        <p className="font-[family-name:var(--font-display)] text-foreground/40 text-[10px] tracking-[0.35em] uppercase">
          Desenvolvimento Web & Design Digital
        </p>
      </div>
    </div>
  )
}

export default IntroPage
