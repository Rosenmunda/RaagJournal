"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Bold, Italic, Underline as UnderlineIcon, List, Highlighter, Type, Palette, ChevronDown, Minus } from "lucide-react";

interface DispatchEditorProps {
  headline: string;
  content: string;
  onChange: (data: { headline?: string; content?: string }) => void;
  onSave: () => void;
}

const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.6;
  audio.play().catch(() => { });
};

// Custom Dropdown Component
interface DropdownOption {
  label: string;
  value: string;
  color?: string;
}

interface DropdownProps {
  label: string;
  icon?: React.ElementType;
  options: DropdownOption[];
  onSelect: (val: string) => void;
  currentVal: string;
}

const Dropdown = ({ label, icon: Icon, options, onSelect, currentVal }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { playSound('/single.wav'); setIsOpen(!isOpen); }}
        className="p-2 border-[1.5px] rounded-[1.25rem] border-ink bg-paper text-ink hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none min-w-[120px]"
      >
        {Icon && <Icon size={16} />}
        <span className="font-mono-tag text-xs font-bold uppercase">{label}</span>
        <ChevronDown size={14} className="ml-auto" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[150px] bg-paper border-[1.5px] rounded-[1.25rem] border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] z-50 flex flex-col overflow-hidden">
          {options.map((opt: DropdownOption) => (
            <button
              key={opt.label}
              onClick={() => {
                playSound('/single.wav');
                onSelect(opt.value);
                setIsOpen(false);
              }}
              className={`p-3 text-left font-mono-tag text-xs font-bold uppercase hover:bg-hot-pink hover:text-paper transition-colors ${currentVal === opt.value ? 'bg-ink text-paper' : 'text-ink'}`}
            >
              <div className="flex items-center gap-2">
                {opt.color && <div className="w-3 h-3 rounded-full border-[1.5px] border-ink" style={{ backgroundColor: opt.color }} />}
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom Toolbar Component
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const toggleAction = (action: () => void) => {
    playSound('/single.wav');
    action();
  };

  const buttonClass = (isActive: boolean) =>
    `p-2 border-[1.5px] border-ink rounded-[1.25rem] transition-all flex items-center justify-center
    ${isActive ? 'bg-ink text-paper shadow-none translate-y-1 translate-x-1' : 'bg-paper text-ink hover:bg-gray-200 dark:hover:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none'}`;

  const colorButtonClass = (colorHex: string, isActive: boolean) =>
    `w-8 h-8 border-[1.5px] border-ink rounded-[1.25rem] transition-all flex items-center justify-center
    ${isActive ? 'scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]' : 'hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:opacity-90 active:translate-y-1 active:translate-x-1 active:shadow-none'}
    `;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 p-2 border-[1.5px] rounded-[1.25rem] border-ink bg-gray-200 dark:bg-zinc-800 relative z-40">
      {/* Dropdowns */}
      <div className="flex gap-2">
        <Dropdown
          label="Style"
          icon={Type}
          currentVal={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : 'p'}
          options={[
            { label: 'Paragraph', value: 'p' },
            { label: 'Heading 1', value: 'h1' },
            { label: 'Heading 2', value: 'h2' }
          ]}
          onSelect={(val: string) => {
            if (val === 'p') editor.chain().focus().setParagraph().run();
            if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        />

        <Dropdown
          label="Text Color"
          icon={Palette}
          currentVal={
            editor.isActive('textStyle', { color: '#A3C4F3' }) ? '#A3C4F3' :
              editor.isActive('textStyle', { color: '#C3E5C4' }) ? '#C3E5C4' :
                editor.isActive('textStyle', { color: '#FFB7B2' }) ? '#FFB7B2' : 'default'
          }
          options={[
            { label: 'Ink (Default)', value: 'default', color: '#111111' },
            { label: 'Soft Blue', value: '#A3C4F3', color: '#A3C4F3' },
            { label: 'Sage Green', value: '#C3E5C4', color: '#C3E5C4' },
            { label: 'Peach Rose', value: '#FFB7B2', color: '#FFB7B2' }
          ]}
          onSelect={(val: string) => {
            if (val === 'default') {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor(val).run();
            }
          }}
        />
      </div>

      <div className="w-[1.5px] h-8 bg-ink" />

      {/* Standard Formatting */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleBold().run())}
          className={buttonClass(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleItalic().run())}
          className={buttonClass(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleUnderline().run())}
          className={buttonClass(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleBulletList().run())}
          className={buttonClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => toggleAction(() => editor.chain().focus().setHorizontalRule().run())}
          className={buttonClass(false)}
          title="Section Break"
        >
          <Minus size={18} />
        </button>
      </div>

      <div className="w-[1.5px] h-8 bg-ink mx-2" />

      {/* Pastel Highlighters */}
      <div className="flex items-center gap-2">
        <Highlighter size={18} className="text-gray-600" />
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleHighlight({ color: '#D2E4FF' }).run())}
          className={colorButtonClass('#D2E4FF', editor.isActive('highlight', { color: '#D2E4FF' }))}
          style={{ backgroundColor: '#D2E4FF' }}
          title="Periwinkle Highlight"
        />
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleHighlight({ color: '#D2F4EA' }).run())}
          className={colorButtonClass('#D2F4EA', editor.isActive('highlight', { color: '#D2F4EA' }))}
          style={{ backgroundColor: '#D2F4EA' }}
          title="Sage Highlight"
        />
        <button
          onClick={() => toggleAction(() => editor.chain().focus().toggleHighlight({ color: '#FAD2E1' }).run())}
          className={colorButtonClass('#FAD2E1', editor.isActive('highlight', { color: '#FAD2E1' }))}
          style={{ backgroundColor: '#FAD2E1' }}
          title="Rose Highlight"
        />
      </div>
    </div>
  );
};

