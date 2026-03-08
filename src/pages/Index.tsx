import React from 'react';
import { FullScreenScrollFX, FullScreenFXAPI } from '@/components/ui/full-screen-scroll-fx';

const sections = [
  {
    id: 'focuss-dev',
    leftLabel: 'Inovação',
    title: 'FOCUSS DEV',
    rightLabel: 'Tecnologia',
    background: '/images/slide-01.jpg',
  },
  {
    id: 'web-design',
    leftLabel: 'Criação',
    title: 'Web Design',
    rightLabel: 'Visual',
    background: '/images/slide-02.jpg',
  },
  {
    id: 'desenvolvimento',
    leftLabel: 'Código',
    title: 'Desenvolvimento',
    rightLabel: 'Performance',
    background: '/images/slide-03.jpg',
  },
  {
    id: 'design-interface',
    leftLabel: 'UI/UX',
    title: 'Design de Interface',
    rightLabel: 'Experiência',
    background: '/images/slide-04.jpg',
  },
  {
    id: 'inovacao-ia',
    leftLabel: 'Futuro',
    title: 'Inovação e IA',
    rightLabel: 'Inteligência',
    background: '/images/slide-05.jpg',
  },
  {
    id: 'mobile-web',
    leftLabel: 'Mobile',
    title: 'Mobile e Web',
    rightLabel: 'Multiplataforma',
    background: '/images/slide-06.jpg',
  },
];

export default function Index() {
  const apiRef = React.useRef<FullScreenFXAPI>(null);

  return (
    <FullScreenScrollFX
      sections={sections}
      apiRef={apiRef}
      header={
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
          FOCUSS DEV — Desenvolvimento & Design Digital
        </div>
      }
      footer={
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.55rem, 0.8vw, 0.65rem)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.4 }}>
          © {new Date().getFullYear()} FOCUSS DEV
        </div>
      }
      showProgress
      bgTransition="fade"
      durations={{ change: 0.7, snap: 800 }}
      colors={{
        text: 'rgba(245,245,245,0.92)',
        overlay: 'rgba(0,0,0,0.45)',
        pageBg: 'hsl(0, 0%, 2%)',
        stageBg: '#000000',
      }}
    />
  );
}
