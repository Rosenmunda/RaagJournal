"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Plus, Trash2, AlertCircle, ChevronDown } from "lucide-react";

export interface Task {
  _id?: string;
  taskName: string;
  isCompleted: boolean;
  priority: 'High' | 'Med' | 'Low';
}

interface TaskSidebarProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export function TaskSidebar({ tasks, onUpdateTasks }: TaskSidebarProps) {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Med' | 'Low'>('Med');

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPriorityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTask = () => {
    if (!newTaskName.trim()) return;
    const newTask: Task = {
      taskName: newTaskName,
      isCompleted: false,
      priority: newTaskPriority
    };
    onUpdateTasks([...tasks, newTask]);
    setNewTaskName("");
    setNewTaskPriority('Med');
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    onUpdateTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    onUpdateTasks(newTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-hot-pink';
      case 'Med': return 'text-electric-blue';
      case 'Low': return 'text-gray-400';
      default: return 'text-black';
    }
  };

  return (
    <div className="bg-paper border-[1.5px] rounded-[1.25rem] border-ink p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] h-full flex flex-col transition-colors">
      <div className="border-b-[1.5px] border-ink mb-6 pb-2">
        <h3 className="font-serif-header text-2xl font-black text-ink">Today's To-Do</h3>
        <p className="font-mono-tag text-[10px] italic font-bold uppercase text-gray-500">Daily Objectives & Dispatches</p>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          className="flex-1 border-[1.5px] rounded-[1.25rem] border-ink px-3 py-1 font-mono-tag text-xs outline-none focus:bg-acid-green/10 bg-transparent text-ink placeholder:text-gray-400 min-w-0"
        />
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            className="flex items-center gap-1 border-[1.5px] rounded-[1.25rem] border-ink px-3 py-1 font-mono-tag text-[10px] font-bold uppercase outline-none bg-paper text-ink cursor-pointer hover:bg-gray-100 transition-colors h-full"
          >
            {newTaskPriority}
            <ChevronDown size={12} className={`transition-transform duration-200 ${isPriorityOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isPriorityOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute top-full right-0 mt-2 w-24 bg-paper border-[1.5px] border-ink rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] z-20"
              >
                {(['High', 'Med', 'Low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setNewTaskPriority(p);
                      setIsPriorityOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 font-mono-tag text-[10px] font-bold uppercase hover:bg-acid-green hover:text-black transition-colors border-b border-ink/10 last:border-none ${newTaskPriority === p ? 'bg-acid-green/20' : ''}`}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={addTask}
          className="bg-ink text-paper p-2 border-[1.5px] rounded-[1.25rem] border-ink hover:bg-hot-pink hover:text-paper transition-colors active:translate-y-0.5 active:translate-x-0.5 flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence initial={false}>
          {tasks.length === 0 ? (
            <div className="text-center py-8 border-[1.5px] border-dashed border-ink/20 rounded-[1.25rem]">
              <p className="font-mono-tag text-xs text-gray-400 uppercase">No updates to report</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 border-b border-ink/10 pb-2 group"
              >
                <button onClick={() => toggleTask(index)} className="text-ink hover:text-hot-pink transition-colors">
                  {task.isCompleted ? <CheckSquare size={18} fill="var(--color-acid-green)" /> : <Square size={18} />}
                </button>
                <span className={`flex-1 font-mono-tag text-xs font-bold uppercase transition-all ${task.isCompleted ? 'line-through text-gray-500 opacity-50' : 'text-ink'}`}>
                  {task.taskName}
                </span>
                <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                  <AlertCircle size={12} />
                  <span className="text-[8px] font-black uppercase">{task.priority}</span>
                </div>
                <button
                  onClick={() => deleteTask(index)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-hot-pink transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t-[1.5px] border-ink flex justify-between items-center">
        <span className="font-mono-tag text-[10px] font-bold uppercase text-ink">
          Completion: {tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0}%
        </span>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-ink rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
