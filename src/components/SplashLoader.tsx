"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Calibrating Printing Press...");

  useEffect(() => {
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

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-paper flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-chomsky text-6xl md:text-7xl mb-8 text-ink"
              >
                The Daily Journal
              </motion.h1>
              
              <div className="relative h-12 border-2 border-ink bg-paper overflow-hidden mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <motion.div 
                  className="absolute inset-0 bg-hot-pink"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-mono-tag text-sm font-bold mix-blend-difference text-paper">
                  CIRCULATION PROGRESS: {progress}%
                </div>
              </div>

              <motion.p 
                key={status}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono-tag text-xs uppercase tracking-widest text-gray-500"
              >
                {status}
              </motion.p>

              <div className="mt-12 flex justify-center gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [10, 40, 10],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1, 
                      delay: i * 0.2 
                    }}
                    className="w-1 bg-ink rounded-full"
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-10 left-10 right-10 flex justify-between border-t border-ink pt-4 opacity-30">
              <span className="font-mono-tag text-[10px] uppercase font-bold">Vol. LXIV / No. 2026</span>
              <span className="font-mono-tag text-[10px] uppercase font-bold text-hot-pink">Neural Network Connection: Stable</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && children}
    </>
  );
}
