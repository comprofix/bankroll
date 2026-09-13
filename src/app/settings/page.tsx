"use client";

import { FormField } from "@/components/FormField";
import { inputClass } from "@/components/form-styles";
import { NavBar } from "@/components/NavBar";

export default function Settings() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Settings" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8">
        <h2 className="mb-4 text-sm font-medium text-black/60 dark:text-white/60">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Current Password">
            <input
              type="password"
              name="currentPassword"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </FormField>
          <FormField label="New Password">
            <input
              type="password"
              name="newPassword"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </FormField>
          <FormField label="Confirm New Password">
            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </FormField>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Update Password
          </button>
          <p className="text-center text-xs text-black/40 dark:text-white/40">
            Not yet connected — this is a layout preview.
          </p>
        </form>
      </main>
    </div>
  );
}
