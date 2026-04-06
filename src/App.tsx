import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/Preloader";
import { HERO_IMAGE_SRC } from "@/components/HeroSection";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = HERO_IMAGE_SRC;

    if (image.complete) {
      setHeroReady(true);
      return;
    }

    image.onload = () => setHeroReady(true);
    image.onerror = () => setHeroReady(true);
  }, []);

  const handleComplete = useCallback(() => {
    if (heroReady) {
      setLoading(false);
    }
  }, [heroReady]);

  useEffect(() => {
    if (heroReady && !loading) return;
    if (heroReady) {
      const timeout = window.setTimeout(() => setLoading(false), 150);
      return () => window.clearTimeout(timeout);
    }
  }, [heroReady, loading]);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <AnimatePresence>
        {loading && (
          <Preloader key="preloader" onComplete={handleComplete} />
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default App;
