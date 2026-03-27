import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wave1 = "M0,40 C150,80 350,0 500,50 C650,100 850,20 1000,60 L1000,100 L0,100 Z"
const wave2 = "M0,60 C200,20 300,90 500,40 C700,-10 800,70 1000,30 L1000,100 L0,100 Z"
const wave3 = "M0,50 C100,90 250,10 400,55 C550,100 750,25 1000,45 L1000,100 L0,100 Z"

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
  const wave1Ref = useRef<SVGSVGElement>(null)
  const wave2Ref = useRef<SVGSVGElement>(null)
  const wave3Ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      // Parallax scroll on each wave layer
      if (wave1Ref.current) {
        gsap.to(wave1Ref.current, {
          xPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }
      if (wave2Ref.current) {
        gsap.to(wave2Ref.current, {
          xPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
      if (wave3Ref.current) {
        gsap.to(wave3Ref.current, {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full leading-[0]"
      style={{ height: '220px', overflow: 'visible' }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ left: '-30%', right: '-30%', width: '160%' }}>
        {/* Wave 1 — deepest, most transparent */}
        <svg
          ref={wave1Ref}
          className="absolute bottom-4 block"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '200%',
            height: '180px',
            zIndex: 1,
            opacity: 0.25,
            animation: 'waveShift 12s ease-in-out infinite',
          }}
        >
          <path d={wave1} fill={topColor} />
        </svg>

        {/* Wave 2 — mid layer */}
        <svg
          ref={wave2Ref}
          className="absolute bottom-2 block"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '200%',
            height: '170px',
            zIndex: 2,
            opacity: 0.5,
            animation: 'waveShift 8s ease-in-out infinite reverse',
          }}
        >
          <path d={wave2} fill={topColor} />
        </svg>

        {/* Wave 3 — front, solid */}
        <svg
          ref={wave3Ref}
          className="absolute bottom-0 block"
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
          <path d={wave3} fill={bottomColor} />
        </svg>
      </div>
    </div>
  )
}
