"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { SessionListRow } from "@/db/queries";

const filters = ["all", "cash", "tournament"] as const;
type Filter = (typeof filters)[number];

export function SessionList({ sessions }: { sessions: SessionListRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => sessions.filter((s) => filter === "all" || s.type === filter),
    [sessions, filter],
  );

  return (
    <>
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
        {filtered.map((s) => (
          <li key={`${s.type}-${s.id}`}>
            <Link
              href={`/sessions/${s.type}/${s.id}`}
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

        {filtered.length === 0 ? (
          <li className="rounded-lg border border-dashed border-black/10 p-6 text-center text-sm text-black/50 dark:border-white/10 dark:text-white/50">
            No sessions yet.
          </li>
        ) : null}
      </ul>
    </>
  );
}
