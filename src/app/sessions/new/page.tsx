import Link from "next/link";

import { NavBar } from "@/components/NavBar";

export default function NewSession() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="New Session" backHref="/" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 pt-8">
        <p className="text-sm text-black/60 dark:text-white/60">
          What did you play?
        </p>
        <Link
          href="/sessions/new/cash"
          className="rounded-xl border border-black/10 p-5 text-left hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
        >
          <p className="text-base font-semibold">Cash Game</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            Blinds, buy-in, cash-out, start/end time
          </p>
        </Link>
        <Link
          href="/sessions/new/tournament"
          className="rounded-xl border border-black/10 p-5 text-left hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
        >
          <p className="text-base font-semibold">Tournament</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            Buy-in, re-entries, finish position, payout
          </p>
        </Link>
      </main>
    </div>
  );
}
