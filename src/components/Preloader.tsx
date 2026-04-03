import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoMedallion from "@/assets/logo-medallion.png";

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2200;
    const interval = 20;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * step * 0.5;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 400);
      }
      setProgress(Math.min(current, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <motion.img
            src={logoMedallion}
            alt=""
            className="h-16 w-16 drop-shadow-lg"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
          />

          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold tracking-tight text-primary glow-text"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              FOCUSS
            </span>
            <span
              className="text-2xl font-light tracking-tight text-foreground/80"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              DEV
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-[2px] w-48 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-foreground/30">
            {Math.round(progress)}%
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
