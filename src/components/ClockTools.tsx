"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer as TimerIcon, AlarmClock, Globe, Search, X, Play, Pause, RotateCcw, Trash2 } from "lucide-react";

interface ClockToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "timer" | "alarm" | "world";

const CITIES = [
  { city: "London", zone: "Europe/London" },
  { city: "New York", zone: "America/New_York" },
  { city: "Tokyo", zone: "Asia/Tokyo" },
  { city: "Paris", zone: "Europe/Paris" },
  { city: "Dubai", zone: "Asia/Dubai" },
  { city: "Sydney", zone: "Australia/Sydney" },
  { city: "Mumbai", zone: "Asia/Kolkata" },
  { city: "Singapore", zone: "Asia/Singapore" },
  { city: "Los Angeles", zone: "America/Los_Angeles" },
  { city: "Berlin", zone: "Europe/Berlin" },
];

export function ClockTools({ isOpen, onClose }: ClockToolsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Alarm State
  const [alarmTime, setAlarmTime] = useState("08:00");
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // World Clock State
  const [search, setSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState<typeof CITIES>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            alert("Timer Finished!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  // Alarm Logic
  useEffect(() => {
    let alarmInterval: NodeJS.Timeout;
    if (isAlarmActive) {
      alarmInterval = setInterval(() => {
        const now = new Date();
        const currentStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentStr === alarmTime) {
          setIsAlarmActive(false);
          alert(`ALARM: ${alarmTime}`);
        }
      }, 1000);
    }
    return () => clearInterval(alarmInterval);
  }, [isAlarmActive, alarmTime]);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getTimeInZone = (zone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  };

  const filteredCities = CITIES.filter(c => 
    c.city.toLowerCase().includes(search.toLowerCase()) && 
    !selectedCities.find(sc => sc.city === c.city)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="bg-paper border-[1.5px] border-ink rounded-[1.5rem] w-full max-w-md shadow-neobrutal z-10 flex flex-col overflow-hidden relative"
          >
            {/* Apple Window Controls */}
            <div className="p-4 flex items-center gap-2 border-b-[1.5px] border-ink bg-paper/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border-[1px] border-ink/20 hover:brightness-90 transition-all shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[1px] border-ink/20 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border-[1px] border-ink/20 shadow-sm" />
              </div>
              <div className="flex-1 text-center pr-10">
                <span className="font-mono-tag text-[10px] font-bold uppercase text-ink/40 tracking-widest">Chronos.app</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b-[1.5px] border-ink bg-paper">
              {(["timer", "alarm", "world"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-mono-tag text-[11px] font-bold uppercase border-r-[1.5px] last:border-r-0 border-ink transition-all
                    ${activeTab === tab ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ink/5"}
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tab === "timer" && <TimerIcon size={14} />}
                    {tab === "alarm" && <AlarmClock size={14} />}
                    {tab === "world" && <Globe size={14} />}
                    {tab}
                  </div>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8 bg-paper flex-1 min-h-[350px]">
              
              {/* Timer View */}
              {activeTab === "timer" && (
                <div className="flex flex-col items-center gap-10">
                  <div className="text-6xl font-mono-tag font-bold tabular-nums text-ink bg-paper p-8 border-[1.5px] border-ink rounded-2xl shadow-neobrutal-sm w-full text-center tracking-tighter">
                    {formatTimer(timerSeconds)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[1, 5, 10, 15, 30, 60].map(m => (
                      <button
                        key={m}
                        onClick={() => setTimerSeconds(prev => prev + m * 60)}
                        className="py-3 border-[1.5px] border-ink bg-paper text-ink font-bold text-[11px] uppercase rounded-xl hover:bg-ink hover:text-paper transition-all shadow-sm active:shadow-none active:translate-y-0.5"
                      >
                        +{m}m
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="flex-1 py-5 border-[1.5px] border-ink rounded-2xl font-bold uppercase transition-all flex items-center justify-center gap-3 text-lg bg-ink text-paper hover:bg-paper hover:text-ink shadow-neobrutal-sm active:translate-y-0.5 active:shadow-none"
                    >
                      {isTimerRunning ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                      {isTimerRunning ? "Stop" : "Start"}
                    </button>
                    <button
                      onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                      className="p-5 border-[1.5px] border-ink bg-paper text-ink hover:bg-ink hover:text-paper rounded-2xl transition-all shadow-neobrutal-sm active:translate-y-0.5 active:shadow-none"
                    >
                      <RotateCcw size={22} />
                    </button>
                  </div>
                </div>
              )}

              {/* Alarm View */}
              {activeTab === "alarm" && (
                <div className="flex flex-col items-center gap-10">
                  <div className="w-full flex flex-col gap-3">
                    <label className="font-mono-tag text-[10px] font-bold uppercase text-ink/60 text-center">Set Alarm</label>
                    <input
                      type="time"
                      value={alarmTime}
                      onChange={(e) => setAlarmTime(e.target.value)}
                      className="w-full p-6 text-5xl border-[1.5px] border-ink rounded-2xl bg-paper text-ink font-mono-tag font-bold text-center focus:outline-none focus:ring-2 focus:ring-ink/20 tracking-tighter"
                    />
                  </div>
                  <button
                    onClick={() => setIsAlarmActive(!isAlarmActive)}
                    className={`w-full py-6 border-[1.5px] border-ink rounded-2xl font-bold uppercase transition-all flex items-center justify-center gap-4 text-xl shadow-neobrutal-sm active:translate-y-0.5 active:shadow-none
                      ${isAlarmActive ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ink hover:text-paper"}
                    `}
                  >
                    <AlarmClock size={24} className={isAlarmActive ? "animate-bounce" : ""} />
                    {isAlarmActive ? "Active" : "Set Alarm"}
                  </button>
                  {isAlarmActive && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-ink rounded-full animate-ping" />
                      <p className="font-mono-tag text-[10px] font-bold text-ink uppercase tracking-widest">
                        Alarm at {alarmTime}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* World Clock View */}
              {activeTab === "world" && (
                <div className="flex flex-col gap-6 h-full">
                  <div className="relative">
                    <div className="flex items-center gap-3 p-4 border-[1.5px] border-ink bg-paper rounded-2xl shadow-sm">
                      <Search size={18} className="text-ink" />
                      <input
                        placeholder="Search City..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setShowCityDropdown(true);
                        }}
                        onFocus={() => setShowCityDropdown(true)}
                        className="bg-transparent border-none outline-none font-mono-tag font-bold uppercase text-xs w-full text-ink"
                      />
                    </div>
                    
                    <AnimatePresence>
                      {showCityDropdown && search.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-paper border-[1.5px] border-ink z-20 max-h-48 overflow-y-auto shadow-2xl rounded-2xl"
                        >
                          {filteredCities.length > 0 ? (
                            filteredCities.map(c => (
                              <button
                                key={c.city}
                                onClick={() => {
                                  setSelectedCities([...selectedCities, c]);
                                  setSearch("");
                                  setShowCityDropdown(false);
                                }}
                                className="w-full text-left p-4 font-mono-tag text-[11px] font-bold uppercase hover:bg-ink hover:text-paper border-b last:border-0 border-ink transition-colors"
                              >
                                {c.city}
                              </button>
                            ))
                          ) : (
                            <div className="p-4 font-mono-tag text-[10px] text-ink/40 uppercase text-center italic">No results</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[250px] pr-2">
                    {selectedCities.map(c => (
                      <div key={c.city} className="flex items-center justify-between p-4 border-[1.5px] border-ink bg-paper rounded-2xl shadow-neobrutal-sm">
                        <div className="flex flex-col">
                          <span className="font-mono-tag text-[10px] font-bold uppercase text-ink/50">{c.city}</span>
                          <span className="font-mono-tag text-2xl font-bold tabular-nums text-ink">{getTimeInZone(c.zone)}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedCities(selectedCities.filter(sc => sc.city !== c.city))}
                          className="p-2 text-ink/30 hover:text-ink transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {selectedCities.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-12 border-[1.5px] border-dashed border-ink/20 rounded-2xl opacity-40">
                        <Globe size={48} className="mb-4" />
                        <span className="font-mono-tag text-[11px] font-bold uppercase">Add a city</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t-[1.5px] border-ink flex justify-end bg-paper">
              <button
                onClick={onClose}
                className="px-8 py-3 border-[1.5px] border-ink bg-ink text-paper font-mono-tag text-[11px] font-bold uppercase rounded-xl hover:bg-paper hover:text-ink transition-all shadow-neobrutal-sm active:translate-y-0.5 active:shadow-none"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
