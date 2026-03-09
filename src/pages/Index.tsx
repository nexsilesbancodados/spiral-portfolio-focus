import { lazy, Suspense } from 'react'
import { LuminaSlider } from '@/components/ui/lumina-interactive-list'
import { HamburgerMenu } from '@/components/HamburgerMenu'

const SectionsDetail = lazy(() => 
  import('@/components/SectionsDetail').then(m => ({ default: m.SectionsDetail }))
)

const Index = () => {
  const handleMenuNavigate = (index: number) => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: index } }));
    // Animate detail section in
    setTimeout(() => {
      const detail = document.getElementById('detail-section');
      const slider = document.querySelector('.slider-wrapper');
      if (detail && slider && typeof (window as any).gsap !== 'undefined') {
        const gsap = (window as any).gsap;
        gsap.to(detail, { y: '0%', opacity: 1, duration: 1.4, ease: 'power3.inOut' });
        gsap.to(slider, { y: '-8%', opacity: 0, duration: 1.4, ease: 'power3.inOut' });
      }
    }, 50);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <HamburgerMenu onNavigate={handleMenuNavigate} />
      <LuminaSlider />
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <SectionsDetail />
      </Suspense>
    </div>
  )
}

export default Index
