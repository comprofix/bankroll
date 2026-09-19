"use client";

import { useSyncExternalStore } from "react";

// Ticks once a second. The snapshot is whole seconds, so it's stable between
// renders within the same second (useSyncExternalStore requires that).
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

function getNowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

// Nothing to show during the server render: the current time is only known
// in the browser.
function getServerNowSeconds(): null {
  return null;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// startedAt is a zone-less "YYYY-MM-DDTHH:MM:SS" wall-clock string, which
// the browser parses as its own local time.
export function SessionTimer({ startedAt }: { startedAt: string }) {
  const nowSeconds = useSyncExternalStore(subscribe, getNowSeconds, getServerNowSeconds);

  if (nowSeconds === null) {
    return <span className="tabular-nums">--:--:--</span>;
  }

  const elapsed = Math.max(0, nowSeconds - Math.floor(new Date(startedAt).getTime() / 1000));
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <span className="tabular-nums">
      {hours}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
