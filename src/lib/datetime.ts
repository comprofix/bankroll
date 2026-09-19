function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Interprets date/time strings in the server's local timezone, matching
// how formatDateLocal/formatTimeLocal read them back out. `time` may be
// "HH:MM" or "HH:MM:SS" (the live-session clock sends seconds).
export function combineDateAndTime(date: string, time: string): Date {
  const withSeconds = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${withSeconds}`);
}

export function formatDateLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTimeLocal(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Zone-less "YYYY-MM-DDTHH:MM:SS" wall-clock string. A browser parses this as
// its own local time, which is how the live timer measures elapsed time
// against a start that was entered/stored as wall-clock time.
export function formatLocalIso(date: Date): string {
  return `${formatDateLocal(date)}T${formatTimeLocal(date)}:${pad(date.getSeconds())}`;
}
