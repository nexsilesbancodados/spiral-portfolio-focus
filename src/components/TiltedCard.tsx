import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface TiltedCardProps {
  imageSrc: string
  altText?: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  scaleOnHover?: number
  rotateAmplitude?: number
  showTooltip?: boolean
  overlayContent?: React.ReactNode
  displayOverlayContent?: boolean
}

const springValues = { damping: 30, stiffness: 100, mass: 2 }

export const TiltedCard = ({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) => {
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 })
  const [lastY, setLastY] = useState(0)

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
    rotateFigcaption.set(-(offsetY - lastY) * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <figure
      ref={ref}
      className="relative flex flex-col items-center justify-center m-0"
      style={{ height: containerHeight, width: containerWidth, perspective: '800px' }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve3d',
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 object-cover rounded-2xl will-change-transform"
          style={{ width: imageWidth, height: imageHeight, transform: 'translateZ(0)' }}
        />
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 z-[2] flex items-end justify-start w-full h-full p-5 pointer-events-none"
            style={{ transform: 'translateZ(30px)' }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded bg-foreground px-2.5 py-1 text-[10px] text-background opacity-0 z-[3] shadow-md whitespace-nowrap"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  )
}
