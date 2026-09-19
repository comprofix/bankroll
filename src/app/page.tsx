import Link from "next/link";

import { NavBar } from "@/components/NavBar";
import { SessionList } from "@/components/SessionList";
import { getSessionListForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

export default async function Home() {
  const userId = await requireUserId();
  const sessions = await getSessionListForUser(userId);
  const allTimeNet = sessions.reduce((sum, s) => (s.active ? sum : sum + s.net), 0);

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

        <SessionList sessions={sessions} />
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
