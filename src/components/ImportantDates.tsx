"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

interface ImportantDate {
  _id: string;
  date: string;
  label: string;
}

export function ImportantDates() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);

  const fetchDates = async () => {
    try {
      const res = await fetch("/api/important-dates");
      if (!res.ok) {
        console.error(`Fetch failed with status: ${res.status}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response");
        return;
      }
      const data = await res.json();
      setDates(data);
    } catch (error) {
      console.error("Failed to fetch important dates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const addDate = async () => {
    if (!newLabel.trim()) return;
    try {
      const res = await fetch("/api/important-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, label: newLabel }),
      });
      if (res.ok) {
        setNewLabel("");
        fetchDates();
      }
    } catch (error) {
      console.error("Failed to add date:", error);
      alert("Failed to save the reminder. Please check if the date and label are valid.");
    }
  };

  const deleteDate = async (id: string) => {
    try {
      const res = await fetch(`/api/important-dates?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchDates();
    } catch (error) {
      console.error("Failed to delete date:", error);
    }
  };

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] p-6 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] flex flex-col transition-colors">
      <div className="border-b-[1.5px] border-ink mb-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="font-serif-header text-2xl font-bold text-ink">Archive Reminders</h3>
          <p className="font-mono-tag text-[10px] italic font-bold uppercase text-gray-500">Upcoming Important Dates</p>
        </div>
        <CalendarIcon className="text-ink" size={20} />
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 border-[1.5px] rounded-[1.25rem] border-ink px-3 py-1 font-mono-tag text-[10px] outline-none bg-transparent text-ink"
          />
          <button
            onClick={addDate}
            className="bg-ink text-paper p-2 border-[1.5px] rounded-[1.25rem] border-ink hover:bg-hot-pink hover:text-paper transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addDate()}
          placeholder="What's happening?"
          className="w-full border-[1.5px] rounded-[1.25rem] border-ink px-3 py-2 font-mono-tag text-xs outline-none bg-transparent text-ink placeholder:text-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[200px] pr-2">
        <AnimatePresence initial={false}>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-[1.25rem]" />
              ))}
            </div>
          ) : dates.length === 0 ? (
            <div className="text-center py-4 border-[1.5px] border-dashed border-ink/20 rounded-[1.25rem]">
              <p className="font-mono-tag text-[10px] text-gray-400 uppercase">Clear Skies / No Reminders</p>
            </div>
          ) : (
            dates.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 border-b border-ink/10 pb-2 group"
              >
                <div className="flex flex-col flex-1">
                  <span className="font-mono-tag text-[9px] font-black uppercase text-hot-pink flex items-center gap-1">
                    <Clock size={10} />
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </span>
                  <span className="font-serif-body text-sm text-ink leading-tight">
                    {item.label}
                  </span>
                </div>
                <button
                  onClick={() => deleteDate(item._id)}
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
