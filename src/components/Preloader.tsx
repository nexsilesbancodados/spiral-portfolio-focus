import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import preloaderBg from "@/assets/preloader-bg.png";

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const interval = 20;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * step * 0.4;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
      setProgress(Math.min(current, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <motion.img
        src={preloaderBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <span
            className="text-3xl font-bold tracking-tight text-primary glow-text sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            FOCUSS
          </span>
          <span
            className="text-3xl font-light tracking-tight text-white/80 sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DEV
          </span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "12rem" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-[2px] overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
