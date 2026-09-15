"use client";

import { useMemo, useState } from "react";

import type { SessionListRow } from "@/db/queries";

import { SessionRowLink } from "./SessionRowLink";

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
            <SessionRowLink session={s} />
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
