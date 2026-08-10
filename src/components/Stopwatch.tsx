import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Trash2, Trophy } from 'lucide-react';
import { LapTime } from '../types';
import { formatTimeMs } from '../utils/formatTime';
import { soundManager } from '../utils/sound';

export const Stopwatch: React.FC = () => {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapTime[]>([]);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const previousElapsedRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  const updateTimer = () => {
    const now = performance.now();
    const currentMs = previousElapsedRef.current + (now - startTimeRef.current);
    setElapsedMs(currentMs);
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  const toggleStartPause = () => {
    soundManager.playClick();
    if (isRunning) {
      previousElapsedRef.current = elapsedMs;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setIsRunning(false);
    setElapsedMs(0);
    previousElapsedRef.current = 0;
    lastLapTimeRef.current = 0;
    setLaps([]);
  };

  const handleAddLap = () => {
    if (elapsedMs === 0) return;
    soundManager.playClick();

    const lapNumber = laps.length + 1;
    const splitTime = elapsedMs - lastLapTimeRef.current;
    lastLapTimeRef.current = elapsedMs;

    const newLap: LapTime = {
      id: Math.random().toString(36).substring(2, 9),
      lapNumber,
      splitTime,
      totalTime: elapsedMs,
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  const clearLaps = () => {
    soundManager.playClick();
    setLaps([]);
  };

  const timeFormatted = formatTimeMs(elapsedMs);

  // Determine fastest and slowest split times if >1 lap
  let minSplit = Infinity;
  let maxSplit = -Infinity;

  if (laps.length > 1) {
    laps.forEach((lap) => {
      if (lap.splitTime < minSplit) minSplit = lap.splitTime;
      if (lap.splitTime > maxSplit) maxSplit = lap.splitTime;
    });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-2">
      {/* Stopwatch Main Display */}
      <div className="w-full my-6 p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          Stopwatch Presisi
        </div>

        {/* Numbers */}
        <div className="font-mono-numbers font-bold tracking-tight text-5xl sm:text-7xl text-slate-900 dark:text-white my-2 flex items-baseline">
          <span>{timeFormatted.minutes}</span>
          <span className="text-slate-400 font-light">:</span>
          <span>{timeFormatted.seconds}</span>
          <span className="text-2xl sm:text-4xl text-indigo-600 dark:text-indigo-400 font-semibold ml-1">
            .{timeFormatted.centiseconds}
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center justify-center gap-4 my-4">
        <button
          onClick={handleReset}
          title="Reset Stopwatch [R]"
          className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleStartPause}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 active:scale-95 ${
            isRunning
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
          onClick={handleAddLap}
          disabled={elapsedMs === 0}
          title="Catat Putaran/Lap [L]"
          className={`p-3.5 rounded-2xl font-semibold transition-all border shadow-sm active:scale-95 flex items-center gap-2 ${
            elapsedMs === 0
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-600/20'
          }`}
        >
          <Flag className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold">Putaran</span>
        </button>
      </div>

      {/* Laps List Section */}
      {laps.length > 0 && (
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-indigo-500" />
              Catatan Putaran ({laps.length})
            </span>
            <button
              onClick={clearLaps}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Semua
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {laps.map((lap) => {
              const isFastest = laps.length > 1 && lap.splitTime === minSplit;
              const isSlowest = laps.length > 1 && lap.splitTime === maxSplit;

              return (
                <div
                  key={lap.id}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono-numbers transition-colors ${
                    isFastest
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : isSlowest
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2 font-sans font-bold">
                    <span className="text-slate-400">#{lap.lapNumber}</span>
                    {isFastest && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white">TERCEPAT</span>}
                    {isSlowest && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white">TERLAMBAT</span>}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      +{formatTimeMs(lap.splitTime).formatted}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatTimeMs(lap.totalTime).formatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
