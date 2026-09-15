import Link from "next/link";

import { NavBar } from "@/components/NavBar";

const settingsLinks = [
  { href: "/settings/password", label: "Change Password" },
  { href: "/settings/venues", label: "Venues" },
];

export default function Settings() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Settings" backHref="/" />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 pt-8">
        {settingsLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-xl border border-black/10 p-4 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
          >
            <span className="text-sm font-medium">{link.label}</span>
            <span className="text-black/30 dark:text-white/30">→</span>
          </Link>
        ))}
      </main>
    </div>
  );
}
