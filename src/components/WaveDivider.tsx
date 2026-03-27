import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wavePath = "M0,1.7c10.2,3.2,35.2,10.2,76.5,10.1C117.9,11.7,156.3,1.3,204.7,0.3c48.3-1,76.2,11.5,108.2,11 c32,0.5,86.5-1.2,109-3.7c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.2,26.9,145.1,36.2c75.3,9.3,145.3,8.5,188.6,10.3 c43.4,1.8,89.4,19,147.3,18.4c58.7-0.6,85.3-7.7,103.6-11V100H0V1.7z"

interface WaveDividerProps {
  topColor?: string
  bottomColor?: string
  triggerId?: string
}

export const WaveDivider = ({
  topColor = 'hsl(var(--primary) / 0.3)',
  bottomColor = 'hsl(var(--background))',
  triggerId = 'wave-trigger',
}: WaveDividerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<SVGSVGElement>(null)
  const mainRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !lightRef.current || !mainRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(lightRef.current, {
        xPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
      gsap.to(mainRef.current, {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full leading-[0]"
      style={{ height: '200px', overflow: 'visible' }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ left: '-30%', right: '-30%', width: '160%' }}>
        {/* Light wave */}
        <svg
          ref={lightRef}
          className="wave-shape absolute bottom-5 block"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '200%',
            height: '160px',
            zIndex: 2,
            opacity: 0.5,
            animation: 'waveShift 10s ease-in-out infinite',
          }}
        >
          <path d={wavePath} fill={topColor} />
        </svg>

        {/* Main wave */}
        <svg
          ref={mainRef}
          className="wave-shape absolute bottom-0 block"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '200%',
            height: '160px',
            zIndex: 3,
            animation: 'waveShift 10s ease-in-out infinite',
          }}
        >
          <path d={wavePath} fill={bottomColor} />
        </svg>
      </div>
    </div>
  )
}
