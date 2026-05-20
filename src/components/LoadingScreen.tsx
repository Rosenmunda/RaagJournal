"use client";

import React from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
      {/* Background Video - Cinematic Intro feel */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale contrast-150"
      >
        <source src="/ascii-art.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dynamic Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 w-full"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-chomsky text-7xl sm:text-8xl text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Raag
            </h1>
            <div className="h-[2px] w-24 bg-neon-hot-pink shadow-[0_0_10px_#FF0055] mb-2" />
            <h2 className="font-serif-header text-xl font-black uppercase tracking-[0.5em] text-white/90">
              Digital Archive
            </h2>
          </div>
        </motion.div>

        {/* Terminal Text Simulation */}
        <div className="mt-20 font-mono-tag text-[10px] uppercase tracking-[0.3em] text-neon-acid-green/80 flex flex-col items-center gap-2 text-center">
          <span className="animate-pulse">&gt;&gt; Establishing Secure Uplink...</span>
          <span className="opacity-60">&gt;&gt; Source: Raag Neural Feed</span>
        </div>
      </div>

      {/* Apple UI Window Controls (Corner Decoration) */}
      <div className="absolute top-8 left-8 flex gap-2 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-lg animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-lg" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-lg" />
      </div>
    </div>
  );
}
