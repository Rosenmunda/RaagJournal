"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 border-[1.5px] rounded-full border-ink flex items-center justify-center">
        <div className="w-4 h-4 bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: 5 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 border-[1.5px] rounded-full border-ink flex items-center justify-center hover:bg-acid-green transition-colors bg-paper text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 hover:text-black" />
      ) : (
        <Moon className="w-5 h-5 hover:text-black" />
      )}
    </motion.button>
  );
}
