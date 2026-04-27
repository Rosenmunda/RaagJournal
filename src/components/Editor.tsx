"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface EditorProps {
  headline: string;
  content: string;
  moodColor: string;
  onChange: (data: { headline?: string; content?: string; moodColor?: string }) => void;
  onSave: () => void;
}

export function Editor({ headline, content, moodColor, onChange, onSave }: EditorProps) {
  const [localHeadline, setLocalHeadline] = useState(headline);
  const [localContent, setLocalContent] = useState(content);

  const handleHeadlineChange = (val: string) => {
    setLocalHeadline(val);
    onChange({ headline: val });
  };

  const handleContentChange = (val: string) => {
    setLocalContent(val);
    onChange({ content: val });
  };

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.play().catch(() => { });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      playSound('/return.wav');
    } else if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      playSound('/single.wav');
    }
  };

  return (
    <motion.div
      initial={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.15)" }}
      className="bg-paper border-[1.5px] rounded-[1.25rem] p-8 min-h-[500px] flex flex-col col-span-1 md:col-span-3 lg:col-span-2 relative"
    >
      <div className="flex justify-between items-center mb-6 border-b-[1.5px] border-ink pb-4">
        <div className="flex flex-col">
          <h3 className="font-mono-tag uppercase font-semibold text-xs text-gray-500">Dispatch Editor</h3>
          <div className="flex gap-2 mt-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-ink" />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            playSound('/double.wav');
            onSave();
          }}
          className="bg-electric-blue hover:bg-hot-pink hover:text-paper rounded-[1.25rem] transition-all border-[1.5px] border-ink font-mono-tag text-xs font-bold uppercase px-6 py-2 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none text-black"
        >
          File Report
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Headline Section */}
        <div className="relative">
          <input
            type="text"
            value={localHeadline}
            onChange={(e) => handleHeadlineChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="WRITE TODAY'S HEADLINE"
            className="w-full bg-transparent border-none outline-none font-sillage text-5xl md:text-6xl font-black uppercase placeholder:text-gray-400 dark:placeholder:text-gray-600 selection:bg-acid-green selection:text-paper text-ink"
          />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-ink/10" />
        </div>

        {/* Content Section */}
        <div className="flex-1 relative font-serif-body text-lg leading-relaxed outline-none">
          <textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Begin your daily chronicle here..."
            className="w-full h-full min-h-[300px] bg-transparent resize-none outline-none selection:bg-hot-pink selection:text-paper placeholder:text-gray-400 text-ink"
            style={{ caretColor: moodColor || "var(--color-hot-pink)" }}
          />

          {/* Decorative typewriter paper holes */}
          <div className="absolute left-[-2.5rem] top-0 bottom-0 flex flex-col justify-between py-4 hidden lg:flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-[1.5px] border-ink bg-paper shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]" />
            ))}
          </div>
        </div>
      </div>

      {/* Mood Accent Selector */}
      <div className="absolute top-0 right-0 p-5 flex gap-2">
        {['#BAFF29', '#FF0055', '#00F0FF', '#FFB800', '#D9D9D9'].map((color) => (
          <button
            key={color}
            onClick={() => {
              playSound('/double.wav');
              onChange({ moodColor: color });
            }}
            className={`w-6 h-6 rounded-full border-2 border-ink transition-all ${moodColor === color ? 'scale-125 shadow-[2px_2px_0px_0px_var(--ink)]' : 'hover:scale-110 opacity-50 hover:opacity-100'}`}
            style={{ backgroundColor: color }}
            title={`Select mood color: ${color}`}
          />
        ))}
      </div>
    </motion.div>
  );

}
