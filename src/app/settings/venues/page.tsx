import { NavBar } from "@/components/NavBar";
import { VenuesSection } from "@/components/VenuesSection";
import { getVenuesForUser } from "@/db/queries";
import { requireUserId } from "@/lib/session";

export default async function VenuesPage() {
  const userId = await requireUserId();
  const venues = await getVenuesForUser(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Venues" backHref="/settings" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-8">
        <VenuesSection venues={venues} />
      </main>
    </div>
  );
}
