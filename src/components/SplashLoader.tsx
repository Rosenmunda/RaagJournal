"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Calibrating Printing Press...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 45); // Roughly 100 steps in 4.5s to finish before 5s

    const statuses = [
      "Calibrating Printing Press...",
      "Inking the Rollers...",
      "Gathering Global Dispatches...",
      "Formatting Front Page...",
      "Final Review by Editor-in-Chief...",
      "Ready for Circulation",
    ];

    const statusInterval = setInterval(() => {
      setStatus((prev) => {
        const currentIndex = statuses.indexOf(prev);
        if (currentIndex < statuses.length - 1) {
          return statuses[currentIndex + 1];
        }
        return prev;
      });
    }, 800);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Video - Cinematic Intro feel */}
            <div className="absolute inset-0 w-full h-full bg-black">
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
            </div>

            {/* Dynamic Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />

            {/* Loading Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-12 w-full"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="font-chomsky text-8xl sm:text-9xl text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    RaagJournal
                  </h1>
                  <div className="h-[1px] w-32 bg-white/40 mb-2" />
                  <h2 className="font-serif-header text-2xl sm:text-3xl font-black uppercase tracking-[0.6em] text-white/90">
                    Digital Archive
                  </h2>
                </div>

                {/* New Premium Loading Bar */}
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-end font-mono-tag font-bold text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70">
                    <span className="animate-pulse">Initializing Dispatches...</span>
                    <span className="font-extrabold">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative h-3 w-full bg-white/10 overflow-hidden border border-white/5 rounded-full">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-hot-pink shadow-[0_0_25px_#FF0055]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Terminal Text Simulation */}
              <div className="mt-20 font-mono-tag font-bold text-xs uppercase tracking-[0.3em] text-acid-green/70 flex flex-col items-center gap-3 text-center">
                <span>Signal: Encrypted / Secure</span>
                <span className="opacity-90">Source: Neural Network Uplink v4.2</span>
              </div>
            </div>

            {/* Apple UI Window Controls (Corner Decoration) */}
            <div className="absolute top-8 left-8 flex gap-2 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-lg animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && children}
    </>
  );
}
