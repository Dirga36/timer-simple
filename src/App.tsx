import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimerMode } from './types';
import { Header } from './components/Header';
import { CountdownTimer } from './components/CountdownTimer';
import { Stopwatch } from './components/Stopwatch';
import { PomodoroTimer } from './components/PomodoroTimer';
import { KeyShortcutsHint } from './components/KeyShortcutsHint';
import { soundManager } from './utils/sound';

export default function App() {
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync sound manager toggle
  useEffect(() => {
    soundManager.enabled = isSoundOn;
  }, [isSoundOn]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      } flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans`}
    >
      {/* Top Header & Navigation */}
      <Header
        currentMode={mode}
        onSelectMode={(newMode) => {
          soundManager.playClick();
          setMode(newMode);
        }}
        isSoundOn={isSoundOn}
        onToggleSound={() => {
          setIsSoundOn((prev) => !prev);
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => {
          soundManager.playClick();
          setIsDarkMode((prev) => !prev);
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Mode View Area */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto py-6 px-4">
        <AnimatePresence mode="wait">
          {mode === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <CountdownTimer />
            </motion.div>
          )}

          {mode === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Stopwatch />
            </motion.div>
          )}

          {mode === 'pomodoro' && (
            <motion.div
              key="pomodoro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <PomodoroTimer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Hint */}
        <KeyShortcutsHint />
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-600 font-medium">
        Timer Simple — Dibuat dengan presisi & desain bersih
      </footer>
    </div>
  );
}
