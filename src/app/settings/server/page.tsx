"use client";

import { NavBar } from "@/components/NavBar";
import { getCapacitor, useIsNativeApp, useOrigin } from "@/lib/capacitor";

export default function ServerSettings() {
  const origin = useOrigin();
  const isNative = useIsNativeApp();

  function handleChangeServer() {
    getCapacitor()?.Plugins?.ServerConfig?.clear();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Server" backHref="/settings" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8">
        <p className="mb-1 text-sm text-black/60 dark:text-white/60">Currently connected to</p>
        <p className="mb-6 break-all text-sm font-medium">{origin}</p>

        {isNative ? (
          <>
            <button
              type="button"
              onClick={handleChangeServer}
              className="w-full rounded-lg border border-red-600/30 py-2.5 text-sm font-medium text-red-600 dark:text-red-400"
            >
              Change Server
            </button>
            <p className="mt-3 text-xs text-black/40 dark:text-white/40">
              You&apos;ll be asked to enter a server address again — nothing is deleted, your
              data stays on whichever server you connect to.
            </p>
          </>
        ) : (
          <p className="text-sm text-black/40 dark:text-white/40">
            Server switching is only available in the Android app.
          </p>
        )}
      </main>
    </div>
  );
}
