import { NavBar } from "@/components/NavBar";
import { TournamentSessionForm } from "@/components/TournamentSessionForm";
import { getVenuesForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

import { createTournamentSession } from "./actions";

export default async function NewTournamentSession() {
  const userId = await requireUserId();
  const venues = await getVenuesForUser(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Tournament" backHref="/sessions/new" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <TournamentSessionForm action={createTournamentSession} venues={venues} />
      </main>
    </div>
  );
}
