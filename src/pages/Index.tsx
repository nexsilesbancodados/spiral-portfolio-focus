import { lazy, Suspense, useState, useCallback } from 'react'
import { LuminaSlider } from '@/components/ui/lumina-interactive-list'
import { HamburgerMenu } from '@/components/HamburgerMenu'

const FocussChat = lazy(() => import('@/components/FocussChat').then(m => ({ default: m.FocussChat })))

const SectionsDetail = lazy(() => 
  import('@/components/SectionsDetail').then(m => ({ default: m.SectionsDetail }))
)

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleMenuNavigate = (index: number) => {
    window.dispatchEvent(new CustomEvent('explore-slide', { detail: { slideIndex: index } }));
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

      {/* FOCUSS AI Chat floating button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        style={{
          background: showChat
            ? 'linear-gradient(135deg, hsl(0 0% 30%), hsl(0 0% 20%))'
            : 'linear-gradient(135deg, hsl(335 75% 55%), hsl(25 95% 55%))',
          boxShadow: showChat
            ? '0 4px 20px hsl(0 0% 0% / 0.3)'
            : '0 4px 30px hsl(335 75% 55% / 0.4)',
        }}
      >
        {showChat ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <span className="text-white text-lg font-bold">F</span>
        )}
      </button>

      {/* FOCUSS AI Chat panel */}
      {showChat && (
        <div
          className="fixed bottom-24 right-6 z-[55] w-[90vw] max-w-[420px] h-[70vh] max-h-[600px] rounded-2xl border border-border/30 overflow-hidden flex flex-col"
          style={{
            background: 'hsl(var(--background) / 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px hsl(0 0% 0% / 0.5), 0 0 40px hsl(335 75% 55% / 0.1)',
            animation: 'chatSlideIn 0.3s ease-out',
          }}
        >
          <style>{`
            @keyframes chatSlideIn {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          <div className="p-4 flex-1 overflow-hidden">
            <FocussChat />
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
