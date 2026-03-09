import { lazy, Suspense } from 'react'
import { LuminaSlider } from '@/components/ui/lumina-interactive-list'

const SectionsDetail = lazy(() => 
  import('@/components/SectionsDetail').then(m => ({ default: m.SectionsDetail }))
)

const Index = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <LuminaSlider />
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <SectionsDetail />
      </Suspense>
    </div>
  )
}

export default Index
