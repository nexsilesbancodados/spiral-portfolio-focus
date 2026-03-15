import React from 'react';
import { motion } from 'framer-motion';

type MediaButtonProps = {
  label: string;
  mediaUrl: string; // .mp4, .webm, or .gif
  className?: string;
  onClick?: () => void;
};

export const MediaButton: React.FC<MediaButtonProps> = ({ label, mediaUrl, className = '', onClick }) => {
  const isVideo = /\.(mp4|webm)$/i.test(mediaUrl);

  return (
    <motion.button
      className={`relative overflow-hidden rounded-2xl px-6 py-3 text-foreground font-semibold text-lg bg-background/80 group shadow-lg hover:cursor-pointer border border-foreground/10 backdrop-blur-sm ${className}`}
      whileHover="hover"
      initial="rest"
      animate="rest"
      onClick={onClick}
    >
      {isVideo ? (
        <motion.video
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          src={mediaUrl}
          muted
          loop
          playsInline
          autoPlay
        />
      ) : (
        <motion.img
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          src={mediaUrl}
          alt="Background"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Button Text */}
      <span className="relative z-20" style={{ textShadow: '0 1.2px 1.2px rgba(0,0,0,0.8)' }}>{label}</span>
    </motion.button>
  );
};
