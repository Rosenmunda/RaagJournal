"use client";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ClockTools } from "./ClockTools";

const RollingDigit = ({ value }: { value: string }) => (
  <div className="relative h-4 overflow-hidden w-[1ch] inline-block align-middle">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -15, opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

export function Masthead() {
  const { user, isLoaded } = useUser();

  const rawName = isLoaded && (user?.firstName || user?.username)
    ? (user.firstName || user.username || "")
    : "";

  const normalizedName = rawName
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()
    : "";

  const displayName = normalizedName
    ? (normalizedName.endsWith("s") ? `${normalizedName}'` : `${normalizedName}'s`)
    : "Your";

  const editorName = "Raag'";

  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPart = (val: number) => val.toString().padStart(2, "0");
  const hh = formatPart(time.getHours());
  const mm = formatPart(time.getMinutes());
  const ss = formatPart(time.getSeconds());
  const nn = Math.floor(time.getMilliseconds() / 10).toString().padStart(2, "0");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [isClockOpen, setIsClockOpen] = React.useState(false);

  return (
    <header className="border-b-[1.5px] border-ink pb-4 mb-4 mt-8 flex flex-col items-center relative">
      <div className="absolute right-0 top-0 flex items-center gap-3">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 border-2 border-ink",
            }
          }}
        />
      </div>

      <div className="text-center mt-8 md:mt-2">
        <h1 className="w-full font-chomsky text-7xl md:text-9xl font-extralight tracking-tighter text-ink">
          The {displayName} Daily Journal
        </h1>
        <div className="flex justify-between items-center w-full border-t-[1.5px] border-b-[1.5px] border-ink py-1 mt-4">
          <div className="flex gap-4 font-mono-tag text-xs uppercase items-center">
            <span>{currentDate}</span>
            <span className="opacity-30">|</span>
            <div className="flex items-center gap-1">
              <span>Editor & Creator: <span className="font-extrabold text-lg font-sillage text-ink">{editorName}</span></span>
              <span className="mx-2 opacity-30">|</span>
              <button
                onClick={() => setIsClockOpen(true)}
                className="bg-ink text-paper px-2 py-0.5 rounded-sm flex items-center gap-[1px] font-bold tabular-nums hover:bg-hot-pink hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:shadow-none"
              >
                {[...hh].map((d, i) => <RollingDigit key={`h-${i}-${d}`} value={d} />)}
                <span className="animate-pulse">:</span>
                {[...mm].map((d, i) => <RollingDigit key={`m-${i}-${d}`} value={d} />)}
                <span className="animate-pulse">:</span>
                {[...ss].map((d, i) => <RollingDigit key={`s-${i}-${d}`} value={d} />)}
              </button>
            </div>
          </div>
          <span className="font-mono-tag text-xs uppercase italic mx-4 line-clamp-1 flex-1 text-center font-bold hidden sm:block">
            &quot;Chronicles of the Everyday Mind&quot;
          </span>
          <span className="font-mono-tag text-xs uppercase">Est. 2026</span>
        </div>
      </div>

      <ClockTools isOpen={isClockOpen} onClose={() => setIsClockOpen(false)} />
    </header>
  );
}
