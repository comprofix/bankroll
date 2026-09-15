import { CashSessionForm } from "@/components/CashSessionForm";
import { NavBar } from "@/components/NavBar";
import { getVenuesForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

import { createCashSession } from "./actions";

export default async function NewCashSession() {
  const userId = await requireUserId();
  const venues = await getVenuesForUser(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Cash Session" backHref="/sessions/new" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <CashSessionForm action={createCashSession} venues={venues} />
      </main>
    </div>
  );
}
