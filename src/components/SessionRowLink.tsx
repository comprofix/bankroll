import Link from "next/link";

import type { SessionListRow } from "@/db/queries";

import { SessionTimer } from "./SessionTimer";

export function SessionRowLink({ session }: { session: SessionListRow }) {
  return (
    <Link
      href={`/sessions/${session.type}/${session.id}`}
      className="flex items-center justify-between rounded-lg border border-black/10 p-3 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
    >
      <div>
        <p className="text-sm font-medium">{session.venue}</p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
          <span className="rounded bg-black/5 px-1.5 py-0.5 capitalize dark:bg-white/10">
            {session.type}
          </span>
          <span>{session.date}</span>
          {session.active ? (
            <span className="rounded bg-emerald-600/15 px-1.5 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
              Live
            </span>
          ) : null}
        </div>
      </div>
      {session.active ? (
        <div className="text-right">
          <p className="text-sm text-black/50 dark:text-white/50">In progress</p>
          {session.startedAt ? (
            <p className="mt-0.5 text-sm font-semibold">
              <SessionTimer startedAt={session.startedAt} />
            </p>
          ) : null}
        </div>
      ) : (
        <span
          className={`text-sm font-semibold ${
            session.net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {session.net >= 0 ? "+" : "-"}${Math.abs(session.net).toLocaleString()}
        </span>
      )}
    </Link>
  );
}
