import React from 'react';
import { TimerMode } from '../types';
import { Timer, Hourglass, Flame, Volume2, VolumeX, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';

interface HeaderProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isSoundOn,
  onToggleSound,
  isDarkMode,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 sm:px-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Timer Simple
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Hitung Mundur & Stopwatch Clean
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <nav className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
        <button
          onClick={() => onSelectMode('countdown')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            currentMode === 'countdown'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Hourglass className="w-4 h-4" />
          Hitung Mundur
        </button>

        <button
          onClick={() => onSelectMode('stopwatch')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            currentMode === 'stopwatch'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Timer className="w-4 h-4" />
          Stopwatch
        </button>

        <button
          onClick={() => onSelectMode('pomodoro')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
            currentMode === 'pomodoro'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          Pomodoro
        </button>
      </nav>

      {/* Utility Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          title={isSoundOn ? 'Matikan Suara (Mute)' : 'Aktifkan Suara (Unmute)'}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
        >
          {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
        </button>

        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 hidden sm:flex"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
