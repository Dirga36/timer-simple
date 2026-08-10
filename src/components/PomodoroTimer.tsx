import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Flame, Coffee, Sparkles, Settings, Bell, CheckCircle2 } from 'lucide-react';
import { PomodoroPhase, PomodoroSettings } from '../types';
import { formatTimeSeconds } from '../utils/formatTime';
import { soundManager } from '../utils/sound';

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

export const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [sessionCount, setSessionCount] = useState<number>(1);

  const getPhaseSeconds = (p: PomodoroPhase, s: PomodoroSettings) => {
    switch (p) {
      case 'work': return s.workMinutes * 60;
      case 'shortBreak': return s.shortBreakMinutes * 60;
      case 'longBreak': return s.longBreakMinutes * 60;
    }
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(DEFAULT_SETTINGS.workMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchPhase = useCallback((newPhase: PomodoroPhase) => {
    setIsRunning(false);
    setIsFinished(false);
    setPhase(newPhase);
    setSecondsLeft(getPhaseSeconds(newPhase, settings));
  }, [settings]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    setIsFinished(true);
    soundManager.playAlarmChime();

    if (phase === 'work') {
      if (sessionCount % settings.longBreakInterval === 0) {
        switchPhase('longBreak');
      } else {
        switchPhase('shortBreak');
      }
      setSessionCount((prev) => prev + 1);
    } else {
      switchPhase('work');
    }
  }, [phase, sessionCount, settings, switchPhase]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          if (prev <= 4) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleSessionComplete]);

  const toggleStartPause = () => {
    soundManager.playClick();
    setIsFinished(false);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(getPhaseSeconds(phase, settings));
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    soundManager.playClick();
    setSettings(newSettings);
    setSecondsLeft(getPhaseSeconds(phase, newSettings));
    setShowSettings(false);
  };

  const currentInitialSeconds = getPhaseSeconds(phase, settings);
  const progressPercent = currentInitialSeconds > 0 ? secondsLeft / currentInitialSeconds : 0;
  const strokeDashoffset = 880 * (1 - progressPercent);

  const { formatted } = formatTimeSeconds(secondsLeft);

  const getPhaseTheme = () => {
    switch (phase) {
      case 'work':
        return {
          title: 'Sesi Fokus',
          color: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30',
          badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          icon: <Flame className="w-4 h-4 text-indigo-500" />,
        };
      case 'shortBreak':
        return {
          title: 'Istirahat Pendek',
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          icon: <Coffee className="w-4 h-4 text-emerald-500" />,
        };
      case 'longBreak':
        return {
          title: 'Istirahat Panjang',
          color: 'text-sky-600 dark:text-sky-400',
          bgColor: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/30',
          badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
          icon: <Sparkles className="w-4 h-4 text-sky-500" />,
        };
    }
  };

  const theme = getPhaseTheme();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-2">
      {/* Phase Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 mb-4">
        <button
          onClick={() => { soundManager.playClick(); switchPhase('work'); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            phase === 'work'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Fokus ({settings.workMinutes}m)
        </button>

        <button
          onClick={() => { soundManager.playClick(); switchPhase('shortBreak'); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            phase === 'shortBreak'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Pendek ({settings.shortBreakMinutes}m)
        </button>

        <button
          onClick={() => { soundManager.playClick(); switchPhase('longBreak'); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            phase === 'longBreak'
              ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Panjang ({settings.longBreakMinutes}m)
        </button>
      </div>

      {/* Finished Banner */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Sesi Selesai!</h3>
                <p className="text-xs opacity-90">Saatnya beralih ke sesi berikutnya.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Circular Timer */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r="140"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            className={`${theme.color} transition-all duration-500 ease-linear`}
            strokeWidth="12"
            strokeDasharray="880"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className={`px-3 py-1 rounded-full border text-xs font-bold mb-2 flex items-center gap-1.5 ${theme.badgeBg}`}>
            {theme.icon}
            {theme.title}
          </div>

          <div className="font-mono-numbers font-bold tracking-tight text-5xl sm:text-6xl text-slate-900 dark:text-white">
            {formatted}
          </div>

          <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Sesi Ke-{sessionCount}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4 my-4">
        <button
          onClick={handleReset}
          title="Reset Pomodoro [R]"
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleStartPause}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
              : theme.bgColor
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-6 h-6 fill-current" />
              <span>Jeda</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current ml-0.5" />
              <span>Mulai</span>
            </>
          )}
        </button>

        <button
          onClick={() => { soundManager.playClick(); setShowSettings((prev) => !prev); }}
          title="Pengaturan Durasi Pomodoro"
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Modal Drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          >
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Pengaturan Waktu (Menit)
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">FOKUS</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.workMinutes}
                  onChange={(e) => setSettings({ ...settings, workMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono-numbers text-center font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">ISTIRAHAT PENDEK</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreakMinutes}
                  onChange={(e) => setSettings({ ...settings, shortBreakMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono-numbers text-center font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">ISTIRAHAT PANJANG</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakMinutes}
                  onChange={(e) => setSettings({ ...settings, longBreakMinutes: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono-numbers text-center font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => updateSettings(settings)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan & Terapkan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
