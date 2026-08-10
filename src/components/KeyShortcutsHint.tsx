import React from 'react';
import { Keyboard } from 'lucide-react';

export const KeyShortcutsHint: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto mt-6 px-4">
      <div className="flex flex-wrap items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
          <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
          Pintas Tombol:
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] shadow-2xs font-bold text-slate-800 dark:text-slate-200">
            Spasi
          </kbd>
          Mulai/Jeda
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] shadow-2xs font-bold text-slate-800 dark:text-slate-200">
            R
          </kbd>
          Reset
        </span>
      </div>
    </div>
  );
};
