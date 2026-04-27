"use client";

import { useEffect } from "react";

export function GlobalClickSound() {
  useEffect(() => {
    let lastPlayed = 0;
    const COOLDOWN = 50; // ms

    const playClick = () => {
      const now = Date.now();
      if (now - lastPlayed < COOLDOWN) return;
      lastPlayed = now;

      const audio = new Audio("/single.wav");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    };

    const handleEvent = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for common interactive elements including contenteditable editors
      const isInteractive = target.closest(
        "button, input, textarea, a, select, [role='button'], [contenteditable='true']"
      );

      if (isInteractive) {
        playClick();
      }
    };

    // Use mousedown for immediate feedback on clicks
    window.addEventListener("mousedown", handleEvent);
    // Use focusin to catch "click to type" and keyboard navigation
    window.addEventListener("focusin", handleEvent);

    return () => {
      window.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("focusin", handleEvent);
    };
  }, []);

  return null;
}
