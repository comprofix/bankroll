"use client";

import { useActionState } from "react";

import { FormField } from "@/components/FormField";
import { inputClass } from "@/components/form-styles";

import { login } from "./actions";

export default function Login() {
  const [error, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-xl font-semibold">Bankroll</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <FormField label="Email">
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className={inputClass}
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </FormField>
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {isPending ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
