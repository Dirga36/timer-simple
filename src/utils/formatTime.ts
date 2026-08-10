/**
 * Formats total seconds into MM:SS or HH:MM:SS
 */
export function formatTimeSeconds(totalSeconds: number): {
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
  hasHours: boolean;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const hasHours = hours > 0;
  const formatted = hasHours
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return { formatted, hours, minutes, seconds, hasHours };
}

/**
 * Formats total milliseconds for Stopwatch (MM:SS.CS - centiseconds)
 */
export function formatTimeMs(totalMs: number): {
  formatted: string;
  minutes: string;
  seconds: string;
  centiseconds: string;
} {
  const mins = Math.floor(totalMs / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const cs = Math.floor((totalMs % 1000) / 10);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const minutesStr = pad(mins);
  const secondsStr = pad(secs);
  const csStr = pad(cs);

  return {
    formatted: `${minutesStr}:${secondsStr}.${csStr}`,
    minutes: minutesStr,
    seconds: secondsStr,
    centiseconds: csStr,
  };
}
