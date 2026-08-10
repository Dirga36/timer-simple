export type TimerMode = 'countdown' | 'stopwatch' | 'pomodoro';

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface LapTime {
  id: string;
  lapNumber: number;
  splitTime: number; // In milliseconds
  totalTime: number; // In milliseconds
}

export interface PresetTimer {
  id: string;
  label: string;
  durationSeconds: number;
  icon?: string;
}

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number; // Sessions before long break
}
