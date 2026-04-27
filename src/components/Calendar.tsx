"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight,
  Calculator, TrendingUp, TrendingDown, Plus, Trash2
} from "lucide-react";


interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  entryDates: string[];
}

// ─── Mini Calculator ──────────────────────────────────────────────────────────
function MiniCalculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState("");
  const [op, setOp] = useState("");
  const [fresh, setFresh] = useState(true);

  const press = (val: string) => {
    if (val === "C") { setDisplay("0"); setPrev(""); setOp(""); setFresh(true); return; }
    if (val === "⌫") { setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (["+", "−", "×", "÷"].includes(val)) {
      setPrev(display); setOp(val); setFresh(true); return;
    }
    if (val === "=") {
      const a = parseFloat(prev), b = parseFloat(display);
      let res = 0;
      if (op === "+") res = a + b;
      else if (op === "−") res = a - b;
      else if (op === "×") res = a * b;
      else if (op === "÷") res = b !== 0 ? a / b : 0;
      setDisplay(String(parseFloat(res.toFixed(8))));
      setPrev(""); setOp(""); setFresh(true); return;
    }
    if (val === "." && display.includes(".") && !fresh) return;
    setDisplay(d => fresh ? (val === "." ? "0." : val) : (d === "0" && val !== "." ? val : d + val));
    setFresh(false);
  };

  const buttons = [
    ["C", "⌫", "÷", "×"],
    ["7", "8", "9", "−"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
    ["0", ".", "", ""],
  ];

  return (
    <div className="bg-paper border-[1.5px] border-ink rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] transition-colors">
      {/* Display */}
      <div className="bg-ink dark:bg-black px-3 py-2 flex flex-col items-end transition-colors">
        <span className="font-mono-tag text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest h-3">
          {op ? `${prev} ${op}` : ""}
        </span>
        <span className="font-mono-tag text-xl font-black text-acid-green tracking-widest truncate max-w-full">
          {display.length > 10 ? parseFloat(display).toExponential(3) : display}
        </span>
      </div>
      {/* Buttons */}
      <div className="grid grid-cols-4 gap-[1px] bg-ink/20 dark:bg-ink/5 border-t border-ink">
        {buttons.flat().map((btn, i) => {
          if (!btn) return <div key={i} className="bg-paper" />;
          const isOp = ["+", "−", "×", "÷"].includes(btn);
          const isEq = btn === "=";
          const isClear = btn === "C" || btn === "⌫";
          return (
            <button
              key={i}
              onClick={() => press(btn)}
              className={`
                h-9 font-mono-tag text-sm font-black transition-all active:scale-95
                border-r border-b border-ink/10
                ${isEq ? "bg-hot-pink text-paper hover:bg-ink hover:text-paper" :
                  isOp ? "bg-acid-green text-black dark:text-black hover:bg-acid-green/80" :
                    isClear ? "bg-gray-100 dark:bg-surface-muted text-ink hover:bg-red-500 hover:text-paper" :
                      "bg-paper text-ink hover:bg-acid-green/30"}
              `}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Daily Ledger ─────────────────────────────────────────────────────────────
interface LedgerEntry { id: string; label: string; amount: number; type: "gain" | "spend"; }

function DailyLedger() {
  const todayKey = `ledger_${format(new Date(), "yyyy-MM-dd")}`;
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"gain" | "spend">("spend");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) setEntries(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [todayKey]);

  const save = useCallback((updated: LedgerEntry[]) => {
    setEntries(updated);
    localStorage.setItem(todayKey, JSON.stringify(updated));
  }, [todayKey]);

  const add = () => {
    const amt = parseFloat(amount);
    if (!label.trim() || isNaN(amt) || amt <= 0) return;
    save([...entries, { id: Date.now().toString(), label: label.trim(), amount: amt, type }]);
    setLabel(""); setAmount("");
  };

  const remove = (id: string) => save(entries.filter(e => e.id !== id));

  const totalGain = entries.filter(e => e.type === "gain").reduce((s, e) => s + e.amount, 0);
  const totalSpend = entries.filter(e => e.type === "spend").reduce((s, e) => s + e.amount, 0);
  const net = totalGain - totalSpend;

  return (
    <div className="space-y-2">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="bg-acid-green/20 border border-ink/10 rounded-lg py-1.5 px-1">
          <p className="font-mono-tag text-[8px] uppercase text-gray-500">In</p>
          <p className="font-mono-tag text-xs font-black text-green-700">+{totalGain.toFixed(0)}</p>
        </div>
        <div className="bg-hot-pink/10 border border-ink/10 rounded-lg py-1.5 px-1">
          <p className="font-mono-tag text-[8px] uppercase text-gray-500">Out</p>
          <p className="font-mono-tag text-xs font-black text-red-600">-{totalSpend.toFixed(0)}</p>
        </div>
        <div className={`border rounded-lg py-1.5 px-1 ${net >= 0 ? "bg-acid-green/30 border-acid-green" : "bg-hot-pink/20 border-hot-pink"}`}>
          <p className="font-mono-tag text-[8px] uppercase text-gray-500">Net</p>
          <p className={`font-mono-tag text-xs font-black ${net >= 0 ? "text-green-800" : "text-red-700"}`}>
            {net >= 0 ? "+" : ""}{net.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-1">
        <div className="flex rounded-lg border border-ink overflow-hidden">
          <button
            onClick={() => setType("gain")}
            className={`px-2 flex items-center transition-colors ${type === "gain" ? "bg-acid-green text-ink" : "bg-paper text-gray-400"}`}
          >
            <TrendingUp size={12} />
          </button>
          <button
            onClick={() => setType("spend")}
            className={`px-2 flex items-center transition-colors ${type === "spend" ? "bg-hot-pink text-paper" : "bg-paper text-gray-400"}`}
          >
            <TrendingDown size={12} />
          </button>
        </div>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Item..."
          className="flex-1 min-w-0 border border-ink/30 rounded-lg px-2 py-1 font-mono-tag text-[9px] outline-none bg-transparent text-ink placeholder:text-gray-300 focus:border-ink"
        />
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onKeyPress={e => e.key === "Enter" && add()}
          placeholder="₹"
          type="number"
          min="0"
          className="w-14 border border-ink/30 rounded-lg px-2 py-1 font-mono-tag text-[9px] outline-none bg-transparent text-ink placeholder:text-gray-300 focus:border-ink"
        />
        <button onClick={add} className="p-1.5 bg-ink text-paper rounded-lg hover:bg-hot-pink transition-colors">
          <Plus size={12} />
        </button>
      </div>

      {/* Entry list */}
      {entries.length > 0 && (
        <div className="max-h-[90px] overflow-y-auto space-y-1 pr-0.5">
          {entries.map(e => (
            <div key={e.id} className="flex items-center justify-between gap-1 group">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.type === "gain" ? "bg-green-500" : "bg-hot-pink"}`} />
              <span className="font-serif-body text-[9px] text-ink flex-1 truncate">{e.label}</span>
              <span className={`font-mono-tag text-[9px] font-black ${e.type === "gain" ? "text-green-700" : "text-red-600"}`}>
                {e.type === "gain" ? "+" : "-"}₹{e.amount}
              </span>
              <button onClick={() => remove(e.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-hot-pink transition-opacity ml-1">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
export function Calendar({
  selectedDate,
  onDateSelect,
  entryDates,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"calc" | "ledger">("calc");

  useEffect(() => {
    setTimeout(() => setCurrentMonth(new Date()), 0);
  }, []);

  if (!currentMonth) return <div className="h-[300px] bg-paper border-[1.5px] rounded-[20px] border-ink animate-pulse" />;

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-3 border-b border-ink pb-2">
      <h3 className="font-news-cycle text-2xl font-bold text-ink">
        {format(currentMonth, "MMMM yyyy")}
      </h3>
      <div className="flex gap-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-acid-green border-[1.5px] rounded-full border-ink transition-colors text-ink hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-acid-green border-[1.5px] rounded-full border-ink transition-colors text-ink hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return (
      <div className="grid grid-cols-7 mb-1">
        {days.map((d, i) => (
          <div key={i} className="text-center font-mono-tag text-[10px] font-black text-gray-400 uppercase">{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const todayStr = format(new Date(), "yyyy-MM-dd");

    const rows = [];
    let days: React.ReactNode[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isoDate = format(day, "yyyy-MM-dd");
        const hasEntry = entryDates.includes(isoDate);
        const isToday = isoDate === todayStr;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-10 border border-ink/10 flex flex-col items-center justify-center cursor-pointer transition-all select-none
              ${!isCurrentMonth ? "text-gray-300 opacity-60" : "text-ink"}
              ${isSelected ? "bg-ink text-paper" : "hover:bg-acid-green/40"}
            `}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span className="font-mono-tag text-[11px] font-bold">{format(day, "d")}</span>
            {(hasEntry || isToday) && (
              <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-ink/20
                ${isToday ? "bg-hot-pink" : "bg-electric-blue"}`}
              />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>{days}</div>
      );
      days = [];
    }

    return <div className="border-t border-l border-ink/20">{rows}</div>;
  };

  const tabs = [
    { id: "calc" as const, label: "Calculator", icon: <Calculator size={12} /> },
    { id: "ledger" as const, label: "Daily Ledger", icon: <TrendingUp size={12} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden"
    >
      {/* Calendar Grid — no padding bottom, flush */}
      <div className="px-4 pt-4 pb-[10px]">
        {renderHeader()}
        {renderDays()}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth.toString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
          >
            {renderCells()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab Bar — sits flush below the grid */}
      <div className="flex border-t-[1.5px] border-ink mt-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 font-mono-tag text-[9px] font-black uppercase transition-all
              ${activeTab === t.id
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-acid-green/30 border-r border-ink/10"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4 border-t border-ink/10 bg-paper">
        <AnimatePresence mode="wait">
          {activeTab === "calc" && (
            <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MiniCalculator />
            </motion.div>
          )}

          {activeTab === "ledger" && (
            <motion.div key="ledger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DailyLedger />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