export function DispatchEditor({ headline, content, onChange, onSave }: DispatchEditorProps) {
  const [localHeadline, setLocalHeadline] = useState(headline);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange({ content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-p:my-2 prose-p:font-serif-body prose-headings:font-serif-header prose-headings:uppercase prose-h1:text-4xl prose-h2:text-2xl prose-a:text-electric-blue focus:outline-none min-h-[300px] w-full text-ink selection:bg-hot-pink selection:text-paper leading-tight',
      },
      handleKeyDown: (view, event) => {
        // Play sounds on typing inside Tiptap
        if (event.key === 'Enter') {
          playSound('/return.wav');
        } else if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          playSound('/single.wav');
        }
        return false; // let tiptap handle the event
      }
    },
  });

  // Keep content synced if changed externally (e.g., date change)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleHeadlineChange = (val: string) => {
    setLocalHeadline(val);
    onChange({ headline: val });
  };

  const handleHeadlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      playSound('/return.wav');
    } else if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      playSound('/single.wav');
    }
  };

  return (
    <motion.div
      initial={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.15)" }}
      className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink min-h-[600px] flex flex-col col-span-1 md:col-span-3 lg:col-span-2 relative transition-colors overflow-hidden"
    >
      {/* Apple UI Window Controls */}
      <div className="w-full bg-surface/50 border-b-[1.5px] border-ink py-3 px-5 flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border-[1px] border-black/10 shadow-sm"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border-[1px] border-black/10 shadow-sm"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border-[1px] border-black/10 shadow-sm"></div>
      </div>

      <div className="p-8 flex flex-col flex-1 gap-0">
        <div className="flex justify-between items-center mb-6 border-b-[1.5px] border-ink pb-4">
        <div className="flex flex-col">
          <h3 className="font-mono-tag uppercase font-bold text-xs text-gray-500">Rich Dispatch Editor</h3>
          <div className="flex gap-2 mt-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-ink rounded-full" />
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            playSound('/double.wav');
            onSave();
          }}
          className="bg-electric-blue hover:bg-hot-pink hover:text-paper rounded-[1.25rem] transition-all border-[1.5px] border-ink font-mono-tag text-xs font-bold uppercase px-6 py-2 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-1 active:translate-x-1 active:shadow-none text-black"
        >
          File Report
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Headline Section */}
        <div className="relative">
          <input
            type="text"
            value={localHeadline}
            onChange={(e) => handleHeadlineChange(e.target.value)}
            onKeyDown={handleHeadlineKeyDown}
            placeholder="WRITE TODAY'S HEADLINE"
            className="w-full bg-transparent border-none outline-none font-news-cycle text-5xl md:text-6xl font-black uppercase placeholder:text-gray-400 dark:placeholder:text-gray-600 selection:bg-acid-green selection:text-paper text-ink caret-ink"
            style={{ caretShape: 'block' }}
          />
          <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-ink/10" />
        </div>

        {/* Rich Text Content Section */}
        <div className="flex-1 relative font-sillage text-lg leading-tight outline-none">
          <MenuBar editor={editor} />

          <div className="p-4 border-[1.5px] rounded-[1.25rem] border-ink bg-paper shadow-inner min-h-[400px]">
            <EditorContent editor={editor} className="caret-ink" style={{ caretShape: 'block' }} />
          </div>

          {/* Decorative typewriter paper holes */}
          <div className="absolute left-[-2.5rem] top-0 bottom-0 flex flex-col justify-between py-4 hidden lg:flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-[1.5px] border-ink bg-paper shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]" />
            ))}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}