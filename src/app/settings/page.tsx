"use client";

import { useActionState } from "react";

import { FormField } from "@/components/FormField";
import { inputClass } from "@/components/form-styles";
import { NavBar } from "@/components/NavBar";

import { updatePassword } from "./actions";

export default function Settings() {
  const [message, formAction, isPending] = useActionState(updatePassword, undefined);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Settings" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8">
        <h2 className="mb-4 text-sm font-medium text-black/60 dark:text-white/60">
          Change Password
        </h2>
        <form action={formAction} className="flex flex-col gap-4">
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
          {message ? <p className="text-sm text-black/70 dark:text-white/70">{message}</p> : null}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {isPending ? "Updating…" : "Update Password"}
          </button>
        </form>
      </main>
    </div>
  );
}
