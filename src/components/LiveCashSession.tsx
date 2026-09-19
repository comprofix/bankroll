import Link from "next/link";

import type { getCashSessionForEdit } from "@/db/queries";
import { formatMoney } from "@/lib/format";

import { FinishSessionForm } from "./FinishSessionForm";
import { inputClass } from "./form-styles";
import { SessionTimer } from "./SessionTimer";

type Record = NonNullable<Awaited<ReturnType<typeof getCashSessionForEdit>>>;

export function LiveCashSession({
  record,
  addRebuy,
  removeRebuy,
  finish,
  remove,
}: {
  record: Record;
  addRebuy: (formData: FormData) => void | Promise<void>;
  removeRebuy: (rebuyId: number) => void | Promise<void>;
  finish: (formData: FormData) => void | Promise<void>;
  remove: () => void | Promise<void>;
}) {
  const totalIn =
    Number(record.startingBuyin) + record.rebuys.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-black/10 p-4 text-center dark:border-white/10">
        <p className="text-sm text-black/60 dark:text-white/60">
          {record.venueName} · {Number(record.smallBlind)}/{Number(record.bigBlind)}
        </p>
        <p className="mt-2 text-5xl font-semibold">
          <SessionTimer startedAt={record.startedAt} />
        </p>
        <p className="mt-2 text-xs text-black/50 dark:text-white/50">
          Started {record.timeStarted} on {record.datePlayed}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">Buy-ins</h2>
          <span className="text-sm text-black/60 dark:text-white/60">Total in: {formatMoney(totalIn)}</span>
        </div>
        <ul className="flex flex-col gap-1 text-sm">
          <li className="flex justify-between rounded-lg border border-black/10 px-3 py-2 dark:border-white/10">
            <span>Starting buy-in</span>
            <span>{formatMoney(Number(record.startingBuyin))}</span>
          </li>
          {record.rebuys.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 dark:border-white/10"
            >
              <span>Rebuy</span>
              <form action={removeRebuy.bind(null, r.id)} className="flex items-center gap-3">
                <span>{formatMoney(Number(r.amount))}</span>
                <button
                  type="submit"
                  aria-label="Remove rebuy"
                  className="text-black/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addRebuy} className="flex gap-2">
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Rebuy amount"
            required
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            className="rounded-lg border border-black/10 px-4 text-sm font-medium dark:border-white/10"
          >
            Add Rebuy
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Finish session</h2>
        <FinishSessionForm action={finish} />
      </section>

      <div className="flex flex-col gap-3">
        <Link
          href={`/sessions/cash/${record.id}?edit=1`}
          className="rounded-lg border border-black/10 py-2.5 text-center text-sm font-medium dark:border-white/10"
        >
          Edit details
        </Link>
        <form action={remove}>
          <button
            type="submit"
            className="w-full rounded-lg border border-red-600/30 py-2.5 text-sm font-medium text-red-600 dark:text-red-400"
          >
            Delete Session
          </button>
        </form>
      </div>
    </div>
  );
}
