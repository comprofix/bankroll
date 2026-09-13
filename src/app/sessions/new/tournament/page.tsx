import { NavBar } from "@/components/NavBar";
import { TournamentSessionForm } from "@/components/TournamentSessionForm";

import { createTournamentSession } from "./actions";

export default function NewTournamentSession() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Tournament" backHref="/sessions/new" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <TournamentSessionForm action={createTournamentSession} />
      </main>
    </div>
  );
}
