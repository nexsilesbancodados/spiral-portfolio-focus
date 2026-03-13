import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Intro = lazy(() => import("./pages/Intro"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/home" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
