"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Heart } from "lucide-react";

interface GratitudeLogProps {
  gratitudes: string[];
  onChange: (gratitudes: string[]) => void;
}

export function GratitudeLog({ gratitudes, onChange }: GratitudeLogProps) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...gratitudes, newItem]);
    setNewItem("");
  };

  const deleteItem = (index: number) => {
    const newList = gratitudes.filter((_, i) => i !== index);
    onChange(newList);
  };

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col h-full transition-colors">
      <div className="border-b-[1.5px] border-ink mb-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-serif-header text-2xl font-black text-ink">Gratitude Log</h3>
          <p className="font-mono-tag text-[10px] italic font-bold uppercase text-gray-500">Highlights & Wins</p>
        </div>
        <Heart className="text-hot-pink" size={26} strokeWidth={2.2} />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder="I am grateful for..."
          className="flex-1 border-[1.5px] rounded-[1.25rem] border-ink px-3 py-1 font-mono-tag text-xs outline-none focus:bg-electric-blue/10 bg-transparent text-ink placeholder:text-gray-400"
        />
        <button
          onClick={addItem}
          className="bg-ink text-paper p-2 border-[1.5px] rounded-[1.25rem] border-ink hover:bg-hot-pink hover:text-ink transition-colors active:translate-y-0.5 active:translate-x-0.5"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        <AnimatePresence initial={false}>
          {(!gratitudes || gratitudes.length === 0) ? (
            <div className="text-center py-4 border-[1.5px] border-dashed border-ink/20 rounded-[1.25rem]">
              <p className="font-mono-tag text-[10px] text-gray-400 uppercase">Log your daily wins</p>
            </div>
          ) : (
            gratitudes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="flex items-center gap-2 border-b border-ink/10 pb-2 group"
              >
                <div className="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0" />
                <span className="flex-1 font-serif-body text-sm text-ink leading-tight">
                  {item}
                </span>
                <button
                  onClick={() => deleteItem(index)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-hot-pink transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
