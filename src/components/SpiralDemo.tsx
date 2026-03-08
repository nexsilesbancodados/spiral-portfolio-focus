import { SpiralAnimation } from '@/components/ui/spiral-animation'

const SpiralDemo = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
    </div>
  )
}

export default SpiralDemo
