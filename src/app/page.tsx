"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { NavBar } from "@/components/NavBar";

type SessionType = "cash" | "tournament";

type SessionRow = {
  id: string;
  type: SessionType;
  date: string;
  venue: string;
  net: number;
};

// Placeholder rows so the layout can be reviewed before real data is wired up.
const mockSessions: SessionRow[] = [
  { id: "1", type: "cash", date: "2026-09-12", venue: "Commerce Casino", net: 340 },
  { id: "2", type: "tournament", date: "2026-09-10", venue: "The Bike", net: -125 },
  { id: "3", type: "cash", date: "2026-09-07", venue: "Home Game — Mike's", net: -60 },
  { id: "4", type: "tournament", date: "2026-09-01", venue: "Commerce Casino", net: 1850 },
];

const filters = ["all", "cash", "tournament"] as const;
type Filter = (typeof filters)[number];

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");

  const sessions = useMemo(
    () => mockSessions.filter((s) => filter === "all" || s.type === filter),
    [filter],
  );

  const allTimeNet = useMemo(
    () => mockSessions.reduce((sum, s) => sum + s.net, 0),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Bankroll" />

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-4">
        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/60 dark:text-white/60">All-time net</p>
          <p
            className={`text-3xl font-semibold ${
              allTimeNet >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {allTimeNet >= 0 ? "+" : "-"}${Math.abs(allTimeNet).toLocaleString()}
          </p>
        </section>

        <div className="mt-4 flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-sm capitalize ${
                filter === f
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/sessions/${s.id}`}
                className="flex items-center justify-between rounded-lg border border-black/10 p-3 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
              >
                <div>
                  <p className="text-sm font-medium">{s.venue}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
                    <span className="rounded bg-black/5 px-1.5 py-0.5 capitalize dark:bg-white/10">
                      {s.type}
                    </span>
                    <span>{s.date}</span>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    s.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {s.net >= 0 ? "+" : "-"}${Math.abs(s.net).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}

          {sessions.length === 0 ? (
            <li className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
              No sessions yet.
            </li>
          ) : null}
        </ul>
      </main>

      <Link
        href="/sessions/new"
        className="fixed bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg dark:bg-white dark:text-black"
        aria-label="Add session"
      >
        +
      </Link>
    </div>
  );
}
