import { notFound } from "next/navigation";

import { CashSessionForm } from "@/components/CashSessionForm";
import { NavBar } from "@/components/NavBar";
import { getCashSessionForEdit } from "@/db/queries";
import { requireUserId } from "@/lib/session";

import { deleteCashSession, updateCashSession } from "./actions";

export default async function EditCashSession({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId();
  const record = await getCashSessionForEdit(userId, Number(id));
  if (!record) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Edit Cash Session" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <CashSessionForm
          action={updateCashSession.bind(null, record.id)}
          defaultValues={record}
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
