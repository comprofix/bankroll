import { notFound } from "next/navigation";

import { NavBar } from "@/components/NavBar";
import { TournamentSessionForm } from "@/components/TournamentSessionForm";
import { getTournamentSessionForEdit, getVenuesForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

import { deleteTournamentSession, updateTournamentSession } from "./actions";

export default async function EditTournamentSession({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await requireUserId();
  const [record, venues] = await Promise.all([
    getTournamentSessionForEdit(userId, Number(id)),
    getVenuesForUser(userId),
  ]);
  if (!record) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Edit Tournament" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <TournamentSessionForm
          action={updateTournamentSession.bind(null, record.id)}
          defaultValues={record}
          venues={venues}
          submitLabel="Save Changes"
        />
        <form action={deleteTournamentSession.bind(null, record.id)} className="mt-3">
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
