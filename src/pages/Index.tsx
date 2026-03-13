import { lazy, Suspense } from 'react'
import { LuminaSlider } from '@/components/ui/lumina-interactive-list'
import { HamburgerMenu } from '@/components/HamburgerMenu'

const SectionsDetail = lazy(() => 
  import('@/components/SectionsDetail').then(m => ({ default: m.SectionsDetail }))
)

const Index = () => {
  const handleMenuNavigate = (index: number) => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: index } }));
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <HamburgerMenu onNavigate={handleMenuNavigate} />
      <LuminaSlider />
      <Suspense fallback={<div className="absolute inset-0 bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" /></div>}>
        <SectionsDetail />
      </Suspense>
    </div>
  )
}

export default Index
