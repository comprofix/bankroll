"use client";

import { useActionState } from "react";

import { updatePassword } from "@/app/settings/password/actions";

import { FormField } from "./FormField";
import { inputClass } from "./form-styles";

export function ChangePasswordForm() {
  const [message, formAction, isPending] = useActionState(updatePassword, undefined);

  return (
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
  );
}
