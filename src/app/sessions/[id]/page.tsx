import { NavBar } from "@/components/NavBar";

export default async function EditSession({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Edit Session" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8">
        <p className="text-sm text-black/60 dark:text-white/60">
          Pre-filled edit form for session <span className="font-mono">{id}</span> will
          go here — shares the Cash/Tournament form once wired to the database.
        </p>
      </main>
    </div>
  );
}
