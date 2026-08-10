import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Plus, Bell, Clock, CheckCircle2 } from 'lucide-react';
import { formatTimeSeconds } from '../utils/formatTime';
import { soundManager } from '../utils/sound';

const QUICK_PRESETS = [
  { label: '1 Mnt', seconds: 60 },
  { label: '3 Mnt', seconds: 180 },
  { label: '5 Mnt', seconds: 300 },
  { label: '10 Mnt', seconds: 600 },
  { label: '15 Mnt', seconds: 900 },
  { label: '25 Mnt', seconds: 1500 },
  { label: '30 Mnt', seconds: 1800 },
  { label: '60 Mnt', seconds: 3600 },
];

export const CountdownTimer: React.FC = () => {
  const [initialSeconds, setInitialSeconds] = useState<number>(300); // Default 5 mins
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Custom Time Inputs
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(5);
  const [inputSeconds, setInputSeconds] = useState<number>(0);
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound play on complete
  const handleFinish = useCallback(() => {
    setIsRunning(false);
    setIsFinished(true);
    soundManager.playAlarmChime();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleFinish();
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
  }, [isRunning, handleFinish]);

  const toggleStartPause = () => {
    if (secondsLeft === 0) return;
    soundManager.playClick();
    setIsFinished(false);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(initialSeconds);
  };

  const addExtraMinute = () => {
    soundManager.playClick();
    setSecondsLeft((prev) => prev + 60);
    setInitialSeconds((prev) => prev + 60);
  };

  const selectPreset = (seconds: number) => {
    soundManager.playClick();
    setIsRunning(false);
    setIsFinished(false);
    setInitialSeconds(seconds);
    setSecondsLeft(seconds);
    
    const { hours, minutes, seconds: secs } = formatTimeSeconds(seconds);
    setInputHours(hours);
    setInputMinutes(minutes);
    setInputSeconds(secs);
    setIsEditingCustom(false);
  };

  const applyCustomTime = () => {
    const total = (inputHours * 3600) + (inputMinutes * 60) + inputSeconds;
    if (total <= 0) return;
    soundManager.playClick();
    setIsRunning(false);
    setIsFinished(false);
    setInitialSeconds(total);
    setSecondsLeft(total);
    setIsEditingCustom(false);
  };

  const { formatted, hasHours } = formatTimeSeconds(secondsLeft);

  // SVG Progress calculation
  const progressPercent = initialSeconds > 0 ? (secondsLeft / initialSeconds) : 0;
  const strokeDashoffset = 880 * (1 - progressPercent);

  // Color progress mapping
  const getProgressColor = () => {
    if (isFinished) return 'text-rose-500';
    if (progressPercent < 0.15) return 'text-amber-500';
    return 'text-indigo-600 dark:text-indigo-400';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-2">
      {/* Time Up Alert Banner */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500 text-white animate-bounce">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Waktu Habis!</h3>
                <p className="text-xs opacity-90">Timer hitung mundur telah selesai.</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors shadow-md"
            >
              Ulangi
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Dial */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-4">
        {/* SVG Ring */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r="140"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Bar */}
          <circle
            cx="150"
            cy="150"
            r="140"
            className={`${getProgressColor()} transition-all duration-500 ease-linear`}
            strokeWidth="12"
            strokeDasharray="880"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Display Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div
            className={`font-mono-numbers font-bold tracking-tight ${
              hasHours ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
            } text-slate-900 dark:text-white transition-all`}
          >
            {formatted}
          </div>

          <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isRunning ? 'Berjalan...' : isFinished ? 'Selesai' : 'Siap'}
          </div>
        </div>
      </div>

      {/* Main Action Control Buttons */}
      <div className="flex items-center justify-center gap-4 my-6">
        <button
          onClick={handleReset}
          title="Reset Timer [R]"
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleStartPause}
          disabled={secondsLeft === 0}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 active:scale-95 ${
            secondsLeft === 0
              ? 'bg-slate-400 cursor-not-allowed'
              : isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
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
          onClick={addExtraMinute}
          title="Tambah +1 Menit"
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-bold">1m</span>
        </button>
      </div>

      {/* Quick Presets Section */}
      <div className="w-full mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pilihan Waktu Cepat
          </span>
          <button
            onClick={() => setIsEditingCustom((prev) => !prev)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isEditingCustom ? 'Tutup Atur Manual' : 'Atur Manual...'}
          </button>
        </div>

        {/* Custom Input Drawer */}
        {isEditingCustom ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 pb-1"
          >
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">JAM</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={inputHours}
                  onChange={(e) => setInputHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono-numbers font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">MENIT</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono-numbers font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">DETIK</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center font-mono-numbers font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={applyCustomTime}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Terapkan Waktu
            </button>
          </motion.div>
        ) : (
          /* Preset Buttons Grid */
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {QUICK_PRESETS.map((preset) => {
              const isActive = initialSeconds === preset.seconds && !isRunning;
              return (
                <button
                  key={preset.seconds}
                  onClick={() => selectPreset(preset.seconds)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
