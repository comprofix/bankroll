function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Interprets date/time strings in the server's local timezone, matching
// how formatDateLocal/formatTimeLocal read them back out.
export function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function formatDateLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTimeLocal(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
