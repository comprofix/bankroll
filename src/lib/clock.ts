"use client";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// The browser's current wall-clock date and time. Sent to the server as
// plain strings so a live session's start/finish times are stored the same
// way as manually typed ones (wall-clock, interpreted in the server's
// timezone) instead of as a true instant that would display in a different
// timezone than the times the user types.
export function clientClock(): { clientDate: string; clientTime: string } {
  const now = new Date();
  return {
    clientDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    clientTime: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  };
}

// Wraps a Server Action so the browser's clock is added to the FormData at
// submit time.
export function withClientClock(action: (formData: FormData) => void | Promise<void>) {
  return async (formData: FormData) => {
    const { clientDate, clientTime } = clientClock();
    formData.set("clientDate", clientDate);
    formData.set("clientTime", clientTime);
    await action(formData);
  };
}
