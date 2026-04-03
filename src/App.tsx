import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/Preloader";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" onComplete={handleComplete} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BrowserRouter>
              <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default App;
