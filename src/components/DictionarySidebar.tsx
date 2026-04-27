"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Book, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

const INTERESTING_WORDS = [
  "ephemeral",
  "labyrinthine",
  "mellifluous",
  "serendipity",
  "petrichor",
  "sonorous",
  "quintessential",
  "effervescent",
  "solitude",
  "eloquence",
  "surreptitious",
  "nefarious",
  "ethereal",
  "luminescence",
  "halcyon",
];

export function DictionarySidebar() {
  const [wordOfTheDay, setWordOfTheDay] = useState<DictionaryEntry | null>(null);
  const [searchResult, setSearchResult] = useState<DictionaryEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWODView, setIsWODView] = useState(true);

  const fetchWord = useCallback(async (word: string, isWOD = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error("Word not found in archives");
      }
      const data = await response.json();
      if (isWOD) {
        setWordOfTheDay(data[0]);
      } else {
        setSearchResult(data[0]);
        setIsWODView(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch definition");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const randomWord = INTERESTING_WORDS[Math.floor(Math.random() * INTERESTING_WORDS.length)];
    // Wrap in a microtask to avoid synchronous setState lint warning if necessary, 
    // but useCallback + async should generally be fine. 
    // The linter might still complain about the initial setIsLoading(true).
    const initFetch = async () => {
      await fetchWord(randomWord, true);
    };
    initFetch();
  }, [fetchWord]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      fetchWord(searchTerm.trim());
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResult(null);
    setError(null);
    setIsWODView(true);
  };

  const displayData = isWODView ? wordOfTheDay : searchResult;

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] font-serif-body transition-colors">
      <div className="flex items-center justify-between mb-6 border-b-[1.5px] border-ink pb-2">
        <h3 className="font-serif-header text-2xl font-black flex items-center gap-2 text-ink">
          <Book className="w-4 h-4" />
          {isWODView ? "Lexicon: Word of the Day" : "Archive Search"}
        </h3>
        {!isWODView && (
          <button
            onClick={clearSearch}
            className="text-md font-mono-tag uppercase underline decoration-1 hover:text-hot-pink hover:no-underline transition-colors flex items-center gap-1 text-ink"
          >
            <X className="w-3 h-3" />
            Clear Search
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a word..."
          className="w-full bg-transparent border-[1.5px] border-ink rounded-[1.25rem] py-2 px-4 pr-10 font-mono-tag text-sm outline-none focus:bg-acid-green/10 transition-all placeholder:text-ink/40 text-ink"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      <div className="min-h-[200px] relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <Loader2 className="w-8 h-8 animate-spin text-ink/40" />
              <p className="font-mono-tag text-[12px] uppercase text-ink/70">Consulting Archives...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12 text-center border-[1.5px] border-dashed border-ink/20 rounded-[1.25rem]"
            >
              <p className="text-hot-pink font-serif-header font-bold italic mb-2">Error 404: Lexicon Failure</p>
              <p className="text-sm text-ink/70">{error}</p>
              <button
                onClick={clearSearch}
                className="mt-4 text-xs font-mono-tag uppercase underline decoration-1 hover:text-hot-pink transition-colors text-ink"
              >
                Back to Daily Word
              </button>
            </motion.div>
          ) : displayData ? (
            <motion.div
              key={displayData.word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-serif-header font-black text-ink lowercase tracking-tighter">
                    {displayData.word}
                  </h4>
                  {displayData.phonetic && (
                    <span className="text-xs font-mono-tag text-ink/50 italic">
                      {displayData.phonetic}
                    </span>
                  )}
                </div>
                <div className="h-0.5 w-full bg-ink/10 mt-1" />
              </div>

              <div className="space-y-4">
                {displayData.meanings.slice(0, 2).map((meaning, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-[12px] font-mono-tag font-bold uppercase bg-ink/10 px-1.5 py-0.5 rounded text-ink/70">
                      {meaning.partOfSpeech}
                    </span>
                    <p className="text-md leading-relaxed text-ink/90 font-serif-body italic">
                      {meaning.definitions[0].definition}
                    </p>
                    {meaning.definitions[0].example && (
                      <blockquote className="border-l-2 border-ink/20 pl-3 py-1 my-2">
                        <p className="text-xs text-ink/60 font-serif-body italic">
                          &ldquo;{meaning.definitions[0].example}&rdquo;
                        </p>
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
