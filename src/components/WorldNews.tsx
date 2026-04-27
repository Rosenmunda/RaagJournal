"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, AlertCircle, CloudRain } from "lucide-react";

interface NewsItem {
  category: string;
  title: string;
  source: string;
  summary: string;
  url?: string;
}

interface WeatherData {
  condition: string;
  temp: string;
  summary: string;
  wind: string;
  humidity: string;
}

interface FashionItem {
  title: string;
  summary: string;
  url?: string;
}

interface DispatchData {
  news: NewsItem[];
  weather: WeatherData;
  fashion: FashionItem[];
}

export function WorldNews() {
  const [data, setData] = useState<DispatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response");
      }
      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        setError(result.details || result.message || "Failed to transmit dispatches.");
      }
    } catch (err) {
      setError("Communication link severed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const groupedNews = (data?.news || []).reduce((acc, item) => {
    const cat = item.category || "General News";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  const entries = Object.entries(groupedNews);
  const mainFlowCategories = entries.slice(0, 2);
  const sidebarCategories = entries.slice(2);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    // Uses global text-ink so it respects the theme toggle natively
    <div className="w-full bg-transparent p-4 md:p-8 flex justify-center text-ink transition-colors duration-300">

      {/* Main Article uses bg-paper and border-ink */}
      <article className="w-full max-w-6xl bg-paper shadow-md border-x-[1px] border-y-[4px] border-ink transition-colors duration-300">

        {/* Top Dateline Bar */}
        <header className="py-3 px-6 uppercase tracking-wider text-xs sm:text-sm font-sans font-bold border-b-4 border-double border-ink flex justify-between items-center transition-colors duration-300">
          <span>{today}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block tracking-widest text-[10px] opacity-70">GEMINI NEURAL FEED</span>
            <button
              onClick={fetchNews}
              className={`transition-opacity hover:opacity-50 ${loading ? "animate-spin opacity-50" : "opacity-100"}`}
              title="Refresh News"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {/* Main Headline */}
          <div className="border-b-[2px] border-ink pb-8 mb-10 transition-colors duration-300">
            <h1
              className="font-serif-header text-5xl sm:text-6xl md:text-[5.5rem] font-black leading-[0.95] tracking-tighter text-center md:text-left"
              style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
            >
              Stay Always Informed
              <br className="hidden sm:block" />
              with the Latest Updates
            </h1>
          </div>

          <main className="flex flex-col gap-12 items-start w-full">
            {loading ? (
              <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-12 animate-pulse space-y-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="mb-8 break-inside-avoid">
                    <div className="h-6 bg-ink opacity-20 w-3/4 mb-3" />
                    <div className="h-4 bg-ink opacity-10 w-full mb-2" />
                    <div className="h-4 bg-ink opacity-10 w-5/6" />
                  </div>
                ))}
              </div>
            ) : error || !data ? (
              <div className="w-full flex flex-col items-center justify-center p-12 text-center border-[1px] border-ink border-dashed">
                <AlertCircle size={40} className="opacity-60 mb-4" />
                <p className="font-serif text-xl font-bold mb-4">{error || "Data unavailable"}</p>
                <button onClick={fetchNews} className="uppercase font-sans font-black text-xs tracking-widest border-b-[2px] border-ink pb-1 hover:opacity-60 transition-opacity">Retry Connection</button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-10">

                {/* TOP SECTION: 12-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 w-full">

                  {/* Left Main Flow - Uses var(--border-muted) for the column lines */}
                  <div
                    className="lg:col-span-8 columns-1 sm:columns-2 gap-10 lg:gap-12 text-justify"
                    style={{ columnRule: '1px solid var(--border-muted)' }}
                  >
                    {mainFlowCategories.map(([category, items], idx) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="mb-10 break-inside-avoid"
                      >
                        <h3 className="font-sans text-xs font-black uppercase tracking-widest border-t-[3px] border-b-[1px] border-ink py-2 mb-5 text-center transition-colors duration-300">
                          {category}
                        </h3>
                        <div className="space-y-8">
                          {items.map((item, itemIdx) => (
                            <div key={itemIdx} className="group">
                              <a
                                href={item.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block font-serif text-2xl font-black leading-[1.1] mb-3 hover:opacity-70 transition-opacity decoration-[1.5px] underline-offset-4 hover:underline"
                                style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
                              >
                                {item.title} <ExternalLink size={14} className="inline opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                              </a>
                              <p className="font-serif text-[16px] leading-relaxed opacity-90 mb-3">
                                {item.summary}
                              </p>
                              <div className="font-sans text-[9px] font-black uppercase tracking-widest opacity-60 border-t-[1px] border-ink/20 pt-2 transition-colors duration-300" style={{ borderTopColor: 'var(--border-muted)' }}>
                                Source: <span className="opacity-100">{item.source}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right Sidebar */}
                  <aside className="lg:col-span-4 flex flex-col gap-10 border-t-[2px] border-dashed lg:border-t-0 lg:border-l-[1px] border-ink pt-8 lg:pt-0 pl-0 lg:pl-10 transition-colors duration-300">

                    {/* Meteorological Report */}
                    <div className="w-full">
                      <h4 className="font-sans text-xs font-black uppercase tracking-widest border-t-[3px] border-b-[1px] border-ink py-2 mb-5 flex items-center gap-2 transition-colors duration-300">
                        <CloudRain size={16} />
                        Meteorology
                      </h4>
                      {/* Inverted box: background is Ink, text is Paper */}
                      <div className="bg-ink text-paper p-5 transition-colors duration-300" style={{ boxShadow: '4px 4px 0px 0px var(--border-muted)' }}>
                        <div className="flex justify-between items-end border-b-[1px] border-current/30 pb-3 mb-3">
                          <span className="font-sans text-sm uppercase tracking-widest">{data.weather.condition}</span>
                          <span className="font-serif text-3xl font-black leading-none">{data.weather.temp}</span>
                        </div>
                        <p className="font-serif text-sm leading-relaxed opacity-80 italic mb-4">
                          {data.weather.summary}
                        </p>
                        <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">
                          <span>WND: {data.weather.wind}</span>
                          <span>HUM: {data.weather.humidity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fashion & Society Dispatch */}
                    <div className="w-full">
                      <h4 className="font-sans text-xs font-black uppercase tracking-widest border-t-[3px] border-b-[1px] border-ink py-2 mb-5 transition-colors duration-300">
                        Society & Style
                      </h4>
                      <div className="space-y-6">
                        {data.fashion.map((item, idx) => (
                          <div key={idx} className={`group cursor-pointer transition-colors duration-300 ${idx !== 0 ? "border-t-[1px] pt-6" : ""}`} style={{ borderTopColor: 'var(--border-muted)' }}>
                            <a href={item.url || "#"} target="_blank" rel="noopener noreferrer" className="block">
                              <h5 className="font-serif text-xl font-bold leading-tight mb-2 group-hover:underline decoration-[1.5px] underline-offset-4">
                                {item.title}
                              </h5>
                              <p className="font-serif text-sm opacity-80 leading-snug">
                                {item.summary}
                              </p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>

                </div>

                {/* Styled "Daily Digest" Box - Uses bg-surface to adapt to global themes */}
                <div className="w-full bg-surface p-8 mt-4 border-[1px] border-ink transition-colors duration-300" style={{ boxShadow: '4px 4px 0px 0px var(--ink)' }}>
                  <h2 className="font-sans text-3xl font-black uppercase leading-none tracking-tighter mb-8 border-b-4 border-double border-ink pb-4 transition-colors duration-300">
                    Your Daily Digest Of
                    <br className="hidden sm:block" />
                    Markets & Science
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
                    {sidebarCategories.map(([category, items], idx) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        className="lg:col-span-2"
                      >
                        <h4 className="font-sans text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b-[2px] border-ink pb-2 transition-colors duration-300">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {items.map((item, itemIdx) => (
                            <div key={itemIdx}>
                              <a
                                href={item.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block font-serif text-lg font-bold leading-tight mb-2 hover:underline decoration-[1.5px] underline-offset-2"
                              >
                                {item.title}
                              </a>
                              <p className="font-serif text-[14px] leading-snug opacity-80 italic">
                                {item.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </article>
    </div>
  );
}