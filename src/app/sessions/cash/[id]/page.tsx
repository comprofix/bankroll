import { notFound } from "next/navigation";

import { CashSessionForm } from "@/components/CashSessionForm";
import { LiveCashSession } from "@/components/LiveCashSession";
import { NavBar } from "@/components/NavBar";
import { getCashSessionForEdit, getVenuesForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

import {
  addCashRebuy,
  deleteCashSession,
  finishCashSession,
  removeCashRebuy,
  updateCashSession,
} from "./actions";

export default async function CashSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const userId = await requireUserId();
  const [record, venues] = await Promise.all([
    getCashSessionForEdit(userId, Number(id)),
    getVenuesForUser(userId),
  ]);
  if (!record) notFound();

  // A session still in progress opens on its live timer screen; the full
  // form is one tap away via "Edit details" (?edit=1).
  if (record.isActive && !edit) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar title="Live Session" backHref="/" />
        <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
          <LiveCashSession
            record={record}
            addRebuy={addCashRebuy.bind(null, record.id)}
            removeRebuy={removeCashRebuy.bind(null, record.id)}
            finish={finishCashSession.bind(null, record.id)}
            remove={deleteCashSession.bind(null, record.id)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        title="Edit Cash Session"
        backHref={record.isActive ? `/sessions/cash/${record.id}` : "/"}
      />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <CashSessionForm
          action={updateCashSession.bind(null, record.id)}
          defaultValues={record}
          venues={venues}
          submitLabel="Save Changes"
        />
        <form action={deleteCashSession.bind(null, record.id)} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-lg border border-red-600/30 py-2.5 text-sm font-medium text-red-600 dark:text-red-400"
          >
            Delete Session
          </button>
        </form>
      </main>
    </div>
  );
}
