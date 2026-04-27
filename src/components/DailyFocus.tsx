"use client";

import React, { useState, useEffect } from "react";
import { Target } from "lucide-react";

interface DailyFocusProps {
  focus: string;
  onChange: (focus: string) => void;
}

export function DailyFocus({ focus, onChange }: DailyFocusProps) {
  const [localFocus, setLocalFocus] = useState(focus);

  useEffect(() => {
    setTimeout(() => {
      setLocalFocus(focus || "");
    }, 0);
  }, [focus]);

  const handleBlur = () => {
    if (localFocus !== focus) {
      onChange(localFocus);
    }
  };

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col transition-colors">
      <div className="border-b-[1.5px] border-ink mb-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-serif-header text-2xl font-bold text-ink">Daily Focus</h3>
          <p className="font-mono-tag text-[10px] italic font-bold uppercase text-gray-500">Main Intention</p>
        </div>
        <Target className="text-ink" size={22} />
      </div>

      <textarea
        value={localFocus}
        onChange={(e) => setLocalFocus(e.target.value)}
        onBlur={handleBlur}
        placeholder="What is your primary focus for today?"
        className="w-full min-h-[80px] bg-transparent border-none outline-none font-s text-ink resize-none placeholder:text-gray-400 selection:bg-acid-green selection:text-ink"
      />
    </div>
  );
}
