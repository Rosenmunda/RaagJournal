"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_NEWS = [
  "New journal entry published: 'The Caffeine Paradox'",
  "UI redesign in progress...",
  "Weather update: Severe procrastination warning",
];

export function Ticker() {
  const [newsItems, setNewsItems] = useState(INITIAL_NEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempItems, setTempItems] = useState(INITIAL_NEWS);

  React.useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (!res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;
        const data = await res.json();
        if (data && data.lines && data.lines.length > 0) {
          setNewsItems(data.lines);
          setTempItems(data.lines);
        }
      } catch (err) {
        console.error("Failed to load ticker data:", err);
      }
    };
    fetchTicker();
  }, []);


  const handleOpenModal = () => {
    setTempItems(newsItems);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setNewsItems(tempItems);
    setIsModalOpen(false);

    try {
      await fetch('/api/ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: tempItems })
      });
    } catch (error) {
      console.error('Failed to save ticker lines:', error);
    }
  };

  return (
    <>
      <div className="w-full bg-ink text-paper overflow-hidden flex items-center h-10 border-b-[1.5px] border-ink relative transition-colors">
        <button
          onClick={handleOpenModal}
          className="absolute left-0 z-10 bg-neon-acid-green text-black font-bold h-full px-4 flex items-center font-mono-tag uppercase text-xs border-r-[1.5px] border-ink whitespace-nowrap hidden sm:flex hover:bg-neon-hot-pink hover:text-paper transition-colors cursor-pointer shadow-none"
        >
          Breaking News
        </button>
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex whitespace-nowrap items-center font-mono-tag uppercase text-sm"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20,
            }}
          >
            {/* We duplicate the items to create a seamless loop */}
            {[...newsItems, ...newsItems, ...newsItems, ...newsItems].map((item, idx) => (
              <span key={idx} className="mx-8 text-neon-acid-green dark:text-neon-hot-pink flex items-center transition-colors">
                <span className="text-paper mx-4">++</span>
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-paper border-[1.5px] rounded-[1.25rem] w-full max-w-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] z-10 flex flex-col overflow-hidden"
            >
              {/* Apple UI Window Controls */}
              <div className="w-full bg-surface/50 border-b-[1.5px] border-ink py-3 px-5 flex items-center gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-[1px] border-black/10 shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                  aria-label="Close"
                ></button>
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-[1px] border-black/10 shadow-sm"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-[1px] border-black/10 shadow-sm"></div>
              </div>

              <div className="p-8 flex flex-col gap-6">
                <h3 className="font-serif-header text-3xl font-black uppercase text-ink">Breaking News Desk</h3>
                <p className="font-mono-tag text-xs text-gray-500 uppercase">Transmit 3 lines to the global ticker</p>

                <div className="flex flex-col gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <label className="font-mono-tag text-[10px] font-bold text-ink uppercase">Line {i + 1}</label>
                      <input
                        value={tempItems[i] || ""}
                        onChange={(e) => {
                          const newItems = [...tempItems];
                          newItems[i] = e.target.value;
                          setTempItems(newItems);
                        }}
                        className="w-full p-3 border-[1.5px] rounded-[1.25rem] border-ink bg-transparent text-ink font-serif-body focus:outline-none focus:ring-2 focus:ring-neon-hot-pink transition-all selection:bg-neon-acid-green selection:text-paper"
                        placeholder="Enter dispatch..."
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 mt-2 border-t-[1.5px] border-ink border-dashed pt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border-[1.5px] rounded-[1.25rem] border-ink bg-transparent text-ink font-mono-tag text-xs uppercase font-bold hover:bg-ink hover:text-paper transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 border-[1.5px] rounded-[1.25rem] border-ink bg-neon-electric-blue text-black font-mono-tag text-xs uppercase font-bold hover:bg-neon-hot-pink hover:text-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                  >
                    Broadcast
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
