import Link from "next/link";

export function NavBar({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-[var(--background)]/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              ← Back
            </Link>
          ) : null}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {!backHref ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Stats
            </Link>
            <Link
              href="/settings"
              className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Settings
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
