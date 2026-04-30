"use client";

import React, { useRef } from "react";
import { format } from "date-fns";
import generatePDF from "react-to-pdf";
import { Printer } from "lucide-react";
import { motion } from "framer-motion";

interface NewspaperPrintViewProps {
  date: string;
  headline: string;
  content: string; // Tiptap HTML
}

export function NewspaperPrintView({ date, headline, content }: NewspaperPrintViewProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isMultiColumn, setIsMultiColumn] = React.useState(false);

  const handlePrint = () => {
    // Generate PDF targeting the newspaper view
    generatePDF(targetRef, {
      filename: `Dispatch-${date}.pdf`,
      page: {
        margin: 20,
        format: 'letter',
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 col-span-1 md:col-span-3 lg:col-span-2"
    >
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsMultiColumn(!isMultiColumn)}
          className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink hover:bg-ink hover:text-paper font-mono-tag text-xs font-bold uppercase px-4 py-2 flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-ink"
        >
          {isMultiColumn ? "Single Column" : "Multi-Column"}
        </button>
        <button
          onClick={handlePrint}
          className="bg-acid-green border-[1.5px] rounded-[1.25rem] border-ink hover:bg-hot-pink hover:text-paper font-mono-tag text-xs font-bold uppercase px-4 py-2 flex items-center gap-2 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-black"
        >
          <Printer size={16} />
          Print Edition
        </button>
      </div>

      <div
        ref={targetRef}
        className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] min-h-[600px] w-full max-w-[816px] mx-auto text-ink"
      >
        <div className="border-b-[1.5px] border-ink pb-6 mb-8 text-center">
          <h1 className="font-serif-header text-5xl md:text-6xl font-black uppercase tracking-tight mb-2">
            {headline || "UNTITLED DISPATCH"}
          </h1>
          <p className="font-mono-tag text-sm font-bold text-gray-500 uppercase">
            Published: {date ? format(new Date(date), "MMMM dd, yyyy") : "Unknown Date"}
          </p>
        </div>

        {/* Newspaper Columns Output */}
        <div
          className={`${isMultiColumn ? 'columns-1 md:columns-2 lg:columns-3' : 'columns-1'} gap-8 prose dark:prose-invert prose-p:font-serif-body prose-headings:font-serif-header prose-headings:uppercase prose-headings:break-after-avoid w-full max-w-none prose-p:text-ink prose-headings:text-ink
          first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-hot-pink`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="mt-12 pt-4 border-t-2 border-ink border-dashed flex justify-between items-center opacity-50">
          <span className="font-mono-tag text-[10px] uppercase">End of Dispatch</span>
          <span className="font-mono-tag text-[10px] uppercase">Archive / {date}</span>
        </div>
      </div>
    </motion.div>
  );
}
