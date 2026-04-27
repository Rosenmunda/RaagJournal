"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Masthead } from "@/components/Masthead";
import { DispatchEditor } from "@/components/DispatchEditor";
import { NewspaperPrintView } from "@/components/NewspaperPrintView";
import { Calendar } from "@/components/Calendar";
import { TaskSidebar, Task } from "@/components/TaskSidebar";
import { DailyFocus } from "@/components/DailyFocus";
import { GratitudeLog } from "@/components/GratitudeLog";
import { ImportantDates } from "@/components/ImportantDates";
import { WorldNews } from "@/components/WorldNews";
import { SpotifyPlayer } from "@/components/SpotifyPlayer";
import { DictionarySidebar } from "@/components/DictionarySidebar";

interface JournalEntryData {
  _id?: string;
  date: string;
  headline: string;
  content: string;
  moodColor: string;
  tasks: Task[];
  dailyFocus: string;
  gratitude: string[];
  thoughtOfTheDay: string;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [entry, setEntry] = useState<JournalEntryData>({
    date: "",
    headline: "",
    content: "",
    moodColor: "#BAFF29",
    tasks: [],
    dailyFocus: "",
    gratitude: [],
    thoughtOfTheDay: "",
  });

  const [entryDates, setEntryDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    setTimeout(() => {
      setSelectedDate(now);
      setEntry(prev => ({ ...prev, date: format(now, "yyyy-MM-dd") }));
    }, 0);
  }, []);

  const fetchEntry = useCallback(async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    try {
      setLoading(true);
      const res = await fetch(`/api/entries?date=${dateStr}`);
      if (!res.ok) {
        console.error(`Fetch entry failed with status: ${res.status}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response for entry");
        return;
      }
      const data = await res.json();
      if (data && !data.notFound) {
        setEntry(data);
        setIsReadingMode(true); // Default to read mode if entry exists
      } else {
        setEntry({
          date: dateStr,
          headline: "",
          content: "",
          moodColor: "#BAFF29",
          tasks: [],
          dailyFocus: "",
          gratitude: [],
          thoughtOfTheDay: "",
        });
        setIsReadingMode(false); // Edit mode for new entries
      }
    } catch (error) {
      console.error("Failed to fetch entry:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEntryDates = useCallback(async () => {
    try {
      const res = await fetch("/api/entries/dates");
      if (!res.ok) {
        console.error(`Fetch dates failed with status: ${res.status}`);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Received non-JSON response for dates");
        return;
      }
      const data = await res.json();
      setEntryDates(data);
    } catch (error) {
      console.error("Failed to fetch entry dates:", error);
    }
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const timeoutId = setTimeout(() => {
      fetchEntry(selectedDate);
      fetchEntryDates();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [selectedDate, fetchEntry, fetchEntryDates]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!entry.date || loading) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          fetchEntryDates();
        }
      } catch (error) {
        console.error("Failed to auto-save entry:", error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [entry, loading, fetchEntryDates]);

  const updateEntry = (updates: Partial<JournalEntryData>) => {
    setEntry((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        fetchEntryDates();
        setIsReadingMode(true);
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Masthead />

      {/* Date & Status Bar */}
      <div className="mt-8 mb-6 border-b-[1.5px] border-ink pb-2 flex justify-between items-end">
        <div className="flex flex-col">
          <h2 className="font-serif-header text-3xl sm:text-4xl font-black text-ink">
            Edition: {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Loading..."}
          </h2>
          <span className="font-mono-tag text-[10px] italic font-bold text-gray-500 uppercase mt-1">
            {(() => {
              const todayStr = format(new Date(), "yyyy-MM-dd");
              const isToday = selectedDate && format(selectedDate, "yyyy-MM-dd") === todayStr;
              const hasContent = (entry.content ?? '').replace(/<[^>]*>/g, '').trim() !== "" || entry.headline.trim() !== "" || entry.tasks.length > 0 || entry.dailyFocus.trim() !== "" || entry.gratitude.length > 0;

              let statusText = "Draft / Unfiled";
              if (loading) statusText = "Fetching Dispatches...";
              else if (hasContent) {
                statusText = isToday ? "Live Dispatch" : "Filed / Archived";
              }

              return `Weather: Digital / Visibility: High / Status: ${statusText}`;
            })()}
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          <div className="border-l-[1.5px] border-ink pl-4">
            <p className="font-mono-tag text-[10px] font-bold uppercase text-gray-500">Tasks</p>
            <p className="font-serif-header text-2xl font-black text-ink">{entry.tasks.filter(t => t.isCompleted).length}/{entry.tasks.length}</p>
          </div>
          <div className="border-l-[1.5px] border-ink pl-4">
            <p className="font-mono-tag text-[10px] font-bold uppercase text-gray-500">Words</p>
            <p className="font-serif-header text-2xl font-black text-ink">{entry.content.split(/\s+/).filter(Boolean).length}</p>
          </div>
        </div>
      </div>

      {/* Main Journal Dashboard - Now using a 12-column grid for better proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

        {/* Left Sidebar (3/12 width on Desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {selectedDate && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              entryDates={entryDates}
            />
          )}
          <DailyFocus
            focus={entry.dailyFocus}
            onChange={(focus) => updateEntry({ dailyFocus: focus })}
          />
          <ImportantDates />
          <div className="bg-hot-pink border-[1.5px] rounded-[1.25rem] p-4 text-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] focus-within:ring-2 focus-within:ring-ink transition-all">
            <h4 className="font-serif-body font-black text-2xl mb-2 underline decoration-2 underline-offset-4">Thought of the Day</h4>
            <textarea
              value={entry.thoughtOfTheDay}
              onChange={(e) => updateEntry({ thoughtOfTheDay: e.target.value })}
              placeholder="Record your daily thought here..."
              className="w-full bg-transparent border-none outline-none font-serif-body text-md leading-tight resize-none placeholder:text-paper/70 selection:bg-paper selection:text-hot-pink"
              rows={4}
            />
          </div>
        </div>

        {/* Center: Main Editor Area (6/12 width on Desktop) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsReadingMode(!isReadingMode)}
              className="font-mono-tag text-xs font-bold uppercase underline decoration-2 hover:text-hot-pink hover:no-underline transition-colors text-ink"
            >
              {isReadingMode ? "[ Switch to Edit Mode ]" : "[ Switch to Read Mode ]"}
            </button>
          </div>

          {isReadingMode ? (
            <NewspaperPrintView
              date={entry.date}
              headline={entry.headline}
              content={entry.content}
            />
          ) : (
            <DispatchEditor
              key={entry.date}
              headline={entry.headline}
              content={entry.content}
              onChange={(updates) => updateEntry(updates)}
              onSave={handleSave}
            />
          )}

          <div className="mt-4">
            <DictionarySidebar />
          </div>
        </div>

        {/* Right Sidebar (3/12 width on Desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <TaskSidebar
            tasks={entry.tasks}
            onUpdateTasks={(tasks) => updateEntry({ tasks })}
          />
          <GratitudeLog
            gratitudes={entry.gratitude}
            onChange={(gratitude) => updateEntry({ gratitude })}
          />
          <SpotifyPlayer />
        </div>
      </div>

      {/* World News Section - Extracted to span full width beautifully */}
      <div className="w-full mb-12 border-t-[1.5px] border-ink pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-header text-6xl tracking-tighter font-bold text-ink">Curated Headline</h2>
          <p className="font-mono-tag text-[13px] font-bold text-gray-500 uppercase">- By <span className="text-hot-pink">Raag</span> Ai Search Engine</p>
        </div>
        <WorldNews />
      </div>
    </>
  );
}