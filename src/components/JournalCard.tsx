"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  featured?: boolean;
  className?: string;
}

export function JournalCard({ title, excerpt, date, tags, featured, className }: JournalCardProps) {
  return (
    <motion.article 
      whileHover={{ y: -4, x: -4, boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.15)" }}
      initial={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-6 flex flex-col h-full",
        featured ? "md:col-span-2 md:row-span-2 bg-paper" : "col-span-1",
        className
      )}
    >
      <header className="mb-4 flex justify-between items-start">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span 
              key={tag} 
              className={cn(
                "font-mono-tag text-xs font-bold uppercase py-1 px-2 border-[1.5px] border-ink rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]",
                i % 2 === 0 ? "bg-hot-pink text-paper" : "bg-ink text-paper"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <time className="font-mono-tag text-xs font-bold border-b-[1.5px] border-ink pb-1 text-ink">
          {date}
        </time>
      </header>

      <h2 className={cn("font-serif-header font-black leading-none mb-4 text-ink", featured ? "text-5xl" : "text-3xl")}>
        {title}
      </h2>
      
      <div className={cn("font-serif-body text-ink flex-1", featured && "broadsheet-cols max-md:broadsheet-cols-none")}>
        <p className="first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2">
          {excerpt}
        </p>
      </div>

      <footer className="mt-6 pt-4 border-t-[1.5px] border-ink border-dashed flex justify-between items-center text-xs font-mono-tag uppercase font-bold text-ink">
        <span>Read Full Entry</span>
        <span className="text-xl">→</span>
      </footer>
    </motion.article>
  );
}
